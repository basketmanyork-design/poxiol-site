import {createHash} from 'node:crypto'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

export const SANITY_BUILD_EVIDENCE_PATH = '.poxiol-build/sanity-build-evidence.json'
export const SANITY_BUILD_ID_INPUT_PATH = '.poxiol-build/sanity-build-id-input.json'

export const SANITY_EVIDENCE_BUILD_ID_PATHS = [
  SANITY_BUILD_ID_INPUT_PATH,
  'app',
  'components',
  'construction/route-release.json',
  'construction/sanity-read-audit.json',
  'content',
  'lib',
  'next.config.mjs',
  'package-lock.json',
  'package.json',
  'postcss.config.js',
  'public',
  'tailwind.config.ts',
  'tsconfig.json',
]

const PROJECT_ID = 'oqpv1xbc'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const COMMIT_PATTERN = /^[a-f0-9]{40}$/
const HASH_PATTERN = /^[a-f0-9]{64}$/
const BUILD_ID_PATTERN = /^poxiol-[a-f0-9]{24}$/
const READ_NAME_PATTERN = /^[a-z0-9-]+$/
const EVIDENCE_KEYS = [
  'aggregateSha256',
  'apiVersion',
  'authentication',
  'candidateCommit',
  'cmsWrites',
  'dataset',
  'perspective',
  'projectId',
  'reads',
  'schemaVersion',
  'transport',
]
const READ_KEYS = [
  'method',
  'name',
  'params',
  'querySha256',
  'responseSha256',
  'resultCount',
  'resultKind',
]

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function exactKeys(value, expected) {
  return value && typeof value === 'object'
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort())
}

function assertEvidenceShape(evidence) {
  if (!exactKeys(evidence, EVIDENCE_KEYS)) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_SHAPE')
  if (evidence.schemaVersion !== 1) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_VERSION')
  if (!COMMIT_PATTERN.test(evidence.candidateCommit || '')) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_COMMIT')
  if (evidence.projectId !== PROJECT_ID || evidence.dataset !== DATASET || evidence.apiVersion !== API_VERSION) {
    throw new Error('SANITY_BUILD_EVIDENCE_INVALID_SOURCE')
  }
  if (evidence.transport !== 'GET_ONLY' || evidence.perspective !== 'published' || evidence.authentication !== 'none' || evidence.cmsWrites !== 0) {
    throw new Error('SANITY_BUILD_EVIDENCE_INVALID_POLICY')
  }
  if (!Array.isArray(evidence.reads) || evidence.reads.length === 0) throw new Error('SANITY_BUILD_EVIDENCE_READS_MISSING')
  const names = new Set()
  for (const read of evidence.reads) {
    if (!exactKeys(read, READ_KEYS)) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_READ')
    if (!READ_NAME_PATTERN.test(read.name || '') || names.has(read.name)) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_READ_NAME')
    names.add(read.name)
    if (read.method !== 'GET' || !HASH_PATTERN.test(read.querySha256 || '') || !HASH_PATTERN.test(read.responseSha256 || '')) {
      throw new Error('SANITY_BUILD_EVIDENCE_INVALID_READ')
    }
    if (!read.params || typeof read.params !== 'object' || Array.isArray(read.params)) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_PARAMS')
    if (!Number.isInteger(read.resultCount) || read.resultCount < 0 || typeof read.resultKind !== 'string') {
      throw new Error('SANITY_BUILD_EVIDENCE_INVALID_RESULT')
    }
  }
  if (!HASH_PATTERN.test(evidence.aggregateSha256 || '')) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_AGGREGATE')
  if (sha256(JSON.stringify(evidence.reads)) !== evidence.aggregateSha256) throw new Error('SANITY_BUILD_EVIDENCE_AGGREGATE_MISMATCH')
  return evidence
}

function resolveParams(params, {firstPublishedProduct, firstPublishedArticle}) {
  return Object.fromEntries(Object.entries(params || {}).map(([key, value]) => {
    if (value === '$firstPublishedProduct') return [key, firstPublishedProduct]
    if (value === '$firstPublishedArticle') return [key, firstPublishedArticle]
    return [key, value]
  }))
}

export function resolveCandidateCommit({envCommit = '', gitCommit = ''}) {
  if (envCommit && gitCommit && envCommit !== gitCommit) throw new Error('SANITY_BUILD_EVIDENCE_COMMIT_MISMATCH')
  const candidateCommit = envCommit || gitCommit
  if (!COMMIT_PATTERN.test(candidateCommit || '')) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_COMMIT')
  return candidateCommit
}

