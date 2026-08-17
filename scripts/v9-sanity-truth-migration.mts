import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
import {createHash} from 'node:crypto'
import {
  MANUFACTURING_PARTNER,
  MEASUREMENT_TOLERANCE_REVIEW,
  ORDER_QUANTITY_CONFIRMED,
  SAMPLE_TIMING_CONFIRMED,
  SHIPPING_TIMING_CONFIRMED,
  TIMELINE_CONFIRMED,
} from '../lib/truth/public-copy.ts'
import {scanV9ClaimText, type V9ClaimKind} from './scan-v9-red-claims.mts'

const PROJECT_ID = 'oqpv1xbc'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

export type SnapshotDocument = {
  _id: string
  _type: string
  _rev: string
  _updatedAt?: string
  [key: string]: unknown
}

export type MigrationPatch = {
  id: string
  type: string
  ifRevisionID: string
  set: Record<string, unknown>
  unset: string[]
  changes: Array<{field: string; kind: V9ClaimKind | 'PROJECT_CLASSIFICATION' | 'TAXONOMY'; before: unknown; after: unknown; status: string}>
}

export type MigrationPlan = {
  version: 'POXIOL_V9_1'
  generatedAt: string
  projectId: string
  dataset: string
  deleteCount: 0
  patches: MigrationPatch[]
}

const KNOWN_FIELDS: Readonly<Record<string, readonly string[]>> = {
  procurementStandards: [
    'defaultMOQ', 'sampleMOQ', 'sampleTime', 'sampleProductionTime', 'bulkProductionTime', 'bulkProductionNote',
    'mockupTime', 'shippingNotes', 'qualityPromise', 'qcStandard', 'sizeTolerance', 'mixedSizes',
    'quantityPolicy', 'sampleTimingPolicy', 'productionTimingPolicy', 'mockupTimingPolicy', 'shippingTimingPolicy',
    'measurementTolerancePolicy', 'returnPolicyStatus',
  ],
  sitePage: ['pageKey', 'internalName', 'slug', 'heroEyebrow', 'heroHeading', 'heroSubheading', 'homepageUspCards', 'homepageSectionHeadings', 'inquirySupport', 'contentSections', 'seo', 'publishStatus', 'claimPolicies'],
  productCategory: ['categoryName', 'shortName', 'slug', 'heroTitle', 'heroDescription', 'introduction', 'heroProofPoints', 'decisionSections', 'buyerTypes', 'targetMarkets', 'productTypes', 'keyFeatures', 'coreBenefits', 'navigationVisibility', 'homepageVisibility', 'showOnHomepage', 'activeStatus', 'taxonomyGroup', 'taxonomyKey', 'displayOrder', 'publishStatus', 'seo', 'claimPolicies'],
  product: ['productName', 'slug', 'sport', 'taxonomyKey', 'category', 'shortDescription', 'fullDescription', 'keyBenefits', 'fabricOptions', 'fabric', 'composition', 'gsm', 'printing', 'customizationOptions', 'customizationAreas', 'sizeRange', 'packaging', 'procurementOverride', 'displayOrder', 'publishStatus', 'seo', 'claimPolicies'],
  faqItem: ['question', 'answer', 'shortAnswer', 'fullAnswer', 'category', 'sports', 'products', 'productCategories', 'pages', 'guides', 'displayOrder', 'publishStatus', 'claimPolicies'],
  article: ['title', 'slug', 'articleType', 'excerpt', 'summary', 'body', 'keyTakeaways', 'methodology', 'displayOrder', 'publishStatus', 'seo', 'claimPolicies'],
  caseStudy: [
    'projectTitle', 'title', 'caseType', 'realOrExample', 'country', 'countryOrRegion', 'buyerType', 'region',
    'quantityDisplay', 'projectTimeline', 'product', 'productType', 'projectBackground', 'challenge', 'requirements',
    'overview', 'solution', 'materials', 'customization', 'sampleProcess', 'production', 'qualityControl', 'qcProcess',
    'packingDelivery', 'packaging', 'delivery', 'result', 'testimonial', 'buyerFeedback', 'evidenceStatus',
    'buyerAuthorizationStatus', 'approvedImageStatus', 'evidenceNote', 'verifiedProcess', 'verifiableResultStatement',
    'slug', 'displayOrder', 'publishStatus', 'seo', 'claimPolicies',
  ],
}

