import assert from 'node:assert/strict'
import test from 'node:test'

import {buildReleaseManifest} from '../lib/release/release-manifest.mjs'

const commit = 'a'.repeat(40)
const digest = 'b'.repeat(64)

test('forces construction packages to remain production unauthorized', () => {
  const manifest = buildReleaseManifest({
    commits: [commit],
    sourceFiles: [],
    outputFiles: [],
    gates: {c1: true, c2: true, c3: true, c4: true},
  })

  assert.equal(manifest.status, 'PREVIEW_READY_PRODUCTION_NO_GO')
  assert.equal(manifest.productionAuthorized, false)
  assert.equal(manifest.deploymentPerformed, false)
  assert.equal(manifest.cmsWrites, 0)
  assert.equal(manifest.realFormSubmissions, 0)
})

test('sorts file entries by path', () => {
  const manifest = buildReleaseManifest({
    commits: [commit],
    sourceFiles: [
      {path: 'z.txt', sha256: digest},
      {path: 'a.txt', sha256: 'c'.repeat(64)},
    ],
    outputFiles: [],
    gates: {c1: true, c2: true, c3: true, c4: true},
  })

  assert.deepEqual(manifest.sourceFiles.map((item) => item.path), ['a.txt', 'z.txt'])
})

test('rejects invalid commits, digests, duplicate paths and implicit gates', () => {
  assert.throws(
    () => buildReleaseManifest({commits: ['short'], sourceFiles: [], outputFiles: [], gates: {}}),
    /INVALID_COMMIT/,
  )
  assert.throws(
    () => buildReleaseManifest({
      commits: [commit],
      sourceFiles: [{path: 'a.txt', sha256: 'A'.repeat(64)}],
      outputFiles: [],
      gates: {c1: true, c2: true, c3: true, c4: true},
    }),
    /INVALID_SHA256/,
  )
  assert.throws(
    () => buildReleaseManifest({
      commits: [commit],
      sourceFiles: [{path: 'same', sha256: digest}],
      outputFiles: [{path: 'same', sha256: digest}],
      gates: {c1: true, c2: true, c3: true, c4: true},
    }),
    /DUPLICATE_PATH/,
  )
  assert.throws(
    () => buildReleaseManifest({
      commits: [commit],
      sourceFiles: [],
      outputFiles: [],
      gates: {c1: true, c2: true, c3: true},
    }),
    /INVALID_GATE:c4/,
  )
})
