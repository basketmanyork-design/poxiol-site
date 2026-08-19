import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {
  buildMigrationPlan,
  materializeExpectedAfter,
  mutationPayloadFor,
  sanityQueryUrlFor,
  sanitizePublicText,
  type SnapshotDocument,
} from './v9-sanity-truth-migration.mts'
import {scanV9ClaimText} from './scan-v9-red-claims.mts'

assert.equal(sanitizePublicText('MOQ 1 Set'), 'MOQ confirmed by product and project requirements.')
assert.equal(
  sanitizePublicText('Sample production usually takes 2-3 working days after mockup approval.'),
  'Sample timing confirmed based on design and production requirements.',
)
assert.equal(
  sanitizePublicText('Bulk production usually takes 7-12 working days after sample approval.'),
  'Timeline confirmed after artwork, quantity and production requirements are reviewed.',
)
assert.equal(sanitizePublicText('Factory-direct manufacturer'), 'Custom teamwear manufacturing partner')
assert.equal(
  sanitizePublicText('POXIOL provides factory-direct custom teamwear manufacturing.'),
  'POXIOL provides custom teamwear manufacturing support.',
)
assert.equal(
  sanitizePublicText('MOQ 1 Set, Free 3D Mockup included.'),
  'MOQ confirmed by product and project requirements, Free 3D Mockup included.',
)
const timeline = sanitizePublicText('Sample Production (2-3 Days After Mockup Confirmation) → Bulk production usually takes 7-12 working days after artwork approval.')
assert.match(timeline, /Sample timing confirmed based on design and production requirements/)
assert.match(timeline, /Timeline confirmed after artwork, quantity and production requirements are reviewed/)
assert.equal(sanitizePublicText('Unlimited Teamwear Customization'), 'Broad Teamwear Customization')
assert.equal(sanitizePublicText('100% Polyester'), 'Polyester')
assert.equal(sanitizePublicText('Direct Manufacturer'), 'Custom Teamwear Manufacturer')
assert.equal(
  sanitizePublicText('2–3 working days after mockup approval'),
  'Sample timing confirmed based on design and production requirements.',
)
assert.equal(
  sanitizePublicText('7–12 working days after sample or artwork approval'),
  'Timeline confirmed after artwork, quantity and production requirements are reviewed.',
)
assert.equal(
  sanitizePublicText('Visit the POXIOL teamwear factory. 15+ years experience, 30,000+ monthly capacity.'),
  'Review the POXIOL teamwear manufacturing workflow. Company history and production planning require owner-approved evidence.',
)
assert.equal(
  sanitizePublicText('Factory-direct custom basketball uniform manufacturer, custom soccer kit supplier and OEM sportswear factory.'),
  'Custom basketball uniform manufacturing partner, custom soccer kit supplier and OEM sportswear manufacturing support.',
)
assert.equal(
  sanitizePublicText('Learn how POXIOL coordinates factory-direct custom teamwear design review.'),
  'Learn how POXIOL coordinates custom teamwear design review.',
)

const fixture: SnapshotDocument[] = [
  {
    _id: 'procurementStandards',
    _type: 'procurementStandards',
    _rev: 'rev-procurement-1',
    defaultMOQ: '1 Set',
    sampleMOQ: 'MOQ 1 set for sample development.',
    sampleProductionTime: 'Sample production usually takes 2-3 working days after mockup approval.',
    bulkProductionTime: 'Bulk production usually takes 7-12 working days after sample approval.',
    mockupTime: 'Free mockup usually within 2 hours after receiving complete project requirements.',
    shippingNotes: 'Express delivery usually takes 3-7 business days.',
    sizeTolerance: 'Normal tolerance: ±2 cm.',
    qualityPromise: '+/- 2cm Tolerance, Not A Reason For Returns',
    unknownField: 'must survive untouched',
  },
  {
    _id: 'faq-1',
    _type: 'faqItem',
    _rev: 'rev-faq-1',
    question: 'Does POXIOL support MOQ 1 set?',
    shortAnswer: 'Yes. Sample production is 2-3 days.',
    unknownField: 'must survive untouched',
  },
  {
    _id: 'case-1',
    _type: 'caseStudy',
    _rev: 'rev-case-1',
    projectTitle: 'Customer Success Story',
    realOrExample: 'real',
    evidenceStatus: 'example',
    buyerAuthorizationStatus: 'unknown',
    quantityDisplay: '3,000 pieces',
  },
  {
    _id: 'cat-soccer-primary',
    _type: 'productCategory',
    _rev: 'rev-cat-primary',
    categoryName: 'Soccer Jerseys',
    slug: {current: 'soccer-jerseys'},
    seo: {seoTitle: 'Soccer Jerseys'},
  },
  {
    _id: 'cat-soccer-duplicate',
    _type: 'productCategory',
    _rev: 'rev-cat-duplicate',
    categoryName: 'Soccer Kits',
    slug: {current: 'soccer-kits'},
    seo: {seoTitle: 'Soccer Kits'},
  },
  {
    _id: 'product-soccer-fixture',
    _type: 'product',
    _rev: 'rev-product-soccer',
    productName: 'Custom Soccer Match Kit',
    slug: {current: 'custom-soccer-match-kit'},
    category: {_type: 'reference', _ref: 'cat-soccer-duplicate'},
  },
]