const dash = String.raw`[-\u2010-\u2015]`

export function sanitizePublicText(input: string): string {
  if (!input.trim()) return input
  if (/\b(?:does\s+POXIOL\s+support|what\s+is\s+(?:your|the))\s+MOQ\s*1(?:\s*set)?\b/i.test(input)) {
    return 'How is the order quantity confirmed?'
  }

  let value = input
  value = value.replace(/Visit the POXIOL teamwear factory\.\s*15\+ years experience,\s*30,000\+ monthly capacity\.?/gi, 'Review the POXIOL teamwear manufacturing workflow. Company history and production planning require owner-approved evidence.')
  value = value.replace(/Real factories typically offer faster sampling\s*\(2\s*[-–—]\s*3 days\)\s*and direct technical advice on fabric specifications\.?/gi, 'Ask the responsible production party to explain sampling ownership, timing dependencies and technical advice on fabric specifications.')
  value = value.replace(/\bproduction capacity data\b/gi, 'project-specific production planning information')
  value = value.replace(/\b100%\s+polyester\b/gi, 'Polyester')
  value = value.replace(/\bStart\s+with\s+1\s+Sample\b/gi, 'Sample planning is confirmed for the project')
  value = value.replace(/\b(?:a\s+)?one[- ]set\s+sample\b/gi, 'the confirmed project sample')
  value = value.replace(new RegExp(String.raw`\b(?:Sample\s+)?MOQ\s*(?::|is)?\s*(?:from\s+)?1(?:\s*(?:set|piece))?(?:\s+for\s+sample\s+development)?\.?`, 'gi'), ORDER_QUANTITY_CONFIRMED)
  value = value.replace(new RegExp(String.raw`\b1\s*${dash}?\s*set\s+MOQ\b\.?`, 'gi'), ORDER_QUANTITY_CONFIRMED)
  value = value.replace(new RegExp(String.raw`\b1\s*${dash}?\s*set\b`, 'gi'), ORDER_QUANTITY_CONFIRMED)
  value = value.replace(new RegExp(String.raw`\bSample(?:\s+production|\s+timing|\s+time)?[^.\n→]{0,40}\b(?:2\s*${dash}\s*3|3\s*${dash}\s*5|5\s*${dash}\s*7|7\s*${dash}\s*10)\s*(?:working\s*)?days(?:\s+after\s+[^.\n→)]+)?\)?\.?`, 'gi'), SAMPLE_TIMING_CONFIRMED)
  value = value.replace(new RegExp(String.raw`\b(?:Bulk(?:\s+production)?|Production)[^.\n→]{0,80}\b(?:3\s*${dash}\s*5|7\s*${dash}\s*12|10\s*${dash}\s*20)\s*(?:working\s*)?days(?:\s+after\s+[^.\n→)]+)?\)?\.?`, 'gi'), TIMELINE_CONFIRMED)
  value = value.replace(new RegExp(String.raw`\b2\s*${dash}\s*3\s*working\s+days\s+after\s+mockup\s+approval\b\.?`, 'gi'), SAMPLE_TIMING_CONFIRMED)
  value = value.replace(new RegExp(String.raw`\b7\s*${dash}\s*12\s*working\s+days\s+after\s+(?:sample\s+or\s+)?artwork\s+approval\b\.?`, 'gi'), TIMELINE_CONFIRMED)
  value = value.replace(/\b(?:Free\s+)?mockup[^.\n]{0,60}\b(?:1\s*[-–—]\s*2|2)\s*(?:hours?|h)\b[^.\n]*\.?/gi, TIMELINE_CONFIRMED)
  value = value.replace(/\bwithin\s+(?:2|24)\s+hours\b/gi, 'after the project requirements are reviewed')
  value = value.replace(new RegExp(String.raw`\b(?:Global\s+)?(?:Express\s+)?(?:international\s+)?(?:delivery|shipping)[^.\n]{0,80}\b\d+\s*${dash}\s*\d+\s*(?:business\s*)?days[^.\n]*\.?`, 'gi'), SHIPPING_TIMING_CONFIRMED)
  value = value.replace(/\bfactory[- ]direct\s+custom\s+teamwear\s+manufacturing\b/gi, 'custom teamwear manufacturing support')
  value = value.replace(/\bfactory[- ]direct\s+manufacturing\s+model\b/gi, 'teamwear manufacturing support model')
  value = value.replace(/\bfactory[- ]direct\s+manufacturing\b/gi, 'teamwear manufacturing support')
  value = value.replace(/\bfactory[- ]direct\s+(custom\s+[^,.;\n]{1,60}?)\s+manufacturer\b/gi, (_match, productPhrase: string) => {
    const normalized = productPhrase.charAt(0).toUpperCase() + productPhrase.slice(1)
    return `${normalized} manufacturing partner`
  })
  value = value.replace(/\bfactory[- ]direct\s+(?:custom\s+teamwear\s+)?manufacturer\b/gi, 'Custom teamwear manufacturing partner')
  value = value.replace(/\bdirect\s+manufacturer\b/gi, 'Custom Teamwear Manufacturer')
  value = value.replace(/\bfactory[- ]direct\s+(?=custom\b)/gi, '')
  value = value.replace(/\bfactory[- ]direct\b/gi, 'teamwear manufacturing partner')
  value = value.replace(/\bunlimited\b/gi, (match) => match[0] === match[0].toUpperCase() || match[0] === match[0].toUpperCase().charAt(0) + match.slice(1) ? 'Broad' : 'broad')
  value = value.replace(/\bOEM\s+sportswear\s+factory\b/gi, 'OEM sportswear manufacturing support')
  value = value.replace(/\b(?:Italian\s+)?KIAN\s+ink\b/gi, 'current approved ink')
  value = value.replace(/\b(?:Japanese\s+)?EPSON\s+print\s+heads?\b/gi, 'current approved print-head configuration')
  value = value.replace(/\b30,?000\+?\s*(?:units|pieces|sets)(?:\s+monthly)?\b/gi, 'production planning confirmed after project review')
  value = value.replace(/\b30,?000\+?\s+monthly\s+capacity\b/gi, 'production planning requires owner-approved evidence')
  value = value.replace(/\b\d+\+?\s+years?\s+(?:of\s+)?experience\b/gi, 'company history requires owner-approved evidence')
  value = value.replace(/\b100%\s+(?:manual\s+)?(?:quality\s+inspection|QC|inspection)\b/gi, 'project-specific quality inspection')
  value = value.replace(/(?:\+\/-|±)\s*2\s*cm[^.\n]{0,80}\bnot\s+a\s+reason\s+for\s+returns?\b/gi, MEASUREMENT_TOLERANCE_REVIEW)
  value = value.replace(/\bnot\s+a\s+reason\s+for\s+returns?\b/gi, 'return policy review required')
  value = value.replace(/\bguaranteed\s+(?:delivery|quality|shipping|production|response)\b/gi, 'project-confirmed requirements')
  return value.replace(/\.\s*,/g, ',').replace(/\s{2,}/g, ' ').trim()
}

