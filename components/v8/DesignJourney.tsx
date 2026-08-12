import {PrimaryButton, SectionHeading} from '@/components/ui'
import type {V8Cta, V8ProcessStep} from '@/lib/v8/types.ts'
import {ProcessTimeline} from './ProcessTimeline'

export function DesignJourney({steps, cta, eyebrow = 'Customization Journey', title = 'From Idea to Shipment', description}: {steps: readonly V8ProcessStep[]; cta?: V8Cta; eyebrow?: string; title?: string; description?: string}) {
  return <section className="bg-neutral-100 px-5 py-16 md:px-10 md:py-24 xl:px-20" aria-labelledby="v8-design-journey-title"><div className="mx-auto max-w-7xl"><div id="v8-design-journey-title"><SectionHeading eyebrow={eyebrow} title={title} subtitle={description} /></div><ProcessTimeline steps={steps} />{cta ? <div className="mt-10 text-center"><PrimaryButton href={cta.href} className="min-h-14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600">{cta.label}</PrimaryButton></div> : null}</div></section>
}
