import Link from "next/link"
import {Footer, Header, PrimaryButton, SecondaryButton} from '@/components/ui'
import {ISSUE_REVIEW_STEPS} from '@/lib/buyer-decision'
import {createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA} from '@/lib/seo/page-metadata'

const canonical = 'https://www.poxiol.com/shipping-after-sales/'
const preservedMetadataBaseline = {
  alternates: {canonical: '/shipping-after-sales/'},
} as const

export const metadata = createPageMetadata({
  title: 'Shipping and After-Sales Process | POXIOL',
  description: 'Review POXIOL production planning, shipping confirmation, tracking updates and the project-specific order issue review process.',
  canonical: preservedMetadataBaseline.alternates.canonical,
  metadata: {twitter: PRESERVED_ROOT_TWITTER_METADATA},
})

const shippingSteps = [
  {title: 'Production Planning', description: 'The product specification, quantity, artwork or sample approval and target schedule are confirmed before production is scheduled.'},
  {title: 'Shipping Method Selection', description: 'The shipping method is selected according to destination, shipment size, timing and the buyer-confirmed quotation.'},
  {title: 'Destination Confirmation', description: 'The delivery address, contact details and any order-specific customs or duties assumptions are confirmed before dispatch.'},
  {title: 'Tracking and Shipment Updates', description: 'Shipment details and available carrier tracking are shared after dispatch.'},
]

const shippingFaqs = [
  {question: 'What determines the production schedule for a custom teamwear order?', answer: 'Production is scheduled after the product specification, quantity, approved size breakdown, artwork or sample approval and target date are confirmed. Because those inputs differ per project, the schedule is stated for the quotation rather than presented as one fixed figure for every order.'},
  {question: 'Can an order be planned around a season start date?', answer: 'Share the required in-hand date with the brief. Feasibility is reviewed against the product, the quantity, the artwork approval stage and the delivery destination, and the confirmed schedule is stated before the order is placed.'},
  {question: 'Who is responsible for customs duties and import charges?', answer: 'Destination, shipping method, freight, carrier timing and any customs or duties assumptions are confirmed for the specific quotation. Ask whether DDP terms are available for the delivery country before the order is placed, since that availability differs by destination.'},
  {question: 'What usually delays an international teamwear shipment?', answer: 'Dispatches are most often held by an unapproved artwork file or size list, incomplete consignee details, or a duty assumption that was never confirmed against the quotation. Each of these is checked before production is scheduled and again before the shipment is released.'},
  {question: 'What is confirmed before an order is dispatched?', answer: 'The delivery address, contact details, shipping method, freight basis and any order-specific customs or duties assumptions are confirmed. Shipment details and carrier tracking are shared after dispatch where the carrier provides tracking.'},
  {question: 'How is an order or delivery issue reviewed?', answer: 'A report is reviewed against the approved project records and the outcome is confirmed for that project in writing. This review does not create an automatic refund, replacement or compensation policy.'},
]

export default function ShippingAfterSalesPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify([
        {'@context': 'https://schema.org', '@type': 'WebPage', name: 'Shipping and After-Sales Process', description: metadata.description, url: canonical},
        {'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
          {'@type': 'ListItem', position: 2, name: 'Shipping and After-Sales', item: canonical},
        ]},
        {'@context': 'https://schema.org', '@type': 'FAQPage', '@id': canonical + '#faq', mainEntity: shippingFaqs.map(({question, answer}) => ({
          '@type': 'Question', name: question, acceptedAnswer: {'@type': 'Answer', text: answer},
        }))},
      ])}} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B6FF00]">Production, Delivery and Support</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black uppercase tracking-tight md:text-7xl">Shipping and After-Sales Process</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-neutral-300">Understand how production timing, shipping requirements, tracking and issue reporting are confirmed for each custom teamwear order.</p>
          <div className="mt-10 flex flex-wrap gap-4"><PrimaryButton href="/free-mockup/">Get a Free Mockup</PrimaryButton><SecondaryButton href="/contact/">Talk to a Teamwear Specialist</SecondaryButton></div>
        </div>
      </section>
      <section className="bg-white px-5 py-20 text-neutral-950 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase md:text-5xl">Production and Shipping Workflow</h2>
          <p className="mt-5 max-w-3xl leading-8 text-neutral-600">Production scheduling is confirmed after the design, quantity, size breakdown and project requirements are approved. Shipping method, freight assumptions and delivery timing are confirmed according to the destination and project requirements.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{shippingSteps.map((step, index) => <article key={step.title} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-7"><p className="text-sm font-black text-lime-600">{String(index + 1).padStart(2, '0')}</p><h3 className="mt-4 text-xl font-black uppercase">{step.title}</h3><p className="mt-3 text-sm leading-7 text-neutral-600">{step.description}</p></article>)}</div>
        </div>
      </section>
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase md:text-5xl">How to Report an Order or Delivery Issue</h2>
          <p className="mt-5 max-w-3xl leading-8 text-neutral-300">A report is reviewed against the approved project records. The outcome is confirmed for that project in writing; this page does not create an automatic refund, replacement or compensation policy.</p>
          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{ISSUE_REVIEW_STEPS.map((step, index) => <li key={step} className="rounded-[2rem] border border-white/10 bg-white/5 p-7"><p className="text-sm font-black text-[#B6FF00]">{String(index + 1).padStart(2, '0')}</p><p className="mt-4 font-bold leading-7">{step}</p></li>)}</ol>
          <div className="mt-12"><Link href="/contact/" className="text-sm font-black uppercase tracking-[0.16em] text-[#B6FF00] hover:underline">Contact a Teamwear Specialist →</Link></div>
        </div>
      </section>
      <section className="bg-white px-5 py-20 text-neutral-950 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black uppercase md:text-5xl">Shipping and Delivery FAQ</h2>
          <div className="mt-12 space-y-8">{shippingFaqs.map(faq => <div key={faq.question}><h3 className="text-lg font-black">{faq.question}</h3><p className="mt-2 leading-7 text-neutral-600">{faq.answer}</p></div>)}</div>
        </div>
      </section>
      <section className="bg-neutral-950 border-t border-white/5 px-5 py-20 text-white md:px-10 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">Policies</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-400">The commercial and legal basis for an order sits in these pages.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link key="/terms/" href="/terms/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Terms</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">The terms that apply to an order.</p>
            </Link>
            <Link key="/intellectual-property-policy/" href="/intellectual-property-policy/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Intellectual Property</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">How artwork, logos and marks are handled.</p>
            </Link>
            <Link key="/privacy-policy/" href="/privacy-policy/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Privacy Policy</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">What is collected and why.</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
