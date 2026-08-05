import {writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {draftPlan, resource, validatePlan} from './high-intent-guides-draft-plan.mjs'

validatePlan()
const applyRequested = process.env.WRITE_HIGH_INTENT_GUIDES_DRAFTS_ONLY === 'WRITE_HIGH_INTENT_GUIDES_DRAFTS_ONLY'
const token = applyRequested ? process.env.SANITY_WRITE_TOKEN : process.env.SANITY_READ_TOKEN
if (!token) throw new Error(applyRequested ? 'write-token-missing' : 'read-token-missing')

const apiVersion = '2024-01-01'
const allIds = draftPlan.flatMap(({draftId, publishedId}) => [draftId, publishedId])

async function query(queryText, params = {}) {
  const endpoint = new URL(`https://${resource.projectId}.api.sanity.io/v${apiVersion}/data/query/${resource.dataset}`)
  endpoint.searchParams.set('query', queryText)
  endpoint.searchParams.set('perspective', 'raw')
  for (const [key, value] of Object.entries(params)) endpoint.searchParams.set(`$${key}`, JSON.stringify(value))
  const response = await fetch(endpoint, {headers: {Authorization: `Bearer ${token}`}})
  if (!response.ok) throw new Error(`sanity-read-http-${response.status}`)
  return (await response.json()).result
}

async function readState() {
  const [documents, releaseCount] = await Promise.all([
    query('*[_id in $ids]{_id,_rev,_type,title,"slug":slug.current,publishStatus}', {ids: allIds}),
    query('count(*[_type == "system.release"])'),
  ])
  return {documents, releaseCount}
}

const before = await readState()
if (before.releaseCount !== 0) throw new Error('sanity-release-count-not-zero')
const beforeById = new Map(before.documents.map((document) => [document._id, document]))
for (const item of draftPlan) {
  const draft = beforeById.get(item.draftId)
  if (item.expectedDraftRevision) {
    if (!draft || draft._rev !== item.expectedDraftRevision || draft._type !== 'article' || draft.slug !== item.slug) throw new Error(`draft-revision-guard-mismatch:`)
  } else if (draft) {
    throw new Error(`new-draft-id-collision:`)
  }
  const published = beforeById.get(item.publishedId)
  if (item.expectedPublishedRevision) {
    if (!published || published._rev !== item.expectedPublishedRevision || published._type !== 'article') throw new Error(`published-revision-guard-mismatch:`)
  } else if (published) {
    throw new Error(`new-published-id-collision:`)
  }
}

if (!applyRequested) {
  console.log(JSON.stringify({status: 'dry-run-passed', count: draftPlan.length, publishedWrites: 0, releaseCount: before.releaseCount, documentIds: draftPlan.map(({draftId}) => draftId)}))
  process.exit(0)
}

const endpoint = `https://${resource.projectId}.api.sanity.io/v${apiVersion}/data/mutate/${resource.dataset}?returnDocuments=true&visibility=sync`
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({mutations: draftPlan.map((item) => item.expectedDraftRevision ? ({patch: {id: item.draftId, ifRevisionID: item.expectedDraftRevision, set: Object.fromEntries(Object.entries(item.document).filter(([key]) => !['_id', '_type'].includes(key)))}}) : ({create: item.document})), transactionId: 'high-intent-guides-week2-drafts-only-20260805'}),
})
if (!response.ok) throw new Error(response.status === 409 ? 'revision-conflict' : response.status === 403 ? 'write-permission-denied' : `draft-write-http-${response.status}`)

const after = await readState()
if (after.releaseCount !== 0) throw new Error('sanity-release-created-unexpectedly')
const afterById = new Map(after.documents.map((document) => [document._id, document]))
const documents = draftPlan.map((item) => {
  const draft = afterById.get(item.draftId)
  if (!draft || !draft._rev || draft._type !== 'article' || draft.slug !== item.slug || draft.publishStatus !== 'draft') throw new Error(`draft-post-write-verification-failed:${item.draftId}`)
  const published = afterById.get(item.publishedId)
  if (item.expectedPublishedRevision && published?._rev !== item.expectedPublishedRevision) throw new Error(`published-changed-unexpectedly:${item.publishedId}`)
  if (!item.expectedPublishedRevision && published) throw new Error(`new-published-write-detected:${item.publishedId}`)
  return {slug: item.slug, draftId: item.draftId, publishedId: item.publishedId, type: 'article', publishStatus: 'draft', beforeRevision: beforeById.get(item.draftId)?._rev || null, lockedRevision: draft._rev, publishedRevisionBeforePreview: published?._rev || null}
})

const ledger = {mode: 'sanity-preview', perspective: 'drafts', useCdn: false, publishedWritesBeforePreview: 0, releaseCountBeforePreview: before.releaseCount, releaseCountAfterDraftWrite: after.releaseCount, documents}
const serialized = `${JSON.stringify(ledger, null, 2)}\n`
await writeFile(new URL('../docs/HIGH_INTENT_GUIDES_WEEK2_DRAFT_LEDGER.json', import.meta.url), serialized, 'utf8')
console.log(JSON.stringify({status: 'drafts-created', count: documents.length, publishedWrites: 0, releaseCount: after.releaseCount, ledgerSha256: createHash('sha256').update(serialized).digest('hex'), documentIds: documents.map(({draftId}) => draftId)}))
