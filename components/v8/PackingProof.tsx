import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {publicSectionDecision} from '@/lib/release/publication-policy'
import {RealProofSection} from './RealProofSection'
const slots=[{category:'individual-packaging',title:'Individual Packaging'},{category:'grouped-order',title:'Grouped Team Order'},{category:'carton-preparation',title:'Carton Preparation'}] as const
export function PackingProof({assets}: {assets: readonly V8MediaAsset[]}) {
  if (publicSectionDecision('delivery-proof') !== 'EVIDENCE') return null
  return <RealProofSection assets={assets} slots={slots} eyebrow="Packing Proof" title="Prepared for Team Delivery" description="Approved packing images show garments after final checks without exposing private shipping information." />
}
