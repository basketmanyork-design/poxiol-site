import {createHash} from 'node:crypto'
import {draftPlan, validatePlan} from './basketball-decision-page-plan.mjs'

validatePlan()
const summary = draftPlan.map(({id, expectedRevision, role, set}) => ({
  id,
  expectedRevision,
  role,
  changedFields: Object.keys(set).sort(),
}))
const canonical = JSON.stringify(summary)
console.log(JSON.stringify({
  mode: 'dry-run',
  documents: summary,
  digest: createHash('sha256').update(canonical).digest('hex'),
}, null, 2))
