const SHA256_PATTERN = /^[0-9a-f]{64}$/
const REQUIRED_GATES = ['c1', 'c2', 'c3', 'c4']
const PRODUCTION_COMMIT = 'ae452f70b4a027822fc4340db683746e90653fc1'
const PRODUCTION_DEPLOYMENT_ID = 'da1e8d5c-5db3-4522-9ee3-79cbbc0774a4'

function requireDigest(value, code) {
  if (!SHA256_PATTERN.test(value || '')) throw new Error(code)
}

export function assertPreviewReadiness(manifest) {
  if (!manifest || manifest.status !== 'PREVIEW_READY_PRODUCTION_NO_GO') {
    throw new Error('PREVIEW_STATUS_INVALID')
  }
  if (manifest.productionAuthorized !== false) throw new Error('PRODUCTION_AUTHORITY_FORBIDDEN')
  if (manifest.deploymentPerformed !== false) throw new Error('DEPLOYMENT_FLAG_FORBIDDEN')
  if (manifest.cmsWrites !== 0) throw new Error('CMS_WRITE_FLAG_FORBIDDEN')
  if (manifest.realFormSubmissions !== 0) throw new Error('REAL_FORM_SUBMISSION_FLAG_FORBIDDEN')
  if (manifest.trackedSourceClean !== true) throw new Error('TRACKED_SOURCE_DIRTY')
  if (manifest.testsPassed !== true) throw new Error('TEST_ACCEPTANCE_MISSING')
  if (manifest.buildPassed !== true) throw new Error('BUILD_ACCEPTANCE_MISSING')

  for (const gate of REQUIRED_GATES) {
    if (manifest.gates?.[gate] !== true) throw new Error(`CONSTRUCTION_GATE_MISSING:${gate}`)
  }

  requireDigest(manifest.releaseManifest?.sha256, 'RELEASE_HASH_MISSING')
  requireDigest(manifest.releaseManifest?.sourceAggregateSha256, 'SOURCE_HASH_MISSING')
  requireDigest(manifest.releaseManifest?.outputAggregateSha256, 'OUTPUT_HASH_MISSING')
  requireDigest(manifest.rollback?.sha256, 'ROLLBACK_HASH_MISSING')

  if (manifest.rollback?.productionCommit !== PRODUCTION_COMMIT) {
    throw new Error('ROLLBACK_COMMIT_MISMATCH')
  }
  if (manifest.rollback?.deploymentId !== PRODUCTION_DEPLOYMENT_ID) {
    throw new Error('ROLLBACK_DEPLOYMENT_MISMATCH')
  }

  return true
}

export const previewReadinessContract = {
  productionCommit: PRODUCTION_COMMIT,
  productionDeploymentId: PRODUCTION_DEPLOYMENT_ID,
}
