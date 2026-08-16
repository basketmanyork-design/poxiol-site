import type {CmsFaqItem} from './cms/types'
import {GEO_V1} from './geo-v1'
export {normalizeBuyerFacingClaim, normalizeBuyerFacingQuestion} from './legacy-claim-normalizer'

export const BUYER_DECISION_HERO_HEADING = GEO_V1.homepage.heroHeading

export const BUYER_DECISION_HERO_HEADING_MOBILE = GEO_V1.homepage.heroHeading

export const BUYER_DECISION_HERO_DESCRIPTION = GEO_V1.homepage.heroDescription

export const APPROVED_CTA_LABELS = {
  primary: 'Get Free Design Mockup',
  secondary: 'Talk to a Teamwear Specialist',
  sample: 'Start with 1 Sample',
  quote: 'Request Factory Quote',
} as const

export type BuyerDecisionCard = {
  title: string
  description: string
  benefit?: string
  note?: string
  tags?: string[]
  href?: string
}

export type BuyerDecisionSection = {
  id: string
  eyebrow: string
  title: string
  body: string
  note?: string
  facts?: string[]
  timeline?: Array<{time: string; text: string}>
  cards: BuyerDecisionCard[]
  cta?: {label: string; href: string}
  ctaSecondary?: {label: string; href: string}
}

export const PRICING_FACTORS = [
  'Product format',
  'Fabric',
  'Order quantity',
  'Names, numbers and artwork',
  'Labels and packaging',
  'Shipping destination',
  'Shipping method',
] as const

export const QUALITY_APPROVAL_STEPS = [
  'Mockup approval',
  'Sample-first option',
  'Fabric and color checks',
  'Names and numbers check',
  'Measurement consistency, including the confirmed +/-2 cm tolerance',
  'Pre-shipment inspection',
  'Packing confirmation',
] as const

export const ISSUE_REVIEW_STEPS = [
  'Provide the order reference',
  'Identify the affected quantity',
  'Provide clear photos or videos',
  'Provide package labels where relevant',
  'Compare the issue with the approved mockup, sample, size chart and packing records',
  'Confirm a project-specific resolution in writing',
] as const

