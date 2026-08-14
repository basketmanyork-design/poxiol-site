import type {V8MediaAsset} from '@/lib/v8/types.ts'
import {RealProofSection} from './RealProofSection'

const slots = [
  {category:'full-set',title:'Complete Uniform Set'},{category:'front',title:'Jersey Front'},{category:'back',title:'Jersey Back'},
  {category:'shorts-front',title:'Shorts Front'},{category:'shorts-back',title:'Shorts Back'},
  {category:'fabric',title:'Fabric Detail'},{category:'collar',title:'Collar Construction'},{category:'number',title:'Number Placement'},{category:'waistband',title:'Waistband Detail'},
] as const
export function RealProductGallery({assets, eyebrow = 'Finished Uniform', title = 'See the Details Before You Order', description = 'Review approved product photographs and construction details before production planning.'}: {assets: readonly V8MediaAsset[]; eyebrow?: string; title?: string; description?: string}) {return <RealProofSection assets={assets} slots={slots} eyebrow={eyebrow} title={title} description={description} />}
