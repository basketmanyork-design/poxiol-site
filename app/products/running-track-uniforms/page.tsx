import type {Metadata} from 'next'
import {CategoryLanding} from '@/components/home-optimization/CategoryLanding'

const path='/products/running-track-uniforms/'
export const metadata:Metadata={title:'Running & Track Uniforms for Teams | POXIOL',description:'Plan custom running and track uniforms for clubs, schools or sportswear brands. Review singlet and shorts options, fit, artwork, quantity and delivery needs.',alternates:{canonical:`https://www.poxiol.com${path}`}}
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
  briefItems:['Buyer or company type and intended use','Singlet, shorts or coordinated set','Expected quantity and size breakdown','Artwork status and required personalization','Destination and required in-hand date'],
}} />}
