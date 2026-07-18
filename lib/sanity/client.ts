/**
 * POXIOL Sanity Client — zero external deps, pure fetch.
 * Safe for Next.js static export. No crypto conflicts.
 */

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oqpv1xbc';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const VERSION = '2024-01-01';

export const contentSource: 'legacy' | 'sanity-preview' | 'sanity' =
  (process.env.NEXT_PUBLIC_CONTENT_SOURCE as any) || 'legacy';

export async function sanityFetch<T = any>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  const url = `https://${PROJECT}.api.sanity.io/v${VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 }, // ISR-style revalidation when available
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result as T;
  } catch {
    return null;
  }
}
