export type CanonicalStatus = 'PRIMARY' | 'MERGE' | 'REDIRECT' | 'KEEP_INDEXABLE' | 'NOINDEX' | 'OWNER_REVIEW'

export type CanonicalUrlEntry = {
  path: string
  intent: string
  canonicalTarget: string
  status: CanonicalStatus
  redirect?: 301 | 308
  sitemap: boolean
  index: boolean
}

export const PSEO_BLOG_DUPLICATE_SLUGS = [
  'best-sportswear-fabrics',
  'custom-baseball-jerseys-for-clubs',
  'custom-basketball-jerseys-melbourne',
  'custom-basketball-uniforms-for-schools',
  'custom-soccer-kits-london',
  'custom-soccer-uniforms-for-academies',
  'custom-sports-apparel-distributor',
  'custom-teamwear-new-york',
  'custom-volleyball-uniforms-for-schools',
  'how-sublimation-printing-works-for-teamwear',
  'how-to-choose-a-teamwear-manufacturer',
  'oem-baseball-apparel-manufacturer',
  'oem-basketball-apparel-manufacturer',
  'oem-soccer-apparel-manufacturer',
  'oem-volleyball-apparel-manufacturer',
  'oem-vs-odm-sportswear',
  'soccer-jersey-supplier-australia',
  'soccer-teamwear-supplier-uk',
  'soccer-teamwear-supplier-usa',
] as const

export type RedirectOwnershipDecision = 'KEEP_301' | 'KEEP_SEPARATE' | 'OWNER_REVIEW'
export type RedirectOwnershipReview = {
  slug: (typeof PSEO_BLOG_DUPLICATE_SLUGS)[number]
  intent: string
  overlap: 'HIGH' | 'PARTIAL'
  dataAvailable: 'TRAFFIC_DATA_NOT_AVAILABLE'
  decision: RedirectOwnershipDecision
  reason: string
}

const keepEditorial301 = new Set([
  'best-sportswear-fabrics',
  'how-sublimation-printing-works-for-teamwear',
  'how-to-choose-a-teamwear-manufacturer',
  'oem-vs-odm-sportswear',
])

export const REDIRECT_OWNERSHIP_REVIEW: readonly RedirectOwnershipReview[] = PSEO_BLOG_DUPLICATE_SLUGS.map((slug) => {
  if (keepEditorial301.has(slug)) return {
    slug,
    intent: 'Informational guide',
    overlap: 'HIGH',
    dataAvailable: 'TRAFFIC_DATA_NOT_AVAILABLE',
    decision: 'KEEP_301',
    reason: 'The root and Blog records target the same informational query and the Blog route is the established editorial owner.',
  }
  const intent = slug.includes('supplier-') || slug.includes('new-york') || slug.includes('melbourne') || slug.includes('london')
    ? 'Commercial geographic landing intent'
    : slug.includes('for-schools') || slug.includes('for-academies') || slug.includes('for-clubs')
      ? 'Commercial buyer-segment landing intent'
      : slug.startsWith('oem-') || slug.includes('distributor')
        ? 'Commercial manufacturing-partner intent'
        : 'Mixed commercial and editorial intent'
  return {
    slug,
    intent,
    overlap: 'PARTIAL',
    dataAvailable: 'TRAFFIC_DATA_NOT_AVAILABLE',
    decision: 'OWNER_REVIEW',
    reason: 'The root record is shaped as a commercial landing page while the Blog document is editorial; traffic, backlink and canonical-history evidence is unavailable, so separation or consolidation needs owner review.',
  }
})

const primary = (path: string, intent: string): CanonicalUrlEntry => ({
  path, intent, canonicalTarget: path, status: 'PRIMARY', sitemap: true, index: true,
})

const redirect = (path: string, canonicalTarget: string, intent: string, status: 301 | 308 = 301): CanonicalUrlEntry => ({
  path, intent, canonicalTarget, status: 'REDIRECT', redirect: status, sitemap: false, index: false,
})

