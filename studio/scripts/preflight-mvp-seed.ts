/**
 * Read-only POXIOL MVP seed preflight.
 *
 * This script only issues GROQ fetch queries. It has no mutation client calls.
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

interface PreflightResult {
  runAt: string
  mode: 'PREFLIGHT_ONLY'
  projectId: string
  dataset: string
  authMode: 'repository-secret'
  queryOnly: true
  mutationAttempted: false
  requestTotal: number
  queryCompleted: boolean
  existingDraftTotal: number
  matchingDraftTotal: number
  conflictingDraftTotal: number
  missingDraftTotal: number
  publishedRootCollisionTotal: number
  matchingDraftIds: string[]
  conflictingDraftIds: string[]
  missingDraftIds: string[]
  publishedRootCollisionIds: string[]
  duplicateIds: number
  invalidReferences: number
  piiMatches: number
  secretMatches: number
  blockedRiskWords: number
  preflightPassed: boolean
  failureCode?: string
}

function initialResult(): PreflightResult {
  return {
    runAt: new Date().toISOString(),
    mode: 'PREFLIGHT_ONLY',
    projectId: PROJECT_ID,
    dataset: DATASET,
    authMode: 'repository-secret',
    queryOnly: true,
    mutationAttempted: false,
    requestTotal: SEED_DOCS.length,
    queryCompleted: false,
    existingDraftTotal: 0,
    matchingDraftTotal: 0,
    conflictingDraftTotal: 0,
    missingDraftTotal: 0,
    publishedRootCollisionTotal: 0,
    matchingDraftIds: [],
    conflictingDraftIds: [],
    missingDraftIds: [],
    publishedRootCollisionIds: [],
    ...getPlanMetrics(),
    preflightPassed: false,
  }
}

function writeResult(result: PreflightResult): void {
  const fs = require('fs')
  const path = require('path')
  const outDir = path.resolve(__dirname, '../../migration-output')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true})
  fs.writeFileSync(path.join(outDir, 'mvp-preflight-result.json'), JSON.stringify(result, null, 2))
}

async function preflight(): Promise<void> {
  const result = initialResult()
  const draftIds = getDraftIds()
  const rootIds = getRootIds()

  try {
    if (!process.env.SANITY_AUTH_TOKEN) throw new Error('auth-missing')
    if (SEED_DOCS.some((doc) => !doc._id.startsWith('drafts.'))) throw new Error('non-draft-id')
    if (result.duplicateIds || result.invalidReferences || result.piiMatches || result.secretMatches || result.blockedRiskWords) {
      throw new Error('static-plan-failed')
    }

    result.publishedRootCollisionIds = await client.fetch<string[]>(`*[_id in $rootIds]._id`, {rootIds})
    const existing = await client.fetch<SeedDocument[]>(`*[_id in $draftIds]`, {draftIds})
    const expectedById = new Map(SEED_DOCS.map((doc) => [doc._id, doc]))
    const existingById = new Map(existing.map((doc) => [doc._id, doc]))

    result.matchingDraftIds = draftIds.filter((id) => {
      const actual = existingById.get(id)
      const expected = expectedById.get(id)
      return Boolean(actual && expected && sameDocument(actual, expected))
    })
    result.conflictingDraftIds = draftIds.filter((id) => {
      const actual = existingById.get(id)
      const expected = expectedById.get(id)
      return Boolean(actual && expected && !sameDocument(actual, expected))
    })
    result.missingDraftIds = draftIds.filter((id) => !existingById.has(id))

    result.existingDraftTotal = existing.length
    result.matchingDraftTotal = result.matchingDraftIds.length
    result.conflictingDraftTotal = result.conflictingDraftIds.length
    result.missingDraftTotal = result.missingDraftIds.length
    result.publishedRootCollisionTotal = result.publishedRootCollisionIds.length
    result.queryCompleted = true
    result.preflightPassed =
      result.publishedRootCollisionTotal === 0 &&
      result.conflictingDraftTotal === 0 &&
      result.existingDraftTotal + result.missingDraftTotal === result.requestTotal
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown-failure'
    const allowedCodes = new Set(['auth-missing', 'non-draft-id', 'static-plan-failed'])
    result.failureCode = allowedCodes.has(code) ? code : 'query-failed'
    result.preflightPassed = false
    console.error(`MVP preflight stopped: ${result.failureCode}`)
  }

  writeResult(result)
  console.log(`MVP preflight result: ${result.preflightPassed ? 'PASSED' : 'BLOCKED'}`)
}

preflight()