export const BUYER_DECISION_SECTIONS: BuyerDecisionSection[] = [
  {
    id: 'who-we-are',
    eyebrow: '01 / Identity',
    title: 'Who We Are',
    body: 'POXIOL is a factory-direct custom teamwear manufacturer supporting clubs, schools, academies, distributors and sportswear brands with design review, sampling, production planning and shipment preparation.',
    cards: [
      {title: 'B2B Teamwear Experience', description: 'Project requirements are reviewed against the confirmed product, quantity and schedule.'},
      {title: 'Factory-Direct Coordination', description: 'Design, sample, production and packing details are managed through one project workflow.'},
    ],
  },
  {
    id: 'what-we-make',
    eyebrow: '02 / Offer',
    title: 'What We Make',
    body: 'Start with one sample, then confirm the production plan for a club, school or private-label program.',
    cards: [
      {title: 'Custom Basketball Uniforms', benefit: 'From 1 sample to a full league rollout — reversible sets, names & numbers, youth-to-adult sizing.', description: 'Jerseys, shorts, reversible sets and team packages.', tags: ['Clubs', 'Schools', 'Leagues']},
      {title: 'Soccer Kits', benefit: 'Complete match-day kits — home, away, goalkeeper and training in one program.', description: 'Jerseys, shorts, socks, goalkeeper kits and training options.', tags: ['Soccer Clubs', 'Academies', 'Leagues']},
      {title: 'Training Wear', benefit: 'Warm-up, travel and training sets that match your uniform program.', description: 'Warm-up, travel and training apparel for team programs.', tags: ['Teams', 'Programs', 'Brands']},
      {title: 'Private-Label Teamwear', benefit: 'Your brand, your labels, your packaging — buyer-approved specs from day one.', description: 'Buyer-approved labels, packaging and product specifications.', tags: ['Brands', 'Distributors']},
    ],
    cta: {label: 'Start your project with a free mockup', href: '/free-mockup/'},
  },
  {
    id: 'pricing',
    eyebrow: '03 / Quotation',
    title: 'How Pricing Works',
    body: 'Itemized quote after the project requirements are reviewed. Every assumption — fabric, quantity, shipping — is confirmed before payment. Pricing is prepared from the confirmed specification rather than a generic public price.',
    cards: PRICING_FACTORS.map((title) => ({title, description: 'Confirmed as part of the project quotation.'})),
    cta: {label: 'Get an Itemized Quote', href: '/get-quote/'},
    ctaSecondary: {label: 'Ask a Question on WhatsApp', href: 'https://wa.me/8613055646888?text=Hello%20POXIOL%2C%20I%20would%20like%20to%20discuss%20a%20custom%20teamwear%20project.'},
  },
  {
    id: 'quality',
    eyebrow: '04 / Approval',
    title: 'Sample and Quality Approval',
    body: 'The approved mockup, sample, size chart, roster details and packing requirements form the reference for production checks.',
    cards: QUALITY_APPROVAL_STEPS.map((title) => ({title, description: 'Checked against the buyer-confirmed project specification.'})),
    cta: {label: 'View Quality Control', href: '/quality-control-process/'},
  },
  {
    id: 'shipping',
    eyebrow: '05 / Fulfilment',
    title: 'Production and Shipping',
    body: 'Production and shipping timing are confirmed after the product specification, quantity, approval status, destination and carrier requirements are reviewed.',
    timeline: [
      {time: 'Project review', text: 'Confirm the product, quantity, destination and target schedule'},
      {time: 'Mockup', text: 'Review artwork and customization details before sampling'},
      {time: 'Approval', text: 'You confirm mockup, sample, roster and packing in writing'},
      {time: 'Production', text: 'Confirm the production schedule for the approved specification and quantity'},
      {time: 'Shipment', text: 'Confirm the shipping method and estimated transit time for the destination'},
    ],
    cards: [
      {title: 'Production Planning', description: 'Quantity, specification and approval status are confirmed before scheduling.'},
      {title: 'Shipping Selection', description: 'Destination, method, freight and applicable customs or duties assumptions are confirmed with the quotation.'},
      {title: 'Tracking Updates', description: 'Shipment information is shared after dispatch according to the selected carrier.'},
      {title: 'Issue Reporting', description: 'Order and delivery issues follow a documented review workflow.'},
    ],
    cta: {label: 'Review Shipping and After-Sales', href: '/shipping-after-sales/'},
  },
  {
    id: 'evidence',
    eyebrow: '06 / Evidence',
    title: 'Project Evidence',
    body: 'Verified projects we\u2019ve manufactured for clubs, schools and brands. Every record below is buyer-authorized for public use.',
    note: 'Records without public authorization are presented as manufacturing scenarios.',
    cards: [
      {title: 'Case Template — Tier 2 (Anonymous)', description: 'Project type: [TO CONFIRM] · Quantity: [TO CONFIRM] sets · Destination: [TO CONFIRM] · Key delivery: names & numbers, youth + adult sizing, team-based packing.'},
      {title: 'Case Template — Tier 3 (Text)', description: 'Project type: [TO CONFIRM] · Quantity: [TO CONFIRM] sets · Destination: [TO CONFIRM] · Roster check · Bulk production · Team-based packing.'},
    ],
    cta: {label: 'Review Project Evidence', href: '/projects/'},
  },
  {
    id: 'why-poxiol',
    eyebrow: '07 / Trust',
    title: 'Why POXIOL',
    body: 'Buyers can start with one sample, review the artwork and physical product, confirm the quotation and schedule, and use documented quality and packing checks before shipment.',
    facts: ['China-based manufacturing support', 'International shipping coordination', 'Sample plan confirmed by project', 'Production schedule confirmed by project', 'QC before shipment'],
    cards: [
      {title: 'Sample First', description: 'Check fabric, fit, print and construction before planning production.', note: 'Review the physical product before you commit a budget.'},
      {title: 'Written Approvals', description: 'Mockup, product, roster and packing decisions are confirmed for the project.', note: 'A written record for every decision — built for school and club procurement.'},
      {title: 'Quality Checkpoints', description: 'Fabric, color, names, numbers, measurements, finished garments and packing are reviewed.', note: 'Five checkpoints from mockup to pre-shipment inspection.'},
      {title: 'Alibaba Store Entry', description: 'Use the existing store link when additional platform context is needed.', note: 'basketman.en.alibaba.com', href: 'https://basketman.en.alibaba.com/'},
    ],
  },
  {
    id: 'start',
    eyebrow: '08 / Next Step',
    title: 'Start Your Project',
    body: 'Send the sport, product, estimated quantity, destination, target schedule, logo and reference files. Sample fees, shipping and all quotation assumptions are confirmed before payment.',
    cards: [
      {title: 'What the Quote Includes', description: 'Confirmed product, customization, quantity, labels or packaging, shipping assumptions and payment terms.'},
      {title: 'What Buyers Need to Send', description: 'Sport, product, quantity, destination, target schedule, logo, artwork and any labeling requirements.'},
      {title: 'No Hidden Assumptions', description: 'Sample cost, freight and project-specific requirements are confirmed before payment.'},
    ],
    cta: {label: APPROVED_CTA_LABELS.primary, href: '/free-mockup/'},
  },
]

