import assert from 'node:assert/strict'
import test from 'node:test'

import {buildHandoffManifest} from '../lib/release/handoff-manifest.mjs'

const sha = 'a'.repeat(64)
const commit = 'b'.repeat(40)

test('builds a path-sorted non-production handoff', () => {
  const result = buildHandoffManifest({commit, artifacts: [
    {path: 'z.json', sha256: sha},
    {path: 'a.json', sha256: sha},
  ]})
  assert.equal(result.status, 'LOCAL_CONSTRUCTION_COMPLETE_PREVIEW_READY_PRODUCTION_NO_GO')
  assert.equal(result.productionAuthorized, false)
  assert.equal(result.deploymentPerformed, false)
  assert.equal(result.cloudflarePreviewCreated, false)
  assert.equal(result.cmsWrites, 0)
  assert.equal(result.realFormSubmissions, 0)
  assert.deepEqual(result.artifacts.map((entry) => entry.path), ['a.json', 'z.json'])
})

test('rejects duplicate, unsafe and malformed artifacts', () => {
  assert.throws(() => buildHandoffManifest({commit, artifacts: [
    {path: 'a.json', sha256: sha},
    {path: 'a.json', sha256: sha},
  ]}), /DUPLICATE_PATH/)
  assert.throws(() => buildHandoffManifest({commit, artifacts: [{path: '../a.json', sha256: sha}]}), /INVALID_PATH/)
  assert.throws(() => buildHandoffManifest({commit, artifacts: [{path: 'a.json', sha256: 'bad'}]}), /INVALID_SHA256/)
})

test('rejects a malformed commit', () => {
  assert.throws(() => buildHandoffManifest({commit: 'HEAD', artifacts: [{path: 'a.json', sha256: sha}]}), /INVALID_COMMIT/)
})
