import {SectionHeading} from '@/components/ui'
import type {ProductionAssetCategory} from '@/lib/real-production/types.ts'
import {getPublicProofAssets} from '@/lib/v8/media.ts'
import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {VerifiedMediaPlaceholder} from './VerifiedMediaPlaceholder'
import {VerifiedProductionVideo} from './VerifiedProductionVideo'

export type RealProofSlot = {category: ProductionAssetCategory; title: string; description?: string}

export function RealProofSection({assets, slots, eyebrow, title, description, dark = false}: {assets: readonly V8MediaAsset[]; slots: readonly RealProofSlot[]; eyebrow: string; title: string; description: string; dark?: boolean}) {
  const publishableAssets = getPublicProofAssets(assets)
  const visibleSlots = slots.filter((slot) => publishableAssets.some((item) => item.stage === slot.category))
  if (!visibleSlots.length) return null

  const sectionClass = (dark ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950') + ' px-5 py-16 md:px-10 md:py-24 xl:px-20'
  const headingClass = 'mt-4 text-xl font-black ' + (dark ? 'text-white' : 'text-neutral-950')
  const descriptionClass = 'mt-2 leading-7 ' + (dark ? 'text-neutral-400' : 'text-neutral-600')

  return (
    <section className={sectionClass}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={description} dark={dark} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleSlots.map((slot) => {
            const asset = publishableAssets.find((item) => item.stage === slot.category)!
            return (
              <article key={slot.category} className="min-w-0">
                {asset.kind === 'video' ? <VerifiedProductionVideo asset={asset} /> : <VerifiedMediaPlaceholder asset={asset} />}
                <h3 className={headingClass}>{slot.title}</h3>
                {slot.description ? <p className={descriptionClass}>{slot.description}</p> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
