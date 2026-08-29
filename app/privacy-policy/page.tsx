import type {Metadata} from 'next'
import {Header, Footer} from '@/components/ui'
import {LegalDraftNotice} from '@/components/legal/LegalDraftNotice'
import {legalPolicyMetadata} from '@/lib/legal-release'

export const metadata: Metadata = {
  title: 'Privacy Policy | POXIOL',
  description: 'How POXIOL handles project inquiry information submitted by B2B custom teamwear buyers.',
  alternates: {canonical: 'https://www.poxiol.com/privacy-policy/'},
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
          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight md:text-6xl">Privacy Policy</h1>
          <p className="mt-6 text-lg leading-8 text-neutral-300">How POXIOL handles project inquiry information submitted by B2B custom teamwear buyers.</p>
          <div className="mt-12 space-y-10 text-neutral-300">
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Information we collect</h2>
              <p className="mt-4 leading-8">POXIOL may receive contact details, project notes, sport category, quantity, delivery country, artwork files and communication preferences when buyers submit an inquiry.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">How information is used</h2>
              <p className="mt-4 leading-8">Information is used to reply to inquiries, prepare mockup or quote guidance, coordinate sampling and support order communication.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Data sharing</h2>
              <p className="mt-4 leading-8">POXIOL does not sell inquiry information. Limited project details may be shared with production or logistics partners only when needed to evaluate or fulfill a buyer request.</p>
            </section>
            <section>
              <h2 className="text-2xl font-black uppercase text-white">Contact</h2>
              <p className="mt-4 leading-8">For privacy questions, contact POXIOL through the published email or contact page.</p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
