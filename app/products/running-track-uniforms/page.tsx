import type {Metadata} from 'next'
import {CategoryLanding} from '@/components/home-optimization/CategoryLanding'

const path='/products/running-track-uniforms/'
export const metadata:Metadata={title:'Running & Track Uniforms for Teams | POXIOL',description:'Discuss custom running and track teamwear, quantities, sizing, design and required delivery date with POXIOL.',alternates:{canonical:`https://www.poxiol.com${path}`}}
export default function Page(){return <CategoryLanding data={{title:'Running & Track Uniforms',product:'Running & Track Uniforms',path,use:'Running and track',image:'/website-optimization/running-track-800.webp',alt:'POXIOL running singlet and shorts set design illustration',description:'Start with a running singlet and shorts program for clubs, schools, track teams or sportswear brands. Review fit, fabric and customization for your intended use before confirming an order.',notes:['Confirm sizes and fit for your athletes or customers.','Review artwork, colors and suitable decoration for the chosen fabric.','Share your quantity, destination and required in-hand date so production and shipping can be reviewed separately.']}} />}