function statusFor(kind: V9ClaimKind): string {
  if (kind === 'MOQ' || kind === 'SAMPLE_TIMING' || kind === 'PRODUCTION_TIMING' || kind === 'SHIPPING_TIMING' || kind === 'FIXED_TIMELINE' || kind === 'UNLIMITED') return 'CONDITIONAL'
  if (kind === 'MOCKUP_TIMING') return 'OPERATIONAL_TARGET'
  if (kind === 'FACTORY_DIRECT' || kind === 'CAPACITY_OR_SCALE' || kind === 'CERTIFICATION' || kind === 'COMPANY_HISTORY') return 'OWNER_CONFIRMATION_REQUIRED'
  return 'UNVERIFIED'
}

function claimId(documentId: string, field: string, kind: V9ClaimKind): string {
  const digest = createHash('sha256').update(`${documentId}:${field}:${kind}`).digest('hex').slice(0, 12)
  return `V9-${kind}-${digest}`
}

type Change = {field: string; kind: V9ClaimKind; before: string; after: string; status: string}

type MigrationContext = {
  categoriesById: Map<string, SnapshotDocument>
  categoryIdsBySlug: Map<string, string>
}

const CATEGORY_TAXONOMY: Readonly<Record<string, {
  group: 'SPORTS' | 'TEAMWEAR'
  key: string
  sport?: string
  navigation: boolean
  homepage: boolean
  active: boolean
}>> = {
  'basketball-uniforms': {group: 'SPORTS', key: 'basketball', sport: 'Basketball', navigation: true, homepage: true, active: true},
  'soccer-jerseys': {group: 'SPORTS', key: 'soccer', sport: 'Soccer', navigation: true, homepage: true, active: true},
  'soccer-kits': {group: 'SPORTS', key: 'soccer-legacy-duplicate', sport: 'Soccer', navigation: false, homepage: false, active: false},
  'training-wear': {group: 'TEAMWEAR', key: 'training-wear', navigation: true, homepage: true, active: true},
  'hoodies-jackets': {group: 'TEAMWEAR', key: 'hoodies-jackets', navigation: true, homepage: true, active: true},
  'team-accessories': {group: 'TEAMWEAR', key: 'team-accessories', navigation: false, homepage: false, active: true},
}

