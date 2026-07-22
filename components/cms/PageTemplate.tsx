import Link from 'next/link'
import type React from 'react'
import type {Metadata} from 'next'
import {Header, Footer, PrimaryButton, SecondaryButton, SectionHeading} from '@/components/ui'
import type {CmsPage} from '@/lib/cms/types'

export function metadataFromCmsPage(page: CmsPage): Metadata {
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: page.seo.canonicalUrl ? {canonical: page.seo.canonicalUrl} : undefined,
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: page.seo.canonicalUrl,
      images: page.seo.ogImage ? [{url: page.seo.ogImage.url, alt: page.seo.ogImage.alt}] : undefined,
    },
    robots: page.seo.noIndex ? {index: false, follow: false} : undefined,
  }
}

export function PageJsonLd({page}: {page: CmsPage}) {
  const canonical = page.seo.canonicalUrl || `https://www.poxiol.com/${page.slug ? `${page.slug}/` : ''}`
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.heading,
      description: page.description,
      url: canonical,
      primaryImageOfPage: page.image?.url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
        {'@type': 'ListItem', position: 2, name: page.title, item: canonical},
      ],
    },
  ]

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
}

export function CmsPageTemplate({page, contactSlot}: {page: CmsPage; contactSlot?: React.ReactNode}) {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <PageJsonLd page={page} />
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#B6FF00]">{page.eyebrow}</p>
            <h1 className="text-5xl font-black uppercase leading-[0.98] tracking-tight md:text-7xl">{page.heading}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-300">{page.description}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              {page.heroCta ? <PrimaryButton href={page.heroCta.href}>{page.heroCta.label}</PrimaryButton> : null}
              <SecondaryButton href="/contact/">Talk to POXIOL</SecondaryButton>
            </div>
          </div>
          {page.image ? <img src={page.image.url} alt={page.image.alt} className="aspect-[4/3] w-full rounded-[2rem] object-cover" /> : null}
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-neutral-950 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="CMS Managed Page" title={page.title} subtitle="Hero, copy modules, image modules, evidence blocks and CTA are resolved from Sanity with legacy fallback." center />
          <div className="grid gap-8 lg:grid-cols-3">
            {page.sections.map((section) => (
              <article key={`${section.eyebrow || ''}-${section.title}`} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
                {section.image ? <img src={section.image.url} alt={section.image.alt} className="mb-8 aspect-[4/3] w-full rounded-2xl object-cover" /> : null}
                {section.eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-600">{section.eyebrow}</p> : null}
                <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">{section.title}</h2>
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-neutral-600">{section.body}</p>
                {section.facts?.length ? (
                  <ul className="mt-6 space-y-2 text-sm font-bold text-neutral-700">
                    {section.facts.map((fact) => <li key={fact}>• {fact}</li>)}
                  </ul>
                ) : null}
                {section.cta ? <Link href={section.cta.href} className="mt-8 inline-block text-xs font-black uppercase tracking-widest text-lime-600 hover:underline">{section.cta.label} →</Link> : null}
              </article>
            ))}
          </div>
          {contactSlot ? <div className="mt-16">{contactSlot}</div> : null}
          {page.bottomCta ? (
            <div className="mt-16 rounded-[2rem] bg-neutral-950 p-10 text-center text-white">
              <h2 className="text-3xl font-black uppercase">Ready to move this project forward?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-neutral-300">Use the CMS-managed CTA below to guide buyers into the next conversion step.</p>
              <div className="mt-8"><PrimaryButton href={page.bottomCta.href}>{page.bottomCta.label}</PrimaryButton></div>
            </div>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  )
}
