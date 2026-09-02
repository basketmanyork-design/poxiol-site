import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'

const requiredFiles = [
  'lib/v8/index.ts',
  'lib/v8/types.ts',
  'lib/v8/brand.ts',
  'lib/v8/processes.ts',
  'lib/v8/faqs.ts',
  'lib/v8/pages.ts',
  'lib/v8/media.ts',
  'components/v8/VerifiedMediaPlaceholder.tsx',
  'components/v8/FinalCTA.tsx',
  'components/v8/index.ts',
]

for (const file of requiredFiles) {
  assert.equal(existsSync(file), true, `Missing approved V8 infrastructure file: ${file}`)
}

const v8 = await import('../lib/v8/index.ts')

assert.equal(v8.V8_BRAND.positioning, 'Professional Custom Teamwear Manufacturer')
assert.equal(v8.V8_BRAND.organizationId, 'https://www.poxiol.com/#organization')
assert.equal(v8.V8_BRAND.canonicalBaseUrl, 'https://www.poxiol.com')

assert.deepEqual(
  v8.V8_BUYERS.map((buyer) => buyer.id),
  ['youth-teams', 'schools', 'clubs', 'sports-brands', 'distributors'],
)

assert.deepEqual(
  v8.V8_PROCESSES.journey.map((step) => step.id),
  ['idea', 'design', 'mockup', 'sample', 'production', 'qc', 'shipment'],
)
assert.deepEqual(
  v8.V8_PROCESSES.manufacturing.map((step) => step.id),
  ['design-preparation', 'material-selection', 'printing', 'cutting', 'sewing', 'assembly', 'inspection-preparation', 'packing'],
)
assert.deepEqual(
  v8.V8_PROCESSES.qualityControl.map((step) => step.id),
  ['incoming-material', 'printing-inspection', 'sewing-inspection', 'size-checking', 'final-inspection', 'packing-verification'],
)

assert.deepEqual(
  v8.V8_MEDIA_SLOTS.map((slot) => slot.id),
  [
    'fabric-inspection',
    'printing',
    'cutting',
    'sewing',
    'qc',
    'packing',
    'factory-overview-video',
    'production-workflow-video',
    'quality-inspection-video',
  ],
)

assert.equal(v8.resolveVerifiedMedia(undefined), null)
assert.equal(
  v8.resolveVerifiedMedia({
    id: 'unverified-printing',
    kind: 'image',
    stage: 'printing',
    url: '/verified/printing.webp',
    alt: 'Printing inspection',
    verified: false,
  }),
  null,
)
assert.equal(
  v8.resolveVerifiedMedia({
    id: 'missing-alt',
    kind: 'image',
    stage: 'printing',
    url: '/verified/printing.webp',
    alt: '',
    verified: true,
  }),
  null,
)
assert.deepEqual(
  v8.resolveVerifiedMedia({
    id: 'verified-printing',
    kind: 'image',
    stage: 'printing',
    url: '/verified/printing.webp',
    alt: 'POXIOL printing inspection',
    caption: 'Printing inspection',
    verified: true,
  }),
  {
    id: 'verified-printing',
    kind: 'image',
    stage: 'printing',
    url: '/verified/printing.webp',
    alt: 'POXIOL printing inspection',
    caption: 'Printing inspection',
    verified: true,
  },
)

assert.deepEqual(
  v8.V8_CTAS.map((cta) => cta.id),
  ['free-mockup', 'start-project', 'start-design', 'get-quote', 'request-sample'],
)
assert.equal(v8.getV8Cta('free-mockup').label, 'Get Free Mockup')
assert.equal(v8.getV8Cta('start-design').label, 'Start Your Team Design')
assert.equal(v8.getV8Cta('request-sample').href, '/sample-order/')

const basketball = v8.getV8PageConfig('basketball')
assert.equal(basketball.canonicalPath, '/products/basketball-uniforms/')
assert.equal(basketball.primaryKeyword, 'Custom Basketball Uniform Manufacturer')

const basketballFaqs = v8.getV8Faqs({pageId: 'basketball'})
assert.ok(basketballFaqs.length >= 4)
assert.ok(basketballFaqs.every((faq) => faq.pageIds.includes('basketball')))
assert.equal(new Set(basketballFaqs.map((faq) => faq.id)).size, basketballFaqs.length)

const prohibitedRoutes = [
  'app/custom-basketball-uniform-manufacturer/page.tsx',
  'app/production-process/page.tsx',
]
for (const route of prohibitedRoutes) {
  assert.equal(existsSync(route), false, `Prohibited duplicate route exists: ${route}`)
}

const v8SourceFiles = requiredFiles.filter((file) => existsSync(file))
const v8Sources = v8SourceFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
assert.doesNotMatch(v8Sources, /images\/poxiol-v6\/manufacturing_/)
assert.doesNotMatch(v8Sources, /stock factory|ai-generated factory|unknown production video/i)

console.log('POXIOL V8 architecture checks passed.')
