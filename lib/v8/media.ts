import type {V8MediaAsset, V8MediaSlot} from './types.ts'
import type {CmsProductionMediaSet, CmsVerifiedMediaAsset} from '../cms/types'

export const V8_MEDIA_FALLBACK = 'Verified production visual pending'

export const V8_MEDIA_SLOTS: readonly V8MediaSlot[] = [
  {id: 'fabric-inspection', label: 'Fabric inspection', kind: 'image'},
  {id: 'printing', label: 'Printing', kind: 'image'},
  {id: 'cutting', label: 'Cutting', kind: 'image'},
  {id: 'sewing', label: 'Sewing', kind: 'image'},
  {id: 'qc', label: 'Quality control', kind: 'image'},
  {id: 'packing', label: 'Packing', kind: 'image'},
  {id: 'factory-overview-video', label: 'Factory overview', kind: 'video'},
  {id: 'production-workflow-video', label: 'Production workflow', kind: 'video'},
  {id: 'quality-inspection-video', label: 'Quality inspection', kind: 'video'},
] as const

export function resolveVerifiedMedia(asset?: V8MediaAsset | null): V8MediaAsset | null {
  if (!asset?.verified || !asset.url.trim()) return null
  if (asset.kind === 'image' && !asset.alt?.trim()) return null
  if (asset.kind === 'video' && !asset.poster?.trim()) return null
  return asset
}

function cmsMediaAsset(id: string, asset?: CmsVerifiedMediaAsset): V8MediaAsset | null {
  if (!asset) return null
  const slot = V8_MEDIA_SLOTS.find((item) => item.id === asset.stage)
  if (!slot || slot.kind !== asset.kind) return null
  return resolveVerifiedMedia({
    id,
    kind: asset.kind,
    stage: slot.id,
    url: asset.url,
    poster: asset.poster,
    alt: asset.alt,
    caption: asset.caption,
    verified: asset.verified,
  })
}

export function cmsProductionMediaToV8Assets(media?: CmsProductionMediaSet): V8MediaAsset[] {
  if (!media) return []
  return Object.entries(media)
    .map(([id, asset]) => cmsMediaAsset(id, asset))
    .filter((asset): asset is V8MediaAsset => Boolean(asset))
}
