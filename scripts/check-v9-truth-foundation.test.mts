import assert from 'node:assert/strict'
import {
  CLAIM_STATUSES,
  publicClaimValue,
  type PublicClaimPolicy,
} from '../lib/truth/claim-policy.ts'
import {
  ORDER_QUANTITY_CONFIRMED,
  SAMPLE_TIMING_CONFIRMED,
  TIMELINE_CONFIRMED,
} from '../lib/truth/public-copy.ts'
import {claimContextForClassification, classifyResidual, scanV9ClaimText} from './scan-v9-red-claims.mts'
import {resolveProcurementTruth} from '../lib/truth/procurement-policy.ts'
import {normalizeBuyerFacingClaim} from '../lib/legacy-claim-normalizer.ts'
import {normalizeBasketballCategoryPublicCopy} from '../lib/truth/basketball-category.ts'
import {readFileSync} from 'node:fs'

assert.deepEqual(CLAIM_STATUSES, [
  'VERIFIED',
  'CONDITIONAL',
  'OPERATIONAL_TARGET',
  'UNVERIFIED',
  'PLACEHOLDER',
  'OWNER_CONFIRMATION_REQUIRED',
])

const verified: PublicClaimPolicy = {
  status: 'VERIFIED',
  publicValue: 'Inspection before shipment',
  publicRule: 'Publish the approved value.',
}
assert.equal(publicClaimValue(verified), 'Inspection before shipment')

const conditional: PublicClaimPolicy = {
  status: 'CONDITIONAL',
  publicValue: SAMPLE_TIMING_CONFIRMED,
  publicRule: 'State the project dependencies.',
}
assert.equal(publicClaimValue(conditional), SAMPLE_TIMING_CONFIRMED)

for (const status of ['OPERATIONAL_TARGET', 'UNVERIFIED', 'PLACEHOLDER', 'OWNER_CONFIRMATION_REQUIRED'] as const) {
  const policy: PublicClaimPolicy = {
    status,
    publicValue: 'Factory Direct with MOQ 1 Set and delivery guaranteed in 7-12 days',
    replacement: status === 'OPERATIONAL_TARGET' ? TIMELINE_CONFIRMED : ORDER_QUANTITY_CONFIRMED,
    publicRule: 'Do not publish the unverified source value.',
  }
  assert.equal(publicClaimValue(policy), policy.replacement)
}

assert.equal(publicClaimValue({
  status: 'UNVERIFIED',
  publicValue: '30,000+ units monthly',
  publicRule: 'Remove when no replacement is approved.',
}), undefined)

assert.deepEqual(resolveProcurementTruth({
  quantityPolicy: {status: 'OWNER_CONFIRMATION_REQUIRED', replacement: ORDER_QUANTITY_CONFIRMED, publicRule: 'Use replacement.'},
  sampleTimingPolicy: {status: 'OPERATIONAL_TARGET', replacement: SAMPLE_TIMING_CONFIRMED, publicRule: 'Use replacement.'},
  productionTimingPolicy: {status: 'OPERATIONAL_TARGET', replacement: TIMELINE_CONFIRMED, publicRule: 'Use replacement.'},
}), {
  quantity: ORDER_QUANTITY_CONFIRMED,
  sampleTiming: SAMPLE_TIMING_CONFIRMED,
  productionTiming: TIMELINE_CONFIRMED,
  mockupTiming: TIMELINE_CONFIRMED,
  shippingTiming: 'Shipping options and transit time are confirmed based on destination, shipping method and order requirements.',
  measurementTolerance: 'Manufacturing tolerance is confirmed against the approved product measurement specification.',
})

assert.deepEqual(
  scanV9ClaimText('Factory Direct. MOQ 1 Set. Sample 2-3 days. Bulk 7-12 days. Unlimited colors. 100% manual QC.')
    .map((match) => match.kind),
  ['FACTORY_DIRECT', 'MOQ', 'SAMPLE_TIMING', 'FIXED_TIMELINE', 'PRODUCTION_TIMING', 'FIXED_TIMELINE', 'UNLIMITED', 'ABSOLUTE_QUALITY'],
)

