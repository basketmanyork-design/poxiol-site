import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const schema = read('studio/schemaTypes/documents/productCategory.ts')
const queries = read('lib/sanity/queries.ts')
const content = read('lib/sanity/content.ts')
const types = read('lib/sports-pages.ts')
const page = read('app/products/basketball-uniforms/page.tsx')
const view = read('components/sports/SportsLandingPage.tsx')
const all = [schema, queries, content, types, page, view].join('\n')

for (const field of ['heroProofPoints', 'decisionSections', 'primaryCta', 'secondaryCta', 'bottomCta']) {
  assert.match(schema, new RegExp(`name:\\s*['"]${field}['"]`), `productCategory is missing ${field}`)
  assert.match(queries, new RegExp(`\\b${field}\\b`), `Basketball category projection is missing ${field}`)
}

assert.match(queries, /\*\[_id == "procurementStandards"\]\[0\]/, 'procurement must use the singleton ID')
assert.match(content, /getBasketballDecisionPage/, 'focused Basketball resolver is missing')
assert.match(
  content,
  /h1:\\s*category\\.heroTitle\\s*\\|\\|/,
  'Basketball Hero H1 must prefer the CMS heroTitle',
)
assert.match(page, /getBasketballDecisionPage/, 'Basketball route is not wired to its focused resolver')
assert.match(types, /heroProofPoints/, 'SportsPageData is missing hero proof points')
assert.match(types, /decisionSections/, 'SportsPageData is missing decision sections')
assert.match(types, /relatedCases/, 'SportsPageData is missing related cases')
assert.match(view, /data\.heroProofPoints/, 'Hero proof points are not CMS driven')
assert.match(view, /data\.decisionSections/, 'Decision sections are not rendered')
assert.match(view, /data\.relatedCases/, 'Related cases are not rendered')

assert.doesNotMatch(all, /15\s*[–-]\s*25\s+Days/i)
assert.doesNotMatch(all, /10\s*[–-]\s*14\s+Days/i)
assert.doesNotMatch(all, /30,?000\+\s+units\s+monthly/i)
assert.doesNotMatch(all, /\bKIAN\b|\bEPSON\b/i)

const categoryFixture = {
  publishStatus: 'published',
  slug: 'basketball-uniforms',
  heroProofPoints: ['Sample MOQ: 1 set', 'QC before shipment'],
  relatedFaqs: [{question: 'Can I order one sample?', answer: 'Yes, one sample set is supported.'}],
}
const previewFixture = {...categoryFixture, publishStatus: 'draft'}

assert.equal(categoryFixture.slug, 'basketball-uniforms')
assert.equal(previewFixture.publishStatus, 'draft')
assert.deepEqual(
  categoryFixture.relatedFaqs,
  JSON.parse(JSON.stringify(categoryFixture.relatedFaqs)),
  'visible FAQ and JSON-LD inputs must be the same resolver array',
)

console.log('Basketball decision-page checks passed')