function slugCurrent(document?: SnapshotDocument): string | undefined {
  const slug = document?.slug
  if (typeof slug === 'string') return slug
  return slug && typeof slug === 'object' && typeof (slug as {current?: unknown}).current === 'string'
    ? (slug as {current: string}).current
    : undefined
}

function taxonomyPatch(document: SnapshotDocument, context: MigrationContext): {set: Record<string, unknown>; changes: MigrationPatch['changes']} {
  const set: Record<string, unknown> = {}
  const changes: MigrationPatch['changes'] = []
  const assign = (field: string, after: unknown) => {
    if (JSON.stringify(document[field]) === JSON.stringify(after)) return
    set[field] = after
    changes.push({field, kind: 'TAXONOMY', before: document[field], after, status: 'MIGRATED'})
  }

  if (document._type === 'productCategory') {
    const slug = slugCurrent(document)
    const policy = slug ? CATEGORY_TAXONOMY[slug] : undefined
    if (!policy) return {set, changes}
    assign('taxonomyGroup', policy.group)
    assign('taxonomyKey', policy.key)
    assign('navigationVisibility', policy.navigation)
    assign('homepageVisibility', policy.homepage)
    assign('showOnHomepage', policy.homepage)
    assign('activeStatus', policy.active)
    if (slug === 'soccer-kits') {
      const currentSeo = document.seo && typeof document.seo === 'object' ? document.seo as Record<string, unknown> : {}
      assign('seo', {...currentSeo, canonicalUrl: 'https://www.poxiol.com/products/soccer-jerseys/', indexStatus: 'noindex'})
    }
    return {set, changes}
  }

  if (document._type !== 'product') return {set, changes}
  const currentReference = document.category && typeof document.category === 'object'
    ? document.category as Record<string, unknown>
    : undefined
  const currentCategoryId = typeof currentReference?._ref === 'string' ? currentReference._ref : undefined
  const currentCategorySlug = slugCurrent(currentCategoryId ? context.categoriesById.get(currentCategoryId) : undefined)
  const productName = String(document.productName || '')
  const desiredCategorySlug = currentCategorySlug === 'soccer-kits'
    ? 'soccer-jerseys'
    : currentCategorySlug || (/basketball/i.test(productName) ? 'basketball-uniforms' : /soccer/i.test(productName) ? 'soccer-jerseys' : undefined)
  if (!desiredCategorySlug) return {set, changes}
  const policy = CATEGORY_TAXONOMY[desiredCategorySlug]
  const desiredCategoryId = context.categoryIdsBySlug.get(desiredCategorySlug)
  if (desiredCategoryId && desiredCategoryId !== currentCategoryId) {
    assign('category', {...(currentReference || {}), _type: 'reference', _ref: desiredCategoryId})
  }
  if (policy) {
    assign('taxonomyKey', policy.key)
    if (policy.sport) assign('sport', policy.sport)
  }
  return {set, changes}
}

