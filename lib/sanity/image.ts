/**
 * Sanity image URL builder — no external deps.
 * Project ID is hardcoded here (safe for public — images are served via CDN).
 */
const PROJECT_ID = 'oqpv1xbc';

function buildImageUrl(ref: string, options: Record<string, number | string> = {}): string {
  const [_, id, dimensions, format] = ref.split('-');
  const params = new URLSearchParams();
  Object.entries(options).forEach(([k, v]) => params.set(k, String(v)));
  params.set('auto', 'format');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/production/${id}-${dimensions}.${format}?${params.toString()}`;
}

function getUrl(source: any): string | null {
  if (!source?.asset?._ref) return null;
  return source.asset._ref;
}

export function heroImageUrl(source: any, mobile = false): string | null {
  const ref = getUrl(source);
  if (!ref) return null;
  return buildImageUrl(ref, { w: mobile ? 720 : 900, q: mobile ? 78 : 82, fit: 'crop' });
}

export function cardImageUrl(source: any): string | null {
  const ref = getUrl(source);
  if (!ref) return null;
  return buildImageUrl(ref, { w: 400, h: 400, q: 75, fit: 'crop' });
}

export function thumbnailUrl(source: any): string | null {
  const ref = getUrl(source);
  if (!ref) return null;
  return buildImageUrl(ref, { w: 200, h: 200, q: 70 });
}
