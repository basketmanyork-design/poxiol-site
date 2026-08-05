import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'

const {draftPlan, validatePlan} = await import('./buyer-decision-draft-plan.mjs')

assert.equal(validatePlan(), true)
assert.deepEqual(
  draftPlan.map((item) => item.id).sort(),
  [
    'drafts.67d89e7018894286',
    'drafts.a01d7979a987463a',
    'drafts.d17c91e8e04842c4',
  ],
  'the mutation allowlist must contain exactly the three approved existing Drafts',
)
assert.ok(draftPlan.every((item) => item.expectedRevision && item.id.startsWith('drafts.')), 'every mutation needs a Draft ID and revision guard')
assert.ok(draftPlan.every((item) => Object.keys(item.set).length > 0), 'every Draft needs an explicit field patch')

const serialized = JSON.stringify(draftPlan)
for (const forbidden of [
  '15+ years',
  '30,000+ units',
  'within 24 hours',
  'sales@poxiol.com',
  'Request a free mockup',
]) {
  assert.ok(!serialized.toLowerCase().includes(forbidden.toLowerCase()), `Draft plan retains unsupported or legacy wording: ${forbidden}`)
}

const applySource = await readFile(new URL('./apply-buyer-decision-clarity-drafts.mjs', import.meta.url), 'utf8')
assert.match(applySource, /ifRevisionID:\s*expectedRevision/, 'apply script must use revision guards')
assert.match(applySource, /set\('perspective', 'raw'\)/, 'guard query must address the real Draft IDs without perspective overlays')
assert.match(applySource, /byId\.get\(item\.id\)/, 'guard results must be matched by exact Draft ID')
assert.match(applySource, /SANITY_WRITE_TOKEN/, 'apply script must use the dedicated write token')
assert.match(applySource, /WRITE_BUYER_DECISION_DRAFTS_ONLY/, 'apply script must require an explicit Draft-only confirmation')
assert.match(applySource, /applyRequested/, 'apply script must default to a non-mutating dry run')
assert.match(applySource, /SANITY_READ_TOKEN/, 'dry run must use the read token')
assert.doesNotMatch(applySource, /createOrReplace|delete\s*:/, 'apply script must not replace or delete documents')

console.log('buyer decision Draft plan contracts passed')