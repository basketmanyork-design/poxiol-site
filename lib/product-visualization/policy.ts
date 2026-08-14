import type {ProductVisualizationAsset} from './types.ts'

const REQUIRED_PROHIBITIONS = [
  'real production proof',
  'real factory proof',
  'real QC proof',
  'real customer project proof',
] as const

export function productVisualizationIssues(asset: ProductVisualizationAsset, page?: string): string[] {
  const issues: string[] = []
  if (asset.classification !== 'PRODUCT_VISUALIZATION') issues.push('classification')
  if (asset.generatedByAI !== true) issues.push('generation-record')
  if (asset.thirdPartyLogoAudit !== 'PASS_MANUAL_VISUAL_REVIEW') issues.push('logo-audit')
  if (!asset.assetId.startsWith('PV-')) issues.push('asset-id')
  if (!asset.publicFile.endsWith('.webp') || asset.publicPath !== `/product-visualization/${asset.publicFile}`) issues.push('public-file')
  if (!asset.packagePath.endsWith(`/${asset.publicFile}`)) issues.push('package-path')
  if (!asset.alt.trim() || !asset.caption.trim()) issues.push('accessibility-copy')
  if (!asset.width || !asset.height) issues.push('dimensions')
  if (REQUIRED_PROHIBITIONS.some((label) => !asset.prohibitedUse.includes(label))) issues.push('proof-prohibition')
  if (page && !asset.recommendedPages.includes(page)) issues.push('page-mapping')
  return Array.from(new Set(issues))
}

export function canDisplayProductVisualization(asset: ProductVisualizationAsset, page?: string): boolean {
  return productVisualizationIssues(asset, page).length === 0
}
