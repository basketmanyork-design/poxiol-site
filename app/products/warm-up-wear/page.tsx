import type {Metadata} from 'next'
import {CategoryLanding} from '@/components/home-optimization/CategoryLanding'

const path='/products/warm-up-wear/'
export const metadata:Metadata={title:'Warm-Up Wear and Team Tracksuits | POXIOL',description:'Discuss custom warm-up jackets and trousers for teams and brands, with product, sizing and delivery review.',alternates:{canonical:`https://www.poxiol.com${path}`}}
export default function Page(){return <CategoryLanding data={{title:'Warm-Up Wear',product:'Warm-Up Wear',path,use:'Warm-up and travel',image:'/website-optimization/warm-up-800.webp',alt:'POXIOL zip-up warm-up jacket and trousers design illustration',description:'Explore a coordinated warm-up jacket and trousers starting point for teams, schools, clubs and brand collections. Materials, sizing, branding and set configuration are confirmed for the project.',notes:['Review jacket and trouser fit and the unit you want to buy.','Discuss logos, labels and colors that match your team or collection.','Enter the quantity and required in-hand date so we can check production and shipping feasibility.']}} />}
