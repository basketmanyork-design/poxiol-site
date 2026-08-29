import {ArrowRight} from 'lucide-react'
import Image from 'next/image'
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
                <article id={`sport-${sport.id}`} key={sport.id} data-product-scene={sport.id} className="group relative flex min-h-[27rem] scroll-mt-24 flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-neutral-950 p-6 transition-colors hover:border-[#b6ff00]/80 motion-reduce:transition-none">
                  <Image
                    aria-hidden="true"
                    alt=""
                    className="object-cover transition-[filter,transform] duration-500 [@media(hover:hover)]:group-hover:brightness-125 [@media(hover:hover)]:group-hover:scale-[1.03] group-focus-within:brightness-125 group-focus-within:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                    fill
                    sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) 50vw, 33vw"
                    src={sport.sceneImage}
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/95 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-80 group-focus-within:opacity-80 motion-reduce:transition-none" />
                  <div className="relative z-10 flex h-full flex-1 flex-col justify-between">
                    <div>
                      <span aria-hidden="true" className="text-5xl font-black text-white/35">{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="mt-6 text-2xl font-black uppercase leading-tight text-white">{sport.label}</h3>
                      <p className="mt-4 font-medium leading-7 text-white/85">{sport.description}</p>
                    </div>
                    <Link href={href} className="mt-8 inline-flex min-h-11 items-center gap-2 font-black uppercase tracking-wide text-[#b6ff00] outline-none focus-visible:ring-2 focus-visible:ring-[#b6ff00] focus-visible:ring-offset-4 focus-visible:ring-offset-black">
                      {cta}
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" strokeWidth={2.5} />
                    </Link>
                  </div>
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
              <article id={`scenario-${scenario.id}`} key={scenario.id} data-product-scene={scenario.id} className="group relative min-h-[34rem] scroll-mt-24 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white md:p-8">
                <Image
                  aria-hidden="true"
                  alt=""
                  className="object-cover transition-[filter,transform] duration-500 [@media(hover:hover)]:group-hover:brightness-125 [@media(hover:hover)]:group-hover:scale-[1.03] group-focus-within:brightness-125 group-focus-within:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                  fill
                  sizes="(max-width: 1023px) calc(100vw - 2.5rem), 33vw"
                  src={scenario.sceneImage}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-black/95 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-80 group-focus-within:opacity-80 motion-reduce:transition-none" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase leading-tight">{scenario.label}</h3>
                  <p className="mt-4 font-medium leading-7 text-white/85">{scenario.description}</p>
                  <ul className="mt-7 flex flex-wrap gap-2" aria-label={`${scenario.label} sports`}>
                    {SPORT_CATEGORIES.map((sport) => (
                      <li key={sport.id}>
                        <Link
                          className="inline-flex min-h-11 items-center rounded-full border border-white/35 bg-black/45 px-3 py-2 text-sm font-bold text-white outline-none backdrop-blur-sm transition-colors hover:border-[#b6ff00] hover:text-[#b6ff00] focus-visible:ring-2 focus-visible:ring-[#b6ff00] focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none"
                          href={productDiscoveryInquiryHref({sport: sport.id, scenario: scenario.id, source: '/products/'})}
                        >
                          {sport.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-4xl border-l-4 border-[#b6ff00] pl-4 font-bold leading-7">{qualification}</p>
        </div>
      </section>
    </>
  )
}
