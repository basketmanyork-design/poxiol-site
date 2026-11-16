import {CategoryLanding} from '@/components/home-optimization/CategoryLanding'
import {createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA} from '@/lib/seo/page-metadata'

const path='/products/running-track-uniforms/'
export const metadata=createPageMetadata({title:'Running & Track Uniforms for Teams | POXIOL',description:'Plan custom running and track uniforms for clubs, schools or sportswear brands. Review singlet and shorts options, fit, artwork, quantity and delivery needs.',canonical:`https://www.poxiol.com${path}`,metadata:{twitter:PRESERVED_ROOT_TWITTER_METADATA}})
export default function Page(){return <CategoryLanding data={{
  title:'Running & Track Uniforms',product:'Running & Track Uniforms',path,use:'Running and track',
  image:'/website-optimization/running-track-800.webp',alt:'POXIOL running singlet and shorts set design illustration',
  description:'Start with a running singlet and shorts program for clubs, schools, track teams or sportswear brands. Review fit, fabric and customization for your intended use before confirming an order.',
  planningHeading:'Plan a running and track uniform brief',
  planningAnswer:'Running and track uniform planning starts with the garment set, fit, artwork, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.',
  decisionCards:[
    {title:'Garment set',body:'Start with a running singlet and shorts. Tell us whether you need the full set or selected pieces.'},
    {title:'Fit and sizing',body:'Share the size range, athlete or customer profile, and any existing size chart that should be reviewed.'},
    {title:'Artwork and color',body:'Provide logos, names, numbers, color references or a design direction. Decoration is reviewed with the selected fabric and construction.'},
  ],
  sections:[
    {heading:'Singlet, shorts, and the pieces clubs actually order',paragraphs:[
      'Track and running kit is usually described as a singlet and shorts, but clubs order in three shapes: the full set, the singlet only where shorts are supplied locally, and a training layer on top. Naming which of the three the club needs changes the production sequence, because a set produced together shares one artwork approval while separate items do not.',
      'The garment also has to match the event. A road or cross-country programme and a track programme put different demands on the same garment: one is worn continuously for a long effort, the other in short bursts with long waits. That difference belongs in the fabric and construction conversation, before the design is finalised.',
    ]},
    {heading:'Why running kit is the least forgiving on fit',paragraphs:[
      'A running singlet moves against the body for the entire effort, so a cut that is slightly wrong is felt immediately rather than tolerated. Armhole depth and shoulder width matter more than overall length, and those are the two measurements a size label does not describe.',
      'The practical route is the same as in other sports but with tighter inputs: the height and build of the smallest and largest athlete, a size per athlete, and a cut decision recorded once for the squad. In manual cut and sew a tolerance of roughly 2 cm across batches is the accepted industry standard, and the size chart the club already uses is the reference to review against.',
    ]},
    {heading:'Names, club marks and the print that survives sweat',paragraphs:[
      'Names on the back of a running vest are common at club level, and numbers less so outside specific events. Both are artwork items with placement and size rules tied to the garment, and both are confirmed on the mockup rather than assumed from a previous order.',
      'Decoration on running kit is exposed to sustained sweat and repeated washing, which is why the fabric and the print method are reviewed together rather than separately. A decoration chosen for appearance alone and applied to a fabric it does not suit is the most common reason a club reports fading that a supplier considers normal wear.',
    ]},
    {heading:'What to lock before the first order',paragraphs:[
      'Three items decide whether the second order matches the first: the approved artwork version, the fabric and construction reference, and the size chart the squad uses. Record those and a reorder becomes a confirmation; skip any one and the next order restarts the design conversation.',
      'Where a club changes athletes between seasons, the size list is rebuilt each cycle while the specification stays fixed. That separation - fixed garment, variable roster - is what allows a small programme to reorder a handful of pieces without paying for a new setup or accepting a different shade from the first delivery.',
    ]},
  ],
  briefItems:['Buyer or company type and intended use','Singlet, shorts or coordinated set','Expected quantity and size breakdown','Artwork status and required personalization','Destination and required in-hand date'],
}} />}
