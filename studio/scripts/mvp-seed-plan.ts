export const PROJECT_ID = 'oqpv1xbc'
export const DATASET = 'production'
export const API_VERSION = '2024-01-01'

export type SeedDocument = {_id: string; _type: string; [key: string]: unknown}

const block = (key: string, text: string) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: `${key}-span`, marks: [], text}],
})

export const SEED_DOCS: SeedDocument[] = [
  {
    _id: 'drafts.siteSettings',
    _type: 'siteSettings',
    brandName: 'POXIOL',
    siteUrl: 'https://www.poxiol.com/',
    globalSeo: {
      seoTitle: 'POXIOL Custom Teamwear Manufacturer',
      metaDescription: 'Factory-direct custom teamwear information for clubs, schools, brands, and international sourcing teams.',
      canonicalUrl: 'https://www.poxiol.com/',
      indexStatus: 'noindex',
    },
  },
  {
    _id: 'drafts.procurementStandards',
    _type: 'procurementStandards',
    minimumSampleMOQ: '1 Set',
    sampleProductionTime: 'Sample Production: 2-3 Days After Mockup Confirmation',
    expressDeliveryTime: 'Express international delivery usually takes 3-7 business days depending on country.',
    sizeTolerance: 'Please allow +-2 cm tolerance, which is not a reason for returns.',
    mockupPolicy: 'Free 3D mockup design is available before sample confirmation.',
  },
  {
    _id: 'drafts.product-category-basketball-mvp',
    _type: 'productCategory',
    categoryName: 'Basketball Uniforms',
    shortName: 'Basketball',
    slug: {current: 'basketball-uniforms'},
    heroTitle: 'Custom Basketball Uniforms',
    heroDescription: 'Draft category content for custom basketball jerseys and shorts.',
    introduction: 'A draft overview of sublimated basketball teamwear options.',
    displayOrder: 10,
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.product-category-soccer-mvp',
    _type: 'productCategory',
    categoryName: 'Soccer Kits',
    shortName: 'Soccer',
    slug: {current: 'soccer-kits'},
    heroTitle: 'Custom Soccer Kits',
    heroDescription: 'Draft category content for custom soccer jerseys and shorts.',
    introduction: 'A draft overview of custom soccer kit options for teams and clubs.',
    displayOrder: 20,
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.product-basketball-mvp',
    _type: 'product',
    productName: 'Pro Basketball Jersey Set',
    slug: {current: 'pro-basketball-jersey-set'},
    shortDescription: 'Draft product content for a sublimated basketball jersey and shorts set.',
    fullDescription: 'A draft product record covering fabric, printing, and team customization options.',
    sportType: 'Basketball',
    productType: 'Jersey and shorts set',
    fabric: 'Interlock polyester',
    gsm: '160 GSM',
    printingMethod: 'Sublimation',
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.product-soccer-mvp',
    _type: 'product',
    productName: 'Custom Soccer Match Kit',
    slug: {current: 'custom-soccer-match-kit'},
    shortDescription: 'Draft product content for a custom soccer jersey and shorts kit.',
    fullDescription: 'A draft product record for club, school, and academy soccer kit sourcing.',
    sportType: 'Soccer',
    productType: 'Jersey and shorts kit',
    fabric: 'Breathable polyester',
    gsm: '150 GSM',
    printingMethod: 'Sublimation',
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.faq-sample-mvp',
    _type: 'faqItem',
    question: 'How long does sample production take?',
    answer: [block('faq-sample', 'Sample production normally takes 2-3 days after mockup confirmation.')],
    category: 'Sample',
    displayOrder: 10,
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.faq-moq-mvp',
    _type: 'faqItem',
    question: 'What is the minimum sample order?',
    answer: [block('faq-moq', 'The draft procurement standard lists a minimum sample order of one set.')],
    category: 'MOQ',
    displayOrder: 20,
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.faq-shipping-mvp',
    _type: 'faqItem',
    question: 'How long does express delivery take?',
    answer: [block('faq-shipping', 'Express delivery commonly takes 3-7 business days depending on destination and carrier.')],
    category: 'Shipping',
    displayOrder: 30,
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.author-mvp',
    _type: 'author',
    name: 'POXIOL Editorial Team',
    role: 'Teamwear Sourcing Editorial Team',
    brand: 'POXIOL',
    shortBio: 'Draft author profile for reviewed teamwear sourcing and manufacturing content.',
    active: true,
  },
  {
    _id: 'drafts.article-mvp',
    _type: 'article',
    title: 'How to Evaluate a Custom Teamwear Supplier',
    slug: {current: 'evaluate-custom-teamwear-supplier'},
    articleType: 'Buying Guide',
    excerpt: 'A draft checklist for evaluating custom sportswear manufacturing partners.',
    body: [block('article-intro', 'Review sample quality, production controls, communication, and delivery evidence before approving a supplier.')],
    publishStatus: 'draft',
  },
  {
    _id: 'drafts.case-study-mvp',
    _type: 'caseStudy',
    title: 'Basketball Academy Tournament Program',
    slug: {current: 'basketball-academy-tournament-program'},
    buyerType: 'Basketball academy',
    countryOrRegion: 'United States',
    buyerNameDisclosure: 'anonymized',
    orderQuantity: '500 sets',
    projectBackground: 'Draft anonymized project summary for a regional tournament uniform program.',
    solution: 'Draft solution summary covering reversible jerseys, matching shorts, and production coordination.',
    publishStatus: 'draft',
  },
]

const SYSTEM_FIELDS = new Set(['_rev', '_createdAt', '_updatedAt'])

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !SYSTEM_FIELDS.has(key))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, normalize(child)]),
    )
  }
  return value
}

export function sameDocument(actual: SeedDocument, expected: SeedDocument): boolean {
  return JSON.stringify(normalize(actual)) === JSON.stringify(normalize(expected))
}

function countMatches(text: string, pattern: RegExp): number {
  return [...text.matchAll(pattern)].length
}

function collectReferences(value: unknown, refs: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((item) => collectReferences(item, refs))
  else if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (typeof record._ref === 'string') refs.push(record._ref)
    Object.values(record).forEach((child) => collectReferences(child, refs))
  }
  return refs
}

export interface PlanMetrics {
  duplicateIds: number
  invalidReferences: number
  piiMatches: number
  secretMatches: number
  blockedRiskWords: number
}

export function getPlanMetrics(): PlanMetrics {
  const ids = SEED_DOCS.map((doc) => doc._id)
  const serialized = JSON.stringify(SEED_DOCS)
  const highRiskWords = ['Nike', 'Adidas', 'Jordan', 'Puma', 'Under Armour', 'New Balance', 'NBA', 'NCAA', 'WNBA', 'FIBA', 'FIFA', 'Olympic', 'Dri-FIT']
  return {
    duplicateIds: ids.length - new Set(ids).size,
    invalidReferences: collectReferences(SEED_DOCS).length,
    piiMatches: countMatches(serialized, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) + countMatches(serialized, /\+?\d[\d ()-]{7,}\d/g),
    secretMatches: countMatches(serialized, /(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{20,})/g),
    blockedRiskWords: highRiskWords.filter((word) => serialized.toLowerCase().includes(word.toLowerCase())).length,
  }
}

export function getDraftIds(): string[] {
  return SEED_DOCS.map((doc) => doc._id)
}

export function getRootIds(): string[] {
  return getDraftIds().map((id) => id.slice('drafts.'.length))
}
