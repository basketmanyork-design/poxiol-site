import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const summary = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), 'utf8'))
const report = fs.readFileSync(path.join(root, 'docs', 'CMS_EXISTING_DRAFT_RECONCILIATION.md'), 'utf8')
const expectedDraftTotal = Object.values(summary.existingSanityDraftInventory || {}).reduce((total, count) => total + Number(count || 0), 0)
if (expectedDraftTotal !== 57) throw new Error(`Expected 57 existing drafts, got ${expectedDraftTotal}`)
if (Object.values(summary.existingPublishedInventory || {}).some((count) => Number(count) !== 0)) throw new Error('Existing published inventory must remain 0')
for (const [key, expected] of Object.entries({reuseExistingCount: 2, updateExistingCount: 40, obsoleteMvpCount: 10, corruptedExistingCount: 5, unsupportedTypeCount: 0, routeConflictCount: 0, articleConflictCount: 0, missingSeoCount: 0, missingAltCount: 0, brokenAssetCount: 0, visualBlockingCount: 0, corruptedExistingWithoutPlan: 0, obsoleteMvpWithoutDecision: 0})) {
  if (summary[key] !== expected) throw new Error(`Expected ${key}=${expected}, got ${summary[key]}`)
}
for (const required of ['reuse_existing_draft', 'update_existing_draft', 'create_new_draft', 'obsolete_mvp_candidate', 'corrupted_existing', 'manual_review', 'article-mvp', 'faq-shipping-mvp', 'U+9225? mojibake marker', 'merge_then_discard', 'replace_then_discard', 'corruptedExistingWithoutPlan: 0', 'obsoleteMvpWithoutDecision: 0', 'Corrupted Case Study Draft Plan', 'USA Basketball Academy Uniform Program', 'usa-basketball-academy-uniform-program', 'Australia Soccer Club Home and Away Kit Launch', 'australia-soccer-club-home-away-kit-launch', 'Canada School Multi-sport Teamwear Rollout', 'canada-school-multi-sport-teamwear-rollout', 'Middle East Club Event Fast-turnaround Program', 'middle-east-club-event-fast-turnaround-program', 'Distributor Private Label Teamwear Supply Program', 'distributor-private-label-teamwear-supply-program', 'current action: no Patch']) {
  if (!report.includes(required)) throw new Error(`Reconciliation report missing required marker: ${required}`)
}
if (report.includes('undefined')) throw new Error('Reconciliation report must not contain undefined placeholders')
if (summary.networkAccess || summary.tokenAccess || summary.sanityDatasetModified || summary.cloudflareModified || summary.schemaDeployed) throw new Error('Dry-run summary must remain read-only')
console.log('cms reconciliation validation passed')
