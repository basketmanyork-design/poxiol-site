import {draftPlan, resource, validatePlan} from './buyer-decision-draft-plan.mjs'

validatePlan()
const applyRequested = process.env.WRITE_BUYER_DECISION_DRAFTS_ONLY === 'WRITE_BUYER_DECISION_DRAFTS_ONLY'
const token = applyRequested ? process.env.SANITY_WRITE_TOKEN : process.env.SANITY_READ_TOKEN
if (!token) throw new Error(applyRequested ? 'write-token-missing' : 'read-token-missing')

async function readDraftGuards(authToken) {
  const queryEndpoint = `https://${resource.projectId}.api.sanity.io/v2024-01-01/data/query/${resource.dataset}`
  const query = '*[_id in $ids]{_id,_rev,_type,pageKey}'
  const queryUrl = new URL(queryEndpoint)
  queryUrl.searchParams.set('query', query)
  queryUrl.searchParams.set('$ids', JSON.stringify(draftPlan.map((item) => item.id)))
  queryUrl.searchParams.set('perspective', 'raw')
  const response = await fetch(queryUrl, {headers: {Authorization: `Bearer ${authToken}`}})
  if (!response.ok) throw new Error(`draft-guard-read-http-${response.status}`)
  const body = await response.json()
  return new Map((body.result || []).map((doc) => [doc._id, doc]))
}

const byId = await readDraftGuards(token)
for (const item of draftPlan) {
  const doc = byId.get(item.id)
  if (!doc || doc._rev !== item.expectedRevision || doc._type !== 'sitePage') throw new Error(`draft-revision-guard-mismatch:${item.id}`)
}

if (!applyRequested) {
  console.log(JSON.stringify({
    status: 'dry-run-passed',
    count: draftPlan.length,
    documents: draftPlan.map((item) => ({id: item.id, expectedRevision: item.expectedRevision, fieldPaths: Object.keys(item.set)})),
  }, null, 2))
  process.exit(0)
}

const mutations = draftPlan.map(({id, expectedRevision, set}) => ({
  patch: {id, ifRevisionID: expectedRevision, set},
}))
const endpoint = `https://${resource.projectId}.api.sanity.io/v2024-01-01/data/mutate/${resource.dataset}?returnIds=true&visibility=sync`
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({mutations, transactionId: 'buyer-decision-clarity-20260805-drafts-only'}),
})
if (!response.ok) {
  const code = response.status === 409 ? 'revision-conflict' : response.status === 401 ? 'auth-missing' : response.status === 403 ? 'write-permission-denied' : `draft-write-http-${response.status}`
  throw new Error(code)
}

const afterById = await readDraftGuards(token)
for (const item of draftPlan) {
  const before = byId.get(item.id)
  const after = afterById.get(item.id)
  if (!after || after._rev === before._rev) throw new Error(`draft-post-write-verification-failed:${item.id}`)
}
console.log(JSON.stringify({status: 'drafts-updated', count: draftPlan.length, documentIds: draftPlan.map((item) => item.id)}))