assert.deepEqual(scanV9ClaimText('Timeline confirmed after project review.'), [])
assert.deepEqual(
  scanV9ClaimText('1 Set | 2h | 24h | 2-3 | 3–5 | 7-12 | fast delivery | rapid production | capacity | 100%')
    .map((match) => match.kind),
  ['MOQ', 'MOCKUP_TIMING', 'MOCKUP_TIMING', 'FIXED_TIMELINE', 'FIXED_TIMELINE', 'FIXED_TIMELINE', 'FIXED_TIMELINE', 'FIXED_TIMELINE', 'CAPACITY_OR_SCALE', 'ABSOLUTE_QUALITY'],
)
assert.deepEqual(
  scanV9ClaimText('Direct manufacturer. Direct factory model. Real Project. Customer Success Story.')
    .map((match) => match.kind),
  ['FACTORY_DIRECT', 'FACTORY_DIRECT', 'PROJECT_AUTHENTICITY', 'PROJECT_AUTHENTICITY'],
)
assert.deepEqual(scanV9ClaimText('15+ years experience').map((match) => match.kind), ['COMPANY_HISTORY'])
assert.equal(
  classifyResidual('app/example/page.tsx', '<span className="mr-2 h-1 w-1" />'),
  'LEGAL_RETAIN',
)
assert.equal(
  classifyResidual('app/terms/page.tsx', 'Schedules depend on confirmed requirements and factory capacity.'),
  'LEGAL_RETAIN',
)
assert.equal(
  classifyResidual('content/product-visualization/assets.json', '"real customer project proof"'),
  'GOVERNANCE_RECORD',
)
assert.equal(
  classifyResidual('studio/schemaTypes/documents/caseStudy.ts', "{title: 'Verified real project'}"),
  'DETECTION_RULE',
)
assert.equal(
  classifyResidual('lib/high-intent-guides.js', 'A sample cannot guarantee unlimited durability.'),
  'SAFE_NEGATION',
)
assert.deepEqual(scanV9ClaimText('wrap(value)'), [])

const repeatedUnlimitedText = 'A sample cannot guarantee unlimited durability. This sentence separates the claims. Unlimited colors.'
const repeatedUnlimitedMatches = scanV9ClaimText(repeatedUnlimitedText).filter((match) => match.kind === 'UNLIMITED')
assert.equal(repeatedUnlimitedMatches.length, 2, 'scanner must return every match of the same risk type')
assert.deepEqual(
  repeatedUnlimitedMatches.map((match) => classifyResidual(
    '/test-page/',
    claimContextForClassification(repeatedUnlimitedText, match),
  )),
  ['SAFE_NEGATION', 'PUBLIC_REVIEW'],
)

const liveCmsLegacyClaim = normalizeBuyerFacingClaim(
  'Factory Direct with unlimited customization, 30,000 units monthly production capacity and 100% polyester.',
)
assert.deepEqual(scanV9ClaimText(liveCmsLegacyClaim), [])
assert.equal(liveCmsLegacyClaim.includes('teamwear manufacturing partner'), true)
assert.equal(liveCmsLegacyClaim.includes('project-specific customization options'), true)
assert.equal(liveCmsLegacyClaim.includes('Production scheduling is confirmed after project review.'), true)
assert.equal(liveCmsLegacyClaim.includes('polyester'), true)

const sanitySnapshot = readFileSync('docs/v9-1/sanity-before.ndjson', 'utf8')
  .trim()
  .split(/\r?\n/)
  .map((line) => JSON.parse(line))
const basketballCategory = sanitySnapshot.find((document) => (
  document._type === 'productCategory' && document.slug?.current === 'basketball-uniforms'
))
assert.ok(basketballCategory, 'The real Before snapshot must include the basketball category fixture')
const rawBasketballClaims = [
  basketballCategory.heroDescription || '',
  ...(basketballCategory.heroProofPoints || []),
  ...(basketballCategory.keyFeatures || []),
  ...(basketballCategory.coreBenefits || []),
].flatMap(scanV9ClaimText)
assert.ok(rawBasketballClaims.length > 0, 'The regression fixture must contain the known legacy RED claims')
const safeBasketballCategory = normalizeBasketballCategoryPublicCopy(basketballCategory)
const safeBasketballClaims = [
  safeBasketballCategory.heroDescription || '',
  ...(safeBasketballCategory.heroProofPoints || []),
  ...(safeBasketballCategory.keyFeatures || []),
  ...(safeBasketballCategory.coreBenefits || []),
].flatMap(scanV9ClaimText)
assert.deepEqual(safeBasketballClaims, [])
assert.match(basketballCategory.heroDescription, /Start with 1 Sample/)
assert.match(basketballCategory.coreBenefits.join(' '), /one-set sample/)
assert.doesNotMatch(safeBasketballCategory.heroDescription || '', /Start with 1 Sample/)
assert.doesNotMatch((safeBasketballCategory.coreBenefits || []).join(' '), /one-set sample/)

console.log('POXIOL V9.1 truth foundation tests passed.')
