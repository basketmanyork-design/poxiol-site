import Link from 'next/link'
import type {Metadata} from 'next'
import {Header, Footer, PrimaryButton} from '@/components/ui'
import type {CmsArticle} from '@/lib/cms/types'

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

export function metadataFromArticle(article: CmsArticle): Metadata {
  const canonical = article.seo.canonicalUrl || `https://www.poxiol.com${basePathFor(article)}${article.slug}/`
  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {canonical},
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      type: 'article',
      url: canonical,
      images: article.seo.ogImage
        ? [{url: article.seo.ogImage.url, alt: article.seo.ogImage.alt}]
        : article.featuredImage
          ? [{url: article.featuredImage.url, alt: article.featuredImage.alt}]
          : undefined,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author] : undefined,
    },
    robots: article.seo.noIndex ? {index: false, follow: false} : undefined,
  }
}

export function ArticleJsonLd({article}: {article: CmsArticle}) {
  const base = basePathFor(article)
  const canonical = article.seo.canonicalUrl || `https://www.poxiol.com${base}${article.slug}/`
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.seo.description || article.excerpt,
      image: article.featuredImage?.url || article.seo.ogImage?.url,
      author: article.author ? {'@type': 'Person', name: article.author} : {'@type': 'Organization', name: 'POXIOL'},
      reviewedBy: article.reviewedBy ? {'@type': 'Person', name: article.reviewedBy} : undefined,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      publisher: {'@type': 'Organization', name: 'POXIOL'},
      mainEntityOfPage: canonical,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
        {'@type': 'ListItem', position: 2, name: labelFor(article), item: `https://www.poxiol.com${base}`},
        {'@type': 'ListItem', position: 3, name: article.title, item: canonical},
      ],
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
}

function LinkList({title, links}: {title: string; links: Array<{label: string; href: string}>}) {
  if (!links.length) return null
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
      <h2 className="text-xl font-black uppercase tracking-tight text-neutral-950">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => <li key={`${title}-${link.href}`}><Link href={link.href} className="text-sm font-bold text-neutral-600 hover:text-lime-600">{link.label} →</Link></li>)}
      </ul>
    </section>
  )
}

export function ArticleTemplate({article}: {article: CmsArticle}) {
  const base = basePathFor(article)
  const label = labelFor(article)
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ArticleJsonLd article={article} />
      <Header />
      <article className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-32">
        <nav className="mb-10 text-xs font-bold uppercase tracking-widest text-neutral-500">
          <Link href="/" className="hover:text-lime-400">Home</Link><span className="mx-3">/</span><Link href={base} className="hover:text-lime-400">{label}</Link>
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
        {article.featuredImage ? <img src={article.featuredImage.url} alt={article.featuredImage.alt} className="mt-12 aspect-[16/9] w-full rounded-[2rem] object-cover" /> : null}

        <div className="mt-16 space-y-14">
          {article.sections.length ? article.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">{section.title}</h2>
              {Array.isArray(section.content)
                ? <ul className="mt-6 space-y-4 text-neutral-400">{section.content.map((item) => <li key={item} className="leading-relaxed">• {item}</li>)}</ul>
                : <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-neutral-400">{section.content}</p>}
            </section>
          )) : <p className="text-lg leading-relaxed text-neutral-400">{article.body || article.intro}</p>}
        </div>

        {article.methodology ? (
          <section className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-black uppercase">Methodology</h2>
            <p className="mt-5 whitespace-pre-line text-neutral-400">{article.methodology}</p>
          </section>
        ) : null}

        {article.references.length ? (
          <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-black uppercase">References</h2>
            <ul className="mt-5 space-y-2 text-neutral-400">{article.references.map((item) => <li key={item}>• {item}</li>)}</ul>
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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <LinkList title="Related products" links={article.relatedProducts} />
          <LinkList title="Related categories" links={article.relatedCategories} />
          <LinkList title="Related case studies" links={article.relatedCaseStudies} />
          <LinkList title="Related articles" links={article.relatedArticles} />
        </div>

        {article.cta ? <div className="mt-16"><PrimaryButton href={article.cta.href}>{article.cta.label}</PrimaryButton></div> : null}
      </article>
      <Footer />
    </main>
  )
}
