import {SectionHeading} from '@/components/ui'
import type {V8ProcessStep} from '@/lib/v8/types.ts'
import {ProcessTimeline} from './ProcessTimeline'

export function ManufacturingTimeline({steps, eyebrow = 'Manufacturing', title = 'Custom Teamwear Production Process', description}: {steps: readonly V8ProcessStep[]; eyebrow?: string; title?: string; description?: string}) {
  return <section className="px-5 py-16 md:px-10 md:py-24 xl:px-20" aria-labelledby="v8-manufacturing-timeline-title"><div className="mx-auto max-w-7xl"><div id="v8-manufacturing-timeline-title"><SectionHeading eyebrow={eyebrow} title={title} subtitle={description} /></div><ProcessTimeline steps={steps} /></div></section>
}
