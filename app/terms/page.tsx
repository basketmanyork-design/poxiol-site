import type {Metadata} from 'next'
import {Header, Footer} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Terms | POXIOL',
  description: 'General website and inquiry terms for POXIOL custom teamwear buyers.',
  alternates: {canonical: 'https://www.poxiol.com/terms/'},
}

export default function Page() {
  return (
    <main className="bg-neutral-950 text-white">
      <Header />
      <section className="px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6FF00]">POXIOL Policy</p>
          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight md:text-6xl">Terms</h1>
          <p className="mt-6 text-lg leading-8 text-neutral-300">General website and inquiry terms for POXIOL custom teamwear buyers.</p>
          <div className="mt-12 space-y-10 text-neutral-300">
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Website information</h2>
              <p className="mt-4 leading-8">Content on this website is provided for B2B sourcing reference. Product specifications, timelines and pricing are confirmed in writing for each project.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Quotes and production</h2>
              <p className="mt-4 leading-8">Mockups, samples, bulk production schedules and delivery plans depend on confirmed artwork, quantity, materials, payment status and factory capacity.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">No unauthorized artwork</h2>
              <p className="mt-4 leading-8">Buyers are responsible for confirming they have rights to use logos, names, numbers, trademarks or artwork submitted to POXIOL.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Liability</h2>
              <p className="mt-4 leading-8">POXIOL works to provide accurate information, but website content does not replace a signed quotation, invoice or production agreement.</p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
