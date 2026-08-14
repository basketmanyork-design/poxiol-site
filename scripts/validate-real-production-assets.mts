import {existsSync, readFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {canPublishProductionAsset, publicationIssues} from '../lib/real-production/policy.ts'
import type {RealProductionManifest} from '../lib/real-production/types.ts'

export function validateManifest(manifest: RealProductionManifest, options: {checkFiles?: boolean} = {}) {
  const checkFiles = options.checkFiles !== false
  const ids = new Set<string>()
  const paths = new Set<string>()
  const issues = manifest.assets.map((asset, index) => {
    const itemIssues = publicationIssues(asset)
    if (ids.has(asset.assetId)) itemIssues.push('duplicate-asset-id')
    if (paths.has(asset.publicPath)) itemIssues.push('duplicate-public-path')
    ids.add(asset.assetId)
    paths.add(asset.publicPath)
    if (checkFiles && !existsSync(`public${asset.publicPath}`)) itemIssues.push('missing-public-file')
    if (checkFiles && asset.mediaType === 'video' && asset.posterPath && !existsSync(`public${asset.posterPath}`)) itemIssues.push('missing-poster-file')
    return {assetId: asset.assetId || `record-${index + 1}`, issues: Array.from(new Set(itemIssues))}
  }).filter((item) => item.issues.length)
  const blockedIds = new Set(issues.map((item) => item.assetId))
  return {total: manifest.assets.length, publishable: manifest.assets.filter((asset) => canPublishProductionAsset(asset) && !blockedIds.has(asset.assetId)).length, blocked: issues.length, issues}
}

export function approvalSummary(manifest: RealProductionManifest, options: {checkFiles?: boolean} = {}): string {
  const result = validateManifest(manifest, options)
  const issueMap = new Map(result.issues.map((item) => [item.assetId, item.issues]))
  const rows = manifest.assets.map((asset) => {const issues=issueMap.get(asset.assetId)||[];return `| ${asset.assetId} | ${asset.verificationStatus} | ${issues.length ? 'BLOCKED' : 'PUBLISHABLE'} | ${issues.join(', ') || 'None'} |`}).join('\n') || '| None | — | — | Empty approved asset registry |'
  return `# POXIOL Real Production Approval Summary\n\nVerified asset count: ${result.publishable}\n\nBlocked asset count: ${result.blocked}\n\n| Asset | Verification | Decision | Issues |\n| --- | --- | --- | --- |\n${rows}\n`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifest = JSON.parse(readFileSync('content/real-production/manifest/assets.json', 'utf8')) as RealProductionManifest
  console.log(JSON.stringify(validateManifest(manifest), null, 2))
}
