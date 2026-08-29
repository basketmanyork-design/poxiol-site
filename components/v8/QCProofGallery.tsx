import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {publicSectionDecision} from '@/lib/release/publication-policy'
import {RealProofSection} from './RealProofSection'
const slots=[{category:'artwork-placement',title:'Design and Print Placement'},{category:'measurement',title:'Garment Measurements'},{category:'stitching',title:'Stitching and Construction'},{category:'finished-garment',title:'Finished Garment'},{category:'packing',title:'Packing Verification'}] as const
export function QCProofGallery({assets}: {assets: readonly V8MediaAsset[]}) {
  if (publicSectionDecision('quality-control-proof') !== 'EVIDENCE') return null
  return <RealProofSection assets={assets} slots={slots} eyebrow="Observable Checks" title="What We Check Before Shipment" description="Each approved image shows the specific product or packing detail being checked." />
}
