import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const summaryPath = path.join(root, 'docs', 'CMS_MIGRATION_DRY_RUN_SUMMARY.json')
const visualPath = path.join(root, 'docs', 'CMS_VISUAL_REGRESSION_REPORT.md')
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
const expectedZero = ['articleConflictCount', 'routeConflictCount', 'missingSeoCount', 'missingAltCount', 'brokenAssetCount', 'visualBlockingCount', 'corruptedExistingWithoutPlan', 'obsoleteMvpWithoutDecision']
for (const key of expectedZero) {
  if (summary[key] !== 0) throw new Error(`Expected ${key}=0, got ${summary[key]}`)
}
const assetPaths = [
  '/images/poxiol-v62/project_soccer_club_v62.png',
  '/images/poxiol-v6/projects_basketball_academy_uniform_program.png',
]
for (const assetPath of assetPaths) {
  if (!fs.existsSync(path.join(root, 'public', assetPath.replace(/^\/+/, '')))) throw new Error(`Expected asset to exist: ${assetPath}`)
}
const report = fs.readFileSync(visualPath, 'utf8')
if (!report.includes('visualBlockingCount: 0')) throw new Error('Visual report must record visualBlockingCount: 0')
if (/CMS Managed|Legacy fallback|Sanity CMS|Resolver|Production integration|content is available|can be overridden/.test(report)) throw new Error('Visual report contains buyer-facing technical wording')
console.log('cms content blocker checks passed')
