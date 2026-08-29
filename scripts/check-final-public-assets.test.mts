import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import test from 'node:test'

import allowlist from '../content/release/asset-allowlist.json' with {type: 'json'}
import productionManifest from '../content/real-production/manifest/assets.json' with {type: 'json'}
import visualizationManifest from '../content/product-visualization/assets.json' with {type: 'json'}

const sha256 = (path: string) =>
  createHash('sha256').update(readFileSync(path)).digest('hex')

test('every evidence asset is POXIOL reviewed and scope-limited', () => {
  const evidence = allowlist.filter(
    (item) => item.classification === 'EVIDENCE',
  )
  assert.equal(evidence.length, 9)
  for (const item of evidence) {
    assert.equal(item.thirdPartyMarkReview, 'PASS')
    assert.equal(item.poxiolMarkReview, 'PASS_RETAINED')
    assert.equal(item.allowedUse, 'basketball-product-detail')
  }
})

test('the allowlist contains every governed evidence and visualization asset exactly once', () => {
  const paths = allowlist.map((item) => item.path)
  assert.equal(new Set(paths).size, paths.length)

  const expectedEvidence = productionManifest.assets
    .map((item) => item.publicPath)
    .sort()
  const actualEvidence = allowlist
    .filter((item) => item.classification === 'EVIDENCE')
    .map((item) => item.path)
    .sort()
  assert.deepEqual(actualEvidence, expectedEvidence)

  const expectedVisualizations = visualizationManifest
    .map((item) => `/product-visualization/${item.publicFile}`)
    .sort()
  const actualVisualizations = allowlist
    .filter((item) => item.allowedUse === 'product-visualization')
    .map((item) => item.path)
    .sort()
  assert.deepEqual(actualVisualizations, expectedVisualizations)
})

test('every allowlisted binary exists and matches its reviewed digest', () => {
  for (const item of allowlist) {
    assert.match(item.sha256, /^[a-f0-9]{64}$/)
    assert.equal(sha256(join('public', item.path)), item.sha256, item.path)
    assert.equal(item.thirdPartyMarkReview, 'PASS', item.path)
    assert.equal(item.poxiolMarkReview, 'PASS_RETAINED', item.path)
  }
})

test('non-evidence assets remain explicitly non-proof', () => {
  const nonEvidence = allowlist.filter(
    (item) => item.classification !== 'EVIDENCE',
  )
  assert.ok(nonEvidence.length > 0)
  for (const item of nonEvidence) {
    assert.equal(item.classification, 'ILLUSTRATION_NON_PROOF')
    assert.notEqual(item.allowedUse, 'basketball-product-detail')
  }
})

test('both public asset registries consume the final allowlist', () => {
  for (const file of [
    'lib/real-production/registry.ts',
    'lib/product-visualization/registry.ts',
  ]) {
    assert.match(readFileSync(file, 'utf8'), /asset-allowlist\.json/, file)
  }
})
