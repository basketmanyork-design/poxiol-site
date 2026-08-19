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
import {
  OWNER_DECISIONS,
  ownerPolicyIdForLegacyKind,
  projectPublicationDecision,
  type OwnerClaimPolicyId,
  type ProjectAuthenticityClass,
} from '../lib/truth/owner-decisions.ts'
import {CATEGORY_PUBLICATION_DECISIONS, categoryPublicationGate, type ProductCategoryState} from '../lib/site-taxonomy.ts'
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
  documentId: string
  documentType: string
  revision: string
  set: Record<string, unknown>
  unset: string[]
  changes: MigrationChange[]
}

export type MigrationChange = {
  fieldPath: string
  kind: V9ClaimKind | 'PROJECT_CLASSIFICATION' | 'TAXONOMY'
  before: unknown
  proposedAfter: unknown
  claimPolicy: string
  reason: string
  riskClassification: string
  truthStatus: string
  result: 'PLANNED'
}

export type MigrationPlan = {
  version: 'POXIOL_V9_1A'
  generatedAt: string
  projectId: string
  dataset: string
  snapshot: {projectId: string; dataset: string; capturedAt: string; documentCount: number}
  affectedDocumentIds: string[]
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
  productCategory: ['categoryName', 'shortName', 'slug', 'heroTitle', 'heroDescription', 'introduction', 'heroProofPoints', 'decisionSections', 'buyerTypes', 'targetMarkets', 'productTypes', 'keyFeatures', 'coreBenefits', 'navigationVisibility', 'homepageVisibility', 'showOnHomepage', 'activeStatus', 'publicationState', 'taxonomyGroup', 'taxonomyKey', 'displayOrder', 'publishStatus', 'seo', 'claimPolicies'],
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

function ownerDecisionFor(kind: string) {
  const policyId = ownerPolicyIdForLegacyKind(kind)
  return {policyId, decision: OWNER_DECISIONS[policyId as OwnerClaimPolicyId]}
}

function migrationChange(
  fieldPath: string,
  kind: MigrationChange['kind'],
  before: unknown,
  proposedAfter: unknown,
  truthStatus: string,
  reason?: string,
  riskClassification?: string,
): MigrationChange {
  const {policyId, decision} = ownerDecisionFor(kind)
  return {
    fieldPath,
    kind,
    before: before === undefined ? null : before,
    proposedAfter: proposedAfter === undefined ? null : proposedAfter,
    claimPolicy: policyId,
    reason: reason || decision?.reason || 'Replace an unverified legacy public value with the governed V9.1A value.',
    riskClassification: riskClassification || decision?.riskClassification || `LEGACY_${kind}`,
    truthStatus,
    result: 'PLANNED',
  }
}

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
  publicationState: ProductCategoryState
}>> = {
  'basketball-uniforms': {group: 'SPORTS', key: 'basketball', sport: 'Basketball', navigation: true, homepage: true, active: true, publicationState: 'ACTIVE_VERIFIED'},
  'soccer-jerseys': {group: 'SPORTS', key: 'soccer', sport: 'Soccer', navigation: true, homepage: true, active: true, publicationState: 'ACTIVE_VERIFIED'},
  'soccer-kits': {group: 'SPORTS', key: 'soccer-legacy-duplicate', sport: 'Soccer', navigation: false, homepage: false, active: false, publicationState: 'DISABLED'},
  'training-wear': {group: 'TEAMWEAR', key: 'training-wear', navigation: true, homepage: true, active: true, publicationState: 'ACTIVE_VERIFIED'},
  'hoodies-jackets': {group: 'TEAMWEAR', key: 'hoodies-jackets', navigation: true, homepage: true, active: true, publicationState: 'ACTIVE_VERIFIED'},
  'team-accessories': {group: 'TEAMWEAR', key: 'team-accessories', navigation: false, homepage: false, active: true, publicationState: 'MANUFACTURABLE_NOT_PROVEN'},
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
    changes.push(migrationChange(field, 'TAXONOMY', document[field], after, 'OWNER_CONFIRMED_CLASSIFICATION', 'Align the CMS field with the approved category and canonical ownership registry.', 'TAXONOMY_GOVERNANCE'))
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
    assign('publicationState', policy.publicationState)
    if (slug === 'soccer-kits') {
      const currentSeo = document.seo && typeof document.seo === 'object' ? document.seo as Record<string, unknown> : {}
      assign('seo', {...currentSeo, canonicalUrl: 'https://www.poxiol.com/products/soccer-jerseys/', indexStatus: 'noindex'})
    } else if (policy.publicationState !== 'ACTIVE_VERIFIED') {
      const currentSeo = document.seo && typeof document.seo === 'object' ? document.seo as Record<string, unknown> : {}
      const gate = categoryPublicationGate(policy.publicationState)
      if (gate.noindex) assign('seo', {...currentSeo, indexStatus: 'noindex'})
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
  const {policyId, decision} = ownerDecisionFor(change.kind)
  return {
    _key: claimId(documentId, change.field, change.kind).replace(/[^a-zA-Z0-9]/g, '').slice(-12),
    _type: 'claimPolicy',
    claimId: claimId(documentId, change.field, change.kind),
    ownerDecisionId: policyId,
    ...(decision ? {ownerDecisionStatus: decision.decisionStatus} : {}),
    sourceField: change.field,
    claim: change.before,
    status: change.status,
    ...(conditional ? {publicValue: change.after} : {replacement: change.after}),
    legacyValue: change.before,
    publicRule: decision?.publicRule || (conditional ? 'Publish only with the stated project dependencies.' : 'Do not publish the historical value without owner-approved evidence.'),
    reviewedAt,
    reviewedBy: 'POXIOL V9.1A migration',
    internalNotes: 'Created from legacy claim discovery and bound to a stable V9.1A policy ID. Evidence gates still apply.',
  }
}

function procurementPatch(document: SnapshotDocument, reviewedAt: string): MigrationPatch {
  const old = (field: string) => typeof document[field] === 'string' ? document[field] as string : ''
  const policy = (claimIdValue: OwnerClaimPolicyId, sourceField: string, status: string, replacement: string) => ({
    _type: 'claimPolicy', claimId: claimIdValue, ownerDecisionId: claimIdValue,
    ownerDecisionStatus: OWNER_DECISIONS[claimIdValue].decisionStatus,
    sourceField, claim: old(sourceField), status,
    ...(status === 'VERIFIED' || status === 'CONDITIONAL' ? {publicValue: replacement} : {replacement}),
    legacyValue: old(sourceField), publicRule: OWNER_DECISIONS[claimIdValue].publicRule,
    reviewedAt, reviewedBy: 'POXIOL V9.1A migration', internalNotes: 'Historical value preserved for internal review. Stable owner decision attached.',
  })
  const set: Record<string, unknown> = {
    defaultMOQ: ORDER_QUANTITY_CONFIRMED,
    sampleMOQ: ORDER_QUANTITY_CONFIRMED,
    sampleTime: TIMELINE_CONFIRMED,
    sampleProductionTime: TIMELINE_CONFIRMED,
    bulkProductionTime: TIMELINE_CONFIRMED,
    mockupTime: TIMELINE_CONFIRMED,
    shippingNotes: SHIPPING_TIMING_CONFIRMED,
    sizeTolerance: MEASUREMENT_TOLERANCE_REVIEW,
    qualityPromise: 'Manufacturing tolerance and return policy are reviewed separately.',
    returnPolicyStatus: 'POLICY_REVIEW_REQUIRED',
    quantityPolicy: policy('CLAIM_MOQ', 'defaultMOQ', 'CONDITIONAL', ORDER_QUANTITY_CONFIRMED),
    sampleTimingPolicy: policy('CLAIM_TIMELINE', 'sampleProductionTime', 'OPERATIONAL_TARGET', TIMELINE_CONFIRMED),
    productionTimingPolicy: policy('CLAIM_TIMELINE', 'bulkProductionTime', 'OPERATIONAL_TARGET', TIMELINE_CONFIRMED),
    mockupTimingPolicy: policy('CLAIM_TIMELINE', 'mockupTime', 'OPERATIONAL_TARGET', TIMELINE_CONFIRMED),
    shippingTimingPolicy: policy('CLAIM_SHIPPING', 'shippingNotes', 'CONDITIONAL', SHIPPING_TIMING_CONFIRMED),
    measurementTolerancePolicy: policy('CLAIM_SIZE_TOLERANCE', 'qualityPromise', 'CONDITIONAL', MEASUREMENT_TOLERANCE_REVIEW),
  }
  const changes = Object.entries(set).filter(([field, after]) => JSON.stringify(document[field]) !== JSON.stringify(after)).map(([field, after]) => {
    const kind = field === 'returnPolicyStatus' || field === 'qualityPromise' || field === 'measurementTolerancePolicy' || field === 'sizeTolerance'
      ? 'TOLERANCE_RETURN_POLICY' as const
      : field.includes('quantity') || field.includes('MOQ') ? 'MOQ' as const
        : field.includes('shipping') ? 'SHIPPING_TIMING' as const
          : field.includes('mockup') || field.includes('sample') || field.includes('production') || field.includes('bulk') ? 'PRODUCTION_TIMING' as const
            : 'PRODUCTION_TIMING' as const
    const decision = ownerDecisionFor(kind).decision
    return migrationChange(field, kind, document[field], after, decision?.truthStatus || 'CONDITIONAL')
  })
  return {documentId: document._id, documentType: document._type, revision: document._rev, set, unset: [], changes}
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
    const currentClass = typeof document.realOrExample === 'string' ? document.realOrExample : ''
    const approvedClass = (['VERIFIED_REAL_PROJECT', 'BUYER_AUTHORIZED_PROJECT', 'INTERNAL_SAMPLE', 'DEMO', 'SCENARIO', 'UNVERIFIED'] as const).includes(currentClass as ProjectAuthenticityClass)
      ? currentClass as ProjectAuthenticityClass
      : document.evidenceStatus === 'verified' && document.buyerAuthorizationStatus === 'publicApproved'
        ? 'BUYER_AUTHORIZED_PROJECT'
        : /sample/i.test(currentClass) ? 'INTERNAL_SAMPLE'
          : /demo/i.test(currentClass) ? 'DEMO'
            : /example|scenario/i.test(currentClass) || document.evidenceStatus === 'example' ? 'SCENARIO'
              : 'UNVERIFIED'
    if (document.realOrExample !== approvedClass) {
      set.realOrExample = approvedClass
      projectChanges.push(migrationChange('realOrExample', 'PROJECT_CLASSIFICATION', document.realOrExample, approvedClass, approvedClass === 'UNVERIFIED' ? 'UNVERIFIED' : 'CONDITIONAL'))
    }
    const publication = projectPublicationDecision(approvedClass, document.buyerAuthorizationStatus === 'publicApproved')
    if (publication.requiredLabel && String(document.projectTitle || document.title || '') !== publication.requiredLabel) {
      set.projectTitle = publication.requiredLabel
      projectChanges.push(migrationChange('projectTitle', 'PROJECT_CLASSIFICATION', document.projectTitle, publication.requiredLabel, approvedClass === 'SCENARIO' ? 'PLACEHOLDER' : 'CONDITIONAL'))
    }
    if (!publication.public && document.publishStatus !== 'draft') {
      set.publishStatus = 'draft'
      projectChanges.push(migrationChange('publishStatus', 'PROJECT_CLASSIFICATION', document.publishStatus, 'draft', 'UNVERIFIED', 'Prevent an unverified project from being published as evidence.', 'PROJECT_AUTHENTICITY'))
    }
    if ((approvedClass === 'SCENARIO' || approvedClass === 'UNVERIFIED') && document.quantityDisplay !== undefined) {
      unset.push('quantityDisplay')
      projectChanges.push(migrationChange('quantityDisplay', 'PROJECT_CLASSIFICATION', document.quantityDisplay, undefined, 'UNVERIFIED'))
    }
  }

  const taxonomy = taxonomyPatch(document, context)
  for (const [field, after] of Object.entries(taxonomy.set)) {
    if (field === 'seo' && set.seo && typeof set.seo === 'object' && after && typeof after === 'object') {
      const taxonomySeo = after as Record<string, unknown>
      set.seo = {
        ...taxonomySeo,
        ...(set.seo as Record<string, unknown>),
        ...(taxonomySeo.canonicalUrl !== undefined ? {canonicalUrl: taxonomySeo.canonicalUrl} : {}),
        ...(taxonomySeo.indexStatus !== undefined ? {indexStatus: taxonomySeo.indexStatus} : {}),
      }
    } else set[field] = after
  }

  if (changes.length) {
    const existing = Array.isArray(document.claimPolicies) ? document.claimPolicies : []
    const generated = changes.map((change) => policyFor(document._id, change, reviewedAt))
    const byId = new Map([...existing, ...generated].filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object')).map((item) => [String(item.claimId || item._key), item]))
    set.claimPolicies = Array.from(byId.values())
  }
  if (!Object.keys(set).length && !unset.length) return null
  return {
    documentId: document._id,
    documentType: document._type,
    revision: document._rev,
    set,
    unset,
    changes: [
      ...changes.map((change) => migrationChange(change.field, change.kind, change.before, change.after, change.status)),
      ...projectChanges,
      ...taxonomy.changes,
    ],
  }
}

export function buildMigrationPlan(documents: SnapshotDocument[], generatedAt = new Date().toISOString(), snapshotCapturedAt = generatedAt): MigrationPlan {
  const categories = documents.filter((document) => document._type === 'productCategory')
  const context: MigrationContext = {
    categoriesById: new Map(categories.map((document) => [document._id, document])),
    categoryIdsBySlug: new Map(categories.flatMap((document) => {
      const slug = slugCurrent(document)
      return slug ? [[slug, document._id] as const] : []
    })),
  }
  const patches = documents.map((document) => document._type === 'procurementStandards' ? procurementPatch(document, generatedAt) : genericPatch(document, generatedAt, context)).filter(Boolean) as MigrationPatch[]
  return {
    version: 'POXIOL_V9_1A',
    generatedAt,
    projectId: PROJECT_ID,
    dataset: DATASET,
    snapshot: {projectId: PROJECT_ID, dataset: DATASET, capturedAt: snapshotCapturedAt, documentCount: documents.length},
    affectedDocumentIds: patches.map((patch) => patch.documentId),
    deleteCount: 0,
    patches,
  }
}

export function mutationPayloadFor(patch: MigrationPatch) {
  return {
    patch: {
      id: patch.documentId,
      ifRevisionID: patch.revision,
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

export function classifyMutationHttpResult(status: number): 'APPLIED' | 'REVISION_CONFLICT' | 'FAILED' {
  if (status >= 200 && status < 300) return 'APPLIED'
  if (status === 409) return 'REVISION_CONFLICT'
  return 'FAILED'
}

type ApplyResult = {
  documentId: string
  documentType: string
  revision: string
  result: 'APPLIED' | 'SKIPPED' | 'REVISION_CONFLICT' | 'FAILED' | 'NO_CHANGE'
  detail?: string
}

async function applyPlan(plan: MigrationPlan): Promise<ApplyResult[]> {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) throw new Error('SANITY_WRITE_TOKEN is required for apply mode. No mutation was sent.')
  if (plan.deleteCount !== 0) throw new Error('Migration plan contains deletes and is blocked.')
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}?returnIds=true&visibility=sync`
  const results: ApplyResult[] = []
  for (const patch of plan.patches) {
    if (!Object.keys(patch.set).length && !patch.unset.length) {
      results.push({documentId: patch.documentId, documentType: patch.documentType, revision: patch.revision, result: 'NO_CHANGE'})
      continue
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({mutations: [mutationPayloadFor(patch)]}),
      })
      const result = classifyMutationHttpResult(response.status)
      const detail = response.ok ? undefined : (await response.text()).slice(0, 1000)
      results.push({documentId: patch.documentId, documentType: patch.documentType, revision: patch.revision, result, ...(detail ? {detail} : {})})
    } catch (error) {
      results.push({
        documentId: patch.documentId,
        documentType: patch.documentType,
        revision: patch.revision,
        result: 'FAILED',
        detail: error instanceof Error ? error.message : String(error),
      })
    }
  }
  return results
}

export function materializeExpectedAfter(plan: MigrationPlan, documents: SnapshotDocument[]) {
  const byId = new Map(documents.map((document) => [document._id, structuredClone(document)]))
  for (const patch of plan.patches) {
    const document = byId.get(patch.documentId)
    if (!document) continue
    Object.assign(document, patch.set)
    for (const field of patch.unset) delete document[field]
  }
  return Array.from(byId.values())
}

async function main() {
  const mode = arg('--mode')
  if (mode === 'snapshot') {
    const output = arg('--output', 'docs/v9-1a/sanity-before.ndjson') as string
    const manifestOutput = arg('--manifest', 'docs/v9-1a/sanity-before-manifest.json') as string
    const capturedAt = new Date().toISOString()
    const documents = await snapshot()
    const previewPlan = buildMigrationPlan(documents, capturedAt, capturedAt)
    writeText(output, `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`)
    writeText(manifestOutput, `${JSON.stringify({projectId: PROJECT_ID, dataset: DATASET, capturedAt, documentCount: documents.length, affectedDocumentIds: previewPlan.affectedDocumentIds}, null, 2)}\n`)
    console.log(JSON.stringify({mode, output, manifestOutput, projectId: PROJECT_ID, dataset: DATASET, capturedAt, documents: documents.length, affectedDocuments: previewPlan.affectedDocumentIds.length}))
    return
  }
  if (mode === 'plan') {
    const input = arg('--input', 'docs/v9-1a/sanity-before.ndjson') as string
    const output = arg('--output', 'docs/v9-1a/sanity-migration-plan.json') as string
    const capturedAt = arg('--snapshot-captured-at') || new Date().toISOString()
    const plan = buildMigrationPlan(readNdjson(input), new Date().toISOString(), capturedAt)
    writeText(output, `${JSON.stringify(plan, null, 2)}\n`)
    console.log(JSON.stringify({mode, output, patches: plan.patches.length, deletes: plan.deleteCount, changes: plan.patches.reduce((sum, patch) => sum + patch.changes.length, 0)}))
    return
  }
  if (mode === 'apply') {
    const input = arg('--input', 'docs/v9-1a/sanity-migration-plan.json') as string
    const resultPath = arg('--result', 'docs/v9-1a/sanity-failed-skipped.json') as string
    const plan = JSON.parse(readFileSync(input, 'utf8')) as MigrationPlan
    const results = await applyPlan(plan)
    const counts = Object.fromEntries(['APPLIED', 'SKIPPED', 'REVISION_CONFLICT', 'FAILED', 'NO_CHANGE'].map((status) => [status, results.filter((result) => result.result === status).length]))
    writeText(resultPath, `${JSON.stringify({projectId: PROJECT_ID, dataset: DATASET, appliedAt: new Date().toISOString(), counts, results}, null, 2)}\n`)
    console.log(JSON.stringify({mode, patches: plan.patches.length, resultPath, counts}))
    if (counts.FAILED) process.exitCode = 1
    return
  }
  if (mode === 'verify') {
    const input = arg('--input', 'docs/v9-1a/sanity-migration-plan.json') as string
    const beforePath = arg('--before', 'docs/v9-1a/sanity-before.ndjson') as string
    const afterPath = arg('--after', 'docs/v9-1a/sanity-after.ndjson') as string
    const diffPath = arg('--diff', 'docs/v9-1a/sanity-applied-diff.json') as string
    const plan = JSON.parse(readFileSync(input, 'utf8')) as MigrationPlan
    const ids = plan.patches.map((patch) => patch.documentId)
    const after = (await querySanity(`*[_id in $ids]`, process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN, {ids})).map(projectSnapshotDocument).sort((left, right) => left._id.localeCompare(right._id))
    const expected = materializeExpectedAfter(plan, readNdjson(beforePath))
    const diffs = plan.patches.flatMap((patch) => patch.changes.map((change) => ({documentId: patch.documentId, documentType: patch.documentType, revision: patch.revision, field: change.fieldPath, before: change.before, after: change.proposedAfter, policy: change.claimPolicy, result: 'APPLIED'})))
    const mismatches = plan.patches.flatMap((patch) => {
      const actual = after.find((document) => document._id === patch.documentId)
      const wanted = expected.find((document) => document._id === patch.documentId)
      if (!actual || !wanted) return [{documentId: patch.documentId, reason: 'document-missing'}]
      return [...Object.keys(patch.set), ...patch.unset].filter((field) => JSON.stringify(actual[field]) !== JSON.stringify(wanted[field])).map((field) => ({documentId: patch.documentId, field, expected: wanted[field], actual: actual[field]}))
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
