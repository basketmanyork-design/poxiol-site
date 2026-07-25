import Link from 'next/link'
import type React from 'react'
import type {Metadata} from 'next'
import {Header, Footer, PrimaryButton, SecondaryButton, SectionHeading} from '@/components/ui'
import type {CmsPage, CmsPageSection} from '@/lib/cms/types'

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

function SectionIntro({section}: {section: CmsPageSection}) {
  return (
    <div className="mb-10 max-w-3xl">
      {section.eyebrow ? <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-lime-600">{section.eyebrow}</p> : null}
      <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-950 md:text-5xl">{section.title}</h2>
      {section.body ? <p className="mt-5 whitespace-pre-line text-base leading-8 text-neutral-600">{section.body}</p> : null}
    </div>
  )
}

function resolveType(section: CmsPageSection) {
  if (section.type) return section.type
  if (section.steps?.length) return 'processSteps'
  if (section.specifications?.length) return 'specificationsTable'
  if (section.stats?.length) return 'stats'
  if (section.gallery?.length) return 'gallery'
  if (section.faqs?.length) return 'faq'
  if (section.image) return 'imageText'
  if (section.facts?.length) return 'evidenceGrid'
  if (section.cta) return 'cta'
  return 'richText'
}

function CmsSection({section, index}: {section: CmsPageSection; index: number}) {
  const type = resolveType(section)

  if (type === 'imageText') {
    return (
      <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className={`mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <div>
            <SectionIntro section={section} />
            {section.facts?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {section.facts.map((fact) => <span key={fact} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700">{fact}</span>)}
              </div>
            ) : null}
            {section.cta ? <Link href={section.cta.href} className="mt-8 inline-block text-sm font-black uppercase tracking-widest text-lime-600 hover:underline">{section.cta.label} →</Link> : null}
          </div>
          {section.image ? <img src={section.image.url} alt={section.image.alt} className="aspect-[4/3] w-full rounded-[2rem] object-cover" /> : null}
        </div>
      </section>
    )
  }

  if (type === 'stats') {
    return (
      <section className="bg-neutral-950 px-5 py-16 text-white md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={section.eyebrow || 'Proof'} title={section.title} subtitle={section.body} dark />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(section.stats || []).map((stat) => <div key={`${stat.value}-${stat.label}`} className="rounded-[2rem] border border-white/10 bg-white/5 p-7"><p className="text-4xl font-black text-[#B6FF00]">{stat.value}</p><p className="mt-3 text-sm font-semibold text-neutral-300">{stat.label}</p></div>)}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'processSteps') {
    return (
      <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionIntro section={section} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(section.steps || []).map((step, stepIndex) => <article key={step.title} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-7"><p className="text-sm font-black text-lime-600">{String(stepIndex + 1).padStart(2, '0')}</p><h3 className="mt-4 text-xl font-black uppercase">{step.title}</h3><p className="mt-3 text-sm leading-7 text-neutral-600">{step.description}</p></article>)}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'specificationsTable') {
    return (
      <section className="bg-neutral-100 px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <SectionIntro section={section} />
          <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white">
            {(section.specifications || []).map((spec) => <div key={spec.label} className="grid gap-4 border-b border-neutral-200 p-5 last:border-b-0 md:grid-cols-[0.35fr_0.65fr]"><p className="font-black uppercase text-neutral-950">{spec.label}</p><p className="text-neutral-600">{spec.value}</p></div>)}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'gallery') {
    return (
      <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionIntro section={section} />
          <div className="grid gap-5 md:grid-cols-3">
            {(section.gallery || []).map((image) => <img key={`${image.url}-${image.alt}`} src={image.url} alt={image.alt} className="aspect-[4/3] w-full rounded-[2rem] object-cover" />)}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'faq') {
    return (
      <section className="bg-neutral-100 px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <SectionIntro section={section} />
          <div className="space-y-4">
            {(section.faqs || []).map((faq) => <details key={faq.question} className="rounded-2xl bg-white p-6"><summary className="cursor-pointer text-lg font-black">{faq.question}</summary><p className="mt-4 text-sm leading-7 text-neutral-600">{faq.answer}</p></details>)}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'cta') {
    return (
      <section className="bg-neutral-950 px-5 py-16 text-center text-white md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-10">
          {section.eyebrow ? <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#B6FF00]">{section.eyebrow}</p> : null}
          <h2 className="text-3xl font-black uppercase md:text-5xl">{section.title}</h2>
          {section.body ? <p className="mx-auto mt-5 max-w-2xl text-neutral-300">{section.body}</p> : null}
          {section.cta ? <div className="mt-8"><PrimaryButton href={section.cta.href}>{section.cta.label}</PrimaryButton></div> : null}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
      <div className="mx-auto max-w-5xl">
        <SectionIntro section={section} />
        {section.facts?.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {section.facts.map((fact) => <div key={fact} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm font-bold text-neutral-700">{fact}</div>)}
          </div>
        ) : null}
      </div>
    </section>
  )
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

      {page.sections.map((section, index) => <CmsSection key={`${section.type || 'section'}-${section.title}-${index}`} section={section} index={index} />)}

      {contactSlot ? <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20"><div className="mx-auto max-w-7xl">{contactSlot}</div></section> : null}

      {page.bottomCta ? (
        <section className="bg-neutral-950 px-5 py-16 text-center text-white md:px-10 md:py-24 xl:px-20">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-10">
            <h2 className="text-3xl font-black uppercase md:text-5xl">Ready to move this project forward?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-300">Send your design, quantity and deadline. POXIOL will help confirm the next practical step.</p>
            <div className="mt-8"><PrimaryButton href={page.bottomCta.href}>{page.bottomCta.label}</PrimaryButton></div>
          </div>
        </section>
      ) : null}
      <Footer />
    </main>
  )
}
