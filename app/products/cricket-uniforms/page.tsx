import {CategoryLanding} from '@/components/home-optimization/CategoryLanding'
import {createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA} from '@/lib/seo/page-metadata'

const path='/products/cricket-uniforms/'
export const metadata=createPageMetadata({title:'Cricket Uniforms & Kits for Clubs | POXIOL',description:'Plan custom cricket whites or coloured kits for clubs and schools. Review shirt and trouser options, fit, artwork, quantity and delivery requirements.',canonical:`https://www.poxiol.com${path}`,metadata:{twitter:PRESERVED_ROOT_TWITTER_METADATA}})
export default function Page(){return <CategoryLanding data={{
  title:'Cricket Uniforms & Kits',product:'Cricket Uniforms',path,use:'Cricket',
  image:'/images/product-discovery/sport-cricket.webp',alt:'POXIOL cricket shirt and trouser kit program illustration',
  description:'Start with a cricket shirt and trouser program in white or club colours for clubs, schools or sportswear brands. Review the kit set, the fit, the fabric for the format you play and the artwork before confirming an order.',
  planningHeading:'Plan a cricket kit brief',
  planningAnswer:'Cricket kit planning starts with the format you play, the shirt and trouser set, the fit, artwork and badges, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.',
  decisionCards:[
    {title:'Kit set',body:'Start with a shirt and trousers. Tell us whether you need the full kit, a training layer or selected pieces.'},
    {title:'White or club colour',body:'State the format and whether the kit is white, club colour or a mix. Colour and badge placement are reviewed together.'},
    {title:'Fit and artwork',body:'Share the size range and athlete profile, then the badges, numbers and sponsor marks with any colour references.'},
  ],
  briefItems:['Buyer or company type and intended use','Shirt, trousers or full kit','Expected quantity and size breakdown','Format, colour and artwork status','Destination and required in-hand date'],
}} />}