export async function buildSanityEvidence({candidateCommit, reads, fetchImpl = fetch}) {
  if (!COMMIT_PATTERN.test(candidateCommit || '')) throw new Error('SANITY_BUILD_EVIDENCE_INVALID_COMMIT')
  if (!Array.isArray(reads) || reads.length === 0) throw new Error('SANITY_BUILD_EVIDENCE_READS_MISSING')

  const results = []
  const seenNames = new Set()
  let firstPublishedProduct = ''
  let firstPublishedArticle = ''

  for (const read of reads) {
    if (!READ_NAME_PATTERN.test(read?.name || '') || seenNames.has(read.name) || typeof read.query !== 'string' || !read.query) {
      throw new Error('SANITY_BUILD_EVIDENCE_INVALID_READ_DEFINITION')
    }
    seenNames.add(read.name)
    const params = resolveParams(read.params, {firstPublishedProduct, firstPublishedArticle})
    const url = new URL(`https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`)
    url.searchParams.set('query', read.query)
    url.searchParams.set('perspective', 'published')
    url.searchParams.set('returnQuery', 'false')
    for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value))

    let response
    try {
      response = await fetchImpl(url, {method: 'GET', headers: {Accept: 'application/json'}})
    } catch {
      throw new Error(`SANITY_BUILD_EVIDENCE_NETWORK:${read.name}`)
    }

    let body
    try {
      body = await response.text()
    } catch {
      throw new Error(`SANITY_BUILD_EVIDENCE_NETWORK:${read.name}`)
    }
    if (!response.ok) throw new Error(`SANITY_BUILD_EVIDENCE_HTTP:${read.name}:${response.status}`)

    let payload
    try {
      payload = JSON.parse(body)
    } catch {
      throw new Error(`SANITY_BUILD_EVIDENCE_JSON:${read.name}`)
    }
    if (!Object.hasOwn(payload, 'result')) throw new Error(`SANITY_BUILD_EVIDENCE_RESULT_MISSING:${read.name}`)

    if (read.name === 'products' && Array.isArray(payload.result)) {
      firstPublishedProduct = String(payload.result[0]?.slug || '')
    }
    if (read.name === 'articles' && Array.isArray(payload.result)) {
      firstPublishedArticle = String(payload.result[0]?.slug || '')
    }

    results.push({
      name: read.name,
      method: 'GET',
      params,
      querySha256: sha256(read.query),
      responseSha256: sha256(JSON.stringify(payload.result)),
      resultKind: Array.isArray(payload.result) ? 'array' : payload.result === null ? 'null' : typeof payload.result,
      resultCount: Array.isArray(payload.result) ? payload.result.length : payload.result == null ? 0 : 1,
    })
  }

  return {
    schemaVersion: 1,
    candidateCommit,
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    transport: 'GET_ONLY',
    perspective: 'published',
    authentication: 'none',
    cmsWrites: 0,
    reads: results,
    aggregateSha256: sha256(JSON.stringify(results)),
  }
}

export function toSanityBuildIdInput(evidence) {
  assertEvidenceShape(evidence)
  const {candidateCommit: _candidateCommit, ...input} = evidence
  return JSON.parse(JSON.stringify(input))
}

export function writeSanityEvidenceArtifacts({root, evidence}) {
  assertEvidenceShape(evidence)
  mkdirSync(resolve(root, '.poxiol-build'), {recursive: true})
  writeFileSync(resolve(root, SANITY_BUILD_EVIDENCE_PATH), `${JSON.stringify(evidence, null, 2)}\n`)
  writeFileSync(resolve(root, SANITY_BUILD_ID_INPUT_PATH), `${JSON.stringify(toSanityBuildIdInput(evidence), null, 2)}\n`)
}

export function readSanityBuildEvidence({root}) {
  let evidence
  try {
    evidence = JSON.parse(readFileSync(resolve(root, SANITY_BUILD_EVIDENCE_PATH), 'utf8'))
  } catch {
    throw new Error('SANITY_BUILD_EVIDENCE_READ_FAILED')
  }
  return assertEvidenceShape(evidence)
}

export async function captureSanityBuildEvidence({root, candidateCommit, reads, fetchImpl = fetch}) {
  const evidence = await buildSanityEvidence({candidateCommit, reads, fetchImpl})
  writeSanityEvidenceArtifacts({root, evidence})
  return evidence
}

export async function verifySanityBuildEvidence({
  root,
  candidateCommit,
  reads,
  fetchImpl = fetch,
  buildId,
  expectedBuildId,
}) {
  const baseline = readSanityBuildEvidence({root})
  const current = await buildSanityEvidence({candidateCommit, reads, fetchImpl})
  assertBuildEvidenceStable({baseline, current, candidateCommit, buildId, expectedBuildId})
  return current
}

export function assertBuildEvidenceStable({baseline, current, candidateCommit, buildId, expectedBuildId}) {
  assertEvidenceShape(baseline)
  assertEvidenceShape(current)
  if (!COMMIT_PATTERN.test(candidateCommit || '') || baseline.candidateCommit !== candidateCommit || current.candidateCommit !== candidateCommit) {
    throw new Error('SANITY_BUILD_EVIDENCE_COMMIT_MISMATCH')
  }
  if (JSON.stringify(toSanityBuildIdInput(baseline)) !== JSON.stringify(toSanityBuildIdInput(current))) {
    throw new Error('SANITY_BUILD_EVIDENCE_DRIFT')
  }
  if (!BUILD_ID_PATTERN.test(buildId || '') || !BUILD_ID_PATTERN.test(expectedBuildId || '') || buildId !== expectedBuildId) {
    throw new Error('SANITY_BUILD_EVIDENCE_BUILD_ID_MISMATCH')
  }
  return true
}

export function formatSanityEvidenceLog({evidence, buildId}) {
  assertEvidenceShape(evidence)
  if (!BUILD_ID_PATTERN.test(buildId || '')) throw new Error('SANITY_BUILD_EVIDENCE_BUILD_ID_MISMATCH')
  return `[sanity-build-evidence] candidate=${evidence.candidateCommit} buildId=${buildId} aggregateSha256=${evidence.aggregateSha256} reads=${evidence.reads.length} cmsWrites=0`
}
