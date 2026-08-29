import type {Metadata} from 'next'
import {Header, Footer} from '@/components/ui'
import {LegalDraftNotice} from '@/components/legal/LegalDraftNotice'
import {legalPolicyMetadata} from '@/lib/legal-release'

export const metadata: Metadata = {
  title: 'Intellectual Property Policy | POXIOL',
  description: 'POXIOL only supports buyer-owned, original or properly authorized artwork for custom teamwear production.',
  alternates: {canonical: 'https://www.poxiol.com/intellectual-property-policy/'},
  ...legalPolicyMetadata(),
}

export default function Page() {
  return (
    <main className="bg-neutral-950 text-white">
      <Header />
      <section className="px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <LegalDraftNotice />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6FF00]">POXIOL Policy</p>
          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight md:text-6xl">Intellectual Property Policy</h1>
          <p className="mt-6 text-lg leading-8 text-neutral-300">POXIOL only supports buyer-owned, original or properly authorized artwork for custom teamwear production.</p>
          <div className="mt-12 space-y-10 text-neutral-300">
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Buyer authorization</h2>
              <p className="mt-4 leading-8">By submitting artwork, logos, team names, brand marks or reference designs, the buyer confirms they own or have permission to use those materials.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Protected marks</h2>
              <p className="mt-4 leading-8">POXIOL does not provide unauthorized protected team crests, league marks, tournament logos or third-party brand artwork.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Production review</h2>
              <p className="mt-4 leading-8">If submitted artwork appears sensitive or unclear, POXIOL may request proof of authorization or decline the project.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Reporting concerns</h2>
              <p className="mt-4 leading-8">For IP concerns, contact POXIOL with the relevant project details and ownership information.</p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
