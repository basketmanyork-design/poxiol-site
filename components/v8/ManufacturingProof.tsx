import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {RealProofSection} from './RealProofSection'
const slots=[{category:'printing',title:'Printing'},{category:'cutting',title:'Cutting'},{category:'sewing',title:'Sewing'},{category:'inspection',title:'Inspection'},{category:'packing',title:'Packing'}] as const
export function ManufacturingProof({assets}: {assets: readonly V8MediaAsset[]}) {return <RealProofSection assets={assets} slots={slots} eyebrow="Verified Process" title="Manufacturing Proof" description="Only approved POXIOL process media appears; missing stages retain the verification placeholder." />}
