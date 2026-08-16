import type {Metadata} from 'next'
import type {GeoProductDetails} from './geo-v1.ts'
import {getV8Cta} from './v8/ctas.ts'
import {V8_PROCESSES} from './v8/processes.ts'
import type {V8ContentCard, V8Cta, V8FaqItem, V8HeroConfig, V8PageId, V8ProcessStep} from './v8/types.ts'

export type CoreSportId = 'basketball' | 'soccer' | 'baseball'

export type CoreSportDefinition = {
  id: CoreSportId
  pageId: Extract<V8PageId, 'basketball' | 'soccer' | 'baseball'>
  label: string
  priority: number
  canonicalPath: string
  seoTitle: string
  seoDescription: string
  primaryKeyword: string
  secondaryKeywords: readonly string[]
  hero: V8HeroConfig
  visualizationId: string
  productSummaryTitle: string
  productCards: readonly V8ContentCard[]
  problems: readonly V8ContentCard[]
  customization: readonly V8ContentCard[]
  sampleSteps: readonly V8ProcessStep[]
  authorityLinks: readonly V8ContentCard[]
  faqs: readonly V8FaqItem[]
  primaryCta: V8Cta
  secondaryCta: V8Cta
  geoDetails: GeoProductDetails
}

const sharedSampleSteps: readonly V8ProcessStep[] = [
  {id: 'requirements', title: 'Confirm Sample Requirements', description: 'Confirm the product, artwork, size and customization details that the sample should represent.'},
  {id: 'sample-review', title: 'Sample Review', description: 'Review the completed sample against the project specification agreed during consultation.'},
  {id: 'bulk-approval', title: 'Approve Production Planning', description: 'Approve the agreed details before the bulk production plan proceeds.'},
]

const sharedAuthorityLinks = (sport: string): readonly V8ContentCard[] => [
  {id: sport + '-customization', title: 'Customization', audience: 'Design intent', description: 'Confirm colors, artwork, names, numbers and product details through the mockup workflow.', href: '/customization/', ctaLabel: 'Review Customization'},
  {id: sport + '-sample', title: 'Request Sample', audience: 'High purchase intent', description: 'Confirm sample requirements before bulk production planning.', href: '/sample-order/', ctaLabel: 'Request Sample'},
  {id: sport + '-manufacturing', title: 'Manufacturing', audience: 'Production planning', description: 'Review how confirmed specifications move through production.', href: '/manufacturing/', ctaLabel: 'See Manufacturing'},
  {id: sport + '-quality', title: 'Quality Control', audience: 'Inspection', description: 'Review material, printing, sewing, sizing, final and packing checks.', href: '/quality-control-process/', ctaLabel: 'See Quality Control'},
  {id: sport + '-quote', title: 'Get Quote', audience: 'Defined project', description: 'Share quantity, customization, destination and target date for project review.', href: '/get-quote/', ctaLabel: 'Get a Project Quote'},
]

const ctas = {
  mockup: getV8Cta('free-mockup'),
  quote: getV8Cta('get-quote'),
  sample: getV8Cta('request-sample'),
}

const consultation = 'Confirmed during project consultation'

