export type HybridClaim = {title: string; body: string; limitation: string}
export type HybridLink = {label: string; href: string}

const projectReviewNote = 'Final feasibility remains project-specific and is confirmed during project review.'

export const hybridHome = {
  seo: {
    title: 'Global Custom Teamwear Manufacturer',
    description: 'POXIOL supports teamwear distributors, dealers, sportswear brands, and custom resellers serving teams worldwide with a controlled path from design review through repeat orders.',
  },
  hero: {title: 'Custom Teamwear Built for Repeatable Team Orders', body: 'POXIOL supports teamwear distributors, dealers, sportswear brands, and custom resellers serving teams worldwide with a controlled path from design review through repeat orders.', projectReviewNote},
  audience: {title: 'For Teamwear Distributors, Dealers, Brands & Custom Resellers', body: 'Six risks can turn a team order into a client problem. Our process is built to control them.'},
  risks: [
    {title:'Design Accuracy', body:'Complex customization, confirmed before production.', href:'/customization/', cta:'Review customization'},
    {title:'Size & Fit', body:'Team sizing is checked before the order is locked.', href:'/guides/basketball-uniform-size-guide/', cta:'Basketball size guide'},
    {title:'Project Deadline', body:'Plan backward from the date your customer needs the order.', href:'/shipping-after-sales/', cta:'Review shipping planning'},
    {title:'Sample-to-Bulk', body:'Use the approved sample as the bulk reference.', href:'/guides/teamwear-sample-approval-checklist/', cta:'Review sample checklist'},
    {title:'Reorder Consistency', body:'Reorders should start from confirmed records—not memory.', href:'/get-quote/?product=Teamwear%20Reorder&source=%2F', cta:'Discuss a reorder'},
    {title:'Account Expansion', body:'Start with one team order. Expand as the account grows.', href:'/private-label-teamwear/', cta:'Review private-label options'},
  ],
  capabilities: [
    ['Design Review','Artwork, placements, colors, and personalization are reviewed against the approved brief.'],
    ['Size Planning','Size references and roster inputs are reviewed before the order is locked.'],
    ['Milestone Planning',"The project path is planned backward from the buyer's target in-hand date."],
    ['Sample Reference','An approved sample can define the reference for the associated bulk order.'],
    ['Retained Records','Confirmed project references can support a later reorder review.'],
    ['Range Planning','The product range can be reviewed as an account develops.'],
  ].map(([title, body]) => ({title, body})),
  explanations: [
    {title:'Approval checklist explanation', body:'A structured checklist can organize design, size, and project decisions before production planning.', limitation:'Illustrative process format only—not a completed customer document or signed approval.'},
    {title:'Milestone planning explanation', body:'A milestone outline can show what needs review before production and delivery planning move forward.', limitation:'Illustrative planning format only—not a delivery promise or completed project timeline.'},
    {title:'Sample and bulk comparison explanation', body:'A comparison structure can identify the fields to review against an approved sample reference.', limitation:'Illustrative comparison logic only—no real sample, bulk order, or result is shown.'},
    {title:'Retained project record explanation', body:'A retained-record structure can organize the confirmed reference used during a reorder review.', limitation:'Illustrative record format only—not a customer file, reorder result, or production guarantee.'},
  ] satisfies HybridClaim[],
  process: [
    {title:'Upload Your Design', body:'Share the available artwork, references, and product direction.', href:'/free-mockup/'},
    {title:'Review the Brief', body:'Confirm the product, quantity, design status, size mix, destination, and target date.'},
    {title:'Define the Approval Path', body:'Identify which design, size, sample, and timing decisions require confirmation.'},
    {title:'Plan Project Milestones', body:'Map the confirmed review steps before production and delivery planning.'},
    {title:'Retain the Reference', body:'Organize the confirmed project record for the associated order and later review.'},
  ],
  range: [
    {title:'Basketball Uniforms', label:'Explore basketball uniforms', href:'/products/basketball-uniforms/'},
    {title:'Soccer / Football Kits', label:'Explore soccer jerseys', href:'/products/soccer-jerseys/'},
    {title:'Full Teamwear', label:'Explore product groups', href:'/products/'},
  ],
  closing: {title:'Tell us where the risk is before we quote the project.', body:'Share your product, quantity, design status, size mix, destination and target in-hand date. We’ll help you define the right approval path before production.'},
  intents: {
    design: {label:'Upload Your Design', href:'/free-mockup/'},
    range: {label:'Build Your Range', href:'/get-quote/?product=Full%20Teamwear&source=%2F'},
    sample: {label:'Start a Sample', href:'/sample-order/'},
  } satisfies Record<string, HybridLink>,
} as const
