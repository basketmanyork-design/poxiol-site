import type {CmsMode} from './types'
import {isDocumentVisible, type PublishStatus} from './visibility'

export type CmsListMode = 'merge' | 'strict'
export type SourceState = 'ok' | 'failed' | 'legacy'

export function getCmsListMode(): CmsListMode {
  return process.env.CMS_LEGACY_LIST_MODE === 'strict' ? 'strict' : 'merge'
}

export type Slugged = {slug: string}
export type StatusedSlugged = {slug?: string; publishStatus?: PublishStatus | string | null}

export function mergeCmsList<TLegacy extends Slugged, TCms extends StatusedSlugged, TResult extends Slugged>(args: {
  legacy: TLegacy[]
  cms: TCms[]
  sourceState: SourceState
  mode: CmsListMode
  contentSource: CmsMode
  mapCms: (item: TCms, fallback: TLegacy | undefined, index: number) => TResult | null
  mapLegacy?: (item: TLegacy) => TResult
}): TResult[] {
  const mapLegacy = args.mapLegacy || ((item: TLegacy) => item as unknown as TResult)
  if (args.contentSource === 'legacy') return args.legacy.map(mapLegacy)
  if (args.sourceState === 'failed') return args.legacy.map(mapLegacy)

  const cmsWithSlug = args.cms.filter((item): item is TCms & {slug: string} => Boolean(item.slug))
  const legacyBySlug = new Map(args.legacy.map((item) => [item.slug, item]))
  const suppressed = new Set(cmsWithSlug.filter((item) => item.publishStatus === 'unpublished').map((item) => item.slug))
  const cmsVisible = cmsWithSlug
    .map((item, index) => isDocumentVisible(item.publishStatus, args.contentSource) ? args.mapCms(item, legacyBySlug.get(item.slug), index) : null)
    .filter(Boolean) as TResult[]

  if (args.mode === 'strict') return cmsVisible

  const cmsBySlug = new Map(cmsVisible.map((item) => [item.slug, item]))
  const merged: TResult[] = []
  for (const legacy of args.legacy) {
    if (suppressed.has(legacy.slug)) continue
    merged.push(cmsBySlug.get(legacy.slug) || mapLegacy(legacy))
    cmsBySlug.delete(legacy.slug)
  }
  merged.push(...Array.from(cmsBySlug.values()))
  return merged
}

export function resolveSingle<TLegacy extends Slugged, TCms extends StatusedSlugged, TResult extends Slugged>(args: {
  slug: string
  legacy: TLegacy | null
  cms: TCms | null
  sourceState: SourceState
  mode: CmsListMode
  contentSource: CmsMode
  mapCms: (item: TCms & {slug: string}, fallback: TLegacy | undefined) => TResult | null
  mapLegacy?: (item: TLegacy) => TResult
}): TResult | null {
  const mapLegacy = args.mapLegacy || ((item: TLegacy) => item as unknown as TResult)
  if (args.contentSource === 'legacy') return args.legacy ? mapLegacy(args.legacy) : null
  if (args.sourceState === 'failed') return args.legacy ? mapLegacy(args.legacy) : null

  if (args.cms?.publishStatus === 'unpublished') return null
  if (args.cms?.slug && isDocumentVisible(args.cms.publishStatus, args.contentSource)) return args.mapCms(args.cms as TCms & {slug: string}, args.legacy || undefined)
  if (args.mode === 'strict') return null
  return args.legacy ? mapLegacy(args.legacy) : null
}