export const CORE_SPORTS: readonly CoreSportDefinition[] = [
  {
    id: 'basketball',
    pageId: 'basketball',
    label: 'Basketball',
    priority: 45,
    canonicalPath: '/products/basketball-uniforms/',
    seoTitle: 'Custom Basketball Uniform Manufacturer | POXIOL',
    seoDescription: 'Custom basketball jerseys, shorts, reversible uniforms and team sets for clubs, schools, youth programs, sports brands and distributors, with mockup, sample and quality-control review.',
    primaryKeyword: 'custom basketball uniforms',
    secondaryKeywords: ['basketball uniform manufacturer', 'custom basketball jerseys', 'custom team basketball uniforms', 'sublimated basketball uniforms'],
    hero: {
      eyebrow: 'Custom Basketball Uniforms',
      title: 'Custom Basketball Uniform Manufacturer for Clubs, Schools and Sportswear Brands',
      description: 'Develop basketball jerseys, shorts, reversible options and full team sets with confirmed artwork, roster, sizing, sample and production requirements.',
      primaryCtaId: 'free-mockup',
      secondaryCtaId: 'request-sample',
    },
    visualizationId: 'PV-BASK-001',
    productSummaryTitle: 'Jersey and Shorts Options for Complete Basketball Programs',
    productCards: [
      {id: 'basketball-jersey-shorts', title: 'Jersey and Shorts', audience: 'Complete team set', description: 'Coordinate the jersey and shorts around the approved artwork, roster, sizing and construction requirements.'},
      {id: 'basketball-front-back', title: 'Front and Back', audience: 'Artwork approval', description: 'Review team branding, player names and numbers on both sides before sample approval.'},
      {id: 'basketball-reversible', title: 'Reversible Option', audience: 'Two coordinated sides', description: 'Confirm whether the team needs a reversible construction and review both approved designs.'},
      {id: 'basketball-fabric', title: 'Fabric and Ribbed Trim', audience: 'Construction review', description: 'Confirm fabric, collar and armhole requirements during project consultation.'},
      {id: 'basketball-sizing', title: 'Youth and Adult Sizing', audience: 'Roster planning', description: 'Confirm available sizes against the final player list during project consultation.'},
      {id: 'basketball-reorders', title: 'Reorders and Private Label', audience: 'Clubs and brands', description: 'Reconfirm the current specification, materials, quantity, timing, labels and packaging for each project.'},
    ],
    problems: [],
    customization: [],
    sampleSteps: sharedSampleSteps,
    authorityLinks: sharedAuthorityLinks('basketball'),
    faqs: [],
    primaryCta: ctas.mockup,
    secondaryCta: ctas.sample,
    geoDetails: {
      overview: [
        {label: 'Product Type', value: 'Custom Basketball Uniforms'},
        {label: 'Application', value: 'Club, school, youth and branded basketball programs'},
        {label: 'Customization', value: 'Team colors, logos, names, numbers and approved graphics'},
        {label: 'Production Type', value: consultation},
        {label: 'Suitable For', value: 'Clubs, schools, youth programs, sports brands and distributors'},
      ],
      specifications: [
        {label: 'Fabric', value: consultation},
        {label: 'Printing Technology', value: consultation},
        {label: 'Customization Options', value: 'Names, numbers, logos, colors, labels and packaging'},
        {label: 'Available Sizes', value: consultation},
        {label: 'MOQ', value: consultation},
        {label: 'Production Type', value: consultation},
      ],
      recommendedFor: ['Youth Programs', 'Schools', 'Clubs', 'Sports Brands', 'Distributors'],
    },
  },
  {
    id: 'soccer',
    pageId: 'soccer',
    label: 'Soccer',
    priority: 35,
    canonicalPath: '/products/soccer-jerseys/',
    seoTitle: 'Custom Soccer Kit Manufacturer | Soccer Jerseys & Full Kits | POXIOL',
    seoDescription: 'Custom soccer jerseys, shorts, socks, goalkeeper kits and full team kits for clubs, schools, youth programs, sports brands and distributors.',
    primaryKeyword: 'custom soccer kits',
    secondaryKeywords: ['custom soccer jerseys', 'soccer kit manufacturer', 'soccer jersey manufacturer', 'custom soccer uniforms', 'soccer jersey supplier'],
    hero: {
      eyebrow: 'Custom Soccer Kits',
      title: 'Custom Soccer Kit Manufacturer for Clubs, Schools and Sports Brands',
      description: 'Plan jerseys, shorts, socks, goalkeeper options and full soccer kits with confirmed crest placement, player details, sample approval and production requirements.',
      primaryCtaId: 'free-mockup',
      secondaryCtaId: 'request-sample',
    },
    visualizationId: 'PV-SOCCER-001',
    productSummaryTitle: 'Jersey, Shorts and Socks for a Complete Soccer Program',
    productCards: [
      {id: 'soccer-jersey', title: 'Soccer Jersey', audience: 'Match and team identity', description: 'Confirm the front and back design, team crest, sponsor artwork, player name, number, collar and sleeve details.'},
      {id: 'soccer-shorts', title: 'Soccer Shorts', audience: 'Coordinated kit', description: 'Match shorts to the approved jersey colors, artwork, size breakdown and construction requirements.'},
      {id: 'soccer-socks', title: 'Soccer Socks', audience: 'Full kit planning', description: 'Include coordinated socks when the club, school or brand requires a complete kit program.'},
      {id: 'soccer-full-kit', title: 'Full Soccer Kit', audience: 'Jersey, shorts and socks', description: 'Plan the full kit as one approved team identity with clear roster, sizing and packing requirements.'},
      {id: 'soccer-goalkeeper', title: 'Goalkeeper Option', audience: 'Contrasting team role', description: 'Confirm the goalkeeper product, colors and customization separately from the field-player kit.'},
      {id: 'soccer-front-back', title: 'Front and Back', audience: 'Artwork approval', description: 'Review crest, sponsor, player name and number placement on both sides before sample approval.'},
    ],
    problems: [
      {id: 'soccer-kit-scope', title: 'Does the whole kit stay coordinated?', description: 'Confirm jersey, shorts, socks and optional goalkeeper requirements from one approved project brief.'},
      {id: 'soccer-artwork', title: 'Will every crest and player detail be correct?', description: 'Review authorized crest, sponsor, name and number placement before production.'},
      {id: 'soccer-repeat', title: 'Can a later reorder match the project?', description: 'Reconfirm artwork, material availability, sizes, quantities and timing for every reorder.'},
    ],
    customization: [
      {id: 'soccer-crest', title: 'Team Crest and Sponsor Placement', audience: 'Authorized artwork', description: 'Confirm the placement and scale of buyer-authorized team and sponsor artwork.'},
      {id: 'soccer-roster', title: 'Player Names and Numbers', audience: 'Roster control', description: 'Prepare the approved player list and size breakdown before production planning.'},
      {id: 'soccer-sizing', title: 'Youth and Adult Sizing', audience: 'Schools and clubs', description: 'Confirm available sizes against the final roster during project consultation.'},
      {id: 'soccer-print', title: 'Sublimation and Customization', audience: 'Design review', description: 'Confirm the suitable printing and customization method for the approved design and material.'},
      {id: 'soccer-private-label', title: 'Private Label and Packaging', audience: 'Brands and distributors', description: 'Confirm label, packaging and collection requirements during project consultation.', href: '/private-label-teamwear/', ctaLabel: 'Review Private Label'},
      {id: 'soccer-reorders', title: 'Reorders', audience: 'Ongoing programs', description: 'Reconfirm the current specification, materials, roster, quantity and schedule for a repeat order.'},
    ],
    sampleSteps: sharedSampleSteps,
    authorityLinks: sharedAuthorityLinks('soccer'),
    faqs: [
      {id: 'soccer-full-kit-faq', question: 'Can a soccer project include jerseys, shorts, socks and a goalkeeper kit?', answer: 'Yes. Share the required field-player and goalkeeper products so the complete kit scope can be reviewed and quoted.', pageIds: ['soccer']},
      {id: 'soccer-customization-faq', question: 'Can soccer jerseys include team crests, names and numbers?', answer: 'Yes. Buyer-authorized crests, sponsor artwork, player names and numbers can be included after placement and roster details are confirmed.', pageIds: ['soccer']},
      {id: 'soccer-sample-faq', question: 'How does soccer kit sample approval work?', answer: 'The buyer confirms the design and sample requirements, reviews the completed sample against the agreed details and approves the specification before bulk production planning.', pageIds: ['soccer']},
      {id: 'soccer-reorder-faq', question: 'What is checked before a soccer kit reorder?', answer: 'The current artwork, material availability, sizes, quantities, customization and required timing are reconfirmed before a repeat production plan is issued.', pageIds: ['soccer']},
      {id: 'soccer-quote-faq', question: 'What information is needed for a soccer kit quote?', answer: 'Share the kit components, quantity, size breakdown, authorized artwork, player list, destination and target date for project review.', pageIds: ['soccer']},
    ],
    primaryCta: ctas.mockup,
    secondaryCta: ctas.sample,
    geoDetails: {
      overview: [
        {label: 'Product Type', value: 'Custom Soccer Kits'},
        {label: 'Application', value: 'Club, school, youth and branded soccer programs'},
        {label: 'Customization', value: 'Crests, authorized sponsor artwork, names, numbers and colors'},
        {label: 'Production Type', value: consultation},
        {label: 'Suitable For', value: 'Clubs, schools, youth programs, sports brands and distributors'},
      ],
      specifications: [
        {label: 'Fabric', value: consultation},
        {label: 'Printing Technology', value: consultation},
        {label: 'Customization Options', value: 'Crests, names, numbers, colors, goalkeeper options, labels and packaging'},
        {label: 'Available Sizes', value: consultation},
        {label: 'MOQ', value: consultation},
        {label: 'Production Type', value: consultation},
      ],
      recommendedFor: ['Youth Programs', 'Schools', 'Clubs', 'Sports Brands', 'Distributors'],
    },
  },
  {
    id: 'baseball',
    pageId: 'baseball',
    label: 'Baseball',
    priority: 20,
    canonicalPath: '/custom-baseball-softball-uniforms/',
    seoTitle: 'Custom Baseball Uniform Manufacturer | Jerseys, Pants & Team Sets | POXIOL',
    seoDescription: 'Custom baseball jerseys, pants and full uniforms for youth programs, schools, clubs, sports brands and distributors, with sample, manufacturing and QC review.',
    primaryKeyword: 'custom baseball uniforms',
    secondaryKeywords: ['baseball uniform manufacturer', 'custom baseball jerseys', 'baseball jersey manufacturer', 'baseball uniform supplier', 'custom sublimated baseball jerseys'],
    hero: {
      eyebrow: 'Custom Baseball Uniforms',
      title: 'Custom Baseball Uniform Manufacturer for Teams, Schools and Clubs',
      description: 'Develop baseball jerseys, pants and full uniform programs with confirmed front and back artwork, player details, sizing, sample and production requirements.',
      primaryCtaId: 'free-mockup',
      secondaryCtaId: 'request-sample',
    },
    visualizationId: 'PV-BASEBALL-001',
    productSummaryTitle: 'Baseball Jersey, Baseball Pants and Full Baseball Uniform Options',
    productCards: [
      {id: 'baseball-jersey', title: 'Baseball Jersey', audience: 'Team identity', description: 'Confirm the jersey format, front and back artwork, team name, player number and construction requirements.'},
      {id: 'baseball-pants', title: 'Baseball Pants', audience: 'Complete game uniform', description: 'Plan matching pants around the agreed fit, construction, color and size requirements.'},
      {id: 'baseball-full-uniform', title: 'Full Baseball Uniform', audience: 'Jersey and pants', description: 'Coordinate the jersey and pants as one approved team uniform with optional matching program requirements.'},
      {id: 'baseball-front-back', title: 'Front and Back', audience: 'Artwork approval', description: 'Review the team name, logo, player name and number placement on both sides before sample approval.'},
      {id: 'baseball-youth', title: 'Youth, School and Club Programs', audience: 'Roster planning', description: 'Confirm sizes, player details, product combinations and packing needs for each program.'},
      {id: 'baseball-private-label', title: 'Private Label', audience: 'Brands and distributors', description: 'Confirm approved label, packaging and brand collection requirements during consultation.', href: '/private-label-teamwear/', ctaLabel: 'Discuss Private Label'},
    ],
    problems: [
      {id: 'baseball-complete-set', title: 'Does the project include more than a jersey?', description: 'Confirm jersey, pants and optional matching program requirements before quoting and design review.'},
      {id: 'baseball-construction', title: 'Will construction match the approved brief?', description: 'Review fabric, jersey format, pants, artwork and sizing through the sample process.'},
      {id: 'baseball-roster', title: 'Can player details stay organized?', description: 'Confirm player names, numbers and sizes against one approved roster before production.'},
    ],
    customization: [
      {id: 'baseball-sublimation', title: 'Sublimation and Decoration', audience: 'Project-specific method', description: 'Confirm the suitable decoration method against the approved artwork, construction and material.'},
      {id: 'baseball-team-name', title: 'Team Names and Player Numbers', audience: 'Roster identity', description: 'Prepare authorized artwork and the final player list for review.'},
      {id: 'baseball-fabric', title: 'Fabric and Construction', audience: 'Product specification', description: 'Confirm material, jersey format, pants construction and finishing details during project consultation.'},
      {id: 'baseball-sizing', title: 'Youth and Adult Sizing', audience: 'Teams, schools and clubs', description: 'Confirm available sizes against the final roster during project consultation.'},
      {id: 'baseball-packaging', title: 'Packaging', audience: 'Program delivery', description: 'Confirm individual, roster-grouped or brand packaging requirements before production planning.'},
      {id: 'baseball-reorders', title: 'Reorders', audience: 'Ongoing programs', description: 'Reconfirm the current specification, materials, player details, quantity and schedule for each repeat order.'},
    ],
    sampleSteps: sharedSampleSteps,
    authorityLinks: sharedAuthorityLinks('baseball'),
    faqs: [
      {id: 'baseball-full-set-faq', question: 'Can a baseball project include both jerseys and pants?', answer: 'Yes. Share whether the project needs jerseys, pants or a full uniform so product, sizing and customization requirements can be reviewed together.', pageIds: ['baseball']},
      {id: 'baseball-customization-faq', question: 'Can baseball uniforms include team names and player numbers?', answer: 'Yes. Buyer-authorized team artwork, player names and numbers can be included after the front and back placement and roster details are confirmed.', pageIds: ['baseball']},
      {id: 'baseball-sample-faq', question: 'How does baseball uniform sample review work?', answer: 'The buyer confirms the design and sample requirements, reviews the completed sample against the agreed details and approves the specification before bulk production planning.', pageIds: ['baseball']},
      {id: 'baseball-buyers-faq', question: 'Can POXIOL review youth, school, club and private-label baseball projects?', answer: 'Yes. The project path is adapted to the buyer type, roster, product combination, branding, packaging and approval requirements provided during consultation.', pageIds: ['baseball']},
      {id: 'baseball-quote-faq', question: 'What information is needed for a baseball uniform quote?', answer: 'Share the jersey and pants requirements, quantity, size breakdown, authorized artwork, player list, destination and target date for project review.', pageIds: ['baseball']},
    ],
    primaryCta: ctas.mockup,
    secondaryCta: ctas.sample,
    geoDetails: {
      overview: [
        {label: 'Product Type', value: 'Custom Baseball Uniforms'},
        {label: 'Application', value: 'Youth, school, club and branded baseball programs'},
        {label: 'Customization', value: 'Team names, logos, player names, numbers and approved graphics'},
        {label: 'Production Type', value: consultation},
        {label: 'Suitable For', value: 'Youth programs, schools, clubs, sports brands and distributors'},
      ],
      specifications: [
        {label: 'Fabric', value: consultation},
        {label: 'Printing Technology', value: consultation},
        {label: 'Customization Options', value: 'Team names, player numbers, colors, labels and packaging'},
        {label: 'Available Sizes', value: consultation},
        {label: 'MOQ', value: consultation},
        {label: 'Production Type', value: consultation},
      ],
      recommendedFor: ['Youth Programs', 'Schools', 'Clubs', 'Sports Brands', 'Distributors'],
    },
  },
] as const

export function getCoreSport(id: CoreSportId): CoreSportDefinition {
  const sport = CORE_SPORTS.find((item) => item.id === id)
  if (!sport) throw new Error('Unknown core sport: ' + id)
  return sport
}

export function getCoreSportMetadata(id: CoreSportId): Metadata {
  const sport = getCoreSport(id)
  const canonical = 'https://www.poxiol.com' + sport.canonicalPath
  return {
    title: sport.seoTitle,
    description: sport.seoDescription,
    alternates: {canonical},
    openGraph: {title: sport.seoTitle, description: sport.seoDescription, url: canonical, type: 'website'},
  }
}

export const CORE_SPORT_JOURNEY = V8_PROCESSES.journey
export const CORE_SPORT_MANUFACTURING = V8_PROCESSES.manufacturing
export const CORE_SPORT_QUALITY_CONTROL = V8_PROCESSES.qualityControl
