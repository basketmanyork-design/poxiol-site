import Link from 'next/link'
import {BUYER_DECISION_SECTIONS} from '@/lib/buyer-decision'

export function BuyerDecisionSections() {
  return (
    <div aria-label="Buyer decision guide">
      {BUYER_DECISION_SECTIONS.map((section, index) => {
        const dark = index % 2 === 0
        return (
          <section id={section.id} key={section.id} className={dark ? 'bg-neutral-950 px-5 py-20 text-white md:px-10 md:py-28 xl:px-20' : 'bg-white px-5 py-20 text-neutral-950 md:px-10 md:py-28 xl:px-20'}>
            <div className="mx-auto max-w-7xl">
              <div className="max-w-4xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8CC700]">{section.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">{section.title}</h2>
                <p className={dark ? 'mt-6 max-w-3xl text-lg leading-8 text-neutral-300' : 'mt-6 max-w-3xl text-lg leading-8 text-neutral-600'}>{section.body}</p>
              </div>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {section.cards.map((card) => (
                  <article key={card.title} className={dark ? 'rounded-[2rem] border border-white/10 bg-white/[0.04] p-7' : 'rounded-[2rem] border border-neutral-200 bg-neutral-50 p-7'}>
                    <h3 className="text-lg font-black uppercase leading-tight">{card.title}</h3>
                    <p className={dark ? 'mt-3 text-sm leading-7 text-neutral-400' : 'mt-3 text-sm leading-7 text-neutral-600'}>{card.description}</p>
                  </article>
                ))}
              </div>
              {section.cta ? <Link href={section.cta.href} className="mt-9 inline-flex text-sm font-black uppercase tracking-[0.16em] text-[#8CC700] hover:underline">{section.cta.label} →</Link> : null}
            </div>
          </section>
        )
      })}
    </div>
  )
}
