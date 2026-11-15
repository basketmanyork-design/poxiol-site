import {CategoryLanding} from '@/components/home-optimization/CategoryLanding'
import {createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA} from '@/lib/seo/page-metadata'

const path='/products/rugby-uniforms/'
export const metadata=createPageMetadata({title:'Rugby Uniforms for Clubs & Schools | POXIOL',description:'Plan custom rugby jerseys and shorts for clubs, schools or sportswear brands. Review fit, fabric, numbering, artwork, quantity and delivery requirements.',canonical:`https://www.poxiol.com${path}`,metadata:{twitter:PRESERVED_ROOT_TWITTER_METADATA}})
export default function Page(){return <CategoryLanding data={{
  title:'Rugby Uniforms & Jerseys',product:'Rugby Uniforms',path,use:'Rugby',
  image:'/images/product-discovery/sport-rugby.webp',alt:'POXIOL rugby jersey and shorts program illustration',
  description:'Start with a rugby jersey and shorts program for clubs, schools or sportswear brands. Review the garment set, the fit through the shoulders and chest, numbering and artwork before confirming an order.',
  planningHeading:'Plan a rugby uniform brief',
  planningAnswer:'Rugby uniform planning starts with the garment set, the fit you want through the shoulders and chest, numbering and sponsor marks, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.',
  decisionCards:[
    {title:'Garment set',body:'Start with a match jersey and shorts. Tell us whether you need the full set, a training layer or selected pieces.'},
    {title:'Fit through contact',body:'Share the size range, the athlete profile and whether the jersey should sit close or loose. Fit preference is reviewed with the fabric and construction.'},
    {title:'Numbering and marks',body:'Provide numbers, club crests, sponsor marks and colour references. Any league or third-party mark has to be authorised by the buyer.'},
  ],
  briefItems:['Buyer or company type and intended use','Jersey, shorts or coordinated set','Expected quantity and size breakdown','Numbering, crest and artwork status','Destination and required in-hand date'],
}} />}