const ownerReview = (path: string, intent: string): CanonicalUrlEntry => ({
  path, intent, canonicalTarget: path, status: 'OWNER_REVIEW', sitemap: false, index: false,
})

const keepIndexable = (path: string, intent: string): CanonicalUrlEntry => ({
  path, intent, canonicalTarget: path, status: 'KEEP_INDEXABLE', sitemap: false, index: true,
})

export const AUDITED_SITEMAP_PATHS = [
  '/design-gallery/',
  '/factory/',
  '/customization/',
  '/customization/custom-packaging/',
  '/customization/logo-name-number/',
  '/about/',
  '/contact/',
  '/free-mockup/',
  '/get-quote/',
  '/sample-order/',
  '/resources/',
  '/guides/',
  '/projects/',
  '/faq/',
  '/printing-guide/',
  '/certificates-testing/',
  '/quality-control-process/',
  '/manufacturing/',
  '/youth-team-uniforms/',
  '/school-teamwear/',
  '/club-teamwear-program/',
  '/shipping-after-sales/',
  '/privacy-policy/',
  '/terms/',
  '/intellectual-property-policy/',
  '/products/basketball-uniforms-1/',
  '/products/basketball-uniforms-2/',
  '/products/basketball-uniforms-3/',
  '/products/basketball-uniforms-4/',
  '/products/soccer-jerseys-2/',
  '/products/soccer-jerseys-3/',
  '/products/soccer-jerseys-4/',
  '/products/training-wear-1/',
  '/products/training-wear-2/',
  '/products/training-wear-3/',
  '/products/training-wear-4/',
  '/products/hoodies-jackets-1/',
  '/products/hoodies-jackets-2/',
  '/products/hoodies-jackets-3/',
  '/projects/usa-basketball-academy-uniform-program/',
  '/projects/australia-soccer-club-kit-project/',
  '/projects/school-athletics-multi-sport-program/',
  '/projects/middle-east-sports-event-program/',
  '/projects/distributor-bulk-teamwear-program/',
  '/blog/custom-teamwear-production-notes/',
  '/guides/how-to-order-custom-basketball-uniforms/',
  '/guides/basketball-uniform-size-guide/',
  '/guides/sublimation-printing-guide/',
  '/guides/b2b-sourcing-faq/',
  '/guides/reversible-vs-single-layer-basketball-uniforms/',
  '/guides/custom-basketball-uniform-fabric-gsm/',
  '/guides/sample-first-vs-bulk-teamwear-order/',
  '/guides/custom-basketball-uniform-cost-factors/',
  '/resources/custom-basketball-uniform-manufacturer-guide/',
  '/resources/custom-soccer-kits-wholesale-guide/',
  '/resources/teamwear-manufacturer-evaluation-checklist/',
  '/resources/custom-teamwear-moq-production-time/',
  '/resources/private-label-teamwear-launch-checklist/',
  '/resources/sports-uniform-fabric-guide/',
] as const

