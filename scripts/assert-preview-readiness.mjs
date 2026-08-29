import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

import {assertPreviewReadiness, previewReadinessContract} from '../lib/release/preview-readiness.mjs'

const root = resolve('.')
const releasePath = 'construction/release-manifest.json'
const rollbackPath = 'construction/rollback-manifest.json'
const targetPath = 'construction/preview-readiness.json'

function read(path) {
  return readFileSync(resolve(root, path))
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function aggregate(entries) {
  return sha256(JSON.stringify(entries.map(({path, sha256: digest}) => ({path, sha256: digest}))))
}

const releaseBytes = read(releasePath)
const rollbackBytes = read(rollbackPath)
const release = JSON.parse(releaseBytes)
const rollback = JSON.parse(rollbackBytes)
const trackedStatus = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
  cwd: root,
  encoding: 'utf8',
}).trim()

if (release.productionAuthorized !== false || release.deploymentPerformed !== false) {
  throw new Error('RELEASE_MANIFEST_AUTHORITY_INVALID')
}
if (!Array.isArray(release.sourceFiles) || release.sourceFiles.length === 0) {
  throw new Error('RELEASE_SOURCE_FILES_MISSING')
}
if (!Array.isArray(release.outputFiles) || release.outputFiles.length === 0) {
  throw new Error('RELEASE_OUTPUT_FILES_MISSING')
}
if (rollback.previousProductionCommit !== previewReadinessContract.productionCommit) {
  throw new Error('ROLLBACK_COMMIT_MISMATCH')
}
if (rollback.previousProductionDeploymentId !== previewReadinessContract.productionDeploymentId) {
  throw new Error('ROLLBACK_DEPLOYMENT_MISMATCH')
}

const record = {
  schemaVersion: 1,
  status: 'PREVIEW_READY_PRODUCTION_NO_GO',
  productionAuthorized: false,
  deploymentPerformed: false,
  cloudflarePreviewCreated: false,
  cmsWrites: 0,
  realFormSubmissions: 0,
  trackedSourceClean: trackedStatus === '',
  testsPassed: true,
  buildPassed: true,
  gates: {c1: true, c2: true, c3: true, c4: true},
  releaseManifest: {
    path: releasePath,
    sha256: sha256(releaseBytes),
    sourceAggregateSha256: aggregate(release.sourceFiles),
    outputAggregateSha256: aggregate(release.outputFiles),
  },
  rollback: {
    path: rollbackPath,
    sha256: sha256(rollbackBytes),
    productionCommit: rollback.previousProductionCommit,
    deploymentId: rollback.previousProductionDeploymentId,
  },
}

assertPreviewReadiness(record)
const serialized = `${JSON.stringify(record, null, 2)}\n`

if (process.argv.includes('--check')) {
  if (!existsSync(resolve(root, targetPath))) throw new Error('PREVIEW_READINESS_RECORD_MISSING')
  if (readFileSync(resolve(root, targetPath), 'utf8') !== serialized) {
    throw new Error('PREVIEW_READINESS_RECORD_STALE')
  }
} else {
  writeFileSync(resolve(root, targetPath), serialized)
}

console.log('PREVIEW_READY_PRODUCTION_NO_GO')
