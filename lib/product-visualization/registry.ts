import manifest from '@/content/product-visualization/assets.json'
import assetAllowlist from '@/content/release/asset-allowlist.json'
import {canDisplayProductVisualization} from './policy.ts'
import type {ProductVisualizationAsset, ProductVisualizationRecord} from './types.ts'

const dimensions: Record<string, {width: number; height: number}> = {
  'PV-HOME-001': {width: 1800, height: 1350},
  'PV-BASK-001': {width: 1400, height: 1400},
  'PV-BASK-002': {width: 1400, height: 1400},
  'PV-BASK-003': {width: 1400, height: 1400},
  'PV-BASK-004': {width: 1400, height: 1400},
  'PV-BASK-005': {width: 1200, height: 1200},
  'PV-BASK-006': {width: 1200, height: 1200},
  'PV-BASK-007': {width: 1200, height: 1200},
  'PV-BASK-008': {width: 1400, height: 1400},
  'PV-CUSTOM-001': {width: 1400, height: 1400},
  'PV-SOCCER-001': {width: 1400, height: 1400},
  'PV-BASEBALL-001': {width: 1400, height: 1400},
  'PV-BASK-009': {width: 1200, height: 1200},
  'PV-BASK-010': {width: 1200, height: 1200},
}

const finalVisualizationAllowlist = new Map(
  assetAllowlist
    .filter((item) => item.allowedUse === 'product-visualization')
    .map((item) => [item.assetId, item]),
)

function passesFinalVisualizationAllowlist(assetId: string, publicPath: string): boolean {
  const review = finalVisualizationAllowlist.get(assetId)
  return Boolean(
    review &&
      review.path === publicPath &&
      review.classification === 'ILLUSTRATION_NON_PROOF' &&
      review.thirdPartyMarkReview === 'PASS' &&
      review.poxiolMarkReview === 'PASS_RETAINED',
  )
}

export const PRODUCT_VISUALIZATIONS: readonly ProductVisualizationAsset[] = (manifest as ProductVisualizationRecord[]).map((record) => ({
  ...record,
  publicPath: `/product-visualization/${record.publicFile}`,
  ...dimensions[record.assetId],
}))

const byId = new Map(PRODUCT_VISUALIZATIONS.map((asset) => [asset.assetId, asset]))

export function getProductVisualization(assetId: string): ProductVisualizationAsset {
  const asset = byId.get(assetId)
  if (!asset || !passesFinalVisualizationAllowlist(asset.assetId, asset.publicPath) || !canDisplayProductVisualization(asset)) throw new Error(`Product visualization is unavailable: ${assetId}`)
  return asset
}

export function getProductVisualizationsForPage(page: string): ProductVisualizationAsset[] {
  return PRODUCT_VISUALIZATIONS.filter((asset) => passesFinalVisualizationAllowlist(asset.assetId, asset.publicPath) && asset.recommendedPages.includes(page) && canDisplayProductVisualization(asset, page))
}

export const BASKETBALL_VISUALIZATION_SEQUENCE = [
  'PV-BASK-001',
  'PV-BASK-002',
  'PV-BASK-003',
  'PV-BASK-004',
  'PV-BASK-005',
  'PV-BASK-006',
  'PV-BASK-009',
  'PV-BASK-007',
  'PV-BASK-010',
].map(getProductVisualization)
