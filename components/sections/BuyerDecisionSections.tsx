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
                {section.note ? <p className={dark ? 'mt-3 text-sm leading-6 text-neutral-500' : 'mt-3 text-sm leading-6 text-neutral-500'}>{section.note}</p> : null}
                {section.facts?.length ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {section.facts.map((fact) => (
                      <span key={fact} className={dark ? 'rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-200' : 'rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-600'}>
                        {fact}
                      </span>
                    ))}
                  </div>
                ) : null}
                {section.timeline?.length ? (
                  <ol className="mt-10 max-w-3xl space-y-4">
                    {section.timeline.map((item) => (
                      <li key={item.time} className="flex items-baseline gap-4 border-l-2 border-[#8CC700] pl-4">
                        <span className="whitespace-nowrap text-sm font-black uppercase tracking-wider text-[#8CC700]">{item.time}</span>
                        <span className={dark ? 'text-sm leading-6 text-neutral-300' : 'text-sm leading-6 text-neutral-600'}>{item.text}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {section.cards.map((card) => (
                  <article key={card.title} className={dark ? 'rounded-[2rem] border border-white/10 bg-white/[0.04] p-7' : 'rounded-[2rem] border border-neutral-200 bg-neutral-50 p-7'}>
                    <h3 className="text-lg font-black uppercase leading-tight">{card.title}</h3>
                    {card.benefit ? <p className={dark ? 'mt-3 text-sm font-bold leading-6 text-white' : 'mt-3 text-sm font-bold leading-6 text-neutral-900'}>{card.benefit}</p> : null}
                    <p className={dark ? 'mt-3 text-sm leading-7 text-neutral-400' : 'mt-3 text-sm leading-7 text-neutral-600'}>{card.description}</p>
                    {card.tags?.length ? <p className="mt-4 text-[11px] font-black uppercase tracking-wider text-[#8CC700]">{card.tags.join(' · ')}</p> : null}
                    {card.note ? <p className={dark ? 'mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-neutral-400' : 'mt-4 border-t border-neutral-200 pt-4 text-xs leading-5 text-neutral-500'}>{card.note}</p> : null}
                    {card.href ? (
                      <a href={card.href} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs font-black uppercase tracking-wider text-[#8CC700] hover:underline">
                        View verified store →
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
              <div className="mt-9">
                {section.cta ? <Link href={section.cta.href} className="inline-flex text-sm font-black uppercase tracking-[0.16em] text-[#8CC700] hover:underline">{section.cta.label} →</Link> : null}
                {section.ctaSecondary ? (
                  <a href={section.ctaSecondary.href} target="_blank" rel="noreferrer" className="ml-8 inline-flex text-sm font-black uppercase tracking-[0.16em] text-[#8CC700] hover:underline">
                    {section.ctaSecondary.label} →
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