function sanitizeValue(value: unknown, field: string, changes: Change[]): unknown {
  if (typeof value === 'string') {
    const after = sanitizePublicText(value)
    if (after !== value) {
      const kinds = scanV9ClaimText(value).map((match) => match.kind)
      const uniqueKinds = kinds.length ? Array.from(new Set(kinds)) : ['GUARANTEE' as const]
      for (const kind of uniqueKinds) changes.push({field, kind, before: value, after, status: statusFor(kind)})
    }
    return after
  }
  if (Array.isArray(value)) return value.map((entry, index) => sanitizeValue(entry, `${field}[${index}]`, changes))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry, `${field}.${key}`, changes)]))
  }
  return value
}

function policyFor(documentId: string, change: Change, reviewedAt: string) {
  const conditional = change.status === 'CONDITIONAL'
  return {
    _key: claimId(documentId, change.field, change.kind).replace(/[^a-zA-Z0-9]/g, '').slice(-12),
    _type: 'claimPolicy',
    claimId: claimId(documentId, change.field, change.kind),
    sourceField: change.field,
    claim: change.before,
    status: change.status,
    ...(conditional ? {publicValue: change.after} : {replacement: change.after}),
    legacyValue: change.before,
    publicRule: conditional ? 'Publish only with the stated project dependencies.' : 'Do not publish the historical value without owner-approved evidence.',
    reviewedAt,
    reviewedBy: 'POXIOL V9.1 migration',
    internalNotes: 'Created from the V9.0 RED claim audit. Owner facts remain unconfirmed unless evidence is attached.',
  }
}

