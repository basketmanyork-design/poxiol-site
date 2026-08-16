import type {Metadata} from 'next'
import {V8_BRAND} from './brand.ts'
import {getV8Faqs} from './faqs.ts'
import type {V8BuyerPageContent, V8PageId} from './types.ts'

type BuyerPageId = V8BuyerPageContent['pageId']

const sharedAuthorityLinks = [
  {id: 'customization', title: 'Customization', description: 'Move from an idea, logo or reference to an approved mockup and sample plan.', audience: 'Design and approval', href: '/customization/', ctaLabel: 'Review Customization'},
  {id: 'manufacturing', title: 'Manufacturing', description: 'See how confirmed teamwear specifications move through the production workflow.', audience: 'Production process', href: '/manufacturing/', ctaLabel: 'Review Manufacturing'},
  {id: 'quality-control', title: 'Quality Control', description: 'Understand the checks used for materials, printing, sewing, sizing and packing.', audience: 'Inspection process', href: '/quality-control-process/', ctaLabel: 'Review Quality Control'},
] as const

const coreSportLinks = [
  {id: 'core-basketball', title: 'Basketball Programs', description: 'Review jerseys, shorts, reversible options, roster customization and sample approval.', audience: 'Core sport', href: '/products/basketball-uniforms/', ctaLabel: 'Explore Basketball'},
  {id: 'core-soccer', title: 'Soccer Programs', description: 'Review jerseys, shorts, socks, goalkeeper options and complete soccer kits.', audience: 'Core sport', href: '/products/soccer-jerseys/', ctaLabel: 'Explore Soccer'},
  {id: 'core-baseball', title: 'Baseball Programs', description: 'Review baseball jerseys, pants, full uniforms and roster customization.', audience: 'Core sport', href: '/custom-baseball-softball-uniforms/', ctaLabel: 'Explore Baseball'},
] as const

