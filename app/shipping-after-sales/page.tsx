import type {Metadata} from 'next'
import Link from 'next/link'
import {Footer, Header, PrimaryButton, SecondaryButton} from '@/components/ui'
import {ISSUE_REVIEW_STEPS} from '@/lib/buyer-decision'

const canonical = 'https://www.poxiol.com/shipping-after-sales/'

export const metadata: Metadata = {
  title: 'Shipping and After-Sales Process | POXIOL',
  description: 'Review POXIOL production planning, shipping confirmation, tracking updates and the project-specific order issue review process.',
  alternates: {canonical: '/shipping-after-sales/'},
}

const shippingSteps = [
  {title: 'Production Planning', description: 'The product specification, quantity, artwork or sample approval and target schedule are confirmed before production is scheduled.'},
  {title: 'Shipping Method Selection', description: 'The shipping method is selected according to destination, shipment size, timing and the buyer-confirmed quotation.'},
  {title: 'Destination Confirmation', description: 'The delivery address, contact details and any order-specific customs or duties assumptions are confirmed before dispatch.'},
  {title: 'Tracking and Shipment Updates', description: 'Shipment details and available carrier tracking are shared after dispatch.'},
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
          <p className="mt-5 max-w-3xl leading-8 text-neutral-600">Bulk production commonly takes 7–12 working days after sample or artwork approval. Express shipping commonly takes 3–7 business days depending on destination and carrier. Large, complex or peak-season projects require a confirmed schedule.</p>
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
      <Footer />
    </main>
  )
}
