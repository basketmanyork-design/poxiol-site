import {PrimaryButton, SecondaryButton} from '@/components/ui'
import {getV8Cta} from '@/lib/v8/ctas.ts'
import type {V8Cta, V8HeroConfig, V8MediaAsset} from '@/lib/v8/types.ts'
import type {ProductVisualizationAsset} from '@/lib/product-visualization/types.ts'
import {resolveVerifiedMedia} from '@/lib/v8/media.ts'
import {ProductVisualizationMedia} from './ProductVisualizationMedia'
import {VerifiedMediaPlaceholder} from './VerifiedMediaPlaceholder'

export function V8Hero({config, media, visualization, visualizationPage, headingId = 'v8-hero-title', primary: primaryOverride, secondary: secondaryOverride}: {config: V8HeroConfig; media?: V8MediaAsset | null; visualization?: ProductVisualizationAsset; visualizationPage?: string; headingId?: string; primary?: V8Cta; secondary?: V8Cta | null}) {
  const primary = primaryOverride || getV8Cta(config.primaryCtaId)
  const secondary = secondaryOverride === undefined
    ? (config.secondaryCtaId ? getV8Cta(config.secondaryCtaId) : null)
    : secondaryOverride
  const verifiedMedia = resolveVerifiedMedia(media)
  const hasVisual = Boolean(visualization || verifiedMedia)
  return (
    <section className="bg-neutral-950 px-5 pb-28 pt-0 text-white sm:pt-12 md:px-10 md:pb-16 md:pt-10 xl:px-20" aria-labelledby={headingId}>
      <div className={`mx-auto grid w-full min-w-0 max-w-7xl items-center gap-10 ${hasVisual ? 'lg:grid-cols-[1.2fr_0.8fr] lg:gap-14' : ''}`}>
        <div className="min-w-0">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#B6FF00]">{config.eyebrow}</p>
          <h1 id={headingId} className="mt-4 max-w-full break-words [overflow-wrap:anywhere] text-[2rem] font-black uppercase leading-[1.02] min-[430px]:text-4xl sm:max-w-3xl sm:text-5xl lg:text-5xl xl:text-5xl">{config.title}</h1>
          <p className="mt-4 max-w-full break-words [overflow-wrap:anywhere] text-base leading-8 text-neutral-300 sm:mt-6 sm:max-w-2xl md:text-lg">{config.description}</p>
          <div className="mt-4 flex w-full min-w-0 flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-3">
            <PrimaryButton href={primary.href} analyticsLocation="hero" className="min-h-14 w-full min-w-0 sm:flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B6FF00]">{primary.label}</PrimaryButton>
            {secondary ? <SecondaryButton href={secondary.href} analyticsLocation="hero" className="min-h-14 w-full min-w-0 sm:flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{secondary.label}</SecondaryButton> : null}
          </div>
        </div>
        {visualization
          ? <ProductVisualizationMedia asset={visualization} page={visualizationPage} priority />
          : verifiedMedia ? <VerifiedMediaPlaceholder asset={verifiedMedia} priority /> : null}
      </div>
    </section>
  )
}
