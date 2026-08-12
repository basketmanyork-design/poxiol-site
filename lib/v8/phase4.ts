import {getV8Cta} from './ctas.ts'
import {getV8Faqs} from './faqs.ts'
import type {V8ContentCard, V8Cta, V8FaqItem, V8PageId, V8ProcessStep} from './types.ts'

type AuthorityPageId = Extract<V8PageId, 'factory' | 'manufacturing' | 'quality-control'>

const requiredBasketballFaqs: readonly V8FaqItem[] = [
  {
    id: 'basketball-mixed-sizes-v8',
    question: 'Can teams order mixed sizes?',
    answer: 'Yes. Share the roster and available size breakdown so youth and adult sizes can be confirmed for the same team project.',
    pageIds: ['basketball'],
  },
  {
    id: 'basketball-custom-names-numbers-v8',
    question: 'Can names and numbers be customized?',
    answer: 'Yes. Team names, player names, numbers, logos and approved graphics can be included after the roster and artwork requirements are confirmed.',
    pageIds: ['basketball'],
  },
  {
    id: 'basketball-sample-approval-v8',
    question: 'How does sample approval work?',
    answer: 'The team confirms the mockup and sample requirements, reviews the completed sample details and approves the agreed specification before bulk production proceeds.',
    pageIds: ['basketball'],
  },
  {
    id: 'basketball-production-time-v8',
    question: 'How long does production take?',
    answer: 'Production timing is confirmed during project consultation because it depends on quantity, customization, the final size breakdown and the current production schedule.',
    pageIds: ['basketball'],
  },
] as const

export const PHASE4_BASKETBALL = {
  problems: [
    {id: 'basketball-size-planning', title: 'How do we manage mixed team sizes?', description: 'Confirm the complete youth and adult size breakdown before the production specification is approved.'},
    {id: 'basketball-roster-control', title: 'Will every name and number be correct?', description: 'Review the roster, spelling, number assignment and artwork placement before production.'},
    {id: 'basketball-approval-confidence', title: 'How can we confirm the result before bulk?', description: 'Use mockup review and sample approval to confirm the agreed product details before bulk production.'},
  ] as readonly V8ContentCard[],
  customization: [
    {id: 'basketball-artwork', title: 'Team Artwork and Colors', audience: 'Identity control', description: 'Confirm team colors, logos, graphics and placement through the mockup workflow.', href: '/customization/', ctaLabel: 'Review Customization'},
    {id: 'basketball-personalization', title: 'Names and Numbers', audience: 'Roster customization', description: 'Prepare the approved player list with names, numbers and size requirements.'},
    {id: 'basketball-product-format', title: 'Jerseys, Shorts and Team Sets', audience: 'Product planning', description: 'Choose the product combination required for games, training or a complete team program.'},
    {id: 'basketball-labels', title: 'OEM and Private Label Options', audience: 'Brands and distributors', description: 'Confirm available label and packaging requirements during project consultation.', href: '/private-label-teamwear/', ctaLabel: 'Review Private Label'},
  ] as readonly V8ContentCard[],
  sampleSteps: [
    {id: 'sample-requirements', title: 'Confirm Sample Requirements', description: 'Agree the product, artwork, size and customization details required for the sample.'},
    {id: 'sample-review', title: 'Review the Sample', description: 'Review the completed sample against the confirmed project requirements.'},
    {id: 'bulk-approval', title: 'Approve Bulk Production', description: 'Approve the agreed specification before the bulk production plan proceeds.'},
  ] as readonly V8ProcessStep[],
  authorityLinks: [
    {id: 'basketball-manufacturing', title: 'Manufacturing Process', audience: 'Production authority', description: 'Review how approved basketball uniform specifications move through production.', href: '/manufacturing/', ctaLabel: 'See Manufacturing'},
    {id: 'basketball-quality', title: 'Quality Control Process', audience: 'Inspection authority', description: 'Review material, printing, sewing, sizing, final and packing checks.', href: '/quality-control-process/', ctaLabel: 'See Quality Control'},
    {id: 'basketball-sample-link', title: 'Request a Sample', audience: 'Approval before bulk', description: 'Confirm sample requirements before planning a bulk basketball uniform order.', href: '/sample-order/', ctaLabel: 'Request Sample'},
  ] as readonly V8ContentCard[],
  faqs: [...getV8Faqs({pageId: 'basketball'}), ...requiredBasketballFaqs] as readonly V8FaqItem[],
  primaryCta: getV8Cta('free-mockup'),
  secondaryCta: getV8Cta('request-sample'),
} as const

