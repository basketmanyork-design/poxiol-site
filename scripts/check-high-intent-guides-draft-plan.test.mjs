import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {readFile} from 'node:fs/promises'
import {draftPlan, validatePlan} from './high-intent-guides-draft-plan.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ledgerPath = path.join(root, 'docs', 'HIGH_INTENT_GUIDES_WEEK2_DRAFT_LEDGER.json')

assert.equal(existsSync(ledgerPath), true, 'the locked four-document Draft ledger must exist')
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'))

assert.equal(ledger.mode, 'sanity-preview')
assert.equal(ledger.perspective, 'drafts')
assert.equal(ledger.useCdn, false)
assert.equal(ledger.publishedWritesBeforePreview, 0)
assert.equal(ledger.releaseCountBeforePreview, 0)
assert.equal(ledger.documents.length, 4)

const expected = new Map([
  ['reversible-vs-single-layer-basketball-uniforms', 'drafts.article-reversible-vs-single-layer-basketball-uniforms'],
  ['custom-basketball-uniform-fabric-gsm', 'drafts.5df7417df6e44eb4'],
  ['sample-first-vs-bulk-teamwear-order', 'drafts.article-sample-first-vs-bulk-teamwear-order'],
  ['custom-basketball-uniform-cost-factors', 'drafts.article-custom-basketball-uniform-cost-factors'],
])

for (const document of ledger.documents) {
  assert.equal(document.draftId, expected.get(document.slug), `unexpected Draft ID for ${document.slug}`)
  assert.equal(document.publishedId, document.draftId.replace(/^drafts\./, ''))
  assert.equal(document.type, 'article')
  assert.equal(document.publishStatus, 'draft')
  assert.ok(document.lockedRevision, `missing locked Draft revision for ${document.slug}`)
}

assert.equal(new Set(ledger.documents.map(({draftId}) => draftId)).size, 4)
assert.equal(new Set(ledger.documents.map(({publishedId}) => publishedId)).size, 4)
assert.equal(validatePlan(), true)
assert.equal(draftPlan.length, 4)
const applySource = await readFile(new URL('./apply-high-intent-guides-drafts.mjs', import.meta.url), 'utf8')
assert.match(applySource, /perspective', 'raw'/)
assert.match(applySource, /WRITE_HIGH_INTENT_GUIDES_DRAFTS_ONLY/)
assert.match(applySource, /SANITY_WRITE_TOKEN/)
assert.doesNotMatch(applySource, /createOrReplace|delete\s*:/)
console.log('high-intent guide Draft ledger contracts passed')
