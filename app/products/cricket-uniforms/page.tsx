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
  sections:[
    {heading:'White kit, coloured kit, and the format decision',paragraphs:[
      'Cricket kit splits by format before it splits by design. A traditional white kit carries different expectations from a coloured limited-overs kit, and a club that plays both needs two sets rather than one set in two colours. Deciding the format first prevents the most common cricket ordering mistake: a white shirt approved with a print treatment that only reads well on a coloured ground.',
      'A cricket kit is also a two-garment problem. Shirt and trousers are cut differently, sized differently and wear differently, and a size list that gives only a shirt size leaves the trousers unresolved. Trousers carry the waist, the inseam and usually the pad-friendly cut, and each of those is a separate specification item.',
    ]},
    {heading:'Fabric and the long day',paragraphs:[
      'Cricket is played slowly. A player can be in the field for a full day in heat with limited shade, which makes breathability and moisture handling more important than in a sport played in short bursts. That is why the fabric conversation for cricket starts with how the garment behaves when it is worn for six hours rather than with how it photographs.',
      'The decoration follows the fabric. A white kit shows print edges and shadowing differently from a coloured one, and a design that relies on fine tonal detail behaves differently on each. Reviewing the artwork on the actual fabric reference, rather than on a screen, is what keeps the delivered kit close to the approved mockup.',
    ]},
    {heading:'Badges, numbers and club identity',paragraphs:[
      'Cricket shirts carry a club badge, often a sponsor mark and, in some competitions, a number. Each is a separate artwork item. The badge is usually the most detailed mark on the garment, which makes its size and its thread or print method a real decision rather than a formality: a detailed crest reproduced too small loses the elements that make it legible.',
      'The same authorisation question applies as in any sport. A club badge the buyer owns is straightforward; a league, county or competition mark has to be authorised, and the buyer is the party who holds that authorisation. Confirming which marks are owned and which are licensed belongs in the first brief, not in the artwork round.',
    ]},
    {heading:'Sizing across a club, and reorders a season later',paragraphs:[
      'A cricket club roster is unusually wide: junior sides, adult sides and social players in the same order. A size list per player, reviewed against the size chart the club already uses, is the only reliable input. In manual cut and sew a tolerance of roughly 2 cm across batches is the accepted industry standard and is not a defect.',
      'Cricket clubs reorder more often than most, because a season is long and players join mid-season. Keeping the approved artwork, the size chart and the fabric reference on file turns a mid-season top-up into a short confirmation. What has to be re-approved rather than reused is stated per batch, so nobody assumes continuity that was never agreed.',
    ]},
  ],
  briefItems:['Buyer or company type and intended use','Shirt, trousers or full kit','Expected quantity and size breakdown','Format, colour and artwork status','Destination and required in-hand date'],
}} />}
