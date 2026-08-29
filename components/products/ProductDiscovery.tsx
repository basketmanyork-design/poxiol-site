import {ArrowRight} from 'lucide-react'
import Link from 'next/link'

import {
  SPORT_CATEGORIES,
  WEARING_SCENARIOS,
  productDiscoveryInquiryHref,
} from '@/lib/product-taxonomy'

const qualification = 'Product construction, material, quantity and timing are confirmed after the project brief is reviewed.'

export function ProductDiscovery() {
  return (
    <>
      <section id="sports" className="scroll-mt-24 bg-[#0a0a0a] px-5 py-20 text-white md:px-10 md:py-28 xl:px-20" aria-labelledby="sports-title">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b6ff00]">Browse by sport</p>
          <h2 id="sports-title" className="mt-3 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">Start with the sport you serve</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPORT_CATEGORIES.map((sport, index) => {
              const href = sport.contentStage === 'deep-page'
                ? sport.href
                : productDiscoveryInquiryHref({sport: sport.id, source: '/products/'})
              const cta = sport.contentStage === 'deep-page'
                ? 'View Product Details'
                : 'Discuss This Sport Program'

              return (
                <article key={sport.id} className="group flex min-h-72 flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-6 transition-colors hover:border-[#b6ff00]/70">
                  <div>
                    <span aria-hidden="true" className="text-5xl font-black text-white/10">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-6 text-2xl font-black uppercase leading-tight">{sport.label}</h3>
                    <p className="mt-4 leading-7 text-neutral-300">{sport.description}</p>
                  </div>
                  <Link href={href} className="mt-8 inline-flex min-h-11 items-center gap-2 font-black uppercase tracking-wide text-[#b6ff00] outline-none focus-visible:ring-2 focus-visible:ring-[#b6ff00] focus-visible:ring-offset-4 focus-visible:ring-offset-black">
                    {cta}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="scenarios" className="scroll-mt-24 bg-white px-5 py-20 text-neutral-950 md:px-10 md:py-28 xl:px-20" aria-labelledby="scenarios-title">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#356000]">Browse by wearing scenario</p>
          <h2 id="scenarios-title" className="mt-3 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">Choose how the range will be worn</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {WEARING_SCENARIOS.map((scenario) => (
              <article key={scenario.id} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
                <h3 className="text-2xl font-black uppercase leading-tight">{scenario.label}</h3>
                <p className="mt-4 leading-7 text-neutral-700">{scenario.description}</p>
                <ul className="mt-7 flex flex-wrap gap-2" aria-label={`${scenario.label} sports`}>
                  {SPORT_CATEGORIES.map((sport) => (
                    <li key={sport.id}>
                      <Link
                        className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-white px-3 py-2 text-sm font-bold outline-none transition-colors hover:border-[#356000] hover:text-[#356000] focus-visible:ring-2 focus-visible:ring-[#356000] focus-visible:ring-offset-2"
                        href={productDiscoveryInquiryHref({sport: sport.id, scenario: scenario.id, source: '/products/'})}
                      >
                        {sport.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-4xl border-l-4 border-[#b6ff00] pl-4 font-bold leading-7">{qualification}</p>
        </div>
      </section>
    </>
  )
}
