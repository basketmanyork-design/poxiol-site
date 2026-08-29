import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {publicSectionDecision} from '@/lib/release/publication-policy'
import {RealProofSection} from './RealProofSection'
const slots=[{category:'sample-review',title:'Front and Back Review'},{category:'measurement',title:'Measurement Check'},{category:'artwork-placement',title:'Design Placement Check'},{category:'stitching',title:'Finishing Check'}] as const
export function SampleInspectionProof({assets}: {assets: readonly V8MediaAsset[]}) {
  if (publicSectionDecision('quality-control-proof') !== 'EVIDENCE') return null
  return <RealProofSection assets={assets} slots={slots} eyebrow="Sample Approval" title="Review the Sample Before Bulk Production" description="Review the finished sample against the approved project specification before production planning continues." />
}
