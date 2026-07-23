import type {CmsMode} from './types'

export type PublishStatus = 'draft' | 'published' | 'unpublished' | string | undefined | null

export function isDocumentVisible(status: PublishStatus, source: CmsMode): boolean {
  if (source === 'legacy') return false
  if (source === 'sanity-preview') return status === 'draft' || status === 'published'
  return status === 'published'
}