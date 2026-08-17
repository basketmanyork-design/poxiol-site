import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {
  CANONICAL_URLS,
  PSEO_BLOG_DUPLICATE_SLUGS,
  redirectEntries,
  sitemapEntries,
  validateCanonicalArchitecture,
} from '../lib/canonical-architecture.ts'
import {
  SITE_TAXONOMY,
  navigableTaxonomyEntries,
  productNavigationEntries,
  sitemapTaxonomyEntries,
} from '../lib/site-taxonomy.ts'
import {HEADER_NAV} from '../lib/navigation.ts'
import {week3Guides} from '../lib/week3-guides.ts'
import {PUBLIC_STATIC_SITEMAP_PATHS, isSitemapEligiblePath} from '../lib/sitemap-policy.ts'
import {ownerReviewNotFound} from '../lib/cloudflare/pages-owner-review-404.ts'

assert.deepEqual(SITE_TAXONOMY.map((group) => group.id), ['SPORTS', 'TEAMWEAR', 'MANUFACTURING_SOLUTIONS'])
assert.deepEqual(SITE_TAXONOMY[0].items.map((item) => item.label), [
  'Basketball', 'Soccer', 'Baseball', 'Pickleball', 'Hockey', 'Volleyball', 'Running & Track',
])
assert.deepEqual(SITE_TAXONOMY[1].items.map((item) => item.label), [
  'Training Wear', 'Warm-up Suits', 'Hoodies', 'Jackets', 'Polo Shirts', 'Shorts',
])
assert.deepEqual(SITE_TAXONOMY[2].items.map((item) => item.label), [
  'Custom Team Uniforms', 'OEM Manufacturing', 'Private Label',
])

assert.ok(navigableTaxonomyEntries().every((item) => item.publicStatus === 'PUBLISHED' && item.navigation))
assert.ok(sitemapTaxonomyEntries().every((item) => item.publicStatus === 'PUBLISHED' && item.sitemap))
assert.deepEqual(
  HEADER_NAV.find((item) => item.label === 'Products')?.children,
  [...productNavigationEntries().map((item) => ({label: item.label, href: item.path})), {label: 'All Products', href: '/products/'}],
)

assert.equal(PSEO_BLOG_DUPLICATE_SLUGS.length, 19)
for (const slug of PSEO_BLOG_DUPLICATE_SLUGS) {
  const root = CANONICAL_URLS.find((entry) => entry.path === `/${slug}/`)
  assert.equal(root?.status, 'REDIRECT')
  assert.equal(root?.canonicalTarget, `/blog/${slug}/`)
  assert.equal(root?.redirect, 301)
  assert.equal(root?.sitemap, false)
  assert.equal(root?.index, false)
}

const validation = validateCanonicalArchitecture(CANONICAL_URLS)
assert.deepEqual(validation, {duplicatePaths: [], invalidRedirects: [], redirectChains: [], sitemapRedirects: []})
assert.ok(redirectEntries().every((entry) => entry.path !== entry.canonicalTarget))
assert.ok(sitemapEntries().every((entry) => entry.status !== 'REDIRECT' && entry.index))
assert.equal(sitemapEntries().length, 71)
assert.equal(new Set(sitemapEntries().map((entry) => entry.path)).size, 71)
assert.equal(CANONICAL_URLS.find((entry) => entry.path === '/products/soccer-jerseys-1/')?.canonicalTarget, '/products/soccer-jerseys/')
assert.equal(CANONICAL_URLS.find((entry) => entry.path === '/products/soccer-kits/')?.canonicalTarget, '/products/soccer-jerseys/')

const configuredRedirects = new Map(
  readFileSync('public/_redirects', 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [source, target, status] = line.split(/\s+/)
      return [source, {target, status: Number(status)}] as const
    }),
)
for (const entry of redirectEntries()) {
  assert.deepEqual(configuredRedirects.get(entry.path), {target: entry.canonicalTarget, status: entry.redirect})
}
for (const entry of CANONICAL_URLS.filter((item) => item.status === 'OWNER_REVIEW')) {
  assert.equal(configuredRedirects.has(entry.path), false)
}

const controlledLinks = JSON.stringify(week3Guides)
assert.equal(controlledLinks.includes('/products/soccer-jerseys-1/'), false)

const sitemapSource = readFileSync('app/sitemap.ts', 'utf8')
assert.equal(sitemapSource.includes('getArticles'), false)
assert.equal(sitemapSource.includes('getProducts'), false)
assert.equal(sitemapSource.includes('getProductCategories'), false)
assert.equal(sitemapSource.includes('legacyArticles'), false)
assert.equal(sitemapSource.includes('legacyProducts'), false)
assert.equal(sitemapSource.includes('sitemapEntries'), true)

for (const path of ['/guides/', '/projects/', '/customization/custom-packaging/', '/privacy-policy/']) {
  assert.equal(PUBLIC_STATIC_SITEMAP_PATHS.includes(path), true)
  assert.equal(isSitemapEligiblePath(path), true)
}
for (const path of ['/sports/', '/customization/private-label/', '/custom-american-football-uniforms/', `/${PSEO_BLOG_DUPLICATE_SLUGS[0]}/`]) {
  assert.equal(isSitemapEligiblePath(path), false)
}

const ownerReviewRouteNames = [
  'custom-american-football-uniforms',
  'custom-esports-jerseys',
  'custom-golf-wear',
  'custom-ice-hockey-jerseys',
  'custom-rugby-uniforms',
  'custom-running-marathon-wear',
  'custom-tennis-wear',
  'custom-volleyball-uniforms',
]
for (const route of ownerReviewRouteNames) {
  const functionPath = `functions/${route}.ts`
  assert.equal(existsSync(functionPath), true, `${functionPath} must return a real HTTP 404 on Cloudflare Pages`)
  assert.equal(readFileSync(functionPath, 'utf8').includes('ownerReviewNotFound'), true)
}
const ownerReviewResponse = await ownerReviewNotFound({
  next: async () => new Response('<h1>Not Found</h1>', {status: 200, headers: {'Content-Type': 'text/html'}}),
})
assert.equal(ownerReviewResponse.status, 404)
assert.equal(ownerReviewResponse.headers.get('X-Robots-Tag'), 'noindex')
assert.equal(await ownerReviewResponse.text(), '<h1>Not Found</h1>')

console.log('POXIOL V9.1 canonical architecture tests passed.')
