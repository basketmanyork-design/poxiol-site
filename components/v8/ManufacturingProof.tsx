import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {publicSectionDecision} from '@/lib/release/publication-policy'
import {RealProofSection} from './RealProofSection'
const slots=[{category:'printing',title:'Printing'},{category:'cutting',title:'Cutting'},{category:'sewing',title:'Sewing'},{category:'inspection',title:'Inspection'},{category:'packing',title:'Packing'}] as const
export function ManufacturingProof({assets}: {assets: readonly V8MediaAsset[]}) {
  if (publicSectionDecision('factory-process') !== 'EVIDENCE') return null
  return <RealProofSection assets={assets} slots={slots} eyebrow="Verified Process" title="Manufacturing Proof" description="Approved POXIOL process media for this manufacturing stage." />
}