const pageDefinitions = [
  {
    pageId: 'youth-team-uniforms',
    label: 'Youth Team Uniforms',
    canonicalPath: '/youth-team-uniforms/',
    purpose: 'A buyer-identity page for youth basketball teams, youth sports clubs and team managers.',
    seoTitle: 'Youth Team Uniforms for Clubs and Team Managers | POXIOL',
    seoDescription: 'Plan youth basketball, soccer and baseball uniforms with mixed sizes, player names and numbers, coach apparel, mockup review and sample approval.',
    heroEyebrow: 'For Youth Teams and Team Managers',
    heroTitle: 'Youth Team Uniforms Made Simple for Managers',
    heroDescription: 'Coordinate basketball, soccer or baseball products, mixed sizes, player details, coach apparel and approvals through one clear ordering process.',
    heroPrimaryCtaId: 'start-project',
    heroSecondaryCtaId: 'request-sample',
    buyerIds: ['youth-teams'],
    problems: [
      {id: 'youth-roster', title: 'Roster details keep changing', description: 'Organize player names, numbers and sizes before the approved production list is confirmed.'},
      {id: 'youth-mixed-sizes', title: 'One team needs many sizes', description: 'Prepare a clear size breakdown for players and coaches within the same project.'},
      {id: 'youth-ordering', title: 'Managers need an easier process', description: 'Move from logo and idea to mockup, sample review and production through defined steps.'},
    ],
    solutions: [
      {id: 'youth-customization', title: 'Player Personalization', audience: 'For complete team rosters', description: 'Confirm individual names, numbers and artwork placement before production.', href: '/customization/', ctaLabel: 'Plan Customization'},
      {id: 'youth-sizing', title: 'Mixed Size Planning', audience: 'For players and coaches', description: 'Organize the final size breakdown around the confirmed roster and apparel requirements.', href: '/get-quote/', ctaLabel: 'Share Team Details'},
      {id: 'youth-sample', title: 'Sample Approval', audience: 'Before bulk production', description: 'Confirm the sample requirements and approval step before the team order proceeds.', href: '/sample-order/', ctaLabel: 'Request Sample'},
    ],
    finalCta: {id: 'start-project', label: 'Create Your Team Uniform', href: '/free-mockup/', description: 'Share your roster, logo, colors, size needs and target date to start the youth team design process.'},
  },
  {
    pageId: 'school-teamwear',
    label: 'School Teamwear',
    canonicalPath: '/school-teamwear/',
    purpose: 'A buyer-identity page for schools, academies and education sports programs.',
    seoTitle: 'School Teamwear Programs for Schools and Academies | POXIOL',
    seoDescription: 'Coordinate seasonal basketball, soccer and baseball school teamwear with clear sizing, repeat supply planning and reliable production steps.',
    heroEyebrow: 'For Schools, Academies and Education Programs',
    heroTitle: 'School Teamwear Built for Seasonal Programs',
    heroDescription: 'Plan seasonal basketball, soccer and baseball orders, team sizes and repeat requirements through a clear approval and production workflow.',
    heroPrimaryCtaId: 'get-quote',
    heroSecondaryCtaId: 'request-sample',
    buyerIds: ['schools'],
    problems: [
      {id: 'school-season', title: 'Seasonal deadlines need planning', description: 'Align team requirements and approvals with the date the school needs its teamwear.'},
      {id: 'school-sizing', title: 'Sizes span several teams', description: 'Keep team and roster size breakdowns clear before production details are confirmed.'},
      {id: 'school-repeat', title: 'Future seasons need consistency', description: 'Reconfirm approved identity, product, size and production requirements for each repeat order.'},
    ],
    solutions: [
      {id: 'school-program', title: 'Seasonal Program Planning', audience: 'For school sports calendars', description: 'Organize teams, quantities, artwork and target dates before the production plan is confirmed.', href: '/get-quote/', ctaLabel: 'Plan a School Program'},
      {id: 'school-size-plan', title: 'Team Size Management', audience: 'For multiple rosters', description: 'Prepare a clear size plan for each team or group within the school order.', href: '/customization/', ctaLabel: 'Review the Workflow'},
      {id: 'school-repeat-plan', title: 'Repeat Supply Review', audience: 'For later seasons', description: 'Reconfirm specifications, current materials, quantities and timing when the school orders again.', href: '/manufacturing/', ctaLabel: 'See Production Steps'},
    ],
    finalCta: {id: 'get-quote', label: 'Request School Teamwear Solution', href: '/get-quote/', description: 'Share the sports, teams, size plan, branding requirements and seasonal deadline for review.'},
  },
  {
    pageId: 'club-teamwear-program',
    label: 'Club Teamwear Program',
    canonicalPath: '/club-teamwear-program/',
    purpose: 'A buyer-identity page for sports clubs managing multiple teams and long-term programs.',
    seoTitle: 'Club Teamwear Programs for Multiple Teams | POXIOL',
    seoDescription: 'Manage basketball, soccer and baseball squads, club collections and repeat teamwear orders through one consistent approval and production workflow.',
    heroEyebrow: 'For Sports Clubs and Multiple Teams',
    heroTitle: 'One Club Teamwear Program for Every Squad',
    heroDescription: 'Coordinate basketball, soccer and baseball club collections, multiple team requirements and repeat orders with consistent approved details.',
    heroPrimaryCtaId: 'start-project',
    heroSecondaryCtaId: 'request-sample',
    buyerIds: ['clubs'],
    problems: [
      {id: 'club-squads', title: 'Multiple squads need coordination', description: 'Keep each team roster, product and size requirement clear within the wider club program.'},
      {id: 'club-identity', title: 'Club identity must stay consistent', description: 'Confirm shared colors, logos and artwork rules before team-specific details are prepared.'},
      {id: 'club-repeat', title: 'Repeat orders need control', description: 'Reconfirm approved requirements, quantities and timing for every new production request.'},
    ],
    solutions: [
      {id: 'club-collection', title: 'Club Collection Planning', audience: 'For a consistent club identity', description: 'Define shared branding and product requirements across match, training and support apparel.', href: '/customization/', ctaLabel: 'Plan Club Customization'},
      {id: 'club-team-map', title: 'Multiple Team Management', audience: 'For several squads', description: 'Separate roster, size and product details by team while keeping one coordinated program.', href: '/get-quote/', ctaLabel: 'Share Club Requirements'},
      {id: 'club-production', title: 'Repeat Production Review', audience: 'For ongoing programs', description: 'Review the approved specifications and current order details before each repeat run.', href: '/manufacturing/', ctaLabel: 'See Manufacturing'},
    ],
    finalCta: {id: 'get-quote', label: 'Build Your Club Teamwear Program', href: '/get-quote/', description: 'Share your club identity, teams, product categories, estimated quantities and target dates.'},
  },
  {
    pageId: 'private-label-teamwear',
    label: 'Private Label Teamwear',
    canonicalPath: '/private-label-teamwear/',
    purpose: 'A buyer-identity page for sports brands and distributors planning OEM teamwear collections.',
    seoTitle: 'Private Label Teamwear for Sports Brands and Distributors | POXIOL',
    seoDescription: 'Plan private-label basketball, soccer and baseball collections with custom labels, packaging, sample approval and repeat manufacturing requirements.',
    heroEyebrow: 'For Sports Brands and Distributors',
    heroTitle: 'Private Label Teamwear Built Around Your Brand',
    heroDescription: 'Develop basketball, soccer and baseball OEM teamwear with confirmed specifications, custom labels, packaging, sample approval and repeat manufacturing requirements.',
    heroPrimaryCtaId: 'get-quote',
    heroSecondaryCtaId: 'request-sample',
    buyerIds: ['sports-brands', 'distributors'],
    problems: [
      {id: 'private-brand', title: 'Brand details must stay controlled', description: 'Confirm artwork, labels, packaging and product specifications before manufacturing.'},
      {id: 'private-sample', title: 'Collections need approval before bulk', description: 'Review sample requirements and the approval step before the production run proceeds.'},
      {id: 'private-repeat', title: 'Repeat manufacturing needs consistency', description: 'Reconfirm specifications, materials, quantity and timing for each new production run.'},
    ],
    solutions: [
      {id: 'private-oem', title: 'OEM Specification Review', audience: 'For brand-owned collections', description: 'Prepare confirmed product, construction, artwork and customization requirements.', href: '/customization/private-label/', ctaLabel: 'Review Private Label Options'},
      {id: 'private-packaging', title: 'Labels and Packaging', audience: 'For brand presentation', description: 'Confirm available label and packaging options during project consultation.', href: '/customization/custom-packaging/', ctaLabel: 'Review Packaging'},
      {id: 'private-manufacturing', title: 'Repeat Manufacturing Plan', audience: 'For ongoing supply', description: 'Reconfirm the approved project details and current production requirements before each run.', href: '/manufacturing/', ctaLabel: 'See Manufacturing'},
    ],
    finalCta: {id: 'get-quote', label: 'Discuss Your OEM Project', href: '/get-quote/', description: 'Share your product brief, brand assets, estimated quantity, packaging needs and target timeline.'},
  },
] as const