export const CANONICAL_URLS: readonly CanonicalUrlEntry[] = [
  primary('/', 'Homepage and entity'),
  primary('/products/', 'Product discovery'),
  primary('/products/basketball-uniforms/', 'Basketball uniforms'),
  primary('/products/soccer-jerseys/', 'Soccer kits'),
  primary('/products/training-wear/', 'Training wear'),
  primary('/products/hoodies-jackets/', 'Team outerwear'),
  primary('/custom-baseball-softball-uniforms/', 'Baseball uniforms pending URL migration evidence'),
  primary('/solutions/', 'Buyer solutions'),
  primary('/oem-odm/', 'OEM and ODM manufacturing'),
  primary('/private-label-teamwear/', 'Private-label teamwear'),
  primary('/fabric-guide/', 'Fabric authority'),
  primary('/blog/', 'Editorial hub'),
  ...PSEO_BLOG_DUPLICATE_SLUGS.map((slug) => keepIndexable(`/blog/${slug}/`, `Editorial owner for ${slug}; sitemap deferred until CMS truth migration`)),
  ...AUDITED_SITEMAP_PATHS.map((path) => primary(path, `Approved canonical route: ${path}`)),
  redirect('/custom-basketball-uniforms/', '/products/basketball-uniforms/', 'Legacy basketball category'),
  redirect('/custom-soccer-kits/', '/products/soccer-jerseys/', 'Legacy soccer category'),
  redirect('/custom-training-wear/', '/products/training-wear/', 'Legacy training category'),
  redirect('/sports/', '/products/', 'Legacy product hub'),
  redirect('/customization/private-label/', '/private-label-teamwear/', 'Duplicate private-label intent'),
  redirect('/customization/fabric-options/', '/fabric-guide/', 'Duplicate fabric intent'),
  redirect('/products/soccer-jerseys-1/', '/products/soccer-jerseys/', 'Broken soccer product link'),
  redirect('/products/soccer-kits/', '/products/soccer-jerseys/', 'Duplicate Soccer CMS category'),
  ...PSEO_BLOG_DUPLICATE_SLUGS.map((slug) => redirect(`/${slug}/`, `/blog/${slug}/`, `Duplicate editorial intent for ${slug}`)),
  ownerReview('/custom-american-football-uniforms/', 'Unconfirmed American football offer'),
  ownerReview('/custom-rugby-uniforms/', 'Unconfirmed rugby offer'),
  ownerReview('/custom-golf-wear/', 'Unconfirmed golf offer'),
  ownerReview('/custom-tennis-wear/', 'Unconfirmed tennis offer'),
  ownerReview('/custom-esports-jerseys/', 'Unconfirmed esports offer'),
  ownerReview('/custom-ice-hockey-jerseys/', 'Unconfirmed hockey canonical target'),
  ownerReview('/custom-volleyball-uniforms/', 'Unconfirmed volleyball canonical target'),
  ownerReview('/custom-running-marathon-wear/', 'Unconfirmed running canonical target'),
] as const

export function redirectEntries(entries: readonly CanonicalUrlEntry[] = CANONICAL_URLS): CanonicalUrlEntry[] {
  return entries.filter((entry) => entry.status === 'REDIRECT')
}

export function sitemapEntries(entries: readonly CanonicalUrlEntry[] = CANONICAL_URLS): CanonicalUrlEntry[] {
  return entries.filter((entry) => entry.sitemap && entry.index && entry.status !== 'REDIRECT')
}

export function ownerReviewEntries(entries: readonly CanonicalUrlEntry[] = CANONICAL_URLS): CanonicalUrlEntry[] {
  return entries.filter((entry) => entry.status === 'OWNER_REVIEW')
}

export function validateCanonicalArchitecture(entries: readonly CanonicalUrlEntry[]) {
  const counts = new Map<string, number>()
  for (const entry of entries) counts.set(entry.path, (counts.get(entry.path) || 0) + 1)
  const duplicatePaths = Array.from(counts.entries()).filter(([, count]) => count > 1).map(([path]) => path).sort()
  const redirectsByPath = new Map(redirectEntries(entries).map((entry) => [entry.path, entry]))
  const invalidRedirects = redirectEntries(entries)
    .filter((entry) => !entry.redirect || entry.path === entry.canonicalTarget)
    .map((entry) => entry.path)
    .sort()
  const redirectChains = redirectEntries(entries)
    .filter((entry) => redirectsByPath.has(entry.canonicalTarget))
    .map((entry) => `${entry.path} -> ${entry.canonicalTarget}`)
    .sort()
  const sitemapRedirects = entries.filter((entry) => entry.status === 'REDIRECT' && entry.sitemap).map((entry) => entry.path).sort()
  return {duplicatePaths, invalidRedirects, redirectChains, sitemapRedirects}
}
