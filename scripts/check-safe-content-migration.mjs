import assert from 'node:assert/strict'
import {buildMigrationPlan, parseArgs} from './migrate-legacy-content-to-sanity.mjs'

const candidates = [
  {candidateKey: 'product.existing', type: 'product', slug: 'existing', title: 'Existing'},
  {candidateKey: 'product.new', type: 'product', slug: 'new', title: 'New'},
  {candidateKey: 'siteSettings.site-settings', type: 'siteSettings', sanityDocumentId: 'siteSettings', title: 'Settings'},
]
const existing = [
  {_id: 'product-one', _type: 'product', slug: {current: 'existing'}},
  {_id: 'drafts.product-one', _type: 'product', slug: {current: 'existing'}},
  {_id: 'siteSettings', _type: 'siteSettings'},
]
const plan = buildMigrationPlan(candidates, existing, {type: '', limit: 0, resumeKeys: new Set()})
assert.deepEqual(plan.summary, {total: 3, create: 1, update: 0, skip: 2, conflict: 0, invalid: 0})
assert.equal(plan.items.find((item) => item.candidateKey === 'product.new').action, 'create')
assert.equal(plan.items.find((item) => item.candidateKey === 'product.existing').action, 'skip')

const conflict = buildMigrationPlan(
  [{candidateKey: 'product.duplicate', type: 'product', slug: 'duplicate'}],
  [
    {_id: 'one', _type: 'product', slug: {current: 'duplicate'}},
    {_id: 'two', _type: 'product', slug: {current: 'duplicate'}},
  ],
  {type: '', limit: 0, resumeKeys: new Set()},
)
assert.equal(conflict.summary.conflict, 1)
assert.equal(conflict.items[0].action, 'conflict')

const filtered = buildMigrationPlan(candidates, existing, {type: 'product', limit: 1, resumeKeys: new Set(['product.existing'])})
assert.equal(filtered.summary.total, 1)
assert.equal(filtered.items[0].candidateKey, 'product.new')

const update = buildMigrationPlan(
  [{candidateKey: 'product.existing', type: 'product', slug: 'existing', allowUpdate: true, document: {productName: 'Existing'}}],
  existing,
  {type: '', limit: 0, resumeKeys: new Set()},
)
assert.equal(update.summary.update, 1)
assert.equal(update.items[0].targetId, 'drafts.product-one')

const defaults = parseArgs([])
assert.equal(defaults.apply, false)
assert.equal(defaults.dryRun, true)
assert.equal(defaults.draftOnly, false)

assert.throws(() => parseArgs(['--apply', '--dry-run']), /mutually exclusive/)
assert.throws(() => parseArgs(['--apply']), /--draft-only/)
assert.throws(() => parseArgs(['--apply', '--draft-only']), /--existing-export/)
assert.throws(() => parseArgs(['--apply', '--draft-only', '--existing-export', 'x']), /--backup-sha/)


const source = await import('node:fs').then(({readFileSync}) => readFileSync(new URL('./migrate-legacy-content-to-sanity.mjs', import.meta.url), 'utf8'))
for (const forbidden of [/sanity\s+dataset\s+import/i, /assets\.upload\s*\(/i, /\.publish\s*\(/i, /\.delete\s*\(/i]) {
  assert.equal(forbidden.test(source), false, `migration tool must not implement ${forbidden}`)
}

console.log('safe content migration tests passed')
