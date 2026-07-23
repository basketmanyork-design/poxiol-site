#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const summary = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json'), 'utf8'))
const report = fs.readFileSync(path.join(root, 'docs', 'CMS_EXISTING_DRAFT_RECONCILIATION.md'), 'utf8')
const expectedDraftTotal = Object.values(summary.existingSanityDraftInventory || {}).reduce((total, count) => total + Number(count || 0), 0)
if (expectedDraftTotal !== 57) throw new Error(`Expected 57 existing drafts, got ${expectedDraftTotal}`)
if (Object.values(summary.existingPublishedInventory || {}).some((count) => Number(count) !== 0)) throw new Error('Existing published inventory must remain 0')
for (const [key, expected] of Object.entries({reuseExistingCount: 2, updateExistingCount: 40, obsoleteMvpCount: 10, corruptedExistingCount: 5, unsupportedTypeCount: 0, routeConflictCount: 0, articleConflictCount: 4, missingAltCount: 5, brokenAssetCount: 2})) {
  if (summary[key] !== expected) throw new Error(`Expected ${key}=${expected}, got ${summary[key]}`)
}
for (const required of ['reuse_existing_draft', 'update_existing_draft', 'create_new_draft', 'obsolete_mvp_candidate', 'corrupted_existing', 'manual_review', 'article-mvp', 'faq-shipping-mvp', 'U+9225? mojibake marker']) {
  if (!report.includes(required)) throw new Error(`Reconciliation report missing required marker: ${required}`)
}
if (summary.networkAccess || summary.tokenAccess || summary.sanityDatasetModified || summary.cloudflareModified || summary.schemaDeployed) throw new Error('Dry-run summary must remain read-only')
console.log('cms reconciliation validation passed')