export const BUYER_DECISION_FAQS: CmsFaqItem[] = [
  {question: 'What does POXIOL manufacture?', answer: 'POXIOL specializes in custom basketball uniforms, soccer kits and baseball uniforms for clubs, schools, youth programs, distributors and sportswear brands, with private-label project support.'},
  {question: 'What affects the quotation?', answer: 'The quotation depends on product format, fabric, quantity, names, numbers, artwork, labels, packaging, shipping destination and shipping method.'},
  {question: 'Can I review a sample before bulk production?', answer: 'Sample availability and quantity are confirmed for the project so the buyer can review agreed fabric, fit, print and construction details before bulk production planning.'},
  {question: 'How is artwork approved?', answer: 'The buyer reviews the front and back layout, colors, logos, names and numbers before sample or production scheduling.'},
  {question: 'How is quality checked?', answer: 'Checks cover fabric, color, names, numbers, measurements, finished garments, pre-shipment inspection and packing against the approved project details.'},
  {question: 'How long does production take?', answer: 'Production timing is confirmed for each project because it depends on quantity, customization, the approved size breakdown and the current production schedule.'},
  {question: 'How is shipping arranged?', answer: 'Destination, shipping method, freight, carrier timing and applicable customs or duties assumptions are confirmed for the specific quotation.'},
  {question: 'What should I do if an order issue is found?', answer: 'Provide the order reference, affected quantity, clear photos or videos and package labels where relevant. POXIOL compares the report with approved project records and confirms a project-specific resolution in writing.'},
  {question: 'What evidence can POXIOL provide?', answer: 'Public evidence is limited to buyer-authorized project images, approved samples, process records and verifiable statements. Records without that evidence are labeled as manufacturing scenarios.'},
  {question: 'How do I start?', answer: 'Send the sport, product, estimated quantity, destination, target schedule, logo and reference files through the Free Mockup form, contact page or WhatsApp.'},
  {question: 'What payment terms do you offer?', answer: 'Payment terms are confirmed with your itemized quotation before any payment. Sample fees, freight and project-specific requirements are confirmed in advance — no hidden assumptions.'},
  {question: 'Do you support DDP or help with customs?', answer: 'Destination, shipping method, freight, carrier timing and applicable customs or duties assumptions are confirmed for your specific quotation. Contact us to confirm DDP availability for your delivery country.'},
]

export function normalizeCtaLabel(label: string, href: string): string {
  if (href.startsWith('/free-mockup')) return APPROVED_CTA_LABELS.primary
  if (href.startsWith('/get-quote')) return APPROVED_CTA_LABELS.quote
  if (href.startsWith('/contact')) return APPROVED_CTA_LABELS.secondary
  if (href.startsWith('/sample-order')) return APPROVED_CTA_LABELS.sample
  return label
}
