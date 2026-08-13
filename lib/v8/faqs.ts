import {GEO_V1} from '../geo-v1.ts'
import type {V8FaqItem, V8PageId, V8BuyerId} from './types.ts'

const basketballFaqIds = ['basketball-manufacturer', 'basketball-small-teams', 'basketball-names-numbers', 'basketball-quote-details'] as const

export const V8_FAQS: readonly V8FaqItem[] = [
  ...GEO_V1.basketballFaqs.map((faq, index) => ({
    id: basketballFaqIds[index],
    question: faq.question,
    answer: faq.answer,
    pageIds: ['basketball'] as const,
  })),
  {
    id: 'project-start-details',
    question: 'What information helps POXIOL review a custom teamwear project?',
    answer: 'Share the sport, quantity, deadline, logo or reference files and customization requirements available for the project.',
    pageIds: ['home', 'customization'],
  },
  {
    id: 'sample-before-bulk',
    question: 'Can a sample be reviewed before bulk production?',
    answer: 'Sample requirements and approval steps can be confirmed during project consultation before bulk production proceeds.',
    pageIds: ['basketball', 'manufacturing', 'quality-control'],
  },
  {
    id: 'manufacturing-workflow',
    question: 'How does POXIOL manufacture custom teamwear?',
    answer: 'The workflow covers design preparation, material selection, printing, cutting, sewing, assembly, inspection preparation and packing based on confirmed specifications.',
    pageIds: ['factory', 'manufacturing'],
  },
  {
    id: 'quality-verification',
    question: 'How does POXIOL verify uniform quality?',
    answer: 'Checks can cover incoming materials, printing, sewing, sizing, final product details and packing against the confirmed project requirements.',
    pageIds: ['factory', 'manufacturing', 'quality-control'],
  },
  {
    id: 'youth-mixed-sizes',
    question: 'Can a youth team order include mixed player sizes?',
    answer: 'Yes. Share the roster and available size information so the required size mix can be confirmed during project consultation.',
    pageIds: ['youth-team-uniforms'],
    buyerIds: ['youth-teams'],
  },
  {
    id: 'youth-names-numbers',
    question: 'Can youth uniforms include individual names and numbers?',
    answer: 'Names, numbers and artwork placement can be included after the team confirms its roster and design requirements.',
    pageIds: ['youth-team-uniforms'],
    buyerIds: ['youth-teams'],
  },
  {
    id: 'youth-coach-apparel',
    question: 'Can coach apparel be planned with the team uniforms?',
    answer: 'Coach apparel requirements can be reviewed alongside the player uniform request, with product and size details confirmed during consultation.',
    pageIds: ['youth-team-uniforms'],
    buyerIds: ['youth-teams'],
  },
  {
    id: 'youth-order-start',
    question: 'What does a youth team manager need to start an order?',
    answer: 'Share the sport, estimated quantity, roster details, target date, logo and any design reference available.',
    pageIds: ['youth-team-uniforms'],
    buyerIds: ['youth-teams'],
  },
  {
    id: 'school-season-planning',
    question: 'How can a school plan teamwear for a sports season?',
    answer: 'Start with the participating teams, estimated quantities, size requirements, artwork and required delivery date so the project stages can be reviewed.',
    pageIds: ['school-teamwear'],
    buyerIds: ['schools'],
  },
  {
    id: 'school-size-management',
    question: 'How are sizes managed across a school teamwear order?',
    answer: 'The school can provide size information by team or roster, and the final size breakdown is confirmed before production.',
    pageIds: ['school-teamwear'],
    buyerIds: ['schools'],
  },
  {
    id: 'school-repeat-supply',
    question: 'Can a school request teamwear again for a later season?',
    answer: 'Repeat requirements can be reviewed against previously confirmed project details, while current materials, quantities and timing are reconfirmed for the new order.',
    pageIds: ['school-teamwear'],
    buyerIds: ['schools'],
  },
  {
    id: 'school-solution-details',
    question: 'What information is needed for a school teamwear solution?',
    answer: 'Provide the sports involved, number of teams, estimated quantities, size plan, branding requirements and seasonal deadline.',
    pageIds: ['school-teamwear'],
    buyerIds: ['schools'],
  },
  {
    id: 'club-multiple-squads',
    question: 'Can one club program cover multiple squads?',
    answer: 'Yes. Each squad can be planned within one club program while its roster, products, sizes and delivery requirements remain clearly identified.',
    pageIds: ['club-teamwear-program'],
    buyerIds: ['clubs'],
  },
  {
    id: 'club-collection-consistency',
    question: 'How can a club keep its teamwear collection consistent?',
    answer: 'Confirm the shared colors, logos, artwork rules and product requirements before individual team specifications are prepared.',
    pageIds: ['club-teamwear-program'],
    buyerIds: ['clubs'],
  },
  {
    id: 'club-repeat-orders',
    question: 'How are repeat club orders reviewed?',
    answer: 'The required products, artwork, sizes, quantity and timing are reconfirmed against the approved club requirements before a repeat production plan is agreed.',
    pageIds: ['club-teamwear-program'],
    buyerIds: ['clubs'],
  },
  {
    id: 'club-program-start',
    question: 'What should a club provide to start a teamwear program?',
    answer: 'Share the club identity, teams involved, product categories, estimated quantities, target dates and any existing artwork guidelines.',
    pageIds: ['club-teamwear-program'],
    buyerIds: ['clubs'],
  },
  {
    id: 'private-label-oem',
    question: 'Does POXIOL support OEM private label teamwear projects?',
    answer: 'Yes. POXIOL can review OEM and private label requirements for sports brands and distributors based on confirmed product specifications.',
    pageIds: ['private-label-teamwear'],
    buyerIds: ['sports-brands', 'distributors'],
  },
  {
    id: 'private-label-branding',
    question: 'Can custom labels and packaging be included?',
    answer: 'Label and packaging options are confirmed during project consultation according to the brand requirements and available production options.',
    pageIds: ['private-label-teamwear'],
    buyerIds: ['sports-brands', 'distributors'],
  },
  {
    id: 'private-label-sample',
    question: 'Can a brand review a sample before bulk manufacturing?',
    answer: 'Sample requirements and approval details can be agreed before bulk production proceeds.',
    pageIds: ['private-label-teamwear'],
    buyerIds: ['sports-brands', 'distributors'],
  },
  {
    id: 'private-label-repeat-production',
    question: 'What is reconfirmed for a repeat private label production run?',
    answer: 'Product specifications, materials, artwork, labels, packaging, quantity and timing are reconfirmed before the new production run.',
    pageIds: ['private-label-teamwear'],
    buyerIds: ['sports-brands', 'distributors'],
  },
] as const

export function getV8Faqs({pageId, buyerId}: {pageId: V8PageId; buyerId?: V8BuyerId}): V8FaqItem[] {
  return V8_FAQS.filter((faq) => {
    if (!faq.pageIds.includes(pageId)) return false
    return !buyerId || !faq.buyerIds?.length || faq.buyerIds.includes(buyerId)
  }).map((faq) => ({...faq}))
}
