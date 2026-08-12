import {SectionHeading} from '@/components/ui'
import type {V8MediaAsset, V8ProcessStep} from '@/lib/v8/types.ts'
import {VerifiedMediaPlaceholder} from './VerifiedMediaPlaceholder'

export function ProductionProof({steps, media = [], eyebrow = 'Production Proof', title = 'Verified Production Media', description}: {steps: readonly V8ProcessStep[]; media?: readonly V8MediaAsset[]; eyebrow?: string; title?: string; description?: string}) {
  return <section className="bg-neutral-100 px-5 py-16 md:px-10 md:py-24 xl:px-20" aria-labelledby="v8-production-proof-title"><div className="mx-auto max-w-7xl"><div id="v8-production-proof-title"><SectionHeading eyebrow={eyebrow} title={title} subtitle={description} /></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list">{steps.map((step) => <article key={step.id} role="listitem"><VerifiedMediaPlaceholder asset={media.find((asset) => asset.stage === step.id)} /><h3 className="mt-4 text-xl font-black text-neutral-950">{step.title}</h3><p className="mt-2 leading-7 text-neutral-600">{step.description}</p></article>)}</div></div></section>
}