function procurementPatch(document: SnapshotDocument, reviewedAt: string): MigrationPatch {
  const old = (field: string) => typeof document[field] === 'string' ? document[field] as string : ''
  const policy = (claimIdValue: string, sourceField: string, status: string, replacement: string) => ({
    _type: 'claimPolicy', claimId: claimIdValue, sourceField, claim: old(sourceField), status,
    ...(status === 'VERIFIED' || status === 'CONDITIONAL' ? {publicValue: replacement} : {replacement}),
    legacyValue: old(sourceField), publicRule: 'Publish the replacement until owner-approved evidence supports a more specific value.',
    reviewedAt, reviewedBy: 'POXIOL V9.1 migration', internalNotes: 'Historical value preserved for internal review.',
  })
  const set: Record<string, unknown> = {
    defaultMOQ: ORDER_QUANTITY_CONFIRMED,
    sampleMOQ: ORDER_QUANTITY_CONFIRMED,
    sampleTime: SAMPLE_TIMING_CONFIRMED,
    sampleProductionTime: SAMPLE_TIMING_CONFIRMED,
    bulkProductionTime: TIMELINE_CONFIRMED,
    mockupTime: TIMELINE_CONFIRMED,
    shippingNotes: SHIPPING_TIMING_CONFIRMED,
    sizeTolerance: MEASUREMENT_TOLERANCE_REVIEW,
    qualityPromise: 'Manufacturing tolerance and return policy are reviewed separately.',
    returnPolicyStatus: 'POLICY_REVIEW_REQUIRED',
    quantityPolicy: policy('V9-CMS-MOQ', 'defaultMOQ', 'OWNER_CONFIRMATION_REQUIRED', ORDER_QUANTITY_CONFIRMED),
    sampleTimingPolicy: policy('V9-CMS-SAMPLE-TIMING', 'sampleProductionTime', 'OPERATIONAL_TARGET', SAMPLE_TIMING_CONFIRMED),
    productionTimingPolicy: policy('V9-CMS-PRODUCTION-TIMING', 'bulkProductionTime', 'OPERATIONAL_TARGET', TIMELINE_CONFIRMED),
    mockupTimingPolicy: policy('V9-CMS-MOCKUP-TIMING', 'mockupTime', 'OPERATIONAL_TARGET', TIMELINE_CONFIRMED),
    shippingTimingPolicy: policy('V9-CMS-SHIPPING-TIMING', 'shippingNotes', 'CONDITIONAL', SHIPPING_TIMING_CONFIRMED),
    measurementTolerancePolicy: policy('V9-CMS-MEASUREMENT-TOLERANCE', 'qualityPromise', 'OWNER_CONFIRMATION_REQUIRED', MEASUREMENT_TOLERANCE_REVIEW),
  }
  const changes = Object.entries(set).filter(([field, after]) => JSON.stringify(document[field]) !== JSON.stringify(after)).map(([field, after]) => ({
    field, kind: field === 'returnPolicyStatus' || field === 'qualityPromise' || field === 'measurementTolerancePolicy' ? 'TOLERANCE_RETURN_POLICY' as const : field.includes('quantity') || field.includes('MOQ') ? 'MOQ' as const : field.includes('sample') ? 'SAMPLE_TIMING' as const : field.includes('shipping') ? 'SHIPPING_TIMING' as const : field.includes('mockup') ? 'MOCKUP_TIMING' as const : 'PRODUCTION_TIMING' as const,
    before: document[field], after, status: 'MIGRATED',
  }))
  return {id: document._id, type: document._type, ifRevisionID: document._rev, set, unset: [], changes}
}

