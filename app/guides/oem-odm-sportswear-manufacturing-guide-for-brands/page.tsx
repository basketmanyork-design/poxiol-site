import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/ui'

const canonicalUrl = 'https://www.poxiol.com/guides/oem-odm-sportswear-manufacturing-guide-for-brands/'
const pageTitle = 'OEM vs ODM Sportswear: A Decision Guide for Brands'
const answerFirst = 'Choose OEM when your team already controls the product specification and needs a supplier to review manufacturability. Choose ODM when the product direction is still being shaped and a development route must be defined before sampling. The exact scope must be confirmed for each project.'

export const metadata: Metadata = {
  title: `${pageTitle} | POXIOL`,
  description: 'Compare OEM and ODM paths for a custom sportswear project. Use a practical decision matrix and project brief checklist before requesting a quote.',
  alternates: { canonical: canonicalUrl },
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/' },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.poxiol.com/resources/' },
        { '@type': 'ListItem', position: 3, name: pageTitle, item: canonicalUrl },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: pageTitle,
      description: answerFirst,
      url: canonicalUrl,
      breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
    },
  ],
}

const comparisonRows = [
  ['Starting point', 'A defined product concept, specification or reference', 'A target customer, use case or collection goal that still needs product definition'],
  ['Buyer inputs', 'Tech pack, artwork, size chart, reference sample or required construction details', 'Market brief, product category, design direction, target use and required brand elements'],
  ['Main review', 'Whether the supplied specification can be translated into a project plan', 'Which product decisions must be defined before a project plan can be confirmed'],
  ['Sampling purpose', 'Check the supplied specification against the physical result', 'Check the newly defined product direction before later decisions are frozen'],
  ['Change risk', 'Late specification changes can reopen cost, sample or timing discussions', 'Unresolved product choices can extend the development discussion before sampling'],
]

const oemSignals = [
  'Your product concept and intended use are already defined.',
  'You can provide a tech pack, reference sample, artwork or measurable specification.',
  'Your team controls the final design, sizing and brand requirements.',
  'The main task is reviewing how the supplied specification could move into sampling and quotation.',
]

const odmSignals = [
  'You know the target buyer or use case but the product definition is not complete.',
  'The collection structure, design direction or specification still needs to be discussed.',
  'You need open decisions identified before a sample brief can be frozen.',
  'Your team can review and approve each product decision before the project advances.',
]

const briefItems = [
  'Buyer or company type and target customer',
  'Product category and intended use',
  'Existing files: tech pack, artwork, size chart or reference images',
  'Confirmed and optional customization requirements',
  'Estimated quantity and size range for project review',
  'Destination and required in-hand date',
  'Whether a sample discussion is required',
  'Who will approve design, sizing and commercial decisions',
]

const samplingQuestions = [
  ['What is already fixed?', 'List the specification, artwork, sizing and branding decisions that should not change.'],
  ['What is still open?', 'Separate material direction, construction, fit, labels, packaging and other unresolved choices.'],
  ['Who approves each step?', 'Name the person or team responsible for design, sample and commercial approval.'],
  ['What does the sample need to prove?', 'Define the decisions the physical sample must confirm before any later stage is discussed.'],
]

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-7 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-relaxed text-neutral-700 md:text-lg">
          <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lime-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function GuidePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="bg-white px-5 py-20 text-neutral-900 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <header className="max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-lime-600">Buyer decision guide · OEM or ODM</p>
            <h1 className="text-4xl font-black leading-[1.02] tracking-tighter text-neutral-950 sm:text-5xl md:text-6xl">{pageTitle}</h1>
            <p className="mt-8 text-xl font-medium leading-relaxed text-neutral-600">{answerFirst}</p>
          </header>

          <section className="mt-16" aria-labelledby="comparison-heading">
            <h2 id="comparison-heading" className="text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">OEM and ODM compared</h2>
            <div className="mt-8 overflow-x-auto rounded-3xl border border-neutral-200">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-neutral-950 text-white">
                  <tr>
                    {['Decision point', 'OEM path', 'ODM path'].map((heading) => (
                      <th key={heading} scope="col" className="px-6 py-5 text-sm font-black uppercase tracking-wide">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([point, oem, odm]) => (
                    <tr key={point} className="border-t border-neutral-200 align-top">
                      <th scope="row" className="w-1/5 bg-neutral-50 px-6 py-5 font-black text-neutral-950">{point}</th>
                      <td className="w-2/5 px-6 py-5 leading-relaxed text-neutral-700">{oem}</td>
                      <td className="w-2/5 px-6 py-5 leading-relaxed text-neutral-700">{odm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-neutral-950 p-8 text-white md:p-10">
              <h2 className="text-3xl font-black tracking-tight">Choose the OEM path when</h2>
              <CheckList items={oemSignals} />
            </div>
            <div className="rounded-3xl bg-lime-300 p-8 text-neutral-950 md:p-10">
              <h2 className="text-3xl font-black tracking-tight">Choose the ODM path when</h2>
              <CheckList items={odmSignals} />
            </div>
          </section>

          <section className="mt-16 rounded-[2rem] bg-neutral-100 p-8 md:p-12" aria-labelledby="brief-heading">
            <h2 id="brief-heading" className="text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">What to prepare before requesting a quote</h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-700">A useful brief separates confirmed inputs from open decisions. Include:</p>
            <CheckList items={briefItems} />
          </section>

          <section className="mt-16" aria-labelledby="sampling-heading">
            <h2 id="sampling-heading" className="text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">Questions to settle before sampling</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {samplingQuestions.map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-neutral-200 p-7 md:p-8">
                  <h3 className="text-xl font-black text-neutral-950">{title}</h3>
                  <p className="mt-3 leading-relaxed text-neutral-600">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative mt-20 overflow-hidden rounded-[2.5rem] border border-lime-400/20 bg-neutral-950 p-8 text-white md:p-14" aria-labelledby="next-step-heading">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-lime-400/10 blur-[100px]" />
            <div className="relative z-10">
              <h2 id="next-step-heading" className="text-3xl font-black tracking-tight md:text-4xl">How this guide connects to POXIOL</h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">If you want POXIOL to review an OEM or ODM teamwear project, submit the information you already have and identify the decisions that remain open. Product scope, quantity, sampling, quotation and timing are confirmed only after the specific brief is reviewed.</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/get-quote/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-lime-400 px-7 py-3 text-center text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-white">Discuss Your OEM/ODM Project</Link>
                <Link href="/oem-odm/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 py-3 text-center text-sm font-black uppercase tracking-wide text-white transition hover:border-lime-400 hover:text-lime-400">Review OEM/ODM Services</Link>
              </div>
            </div>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  )
}