const plan = buildMigrationPlan(fixture, '2026-08-17T00:00:00.000Z')
assert.equal(plan.deleteCount, 0)
assert.equal(plan.patches.length, 6)

assert.equal(plan.version, 'POXIOL_V9_1A')
const procurement = plan.patches.find((patch) => patch.documentId === 'procurementStandards')
assert.ok(procurement)
assert.equal(procurement.revision, 'rev-procurement-1')
assert.equal(procurement.set.defaultMOQ, 'MOQ confirmed by product and project requirements.')
assert.equal((procurement.set.quantityPolicy as {legacyValue: string}).legacyValue, '1 Set')
assert.equal((procurement.set.quantityPolicy as {publicValue: string}).publicValue, 'MOQ confirmed by product and project requirements.')
assert.equal((procurement.set.quantityPolicy as {ownerDecisionId: string}).ownerDecisionId, 'CLAIM_MOQ')
assert.equal(
  (procurement.set.shippingTimingPolicy as {publicValue: string}).publicValue,
  'Shipping options and transit time are confirmed based on destination, shipping method and order requirements.',
)
assert.equal(procurement.set.returnPolicyStatus, 'POLICY_REVIEW_REQUIRED')
assert.equal('unknownField' in procurement.set, false)

const faq = plan.patches.find((patch) => patch.documentId === 'faq-1')
assert.ok(faq)
assert.match(String(faq.set.question), /order quantity confirmed/i)
assert.match(String(faq.set.shortAnswer), /Sample timing confirmed/i)
assert.equal(Array.isArray(faq.set.claimPolicies), true)

const project = plan.patches.find((patch) => patch.documentId === 'case-1')
assert.ok(project)
assert.equal(project.set.realOrExample, 'SCENARIO')
assert.equal(project.set.projectTitle, 'Example Project Scenario')
assert.equal(project.set.quantityDisplay, undefined)

const primarySoccer = plan.patches.find((patch) => patch.documentId === 'cat-soccer-primary')
assert.ok(primarySoccer)
assert.equal(primarySoccer.set.taxonomyGroup, 'SPORTS')
assert.equal(primarySoccer.set.taxonomyKey, 'soccer')
assert.equal(primarySoccer.set.navigationVisibility, true)
assert.equal(primarySoccer.set.publicationState, 'ACTIVE_VERIFIED')

const duplicateSoccer = plan.patches.find((patch) => patch.documentId === 'cat-soccer-duplicate')
assert.ok(duplicateSoccer)
assert.equal(duplicateSoccer.set.activeStatus, false)
assert.equal((duplicateSoccer.set.seo as {indexStatus: string}).indexStatus, 'noindex')
assert.equal((duplicateSoccer.set.seo as {canonicalUrl: string}).canonicalUrl, 'https://www.poxiol.com/products/soccer-jerseys/')
assert.equal(duplicateSoccer.set.publicationState, 'DISABLED')

const soccerProduct = plan.patches.find((patch) => patch.documentId === 'product-soccer-fixture')
assert.ok(soccerProduct)
assert.equal((soccerProduct.set.category as {_ref: string})._ref, 'cat-soccer-primary')
assert.equal(soccerProduct.set.taxonomyKey, 'soccer')

const payload = mutationPayloadFor(procurement)
assert.deepEqual(Object.keys(payload), ['patch'])
assert.equal(payload.patch.id, 'procurementStandards')
assert.equal(payload.patch.ifRevisionID, 'rev-procurement-1')
assert.equal('delete' in payload, false)

assert.equal(materializeExpectedAfter(plan, fixture).find((document) => document._id === 'procurementStandards')?.defaultMOQ, 'MOQ confirmed by product and project requirements.')
const queryUrl = new URL(sanityQueryUrlFor('*[_id in $ids]', {ids: ['faq-1', 'case-1']}))
assert.equal(queryUrl.searchParams.get('$ids'), '["faq-1","case-1"]')

const realSnapshot = readFileSync('docs/v9-1a/sanity-before.ndjson', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line) as SnapshotDocument)
const realPlan = buildMigrationPlan(realSnapshot, '2026-08-17T00:00:00.000Z')
const internalOnlyKeys = new Set(['claimPolicies', 'claim', 'legacyValue', 'internalNotes'])
function publicFields(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(publicFields)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !internalOnlyKeys.has(key))
    .map(([key, entry]) => [key, publicFields(entry)]))
}
const plannedPublicAfter = publicFields(materializeExpectedAfter(realPlan, realSnapshot))
const residuals: Array<{path: string; value: string}> = []
function collectResiduals(value: unknown, path = '$') {
  if (typeof value === 'string') {
    if (/\b(?:check|evaluat(?:e|ing)|framework\s+for\s+evaluating)\b[^.\n]{0,120}\bcapacity\b/i.test(value)) return
    if (scanV9ClaimText(value).length) residuals.push({path, value})
    return
  }
  if (Array.isArray(value)) return value.forEach((entry, index) => collectResiduals(entry, `${path}[${index}]`))
  if (value && typeof value === 'object') return Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => collectResiduals(entry, `${path}.${key}`))
}
collectResiduals(plannedPublicAfter)
assert.deepEqual(residuals, [])

console.log('POXIOL V9.1 Sanity migration safety tests passed.')
