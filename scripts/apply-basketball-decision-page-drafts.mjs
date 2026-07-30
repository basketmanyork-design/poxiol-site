import {draftPlan, resource, validatePlan} from './basketball-decision-page-plan.mjs'

validatePlan()
if (process.env.WRITE_BASKETBALL_DRAFTS_ONLY !== 'WRITE_BASKETBALL_DRAFTS_ONLY') {
  throw new Error('confirmation-missing')
}
const token = process.env.SANITY_AUTH_TOKEN
if (!token) throw new Error('auth-missing')

const endpoint = `https://${resource.projectId}.api.sanity.io/v2026-07-30/data/mutate/${resource.dataset}?returnIds=true&visibility=sync`
const mutations = draftPlan.map(({id, expectedRevision, set}) => ({
  patch: {id, ifRevisionID: expectedRevision, set},
}))
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({mutations, transactionId: 'basketball-product-deep-optimization-sprint-1'}),
})

if (!response.ok) {
  const code = response.status === 409 ? 'revision-conflict' : response.status === 401 ? 'auth-missing' : response.status === 403 ? 'write-permission-denied' : 'draft-write-failed'
  throw new Error(code)
}
console.log(JSON.stringify({status: 'drafts-updated', documentIds: draftPlan.map((item) => item.id)}))