function genericPatch(document: SnapshotDocument, reviewedAt: string, context: MigrationContext): MigrationPatch | null {
  const fields = KNOWN_FIELDS[document._type]
  if (!fields) return null
  const set: Record<string, unknown> = {}
  const changes: Change[] = []
  for (const field of fields) {
    if (field === 'claimPolicies' || document[field] === undefined) continue
    const valueChanges: Change[] = []
    const after = sanitizeValue(document[field], field, valueChanges)
    if (JSON.stringify(after) !== JSON.stringify(document[field])) {
      set[field] = after
      changes.push(...valueChanges)
    }
  }

  const unset: string[] = []
  const projectChanges: MigrationPatch['changes'] = []
  if (document._type === 'caseStudy') {
    const verified = document.evidenceStatus === 'verified' && document.buyerAuthorizationStatus === 'publicApproved'
    if (!verified) {
      if (document.realOrExample !== 'SCENARIO') {
        set.realOrExample = 'SCENARIO'
        projectChanges.push({field: 'realOrExample', kind: 'PROJECT_CLASSIFICATION', before: document.realOrExample, after: 'SCENARIO', status: 'PLACEHOLDER'})
      }
      if (/customer success story|real project/i.test(String(document.projectTitle || document.title || ''))) {
        set.projectTitle = 'Example Project Scenario'
        projectChanges.push({field: 'projectTitle', kind: 'PROJECT_CLASSIFICATION', before: document.projectTitle, after: 'Example Project Scenario', status: 'PLACEHOLDER'})
      }
      if (document.quantityDisplay !== undefined) {
        unset.push('quantityDisplay')
        projectChanges.push({field: 'quantityDisplay', kind: 'PROJECT_CLASSIFICATION', before: document.quantityDisplay, after: undefined, status: 'UNVERIFIED'})
      }
    }
  }

  const taxonomy = taxonomyPatch(document, context)
  for (const [field, after] of Object.entries(taxonomy.set)) set[field] = after

  if (changes.length) {
    const existing = Array.isArray(document.claimPolicies) ? document.claimPolicies : []
    const generated = changes.map((change) => policyFor(document._id, change, reviewedAt))
    const byId = new Map([...existing, ...generated].filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object')).map((item) => [String(item.claimId || item._key), item]))
    set.claimPolicies = Array.from(byId.values())
  }
  if (!Object.keys(set).length && !unset.length) return null
  return {id: document._id, type: document._type, ifRevisionID: document._rev, set, unset, changes: [...changes, ...projectChanges, ...taxonomy.changes]}
}

export function buildMigrationPlan(documents: SnapshotDocument[], generatedAt = new Date().toISOString()): MigrationPlan {
  const categories = documents.filter((document) => document._type === 'productCategory')
  const context: MigrationContext = {
    categoriesById: new Map(categories.map((document) => [document._id, document])),
    categoryIdsBySlug: new Map(categories.flatMap((document) => {
      const slug = slugCurrent(document)
      return slug ? [[slug, document._id] as const] : []
    })),
  }
  const patches = documents.map((document) => document._type === 'procurementStandards' ? procurementPatch(document, generatedAt) : genericPatch(document, generatedAt, context)).filter(Boolean) as MigrationPatch[]
  return {version: 'POXIOL_V9_1', generatedAt, projectId: PROJECT_ID, dataset: DATASET, deleteCount: 0, patches}
}

export function mutationPayloadFor(patch: MigrationPatch) {
  return {
    patch: {
      id: patch.id,
      ifRevisionID: patch.ifRevisionID,
      set: patch.set,
      ...(patch.unset.length ? {unset: patch.unset} : {}),
    },
  }
}

function projectSnapshotDocument(document: SnapshotDocument): SnapshotDocument {
  const fields = KNOWN_FIELDS[document._type] || []
  return Object.fromEntries([
    ['_id', document._id], ['_type', document._type], ['_rev', document._rev], ['_updatedAt', document._updatedAt],
    ...fields.filter((field) => document[field] !== undefined).map((field) => [field, document[field]]),
  ]) as SnapshotDocument
}

export function sanityQueryUrlFor(query: string, params: Record<string, unknown> = {}, token?: string): string {
  const host = token ? `${PROJECT_ID}.api.sanity.io` : `${PROJECT_ID}.apicdn.sanity.io`
  const url = new URL(`https://${host}/v${API_VERSION}/data/query/${DATASET}`)
  url.searchParams.set('query', query)
  url.searchParams.set('perspective', 'published')
  url.searchParams.set('returnQuery', 'false')
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value))
  return url.toString()
}

async function querySanity(query: string, token?: string, params: Record<string, unknown> = {}): Promise<SnapshotDocument[]> {
  const url = sanityQueryUrlFor(query, params, token)
  const response = await fetch(url, {headers: {Accept: 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {})}})
  if (!response.ok) throw new Error(`Sanity query failed with HTTP ${response.status}`)
  const payload = await response.json() as {result?: SnapshotDocument[]}
  return payload.result || []
}

async function snapshot(): Promise<SnapshotDocument[]> {
  const types = Object.keys(KNOWN_FIELDS).map((type) => JSON.stringify(type)).join(',')
  const documents = await querySanity(`*[_type in [${types}]]`)
  return documents.map(projectSnapshotDocument).sort((left, right) => left._id.localeCompare(right._id))
}

function readNdjson(path: string): SnapshotDocument[] {
  return readFileSync(path, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as SnapshotDocument)
}

function writeText(path: string, content: string) {
  mkdirSync(dirname(resolve(path)), {recursive: true})
  writeFileSync(path, content, 'utf8')
}

function arg(name: string, fallback?: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : fallback
}

