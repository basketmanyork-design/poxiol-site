const COMMIT_PATTERN = /^[0-9a-f]{40}$/
const SHA256_PATTERN = /^[0-9a-f]{64}$/

function assertPath(value) {
  if (typeof value !== 'string' || !value || value.startsWith('/') || value.includes('\\') || value.split('/').includes('..')) {
    throw new Error(`INVALID_PATH:${String(value)}`)
  }
}

export function buildHandoffManifest({commit, artifacts}) {
  if (!COMMIT_PATTERN.test(commit || '')) throw new Error(`INVALID_COMMIT:${String(commit)}`)
  if (!Array.isArray(artifacts) || artifacts.length === 0) throw new Error('INVALID_ARTIFACTS')
  const seen = new Set()
  const normalized = artifacts.map((entry) => {
    if (!entry || typeof entry !== 'object') throw new Error('INVALID_ARTIFACT')
    assertPath(entry.path)
    if (seen.has(entry.path)) throw new Error(`DUPLICATE_PATH:${entry.path}`)
    seen.add(entry.path)
    if (!SHA256_PATTERN.test(entry.sha256 || '')) throw new Error(`INVALID_SHA256:${entry.path}`)
    return {path: entry.path, sha256: entry.sha256}
  }).sort((a, b) => a.path.localeCompare(b.path, 'en'))

  return {
    schemaVersion: 1,
    status: 'LOCAL_CONSTRUCTION_COMPLETE_PREVIEW_READY_PRODUCTION_NO_GO',
    commit,
    productionAuthorized: false,
    deploymentPerformed: false,
    cloudflarePreviewCreated: false,
    cmsWrites: 0,
    realFormSubmissions: 0,
    analyticsActivated: false,
    artifacts: normalized,
  }
}

