import {PrimaryButton, SecondaryButton} from '@/components/ui'
import {getV8Cta} from '@/lib/v8/ctas.ts'
import type {V8Cta, V8HeroConfig, V8MediaAsset} from '@/lib/v8/types.ts'
import {VerifiedMediaPlaceholder} from './VerifiedMediaPlaceholder'

export function V8Hero({config, media, headingId = 'v8-hero-title', primary: primaryOverride, secondary: secondaryOverride}: {config: V8HeroConfig; media?: V8MediaAsset | null; headingId?: string; primary?: V8Cta; secondary?: V8Cta | null}) {
  const primary = primaryOverride || getV8Cta(config.primaryCtaId)
  const secondary = secondaryOverride === undefined
    ? (config.secondaryCtaId ? getV8Cta(config.secondaryCtaId) : null)
    : secondaryOverride
  return (
    <section className="overflow-x-hidden bg-neutral-950 px-5 pb-28 pt-10 text-white sm:pt-12 md:px-10 md:pb-16 md:pt-10 xl:px-20" aria-labelledby={headingId}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#B6FF00]">{config.eyebrow}</p>
          <h1 id={headingId} className="mt-5 max-w-3xl break-words text-[2rem] font-black uppercase leading-[1.02] min-[390px]:text-4xl sm:text-5xl lg:text-5xl xl:text-5xl">{config.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">{config.description}</p>
          <div className="mt-8 flex flex-col gap-3 min-[360px]:flex-row">
            <PrimaryButton href={primary.href} className="min-h-14 min-[360px]:flex-1 min-[360px]:px-4 min-[360px]:py-2 min-[360px]:text-xs min-[360px]:leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B6FF00]">{primary.label}</PrimaryButton>
            {secondary ? <SecondaryButton href={secondary.href} className="min-h-14 min-[360px]:flex-1 min-[360px]:px-4 min-[360px]:py-2 min-[360px]:text-xs min-[360px]:leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{secondary.label}</SecondaryButton> : null}
          </div>
        </div>
        <VerifiedMediaPlaceholder asset={media} />
      </div>
    </section>
  )
}
