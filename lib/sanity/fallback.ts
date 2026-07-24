import 'server-only'

import {contentSource} from './client'

function hasContent(value: unknown): boolean {
  if (value == null) return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

export async function resolveContent<T>(
  fetchSanity: () => Promise<T | null>,
  legacyData: T,
  isUsable: (value: T) => boolean = hasContent,
): Promise<T> {
  if (contentSource === 'legacy') return legacyData

  try {
    const result = await fetchSanity()
    if (result != null && isUsable(result)) return result
  } catch {
    // CMS content is optional at build time. Preserve the legacy page on any read failure.
  }

  return legacyData
}

export function useLegacy(): boolean {
  return contentSource === 'legacy'
}
