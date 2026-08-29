const COMMIT_PATTERN = /^[0-9a-f]{40}$/
const SHA256_PATTERN = /^[0-9a-f]{64}$/
const REQUIRED_GATES = ['c1', 'c2', 'c3', 'c4']

function assertRelativePath(path) {
  if (
    typeof path !== 'string'
    || path.length === 0
    || path.startsWith('/')
    || path.includes('\\')
    || path.split('/').includes('..')
  ) {
    throw new Error(`INVALID_PATH:${String(path)}`)
  }
}

function normalizeFiles(files, allPaths) {
  if (!Array.isArray(files)) throw new Error('INVALID_FILE_LIST')

  return files.map((entry) => {
    if (!entry || typeof entry !== 'object') throw new Error('INVALID_FILE_ENTRY')
    assertRelativePath(entry.path)
    if (!SHA256_PATTERN.test(entry.sha256)) throw new Error(`INVALID_SHA256:${entry.path}`)
    if (allPaths.has(entry.path)) throw new Error(`DUPLICATE_PATH:${entry.path}`)
    allPaths.add(entry.path)
    return {path: entry.path, sha256: entry.sha256}
  }).sort((a, b) => a.path.localeCompare(b.path, 'en'))
}

export function buildReleaseManifest({commits, sourceFiles, outputFiles, gates}) {
  if (!Array.isArray(commits) || commits.length === 0) throw new Error('INVALID_COMMITS')
  const seenCommits = new Set()
  for (const commit of commits) {
    if (!COMMIT_PATTERN.test(commit)) throw new Error(`INVALID_COMMIT:${String(commit)}`)
    if (seenCommits.has(commit)) throw new Error(`DUPLICATE_COMMIT:${commit}`)
    seenCommits.add(commit)
  }

  if (!gates || typeof gates !== 'object') throw new Error('INVALID_GATES')
  const normalizedGates = {}
  for (const gate of REQUIRED_GATES) {
    if (typeof gates[gate] !== 'boolean') throw new Error(`INVALID_GATE:${gate}`)
    normalizedGates[gate] = gates[gate]
  }

  const allPaths = new Set()
  return {
    schemaVersion: 1,
    status: 'PREVIEW_READY_PRODUCTION_NO_GO',
    productionAuthorized: false,
    deploymentPerformed: false,
    cmsWrites: 0,
    realFormSubmissions: 0,
    commits: [...commits],
    gates: normalizedGates,
    sourceFiles: normalizeFiles(sourceFiles, allPaths),
    outputFiles: normalizeFiles(outputFiles, allPaths),
  }
}
