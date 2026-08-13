import {SectionHeading} from '@/components/ui'
import type {V8MediaAsset, V8ProcessStep} from '@/lib/v8/types.ts'
import {ProcessTimeline} from './ProcessTimeline'
import {VerifiedMediaPlaceholder} from './VerifiedMediaPlaceholder'

export function SampleApproval({steps, media, eyebrow = 'Sample Approval', title = 'Confirm Before Bulk Production', description}: {steps: readonly V8ProcessStep[]; media?: V8MediaAsset | null; eyebrow?: string; title?: string; description?: string}) {
  return <section className="px-5 py-16 md:px-10 md:py-24 xl:px-20" aria-labelledby="v8-sample-approval-title"><div className="mx-auto max-w-7xl"><div id="v8-sample-approval-title"><SectionHeading eyebrow={eyebrow} title={title} subtitle={description} /></div><div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"><ProcessTimeline steps={steps} /><VerifiedMediaPlaceholder asset={media} /></div></div></section>
}
