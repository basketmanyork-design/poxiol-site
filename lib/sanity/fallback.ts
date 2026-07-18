import { contentSource } from './client';

/**
 * Content resolution helper.
 *
 * Priority:
 *   sanity / sanity-preview → attempt Sanity fetch
 *   Sanity fails or missing  → fall back to legacy data
 *   legacy                   → always use legacy data
 */

export async function resolveContent<T>(
  fetchSanity: () => Promise<T | null>,
  legacyData: T,
  debugLabel?: string,
): Promise<T> {
  if (contentSource === 'legacy') {
    if (process.env.NODE_ENV === 'development') console.log(`[CMS:legacy] ${debugLabel || 'content'}`);
    return legacyData;
  }

  try {
    const result = await fetchSanity();
    if (result != null) {
      if (process.env.NODE_ENV === 'development') console.log(`[CMS:sanity] ${debugLabel || 'content'}`);
      return result;
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.warn(`[CMS:fallback] ${debugLabel || 'content'} – reverting to legacy`, (err as Error).message);
  }

  return legacyData;
}

export function useLegacy(explicitly = false): boolean {
  if (explicitly) return true;
  return contentSource === 'legacy';
}
