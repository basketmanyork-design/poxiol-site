import assert from 'node:assert/strict'
import test from 'node:test'

import {assertPreviewReadiness} from '../lib/release/preview-readiness.mjs'

const digest = 'a'.repeat(64)
const base = {
  schemaVersion: 1,
  status: 'PREVIEW_READY_PRODUCTION_NO_GO',
  productionAuthorized: false,
  deploymentPerformed: false,
  cmsWrites: 0,
  realFormSubmissions: 0,
  trackedSourceClean: true,
  testsPassed: true,
  buildPassed: true,
  gates: {c1: true, c2: true, c3: true, c4: true},
  releaseManifest: {
    path: 'construction/release-manifest.json',
    sha256: digest,
    sourceAggregateSha256: digest,
    outputAggregateSha256: digest,
  },
  rollback: {
    path: 'construction/rollback-manifest.json',
    sha256: digest,
    productionCommit: 'ae452f70b4a027822fc4340db683746e90653fc1',
    deploymentId: 'da1e8d5c-5db3-4522-9ee3-79cbbc0774a4',
  },
}

test('rejects a package that claims production authority', () => {
  assert.throws(
    () => assertPreviewReadiness({...base, productionAuthorized: true}),
    /PRODUCTION_AUTHORITY_FORBIDDEN/,
  )
})

test('requires every construction gate', () => {
  assert.throws(
    () => assertPreviewReadiness({...base, gates: {...base.gates, c4: false}}),
    /CONSTRUCTION_GATE_MISSING:c4/,
  )
})

test('rejects dirty, failed, unbound or wrong rollback records', () => {
  assert.throws(() => assertPreviewReadiness({...base, trackedSourceClean: false}), /TRACKED_SOURCE_DIRTY/)
  assert.throws(() => assertPreviewReadiness({...base, testsPassed: false}), /TEST_ACCEPTANCE_MISSING/)
  assert.throws(() => assertPreviewReadiness({...base, buildPassed: false}), /BUILD_ACCEPTANCE_MISSING/)
  assert.throws(
    () => assertPreviewReadiness({...base, releaseManifest: {...base.releaseManifest, sha256: ''}}),
    /RELEASE_HASH_MISSING/,
  )
  assert.throws(
    () => assertPreviewReadiness({...base, rollback: {...base.rollback, deploymentId: 'unknown'}}),
    /ROLLBACK_DEPLOYMENT_MISMATCH/,
  )
})

test('accepts the non-deploying package with bound source, output and rollback hashes', () => {
  assert.equal(assertPreviewReadiness(base), true)
})
