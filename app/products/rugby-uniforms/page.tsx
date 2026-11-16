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
  sections:[
    {heading:'What a rugby kit programme actually contains',paragraphs:[
      'A rugby programme is rarely one garment. A match kit is a jersey and shorts; a training kit adds a layer that can be pulled over the match jersey; travel and presentation wear is a third decision entirely. Buyers who describe all three at the brief stage get one production sequence and one artwork approval covering the set. Buyers who describe only the jersey come back for shorts two weeks later and pay for a second setup. The useful question at the start is therefore not which jersey, but which of the three the club is actually buying this cycle.',
      'Within the match kit, the two garments behave differently. A rugby jersey is cut to survive contact: it is pulled, gripped and stretched, so the shoulder seam, the neck opening and the side panel are the places that fail first if the construction is chosen for looks rather than for load. Shorts carry the same problem at the waistband and the inside leg. Neither of those can be judged from a mockup, which is why the fabric and construction discussion has to happen before the design conversation, not after it.',
    ]},
    {heading:'Fit through contact, and why preference beats a standard',paragraphs:[
      'Rugby players disagree about fit more than players in any other team sport. Some want a jersey close enough that a hand cannot grab a handful of fabric; others want room to move the shoulders. Both are legitimate, and a supplier that ships one house cut to every club produces the complaint that reads as a sizing error but is actually a fit mismatch.',
      'The practical answer is to decide the cut once, per squad, and record it. The height and build of the largest and smallest player in the squad are more useful inputs than an average size, because the extremes are where a cut fails. Where a squad spans a wide range, the cut is confirmed on the two extreme sizes rather than on a middle sample, and the size list per player is built from that decision.',
    ]},
    {heading:'Numbering, crests and the authorisation question',paragraphs:[
      'Rugby shirts carry a back number as standard, and many clubs add a front number, a club crest and one or more sponsor marks. Each of those is a separate artwork item with its own placement, and each has to be approved as part of the same set. A club that approves only the crest leaves the sponsor block unresolved, and the gap surfaces at printing rather than at approval.',
      'Authorisation is the part that stops projects. A club crest the buyer owns is straightforward. A league, competition or sponsor mark has to be authorised by the buyer, and a supplier cannot accept a claim of authorisation as proof of it. State which marks the club owns and which are licensed at the brief stage; that single answer decides whether the artwork can be released.',
    ]},
    {heading:'Order size, reorders and what to fix in writing',paragraphs:[
      'The quantity for a rugby programme is set by the squad list, not by a catalogue rule, and it changes between the first order and the second: players join, leave and change size. The specification is what should be fixed, because a club that locks the construction, the colour references and the size chart can then reorder without re-approving the garment.',
      'Three things need to be recorded before the first order closes: the approved artwork version, the size chart the squad actually uses, and the exact fabric and construction reference. With those three on file a reorder is a confirmation rather than a redesign. Without them every subsequent order restarts the conversation, and each restart is where a club ends up with a set that no longer matches the first.',
    ]},
  ],
  briefItems:['Buyer or company type and intended use','Jersey, shorts or coordinated set','Expected quantity and size breakdown','Numbering, crest and artwork status','Destination and required in-hand date'],
}} />}
