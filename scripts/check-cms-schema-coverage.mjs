#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const summaryPath = path.join(root, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json')
const schemaPath = path.join(root, 'studio', 'schemaTypes', 'index.ts')
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
const schema = fs.readFileSync(schemaPath, 'utf8')
const match = schema.match(/export const schemaTypes = \[([\s\S]*?)\]/)
if (!match) throw new Error('Unable to parse studio/schemaTypes/index.ts schemaTypes export')
const supported = new Set(match[1].split(',').map((item) => item.trim()).filter(Boolean))
const unsupported = Object.keys(summary.plannedDocumentsByType || {}).filter((type) => !supported.has(type))
if (summary.unsupportedTypeCount !== 0) throw new Error(`Expected unsupportedTypeCount=0, got ${summary.unsupportedTypeCount}`)
if (unsupported.length) throw new Error(`Planned types not registered in Studio schema: ${unsupported.join(', ')}`)
for (const forbidden of ['contactCard', 'homepageSportCategoryCard', 'inquiryType']) {
  if (summary.plannedDocumentsByType?.[forbidden]) throw new Error(`Unsupported migration document type still planned: ${forbidden}`)
}
if (!summary.plannedDocumentsByType?.procurementStandards) throw new Error('procurementStandards singleton is missing from dry-run plan')
console.log('cms schema coverage validation passed')