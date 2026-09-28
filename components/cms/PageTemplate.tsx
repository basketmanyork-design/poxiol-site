import Link from 'next/link'
import type React from 'react'
import type {Metadata} from 'next'
import {Header, Footer, PrimaryButton, SecondaryButton, SectionHeading} from '@/components/ui'
import type {CmsPage, CmsPageSection} from '@/lib/cms/types'
import {FAQSchema} from '@/components/seo/GEOStructuredData'
import {VerifiedMediaPlaceholder} from '@/components/v8/VerifiedMediaPlaceholder'
import {cmsProductionMediaToV8Assets} from '@/lib/v8/media'
import {getV8ConversionEntry, type V8ConversionIntent} from '@/lib/v8/leads'

function verifiedMedia(media: CmsPage['productionMedia']) {
  return cmsProductionMediaToV8Assets(media)
}

export function metadataFromCmsPage(page: CmsPage, override?: Pick<CmsPage['seo'], 'title' | 'description'>): Metadata {
  const title = override?.title ?? page.seo.title
  const description = override?.description ?? page.seo.description
  const socialImage = verifiedMedia(page.productionMedia).find((asset) => asset.kind === 'image')
  return {
    title,
    description,
    alternates: page.seo.canonicalUrl ? {canonical: page.seo.canonicalUrl} : undefined,
    openGraph: {
      title,
      description,
      url: page.seo.canonicalUrl,
      images: socialImage ? [{url: socialImage.url, alt: socialImage.alt || ''}] : undefined,
    },
    robots: page.seo.noIndex ? {index: false, follow: false} : undefined,
  }
}

export function PageJsonLd({page}: {page: CmsPage}) {
  const canonical = page.seo.canonicalUrl || `https://www.poxiol.com/${page.slug ? `${page.slug}/` : ''}`
  const primaryImage = verifiedMedia(page.productionMedia).find((asset) => asset.kind === 'image')
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.heading,
      description: page.description,
      url: canonical,
      ...(primaryImage ? {primaryImageOfPage: primaryImage.url} : {}),
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
  const sectionMedia = cmsProductionMediaToV8Assets(section.productionMedia)

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
          <VerifiedMediaPlaceholder asset={sectionMedia[0]} />
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
            {sectionMedia.length
              ? sectionMedia.map((asset) => <VerifiedMediaPlaceholder key={asset.id} asset={asset} />)
              : <VerifiedMediaPlaceholder />}
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

export function CmsPageTemplate({page, contactSlot, beforeFooterSlot, conversionIntent}: {page: CmsPage; contactSlot?: React.ReactNode; beforeFooterSlot?: React.ReactNode; conversionIntent?: V8ConversionIntent}) {
  const faqItems = page.sections.flatMap((section) => section.faqs || [])
  const heroMedia = verifiedMedia(page.productionMedia)[0]
  const conversionEntry = conversionIntent ? getV8ConversionEntry(conversionIntent) : undefined
  const formCta = conversionEntry ? {label: conversionEntry.formTitle, href: `#${conversionEntry.formAnchorId}`} : undefined
  const heroCta = formCta ?? page.heroCta
  const bottomCta = page.bottomCta ? formCta ?? page.bottomCta : undefined
  const contactSection = contactSlot ? <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20"><div className="mx-auto max-w-7xl">{contactSlot}</div></section> : null
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <PageJsonLd page={page} />
      {faqItems.length ? <FAQSchema faqs={faqItems} /> : null}
      <Header />
      <section className="relative bg-neutral-950 px-5 pb-28 pt-16 md:px-10 md:py-32 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className={`relative mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-14 ${heroMedia ? 'lg:grid-cols-2 lg:items-center' : ''}`}>
          <div className="min-w-0">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#B6FF00]">{page.eyebrow}</p>
            <h1 className="max-w-full break-words [overflow-wrap:anywhere] text-4xl font-black uppercase leading-[0.98] tracking-tight md:text-7xl">{page.heading}</h1>
            <p className="mt-8 max-w-full break-words [overflow-wrap:anywhere] text-lg leading-8 text-neutral-300 sm:max-w-2xl">{page.description}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {heroCta ? <PrimaryButton href={heroCta.href} analyticsLocation="hero" className="w-full sm:w-auto">{heroCta.label}</PrimaryButton> : null}
              {!conversionEntry && heroCta?.href !== '/contact/' ? <SecondaryButton href="/contact/" analyticsLocation="hero" className="w-full sm:w-auto">Talk to a Teamwear Specialist</SecondaryButton> : null}
            </div>
          </div>
          {heroMedia ? <VerifiedMediaPlaceholder asset={heroMedia} /> : null}
        </div>
      </section>

      {conversionIntent === 'contact' ? contactSection : null}

      {page.sections.map((section, index) => <CmsSection key={`${section.type || 'section'}-${section.title}-${index}`} section={section} index={index} />)}

      {conversionIntent !== 'contact' ? contactSection : null}

      {bottomCta ? (
        <section className="bg-neutral-950 px-5 py-16 text-center text-white md:px-10 md:py-24 xl:px-20">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-10">
            <h2 className="text-3xl font-black uppercase md:text-5xl">{conversionIntent === 'contact' ? 'Have a question before you decide?' : 'Ready to move this project forward?'}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-300">{conversionIntent === 'contact' ? 'Start with your question. No artwork or confirmed quantity is needed for a general inquiry.' : 'Send your design, quantity and deadline. POXIOL will help confirm the next practical step.'}</p>
            <div className="mt-8"><PrimaryButton href={bottomCta.href}>{bottomCta.label}</PrimaryButton></div>
          </div>
        </section>
      ) : null}
      {beforeFooterSlot}
      <Footer />
    </main>
  )
}
