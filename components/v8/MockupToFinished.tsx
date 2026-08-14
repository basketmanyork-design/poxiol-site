import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {RealProofSection} from './RealProofSection'

const slots = [
  {category: 'mockup', title: 'Approved Mockup'},
  {category: 'finished-garment', title: 'Finished Sample'},
] as const

function withFinishedSampleFallback(assets: readonly V8MediaAsset[]): V8MediaAsset[] {
  if (assets.some((asset) => asset.stage === 'finished-garment')) return [...assets]
  const finishedSample = assets.find((asset) => asset.stage === 'full-set')
    || assets.find((asset) => asset.stage === 'front')
  return finishedSample
    ? [...assets, {...finishedSample, id: `${finishedSample.id}-finished-sample`, stage: 'finished-garment'}]
    : [...assets]
}

export function MockupToFinished({assets}: {assets: readonly V8MediaAsset[]}) {
  return (
    <RealProofSection
      assets={withFinishedSampleFallback(assets)}
      slots={slots}
      eyebrow="Design Execution"
      title="From Design to Finished Uniform"
      description="Compare the approved design with the finished garment before moving into larger production planning."
    />
  )
}
