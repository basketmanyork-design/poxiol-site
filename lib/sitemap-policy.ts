import {CANONICAL_URLS, sitemapEntries} from './canonical-architecture.ts'

export const PUBLIC_STATIC_SITEMAP_PATHS = sitemapEntries().map((entry) => entry.path)

export const PUBLIC_PRODUCT_DETAIL_CATEGORY_SLUGS = [
  'basketball-uniforms',
  'soccer-jerseys',
  'training-wear',
  'hoodies-jackets',
] as const

const deniedPaths = new Set(
  CANONICAL_URLS.filter((entry) => entry.status === 'REDIRECT' || entry.status === 'NOINDEX' || entry.status === 'OWNER_REVIEW' || !entry.index)
    .map((entry) => entry.path),
)

export function isSitemapEligiblePath(path: string): boolean {
  return !deniedPaths.has(path) && (PUBLIC_STATIC_SITEMAP_PATHS as readonly string[]).includes(path)
}

export function isSitemapDeniedPath(path: string): boolean {
  return deniedPaths.has(path)
}