async function applyPlan(plan: MigrationPlan) {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) throw new Error('SANITY_WRITE_TOKEN is required for apply mode. No mutation was sent.')
  if (plan.deleteCount !== 0) throw new Error('Migration plan contains deletes and is blocked.')
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?returnIds=true&visibility=sync`
  const response = await fetch(url, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({mutations: plan.patches.map(mutationPayloadFor)}),
  })
  if (!response.ok) throw new Error(`Sanity mutation failed with HTTP ${response.status}: ${await response.text()}`)
  return response.json()
}

export function materializeExpectedAfter(plan: MigrationPlan, documents: SnapshotDocument[]) {
  const byId = new Map(documents.map((document) => [document._id, structuredClone(document)]))
  for (const patch of plan.patches) {
    const document = byId.get(patch.id)
    if (!document) continue
    Object.assign(document, patch.set)
    for (const field of patch.unset) delete document[field]
  }
  return Array.from(byId.values())
}

async function main() {
  const mode = arg('--mode')
  if (mode === 'snapshot') {
    const output = arg('--output', 'docs/v9-1/sanity-before.ndjson') as string
    const documents = await snapshot()
    writeText(output, `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`)
    console.log(JSON.stringify({mode, output, documents: documents.length}))
    return
  }
  if (mode === 'plan') {
    const input = arg('--input', 'docs/v9-1/sanity-before.ndjson') as string
    const output = arg('--output', 'docs/v9-1/sanity-migration-plan.json') as string
    const plan = buildMigrationPlan(readNdjson(input))
    writeText(output, `${JSON.stringify(plan, null, 2)}\n`)
    console.log(JSON.stringify({mode, output, patches: plan.patches.length, deletes: plan.deleteCount, changes: plan.patches.reduce((sum, patch) => sum + patch.changes.length, 0)}))
    return
  }
  if (mode === 'apply') {
    const input = arg('--input', 'docs/v9-1/sanity-migration-plan.json') as string
    const plan = JSON.parse(readFileSync(input, 'utf8')) as MigrationPlan
    const result = await applyPlan(plan)
    console.log(JSON.stringify({mode, patches: plan.patches.length, result}))
    return
  }
  if (mode === 'verify') {
    const input = arg('--input', 'docs/v9-1/sanity-migration-plan.json') as string
    const beforePath = arg('--before', 'docs/v9-1/sanity-before.ndjson') as string
    const afterPath = arg('--after', 'docs/v9-1/sanity-after.ndjson') as string
    const diffPath = arg('--diff', 'docs/v9-1/sanity-migration-diff.json') as string
    const plan = JSON.parse(readFileSync(input, 'utf8')) as MigrationPlan
    const ids = plan.patches.map((patch) => patch.id)
    const after = (await querySanity(`*[_id in $ids]`, process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN, {ids})).map(projectSnapshotDocument).sort((left, right) => left._id.localeCompare(right._id))
    const expected = materializeExpectedAfter(plan, readNdjson(beforePath))
    const diffs = plan.patches.flatMap((patch) => patch.changes.map((change) => ({documentId: patch.id, ...change})))
    const mismatches = plan.patches.flatMap((patch) => {
      const actual = after.find((document) => document._id === patch.id)
      const wanted = expected.find((document) => document._id === patch.id)
      if (!actual || !wanted) return [{documentId: patch.id, reason: 'document-missing'}]
      return [...Object.keys(patch.set), ...patch.unset].filter((field) => JSON.stringify(actual[field]) !== JSON.stringify(wanted[field])).map((field) => ({documentId: patch.id, field, expected: wanted[field], actual: actual[field]}))
    })
    writeText(afterPath, `${after.map((document) => JSON.stringify(document)).join('\n')}\n`)
    writeText(diffPath, `${JSON.stringify({verifiedAt: new Date().toISOString(), diffs, mismatches}, null, 2)}\n`)
    console.log(JSON.stringify({mode, documents: after.length, diffs: diffs.length, mismatches: mismatches.length}))
    if (mismatches.length) process.exitCode = 1
    return
  }
  throw new Error('Usage: --mode snapshot|plan|apply|verify')
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
