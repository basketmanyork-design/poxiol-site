import Link from 'next/link'
import type {CmsPageSection} from '@/lib/cms/types'

function cardsFor(section: CmsPageSection) {
  if (section.steps?.length) {
    return section.steps.map((step, index) => ({
      eyebrow: String(index + 1).padStart(2, '0'),
      title: step.title,
      description: step.description,
    }))
  }
  if (section.stats?.length) {
    return section.stats.map((stat) => ({eyebrow: stat.value, title: stat.label, description: ''}))
  }
  if (section.specifications?.length) {
    return section.specifications.map((spec) => ({eyebrow: 'Check', title: spec.label, description: spec.value}))
  }
  return (section.facts || []).map((fact) => ({eyebrow: 'Included', title: fact, description: ''}))
}

export function SeedTrustConversionSections({sections}: {sections: CmsPageSection[]}) {
  return (
    <div aria-label="Club purchasing and quality workflow">
      {sections.filter((section) => section.enabled !== false && section.type !== 'cta').map((section, index) => {
        const cards = cardsFor(section)
        const dark = index % 2 === 0
        return (
          <section
            key={`${section.type || 'section'}-${section.title}-${index}`}
            className={dark ? 'bg-neutral-950 px-5 py-20 text-white md:px-10 md:py-28 xl:px-20' : 'bg-white px-5 py-20 text-neutral-950 md:px-10 md:py-28 xl:px-20'}
          >
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                <div>
                  {section.eyebrow ? <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8CC700]">{section.eyebrow}</p> : null}
                  <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">{section.title}</h2>
                  {section.body ? <p className={dark ? 'mt-5 max-w-2xl leading-8 text-neutral-300' : 'mt-5 max-w-2xl leading-8 text-neutral-600'}>{section.body}</p> : null}
                  {section.cta ? <Link className="mt-7 inline-flex text-sm font-black uppercase tracking-[0.16em] text-[#8CC700] hover:underline" href={section.cta.href}>{section.cta.label} {'->'}</Link> : null}
                </div>
                {section.image ? <img src={section.image.url} alt={section.image.alt} className="aspect-[16/9] w-full rounded-[2rem] object-cover" /> : null}
              </div>
              {cards.length ? (
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {cards.map((card) => (
                    <article key={`${card.eyebrow}-${card.title}`} className={dark ? 'rounded-[2rem] border border-white/10 bg-white/[0.04] p-7' : 'rounded-[2rem] border border-neutral-200 bg-neutral-50 p-7'}>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8CC700]">{card.eyebrow}</p>
                      <h3 className="mt-4 text-xl font-black uppercase leading-tight">{card.title}</h3>
                      {card.description ? <p className={dark ? 'mt-3 text-sm leading-7 text-neutral-400' : 'mt-3 text-sm leading-7 text-neutral-600'}>{card.description}</p> : null}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        )
      })}
    </div>
  )
}