import Link from 'next/link'
import type {Metadata} from 'next'
import {Header, Footer, PrimaryButton, SecondaryButton} from '@/components/ui'
import type {CmsArticle} from '@/lib/cms/types'
import {ContentViewTracker} from '@/components/analytics/ContentViewTracker'
import {normalizePortableText, type CmsPortableContent} from '@/lib/cms/portableText'

const siteUrl = 'https://www.poxiol.com'

function basePathFor(article: CmsArticle) {
  if (article.articleType === 'resource') return '/resources/'
  if (article.articleType === 'blog') return '/blog/'
  return '/guides/'
}

function labelFor(article: CmsArticle) {
  if (article.articleType === 'resource') return 'Resources'
  if (article.articleType === 'blog') return 'Blog'
  return 'Guides'
}

function canonicalFor(article: CmsArticle) {
  return article.seo.canonicalUrl || `${siteUrl}${basePathFor(article)}${article.slug}/`
}

function uniqueLinks(links: Array<{label: string; href: string}>) {
  const seen = new Set<string>()
  return links.filter((link) => {
    const key = `${link.href}::${link.label}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function metadataFromArticle(article: CmsArticle): Metadata {
  const canonical = canonicalFor(article)
  const ogImage = article.seo.ogImage || article.featuredImage
  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {canonical},
    openGraph: {
      title: article.seo.ogTitle || article.seo.title,
      description: article.seo.ogDescription || article.seo.description,
      type: 'article',
      url: canonical,
      images: ogImage ? [{url: ogImage.url, alt: ogImage.alt}] : undefined,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author] : undefined,
    },
    robots: article.seo.noIndex
      ? {index: false, follow: !article.seo.nofollow}
      : article.seo.nofollow
        ? {index: true, follow: false}
        : undefined,
  }
}

export function ArticleJsonLd({article}: {article: CmsArticle}) {
  const base = basePathFor(article)
  const canonical = canonicalFor(article)
  const graph: Array<Record<string, unknown>> = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: article.title,
      description: article.seo.description || article.excerpt,
      image: article.featuredImage?.url || article.seo.ogImage?.url,
      author: article.author ? {'@type': 'Organization', name: article.author} : {'@type': 'Organization', name: 'POXIOL'},
      reviewedBy: article.reviewedBy ? {'@type': 'Organization', name: article.reviewedBy} : undefined,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      publisher: {'@type': 'Organization', name: 'POXIOL', url: siteUrl},
      mainEntityOfPage: canonical,
      about: [...article.relatedCategories, ...article.relatedProducts].map((link) => link.label),
      citation: article.references.length ? article.references : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/`},
        {'@type': 'ListItem', position: 2, name: labelFor(article), item: `${siteUrl}${base}`},
        {'@type': 'ListItem', position: 3, name: article.title, item: canonical},
      ],
    },
  ]

  if (article.faqs.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {'@type': 'Answer', text: faq.answer},
      })),
    })
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(graph).replace(/</g, '\\u003c')}} />
}