export function getPhase4BasketballFaqs(existing: readonly {question: string; answer: string}[]): V8FaqItem[] {
  const seen = new Set<string>()
  return [
    ...existing.map((faq, index) => ({id: `basketball-existing-${index}`, ...faq, pageIds: ['basketball'] as const})),
    ...PHASE4_BASKETBALL.faqs,
  ].filter((faq) => {
    const key = faq.question.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

type AuthorityPageContent = {
  id: AuthorityPageId
  introTitle: string
  introDescription: string
  capabilityCards: readonly V8ContentCard[]
  processSteps: readonly V8ProcessStep[]
  proofSteps: readonly V8ProcessStep[]
  authorityLinks: readonly V8ContentCard[]
  faqs: readonly V8FaqItem[]
  primaryCta: V8Cta
  secondaryCta?: V8Cta
}

const AUTHORITY_METADATA: Record<AuthorityPageId, {title: string; description: string}> = {
  factory: {
    title: 'Teamwear Factory & Manufacturing Capability | POXIOL',
    description: 'Learn who POXIOL is, the custom teamwear categories supported and how factory capability connects to manufacturing and quality control.',
  },
  manufacturing: {
    title: 'Custom Teamwear Manufacturing Process | POXIOL',
    description: 'See how POXIOL manufactures custom teamwear from design preparation and material selection through printing, cutting, sewing, inspection and packing.',
  },
  'quality-control': {
    title: 'Custom Uniform Quality Control Process | POXIOL',
    description: 'Review how POXIOL checks custom uniforms through material, printing, sewing, size, final and packing inspections before shipment.',
  },
}

export function getV8AuthorityMetadata(pageId: AuthorityPageId) {
  return AUTHORITY_METADATA[pageId]
}

export const PHASE4_AUTHORITY_PAGES: readonly AuthorityPageContent[] = [
  {
    id: 'factory',
    introTitle: 'Who POXIOL Is',
    introDescription: 'POXIOL is a B2B custom teamwear manufacturer supporting clubs, schools, sports brands and distributors with confirmed design, sample and production requirements.',
    capabilityCards: [
      {id: 'factory-capability', title: 'Manufacturing Capability', description: 'POXIOL coordinates custom teamwear projects from approved design requirements through production and shipment preparation.'},
      {id: 'factory-categories', title: 'Sportswear Categories', description: 'Basketball uniforms, soccer kits, training wear and multi-sport team apparel can be reviewed against the buyer brief.'},
      {id: 'factory-buyers', title: 'B2B Buyer Support', description: 'Project requirements are organized for clubs, schools, teamwear brands and distributors.'},
      {id: 'factory-choice', title: 'Why Teams Choose POXIOL', description: 'A clear workflow connects mockup review, sample approval, production visibility and quality checks.'},
    ],
    processSteps: [],
    proofSteps: [],
    authorityLinks: [
      {id: 'factory-manufacturing', title: 'Manufacturing Process', description: 'Continue to the dedicated production process authority page.', href: '/manufacturing/', ctaLabel: 'See Manufacturing'},
      {id: 'factory-quality', title: 'Quality Control', description: 'Continue to the dedicated quality verification authority page.', href: '/quality-control-process/', ctaLabel: 'See Quality Control'},
    ],
    faqs: getV8Faqs({pageId: 'factory'}),
    primaryCta: getV8Cta('start-project'),
    secondaryCta: getV8Cta('get-quote'),
  },
  {
    id: 'manufacturing',
    introTitle: 'How the Custom Production Workflow Works',
    introDescription: 'Each stage follows the artwork, material, size, construction and packing requirements confirmed for the project.',
    capabilityCards: [],
    processSteps: [
      {id: 'design-preparation', title: 'Design Preparation', description: 'Prepare the approved artwork, roster and production details.'},
      {id: 'material-selection', title: 'Material Selection', description: 'Confirm the material requirements appropriate for the agreed product.'},
      {id: 'printing', title: 'Printing', description: 'Apply the approved artwork using the printing method confirmed for the project.'},
      {id: 'cutting', title: 'Cutting', description: 'Cut the prepared material panels according to the confirmed size specification.'},
      {id: 'sewing', title: 'Sewing', description: 'Sew and assemble the garment according to the approved construction details.'},
      {id: 'inspection', title: 'Inspection', description: 'Prepare and review completed items against the confirmed requirements.'},
      {id: 'packing', title: 'Packing', description: 'Pack approved items according to the confirmed order and shipment details.'},
    ],
    proofSteps: [
      {id: 'fabric-inspection', title: 'Fabric Inspection', description: 'Verified media can document material review.'},
      {id: 'printing', title: 'Printing', description: 'Verified media can document the approved printing workflow.'},
      {id: 'cutting', title: 'Cutting', description: 'Verified media can document panel preparation.'},
      {id: 'sewing', title: 'Sewing', description: 'Verified media can document garment construction.'},
      {id: 'qc', title: 'Quality Inspection', description: 'Verified media can document inspection against confirmed requirements.'},
      {id: 'packing', title: 'Packing', description: 'Verified media can document shipment preparation.'},
    ],
    authorityLinks: [
      {id: 'manufacturing-quality', title: 'Quality Control Process', description: 'Review how completed teamwear is checked before shipment.', href: '/quality-control-process/', ctaLabel: 'See Quality Control'},
      {id: 'manufacturing-inquiry', title: 'Start Your Team Project', description: 'Share the product, quantity, customization and deadline requirements.', href: '/get-quote/', ctaLabel: 'Start an Inquiry'},
    ],
    faqs: getV8Faqs({pageId: 'manufacturing'}),
    primaryCta: getV8Cta('start-project'),
    secondaryCta: getV8Cta('request-sample'),
  },
  {
    id: 'quality-control',
    introTitle: 'Quality Checks Based on Confirmed Requirements',
    introDescription: 'POXIOL reviews the agreed material, artwork, construction, size, finished product and packing details before shipment preparation.',
    capabilityCards: [],
    processSteps: [
      {id: 'material-inspection', title: 'Material Inspection', description: 'Review incoming material against the confirmed project requirements.'},
      {id: 'printing-inspection', title: 'Printing Inspection', description: 'Review artwork placement and visible printing details.'},
      {id: 'sewing-inspection', title: 'Sewing Inspection', description: 'Review stitching and garment construction.'},
      {id: 'size-checking', title: 'Size Checking', description: 'Check finished measurements against the confirmed size specification.'},
      {id: 'final-inspection', title: 'Final Inspection', description: 'Review completed customization and product details.'},
      {id: 'packing-verification', title: 'Packing Verification', description: 'Confirm quantity and packing details before shipment preparation.'},
    ],
    proofSteps: [],
    authorityLinks: [
      {id: 'quality-sample', title: 'Request Sample', description: 'Review a sample before planning bulk production.', href: '/sample-order/', ctaLabel: 'Request Sample'},
      {id: 'quality-inquiry', title: 'Discuss Project Requirements', description: 'Share the product, quantity, customization and target date.', href: '/get-quote/', ctaLabel: 'Get a Project Quote'},
    ],
    faqs: getV8Faqs({pageId: 'quality-control'}),
    primaryCta: getV8Cta('request-sample'),
    secondaryCta: getV8Cta('get-quote'),
  },
] as const

export function getPhase4AuthorityPage(pageId: AuthorityPageId): AuthorityPageContent {
  const page = PHASE4_AUTHORITY_PAGES.find((item) => item.id === pageId)
  if (!page) throw new Error(`Unknown Phase 4 authority page: ${pageId}`)
  return page
}
