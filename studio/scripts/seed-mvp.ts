/**
 * POXIOL CMS MVP Seed.
 *
 * Safety guarantees:
 * - targets one explicit project/dataset;
 * - only handles drafts.* document IDs;
 * - never replaces, patches, publishes, or deletes documents;
 * - aborts before mutation on published-root or draft-content collisions;
 * - can be repeated when existing drafts exactly match the seed plan.
 */

import {getCliClient} from 'sanity/cli'

const PROJECT_ID = 'oqpv1xbc'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

const client = getCliClient().withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
})

type SeedDocument = {_id: string; _type: string; [key: string]: unknown}

const block = (key: string, text: string) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: `${key}-span`, marks: [], text}],
})

const SEED_DOCS: SeedDocument[] = [
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

interface SeedResult {
  runAt: string
  projectId: string
  dataset: string
  authMode: 'repository-secret'
  requestTotal: number
  createdTotal: number
  updatedTotal: number
  unchangedTotal: number
  failedTotal: number
  draftDocumentsFound: number
  contentMatches: number
  publishedDocumentsFound: number
  duplicateIds: number
  invalidReferences: number
  piiMatches: number
  secretMatches: number
  blockedRiskWords: number
  transactionCommitted: boolean
  seedPassed: boolean
  failureCode?: string
}

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

function sameDocument(actual: SeedDocument, expected: SeedDocument): boolean {
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

function initialResult(): SeedResult {
  const ids = SEED_DOCS.map((doc) => doc._id)
  const serialized = JSON.stringify(SEED_DOCS)
  const highRiskWords = ['Nike', 'Adidas', 'Jordan', 'Puma', 'Under Armour', 'New Balance', 'NBA', 'NCAA', 'WNBA', 'FIBA', 'FIFA', 'Olympic', 'Dri-FIT']
  return {
    runAt: new Date().toISOString(),
    projectId: PROJECT_ID,
    dataset: DATASET,
    authMode: 'repository-secret',
    requestTotal: SEED_DOCS.length,
    createdTotal: 0,
    updatedTotal: 0,
    unchangedTotal: 0,
    failedTotal: 0,
    draftDocumentsFound: 0,
    contentMatches: 0,
    publishedDocumentsFound: 0,
    duplicateIds: ids.length - new Set(ids).size,
    invalidReferences: collectReferences(SEED_DOCS).length,
    piiMatches: countMatches(serialized, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) + countMatches(serialized, /\+?\d[\d ()-]{7,}\d/g),
    secretMatches: countMatches(serialized, /(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]{20,})/g),
    blockedRiskWords: highRiskWords.filter((word) => serialized.toLowerCase().includes(word.toLowerCase())).length,
    transactionCommitted: false,
    seedPassed: false,
  }
}

function writeResult(result: SeedResult): void {
  const fs = require('fs')
  const path = require('path')
  const outDir = path.resolve(__dirname, '../../migration-output')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true})
  fs.writeFileSync(path.join(outDir, 'mvp-seed-result.json'), JSON.stringify(result, null, 2))
}

async function seed(): Promise<void> {
  const result = initialResult()
  const draftIds = SEED_DOCS.map((doc) => doc._id)
  const rootIds = draftIds.map((id) => id.slice('drafts.'.length))

  try {
    if (!process.env.SANITY_AUTH_TOKEN) throw new Error('auth-missing')
    if (SEED_DOCS.some((doc) => !doc._id.startsWith('drafts.'))) throw new Error('non-draft-id')
    if (result.duplicateIds || result.invalidReferences || result.piiMatches || result.secretMatches || result.blockedRiskWords) {
      throw new Error('static-preflight-failed')
    }

    const published = await client.fetch<SeedDocument[]>(`*[_id in $rootIds]`, {rootIds})
    result.publishedDocumentsFound = published.length
    if (published.length) throw new Error('published-root-collision')

    const existing = await client.fetch<SeedDocument[]>(`*[_id in $draftIds]`, {draftIds})
    const expectedById = new Map(SEED_DOCS.map((doc) => [doc._id, doc]))
    const collisions = existing.filter((doc) => {
      const expected = expectedById.get(doc._id)
      return !expected || !sameDocument(doc, expected)
    })
    if (collisions.length) throw new Error('draft-content-collision')

    result.unchangedTotal = existing.length
    const existingIds = new Set(existing.map((doc) => doc._id))
    const missing = SEED_DOCS.filter((doc) => !existingIds.has(doc._id))

    if (missing.length) {
      await client.transaction(missing.map((doc) => ({createIfNotExists: doc}))).commit({visibility: 'sync'})
      result.transactionCommitted = true
      result.createdTotal = missing.length
    }

    const verified = await client.fetch<SeedDocument[]>(`*[_id in $draftIds]`, {draftIds})
    result.draftDocumentsFound = verified.length
    result.contentMatches = verified.filter((doc) => {
      const expected = expectedById.get(doc._id)
      return Boolean(expected && sameDocument(doc, expected))
    }).length

    const publishedAfter = await client.fetch<SeedDocument[]>(`*[_id in $rootIds]`, {rootIds})
    result.publishedDocumentsFound = publishedAfter.length
    result.seedPassed =
      result.draftDocumentsFound === result.requestTotal &&
      result.contentMatches === result.requestTotal &&
      result.publishedDocumentsFound === 0 &&
      result.createdTotal + result.unchangedTotal === result.requestTotal
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown-failure'
    const allowedCodes = new Set(['auth-missing', 'non-draft-id', 'static-preflight-failed', 'published-root-collision', 'draft-content-collision'])
    result.failureCode = allowedCodes.has(code) ? code : 'seed-transaction-failed'
    result.failedTotal = result.requestTotal
    result.seedPassed = false
    console.error(`MVP seed stopped: ${result.failureCode}`)
  }

  writeResult(result)
  console.log(`MVP seed result: ${result.seedPassed ? 'PASSED' : 'FAILED'}`)
  if (!result.seedPassed) process.exit(1)
}

seed()