function LinkList({title, links}: {title: string; links: Array<{label: string; href: string}>}) {
  const resolvedLinks = uniqueLinks(links)
  if (!resolvedLinks.length) return null
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8 text-neutral-950">
      <h2 className="text-xl font-black uppercase tracking-tight">{title}</h2>
      <ul className="mt-5 space-y-3">
        {resolvedLinks.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link href={link.href} className="text-sm font-bold text-neutral-600 hover:text-lime-600">
              {link.label} <span aria-hidden="true">-&gt;</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SectionContent({content}: {content: string | string[]}) {
  if (Array.isArray(content)) {
    return (
      <ul className="mt-6 space-y-4 text-neutral-400">
        {content.map((item) => <li key={item} className="leading-relaxed">• {item}</li>)}
      </ul>
    )
  }
  return <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-neutral-400">{content}</p>
}

function PortableTextContent({content}: {content: CmsPortableContent[]}) {
  return (
    <div className="space-y-8">
      {content.map((node) => {
        if (node.kind === 'heading') {
          if (node.level === 3) return <h3 key={node.key} className="text-2xl font-black tracking-tight text-white">{node.text}</h3>
          if (node.level === 4) return <h4 key={node.key} className="text-xl font-black tracking-tight text-white">{node.text}</h4>
          return <h2 key={node.key} className="pt-6 text-3xl font-black uppercase tracking-tight text-white">{node.text}</h2>
        }
        if (node.kind === 'paragraph') {
          return <p key={node.key} className="text-lg leading-relaxed text-neutral-300">{node.text}</p>
        }
        if (node.kind === 'list') {
          const List = node.ordered ? 'ol' : 'ul'
          return (
            <List key={node.key} className={`${node.ordered ? 'list-decimal' : 'list-disc'} space-y-3 pl-6 text-lg leading-relaxed text-neutral-300`}>
              {node.items.map((item, index) => <li key={`${node.key}-${index}`}>{item}</li>)}
            </List>
          )
        }
        if (node.kind === 'table') {
          const [header = [], ...rows] = node.rows
          return (
            <div key={node.key} className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full border-collapse text-left text-sm text-neutral-300">
                {node.caption ? <caption className="bg-white/[0.04] px-5 py-4 text-left font-bold text-white">{node.caption}</caption> : null}
                {header.length ? <thead><tr>{header.map((cell, index) => <th key={`${node.key}-head-${index}`} className="border-b border-white/10 px-5 py-4 font-black text-white">{cell}</th>)}</tr></thead> : null}
                <tbody>{rows.map((row, rowIndex) => <tr key={`${node.key}-row-${rowIndex}`} className="border-b border-white/5 last:border-0">{row.map((cell, cellIndex) => <td key={`${node.key}-${rowIndex}-${cellIndex}`} className="px-5 py-4 align-top">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )
        }
        if (node.kind === 'callout') {
          return (
            <aside key={node.key} className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
              {node.title ? <h3 className="text-lg font-black text-amber-200">{node.title}</h3> : null}
              {node.body ? <p className="mt-3 leading-relaxed text-amber-50/90">{node.body}</p> : null}
            </aside>
          )
        }
        return null
      })}
    </div>
  )
}
export function ArticleTemplate({article}: {article: CmsArticle}) {
  const base = basePathFor(article)
  const label = labelFor(article)
  const clusterLinks = [
    {title: 'Related products', links: article.relatedProducts},
    {title: 'Related categories', links: article.relatedCategories},
    {title: 'Related case studies', links: article.relatedCaseStudies},
    {title: 'Related articles', links: article.relatedArticles},
  ]
  const hasClusters = clusterLinks.some((cluster) => cluster.links.length)
  const portableContent = article.bodyBlocks?.length ? normalizePortableText(article.bodyBlocks) : []

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ContentViewTracker event="guide_view" params={{content_type: article.articleType, content_slug: article.slug}} />
      <ArticleJsonLd article={article} />
      <Header />
      <article className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-32">
        <nav className="mb-10 text-xs font-bold uppercase tracking-widest text-neutral-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-lime-400">Home</Link>
          <span className="mx-3">/</span>
          <Link href={base} className="hover:text-lime-400">{label}</Link>
        </nav>

        <p className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">{article.eyebrow}</p>
        <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl">{article.title}</h1>
        <p className="mt-8 text-xl leading-8 text-neutral-300">{article.excerpt || article.intro}</p>

        <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
          {article.author ? <span>By {article.author}</span> : null}
          {article.reviewedBy ? <span>Reviewed by {article.reviewedBy}</span> : null}
          {article.publishedAt ? <time dateTime={article.publishedAt}>Published {article.publishedAt.slice(0, 10)}</time> : null}
          {article.updatedAt ? <time dateTime={article.updatedAt}>Updated {article.updatedAt.slice(0, 10)}</time> : null}
        </div>

        {article.featuredImage ? (
          <figure className="mt-12">
            <img src={article.featuredImage.url} alt={article.featuredImage.alt} className="aspect-[16/9] w-full rounded-[2rem] object-cover" />
            {article.featuredImage.caption ? <figcaption className="mt-3 text-sm text-neutral-500">{article.featuredImage.caption}</figcaption> : null}
          </figure>
        ) : article.imageStatus ? (
          <div role="img" aria-label={article.imageStatus} className="mt-12 flex aspect-[16/9] w-full items-center justify-center rounded-[2rem] border border-dashed border-white/20 bg-white/[0.03] px-8 text-center text-sm font-bold uppercase tracking-widest text-neutral-500">
            {article.imageStatus}
          </div>
        ) : null}

        <div className="mt-16 space-y-14">
          {article.bodyBlocks?.length ? (
            <PortableTextContent content={portableContent} />
          ) : article.sections.length ? article.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">{section.title}</h2>
              <SectionContent content={section.content} />
            </section>
          )) : <p className="text-lg leading-relaxed text-neutral-400">{article.body || article.intro}</p>}
        </div>

        {article.methodology || article.reviewedBy ? (
          <section className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-black uppercase">Editorial review notes</h2>
            {article.reviewedBy ? <p className="mt-4 text-neutral-400">Reviewed by {article.reviewedBy} for sourcing accuracy and manufacturing practicality.</p> : null}
            {article.methodology ? <p className="mt-5 whitespace-pre-line text-neutral-400">{article.methodology}</p> : null}
          </section>
        ) : null}

        {article.references.length ? (
          <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-black uppercase">References</h2>
            <ul className="mt-5 space-y-2 text-neutral-400">{article.references.map((item) => <li key={item} className="break-all">• {item}</li>)}</ul>
          </section>
        ) : null}

        {article.faqs.length ? (
          <section className="mt-16">
            <h2 className="text-3xl font-black uppercase">Related FAQ</h2>
            <div className="mt-6 space-y-4">
              {article.faqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <summary className="cursor-pointer font-black text-white">{faq.question}</summary>
                  <p className="mt-4 text-neutral-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {hasClusters ? (
          <section className="mt-16">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Continue research</h2>
            <p className="mt-4 text-neutral-400">Use these related POXIOL pages to connect the article with products, categories, project evidence and buyer FAQs.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {clusterLinks.map((cluster) => <LinkList key={cluster.title} title={cluster.title} links={cluster.links} />)}
            </div>
          </section>
        ) : null}

        {article.cta || article.secondaryCta ? (
          <div className="mt-16 flex flex-wrap gap-4">
            {article.cta ? <PrimaryButton href={article.cta.href}>{article.cta.label}</PrimaryButton> : null}
            {article.secondaryCta ? <SecondaryButton href={article.secondaryCta.href}>{article.secondaryCta.label}</SecondaryButton> : null}
          </div>
        ) : null}
      </article>
      <Footer />
    </main>
  )
}