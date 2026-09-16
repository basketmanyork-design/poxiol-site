import {isDocumentVisible} from '@/lib/cms/visibility'
import {contentSource,sanityQuery} from './client'

const query=`*[_type == "sitePage" && pageKey == "homepage"][0]{publishStatus,homepageOptimization}`
const limits={heroEyebrow:80,heroHeading:130,heroDescription:500,heroWelcome:180,heroMicrocopy:180,sportsHeading:130,buyersHeading:130,detailsHeading:130,mockupHeading:130,sampleHeading:130,productionHeading:130,faqHeading:130,contactHeading:130} as const
type CopyKey=keyof typeof limits
export type HomepageOptimizationCopy=Partial<Record<CopyKey,string>> & {faqs?: {question:string;answer:string}[]}
type RawPage={publishStatus?:string;homepageOptimization?:Record<string,unknown>}

export async function getHomepageOptimizationCopy():Promise<HomepageOptimizationCopy> {
  if(contentSource==='legacy') return {}
  const response=await sanityQuery<RawPage>(query)
  if(!response.ok || !response.result || !isDocumentVisible(response.result.publishStatus,contentSource)) return {}
  const raw=response.result.homepageOptimization
  if(!raw || typeof raw!=='object') return {}
  const copy:HomepageOptimizationCopy={}
  for(const key of Object.keys(limits) as CopyKey[]) {
    const value=raw[key]
    if(typeof value==='string' && value.trim() && value.trim().length<=limits[key]) copy[key]=value.trim()
  }
  if(Array.isArray(raw.faqs) && raw.faqs.length===9) {
    const faqs=raw.faqs.map(item=>({question:typeof item?.question==='string'?item.question.trim():'',answer:typeof item?.answer==='string'?item.answer.trim():''}))
    if(faqs.every(item=>item.question.length>0 && item.question.length<=180 && item.answer.length>0 && item.answer.length<=700)) copy.faqs=faqs
  }
  return copy
}
