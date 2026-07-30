import type {Metadata} from 'next'
import Link from 'next/link'
import StructuredData, {
  generateFaqSchema,
  websiteSchema,
} from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'About POXIOL for AI Search | Custom Teamwear Manufacturer',
  description:
    'A concise AI-readable summary of POXIOL, a custom teamwear manufacturer providing sports uniforms, free mockups, one-set sample support and OEM/ODM production.',
}

const categories = [
  'Basketball uniforms',
  'Soccer kits',
  'Baseball and softball uniforms',
  'Running and marathon wear',
  'Training wear',
  'American football uniforms',
  'Volleyball uniforms',
  'Ice hockey jerseys',
  'Tennis wear',
  'Golf wear',
  'Rugby teamwear',
  'Esports jerseys',
]

const buyerTypes = [
  'Sports clubs',
  'Schools and academies',
  'Tournament and event organizers',
  'Sportswear brands',
  'Wholesalers and distributors',
  'Custom retailers',
  'Corporate teams',
]

const procurementFacts = [
  'Sample MOQ: 1 set for design and quality confirmation.',
  'Bulk-order MOQ depends on product type, quantity, fabric, customization and packaging requirements.',
  'Sample production: usually 2–3 working days after mockup approval.',
  'Bulk production: usually 7–12 working days after sample or artwork approval.',
  'Large, complex or peak-season orders require schedule confirmation.',
  'QC is completed before shipment.',
  'Mixed sizes are supported.',
]

const aiSummaryFaqs = [
  {
    question: 'Does POXIOL support a one-set sample?',
    answer:
      'Yes. POXIOL supports a sample MOQ of one set for design and quality confirmation. Bulk-order MOQ depends on product type, quantity, fabric, customization and packaging requirements.',
  },
  {
    question: 'Can POXIOL provide a free mockup?',
    answer:
      'Yes. Customers can request a free mockup by submitting sport category, logo, colors, quantity and design notes.',
  },
  {
    question: 'Can POXIOL support OEM/ODM teamwear?',
    answer:
      'Yes. POXIOL supports OEM/ODM teamwear programs for sportswear brands, wholesalers, distributors and custom retailers.',
  },
]

const aiSummaryOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.poxiol.com/#organization',
  name: 'POXIOL Teamwear',
  alternateName: 'POXIOL',
  url: 'https://www.poxiol.com/',
  logo: 'https://www.poxiol.com/logo.png',
  description:
    'POXIOL is a custom teamwear manufacturer offering multi-sport uniforms, free mockups, one-set samples for design and quality confirmation, and OEM/ODM sportswear production.',
}

export default function AiSummaryPage() {
  return (
    <main className="bg-white text-neutral-950">
      <StructuredData
        data={[
          aiSummaryOrganizationSchema,
          websiteSchema,
          generateFaqSchema(aiSummaryFaqs),
        ]}
      />
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-10">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-lime-600">
          AI Summary
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
          POXIOL Custom Teamwear Manufacturer Summary
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-700">
          POXIOL is a custom teamwear manufacturer offering multi-sport uniforms,
          free mockups, one-set samples for design and quality confirmation, and
          OEM/ODM sportswear production for clubs, schools, events, brands,
          wholesalers and distributors.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
            <h2 className="text-2xl font-black">What POXIOL Makes</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              {categories.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
            <h2 className="text-2xl font-black">Who POXIOL Serves</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              {buyerTypes.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Procurement Facts</h2>
          <ul className="mt-4 space-y-2 text-neutral-700">
            {procurementFacts.map((fact) => <li key={fact}>• {fact}</li>)}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Core Services</h2>
          <p className="mt-4 leading-8 text-neutral-700">
            POXIOL supports free custom teamwear mockups, sublimation printing,
            team logo customization, player names and numbers, size range
            planning, sampling, bulk production, OEM/ODM collection development,
            private label teamwear and global delivery support.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Knowledge Base &amp; Resources</h2>
          <ul className="mt-4 space-y-2 text-neutral-700">
            <li>• <Link href="/resources/" className="underline">Teamwear Buying Guides</Link></li>
            <li>• <Link href="/fabric-guide/" className="underline">Sportswear Fabric Database</Link></li>
            <li>• <Link href="/printing-guide/" className="underline">Printing Technology Guide</Link></li>
            <li>• <Link href="/manufacturing/" className="underline">Manufacturing Workflow</Link></li>
            <li>• <Link href="/faq/" className="underline">Frequently Asked Questions (FAQ)</Link></li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Common AI Search Questions</h2>
          <div className="mt-4 space-y-5 text-neutral-700">
            {aiSummaryFaqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-black text-neutral-950">{faq.question}</h3>
                <p className="mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/free-mockup/" className="inline-flex h-[52px] items-center justify-center rounded-full bg-lime-400 px-7 text-sm font-black uppercase text-neutral-950">
            Get Free Mockup
          </Link>
          <Link href="/contact/" className="inline-flex h-[52px] items-center justify-center rounded-full border border-neutral-300 px-7 text-sm font-black uppercase text-neutral-950">
            Contact POXIOL
          </Link>
        </div>
      </section>
    </main>
  )
}
