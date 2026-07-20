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

const client = getCliClient().withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
})

interface SeedResult {
  runAt: string
  projectId: string
  dataset: string
  authMode: 'repository-secret'
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
}

function initialResult(): SeedResult {
  return {
    runAt: new Date().toISOString(),
    projectId: PROJECT_ID,
    dataset: DATASET,
    authMode: 'repository-secret',
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
    if (!process.env.SANITY_AUTH_TOKEN) throw new Error('auth-missing')
    if (SEED_DOCS.some((doc) => !doc._id.startsWith('drafts.'))) throw new Error('non-draft-id')
    if (result.duplicateIds || result.invalidReferences || result.piiMatches || result.secretMatches || result.blockedRiskWords) {
      throw new Error('static-preflight-failed')
    }

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
    const code = error instanceof Error ? error.message : 'unknown-failure'
    const allowedCodes = new Set(['auth-missing', 'non-draft-id', 'static-preflight-failed', 'published-root-collision', 'draft-content-collision'])
    result.failureCode = allowedCodes.has(code) ? code : 'seed-transaction-failed'
    result.failedTotal = result.requestTotal
    result.seedPassed = false
    console.error(`MVP seed stopped: ${result.failureCode}`)
  }

  writeResult(result)
  console.log(`MVP seed result: ${result.seedPassed ? 'PASSED' : 'FAILED'}`)
  if (!result.seedPassed) process.exit(1)
}

seed()
