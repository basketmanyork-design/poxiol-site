import type {Metadata} from 'next'
import {CategoryLanding} from '@/components/home-optimization/CategoryLanding'

const path='/products/warm-up-wear/'
export const metadata:Metadata={title:'Warm-Up Wear and Team Tracksuits | POXIOL',description:'Plan custom warm-up wear for teams, clubs, schools or sportswear brands. Review jacket and trouser configuration, fit, branding, quantity and delivery needs.',alternates:{canonical:`https://www.poxiol.com${path}`}}
export default function Page(){return <CategoryLanding data={{
  title:'Warm-Up Wear',product:'Warm-Up Wear',path,use:'Warm-up and travel',
  image:'/website-optimization/warm-up-800.webp',alt:'POXIOL zip-up warm-up jacket and trousers design illustration',
  description:'Explore a coordinated warm-up jacket and trousers starting point for teams, schools, clubs and brand collections. Materials, sizing, branding and set configuration are confirmed for the project.',
  planningHeading:'Plan a warm-up wear brief',
  planningAnswer:'Warm-up wear planning starts with the jacket-and-trouser configuration, fit, branding, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.',
  decisionCards:[
    {title:'Set configuration',body:'Start with a warm-up jacket and trousers. Tell us whether you need a coordinated set or selected pieces.'},
    {title:'Fit and sizing',body:'Share the size range, wearer profile, and any existing size chart that should be reviewed.'},
    {title:'Branding and color',body:'Provide logos, labels, color references or a design direction for project review.'},
  ],
  briefItems:['Buyer or company type and intended use','Jacket, trousers or coordinated set','Expected quantity and size breakdown','Artwork, logo and label status','Destination and required in-hand date'],
}} />}