export const V8_BUYER_PAGE_CONTENT: readonly V8BuyerPageContent[] = pageDefinitions.map((page) => ({
  ...page,
  authorityLinks: [
    ...coreSportLinks,
    ...sharedAuthorityLinks,
    {id: `${page.pageId}-inquiry`, title: page.finalCta.label, description: page.finalCta.description, audience: 'Project inquiry', href: page.finalCta.href, ctaLabel: page.finalCta.label},
  ],
  faqs: getV8Faqs({pageId: page.pageId}),
}))

export function getV8BuyerPageContent(pageId: BuyerPageId): V8BuyerPageContent {
  const page = V8_BUYER_PAGE_CONTENT.find((item) => item.pageId === pageId)
  if (!page) throw new Error(`Unknown V8 buyer page: ${pageId}`)
  return page
}

export function getV8BuyerPageMetadata(pageId: BuyerPageId): Metadata {
  const page = getV8BuyerPageContent(pageId)
  const canonical = `${V8_BRAND.canonicalBaseUrl}${page.canonicalPath}`
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: {canonical},
    openGraph: {title: page.seoTitle, description: page.seoDescription, url: canonical, type: 'website'},
  }
}

export function isV8BuyerPageId(pageId: V8PageId): pageId is BuyerPageId {
  return V8_BUYER_PAGE_CONTENT.some((page) => page.pageId === pageId)
}
