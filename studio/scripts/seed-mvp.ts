/**
 * POXIOL CMS MVP Seed.
 *
 * Safety guarantees:
 * - only handles drafts.* document IDs;
 * - never replaces, patches, publishes, or deletes documents;
 * - aborts before mutation on published-root or draft-content collisions;
 * - can be repeated when existing drafts exactly match the shared seed plan.
 */

import {getCliClient} from 'sanity/cli'
import {
  API_VERSION,
  DATASET,
  PROJECT_ID,
  SEED_DOCS,
  SeedDocument,
  getDraftIds,
  getPlanMetrics,
  getRootIds,
  sameDocument,
} from './mvp-seed-plan'

function createAuthenticatedClient() {
  const token = process.env.SANITY_AUTH_TOKEN

  if (!token) {
    throw new Error('auth-missing')
  }

  return getCliClient().withConfig({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: false,
    token,
  })
}

const PERMISSION_CHECK_DOCUMENT: SeedDocument = {
  _id: 'drafts.poxiol-mvp-permission-check',
  _type: 'faqItem',
  question: 'POXIOL MVP write permission check',
  answer: [],
}

interface SeedResult {
  runAt: string
  projectId: string
  dataset: string
  authMode: 'repository-secret'
  authenticatedClientConfigured: boolean
  writePermissionDryRunPassed: boolean
  requestTotal: number
  createdTotal: number
  updatedTotal: number
  unchangedTotal: number
  failedTotal: number
  draftDocumentsFound: number
  contentMatches: number
  publishedDocumentsFound: number
  duplicateIds: number
  invalidReferences: number
  piiMatches: number
  secretMatches: number
  blockedRiskWords: number
  transactionCommitted: boolean
  seedPassed: boolean
  failureCode?: string
  failureStatus?: number
}

const LOCAL_FAILURE_CODES = new Set([
  'auth-missing',
  'non-draft-id',
  'static-preflight-failed',
  'published-root-collision',
  'draft-content-collision',
])

function getFailureStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined
  const record = error as Record<string, unknown>
  const response = record.response && typeof record.response === 'object'
    ? record.response as Record<string, unknown>
    : undefined
  const candidates = [record.statusCode, record.status, response?.statusCode, response?.status]
  return candidates.find((value): value is number => Number.isInteger(value) && Number(value) >= 400 && Number(value) <= 599)
}

function classifyFailure(error: unknown): {code: string; status?: number} {
  const localCode = error instanceof Error ? error.message : undefined
  if (localCode && LOCAL_FAILURE_CODES.has(localCode)) return {code: localCode}

  const status = getFailureStatus(error)
  if (status === 401) return {code: 'auth-unauthorized', status}
  if (status === 403) return {code: 'write-permission-denied', status}
  if (status === 409) return {code: 'mutation-conflict', status}
  if (status === 429) return {code: 'rate-limited', status}
  if (status && status >= 500) return {code: 'sanity-service-error', status}
  if (status === 400 || status === 422) return {code: 'mutation-validation-failed', status}
  return {code: 'seed-transaction-failed'}
}

function initialResult(): SeedResult {
  return {
    runAt: new Date().toISOString(),
    projectId: PROJECT_ID,
    dataset: DATASET,
    authMode: 'repository-secret',
    authenticatedClientConfigured: false,
    writePermissionDryRunPassed: false,
    requestTotal: SEED_DOCS.length,
    createdTotal: 0,
    updatedTotal: 0,
    unchangedTotal: 0,
    failedTotal: 0,
    draftDocumentsFound: 0,
    contentMatches: 0,
    publishedDocumentsFound: 0,
    ...getPlanMetrics(),
    transactionCommitted: false,
    seedPassed: false,
  }
}

function writeResult(result: SeedResult): void {
  const fs = require('fs')
  const path = require('path')
  const outDir = path.resolve(__dirname, '../../migration-output')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true})
  fs.writeFileSync(path.join(outDir, 'mvp-seed-result.json'), JSON.stringify(result, null, 2))
}

async function seed(): Promise<void> {
  const result = initialResult()
  const draftIds = getDraftIds()
  const rootIds = getRootIds()

  try {
    if (SEED_DOCS.some((doc) => !doc._id.startsWith('drafts.'))) throw new Error('non-draft-id')
    if (result.duplicateIds || result.invalidReferences || result.piiMatches || result.secretMatches || result.blockedRiskWords) {
      throw new Error('static-preflight-failed')
    }

    const client = createAuthenticatedClient()
    result.authenticatedClientConfigured = true

    await client
      .transaction()
      .createIfNotExists(PERMISSION_CHECK_DOCUMENT)
      .commit({dryRun: true})
    result.writePermissionDryRunPassed = true

    const published = await client.fetch<SeedDocument[]>(`*[_id in $rootIds]`, {rootIds})
    result.publishedDocumentsFound = published.length
    if (published.length) throw new Error('published-root-collision')

    const existing = await client.fetch<SeedDocument[]>(`*[_id in $draftIds]`, {draftIds})
    const expectedById = new Map(SEED_DOCS.map((doc) => [doc._id, doc]))
    const collisions = existing.filter((doc) => {
      const expected = expectedById.get(doc._id)
      return !expected || !sameDocument(doc, expected)
    })
    if (collisions.length) throw new Error('draft-content-collision')

    result.unchangedTotal = existing.length
    const existingIds = new Set(existing.map((doc) => doc._id))
    const missing = SEED_DOCS.filter((doc) => !existingIds.has(doc._id))

    if (missing.length) {
      await client.transaction(missing.map((doc) => ({createIfNotExists: doc}))).commit({visibility: 'sync'})
      result.transactionCommitted = true
      result.createdTotal = missing.length
    }

    const verified = await client.fetch<SeedDocument[]>(`*[_id in $draftIds]`, {draftIds})
    result.draftDocumentsFound = verified.length
    result.contentMatches = verified.filter((doc) => {
      const expected = expectedById.get(doc._id)
      return Boolean(expected && sameDocument(doc, expected))
    }).length

    const publishedAfter = await client.fetch<SeedDocument[]>(`*[_id in $rootIds]`, {rootIds})
    result.publishedDocumentsFound = publishedAfter.length
    result.seedPassed =
      result.draftDocumentsFound === result.requestTotal &&
      result.contentMatches === result.requestTotal &&
      result.publishedDocumentsFound === 0 &&
      result.createdTotal + result.unchangedTotal === result.requestTotal
  } catch (error) {
    const failure = classifyFailure(error)
    result.failureCode = failure.code
    result.failureStatus = failure.status
    result.failedTotal = result.requestTotal
    result.seedPassed = false
    console.error(`MVP seed stopped: ${result.failureCode}${result.failureStatus ? ` (${result.failureStatus})` : ''}`)
  }

  writeResult(result)
  console.log(`MVP seed result: ${result.seedPassed ? 'PASSED' : 'FAILED'}`)
  if (!result.seedPassed) process.exit(1)
}

seed()
