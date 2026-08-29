import manifest from '../../content/real-production/manifest/assets.json'
import assetAllowlist from '../../content/release/asset-allowlist.json'
import type {V8PageId} from '../v8/types.ts'
import {canPublishProductionAsset} from './policy.ts'
import type {RealProductionAsset, RealProductionManifest} from './types.ts'
import type {V8MediaAsset, V8MediaStage} from '../v8/types.ts'

const registry = manifest as RealProductionManifest
const finalEvidenceAllowlist = new Map(
  assetAllowlist
    .filter((item) => item.classification === 'EVIDENCE')
    .map((item) => [item.assetId, item]),
)

function passesFinalEvidenceAllowlist(asset: RealProductionAsset): boolean {
  const review = finalEvidenceAllowlist.get(asset.assetId)
  return Boolean(
    review &&
      review.path === asset.publicPath &&
      review.allowedUse === 'basketball-product-detail' &&
      review.thirdPartyMarkReview === 'PASS' &&
      review.poxiolMarkReview === 'PASS_RETAINED',
  )
}

export function getAllProductionAssets(): readonly RealProductionAsset[] {
  return registry.assets
}

export function getPublishedProductionAssets(): RealProductionAsset[] {
  return registry.assets.filter(
    (asset) => canPublishProductionAsset(asset) && passesFinalEvidenceAllowlist(asset),
  )
}

export function getProductionAssetsForPage(pageId: V8PageId): RealProductionAsset[] {
  return getPublishedProductionAssets().filter((asset) => asset.intendedPages.includes(pageId))
}

export function getProductionAssetsForSample(sampleId: string): RealProductionAsset[] {
  return getPublishedProductionAssets().filter((asset) => asset.sampleId === sampleId)
}

export function getProductionAssetCount(): number {
  return getPublishedProductionAssets().length
}

export function toV8MediaAsset(asset?: RealProductionAsset): V8MediaAsset | null {
  if (!asset || !canPublishProductionAsset(asset)) return null
  return {
    id: asset.assetId,
    kind: asset.mediaType === 'video' ? 'video' : 'image',
    stage: asset.category as V8MediaStage,
    url: asset.publicPath,
    alt: asset.alt,
    caption: asset.caption,
    verified: true,
    verificationNote: asset.verificationNote,
    width: asset.width,
    height: asset.height,
    poster: asset.posterPath,
  }
}

export function getV8ProductionAssetsForPage(pageId: V8PageId): V8MediaAsset[] {
  return getProductionAssetsForPage(pageId).map(toV8MediaAsset).filter((asset): asset is V8MediaAsset => Boolean(asset))
}

export function getV8ProductionAssetsForSample(sampleId: string): V8MediaAsset[] {
  return getProductionAssetsForSample(sampleId).map(toV8MediaAsset).filter((asset): asset is V8MediaAsset => Boolean(asset))
}

export function getHeroProductionAsset(pageId: V8PageId): V8MediaAsset | null {
  const assets = getProductionAssetsForPage(pageId)
  return toV8MediaAsset(assets.find((asset) => asset.category === 'full-set') || assets.find((asset) => asset.category === 'front'))
}
