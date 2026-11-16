const BASELINE_LAST_MODIFIED = new Date('2026-08-29T00:00:00.000Z')
const AI_DISCOVERY_TRUTH_RELEASE = new Date('2026-09-13T00:00:00.000Z')
const GEO_CONTENT_RELEASE = new Date('2026-11-15T00:00:00.000Z')
// Pages whose substance changed on 2026-11-16: the seven explainers were published, three
// sport pages gained long-form sections, three product pages had their FAQ sets scoped, the
// factory page lost two shared answers, and the two resource guides had theirs scoped by sport.
// Without this the sitemap would tell crawlers those pages were last touched on 2026-08-29.
const SEO_POLISH_RELEASE = new Date('2026-11-16T00:00:00.000Z')

const SEO_POLISH_ROUTES = new Set([
  '/basketball-positions-explained/',
  '/soccer-offside-rule-explained/',
  '/baseball-positions-and-numbers-explained/',
  '/what-the-a-and-c-mean-on-a-jersey/',
  '/team-name-ideas-for-sports-clubs/',
  '/volleyball-positions-explained/',
  '/football-positions-explained/',
  '/products/rugby-uniforms/',
  '/products/cricket-uniforms/',
  '/products/running-track-uniforms/',
  '/products/soccer-jerseys/',
  '/products/training-wear/',
  '/products/hoodies-jackets/',
  '/products/team-accessories/',
  '/factory/',
  '/resources/',
  '/solutions/',
  '/privacy-policy/',
  '/resources/custom-basketball-uniform-manufacturer-guide/',
  '/resources/custom-soccer-kits-wholesale-guide/',
])

const GEO_CONTENT_ROUTES = new Set([
  '/solutions/',
  '/shipping-after-sales/',
  '/certificates-testing/',
  '/fabric-guide/',
  '/blog/',
  '/terms/',
  '/intellectual-property-policy/',
  '/products/',
  '/oem-odm/',
  '/resources/',
  '/projects/',
  '/products/rugby-uniforms/',
  '/products/cricket-uniforms/',
])

const AI_DISCOVERY_TRUTH_ROUTES = new Set([
  '/',
  '/about/',
  '/faq/',
  '/get-quote/',
  '/resources/',
  '/guides/b2b-sourcing-faq/',
  '/guides/how-to-choose-teamwear-manufacturer-china/',
  '/products/hoodies-jackets/',
  '/products/team-accessories/',
  '/products/training-wear/',
  '/how-to-choose-a-teamwear-manufacturer/',
  '/custom-soccer-uniforms-for-academies/',
  '/soccer-jersey-supplier-australia/',
  '/custom-baseball-jerseys-for-clubs/',
  '/soccer-teamwear-supplier-usa/',
  '/custom-volleyball-uniforms-for-schools/',
  '/oem-soccer-apparel-manufacturer/',
  '/soccer-teamwear-supplier-uk/',
  '/custom-basketball-jerseys-melbourne/',
  '/custom-soccer-kits-london/',
  '/custom-teamwear-new-york/',
])

function normalizeRoute(route: string): string {
  if (!route || route === '/') return '/'
  return `/${route.replace(/^\/+|\/+$/g, '')}/`
}

export function getRouteLastModified(route: string, sourceLastModified = BASELINE_LAST_MODIFIED): Date {
  const normalized = normalizeRoute(route)
  const releases = [BASELINE_LAST_MODIFIED.getTime(), sourceLastModified.getTime()]
  if (SEO_POLISH_ROUTES.has(normalized)) releases.push(SEO_POLISH_RELEASE.getTime())
  if (GEO_CONTENT_ROUTES.has(normalized)) releases.push(GEO_CONTENT_RELEASE.getTime())
  if (AI_DISCOVERY_TRUTH_ROUTES.has(normalized)) releases.push(AI_DISCOVERY_TRUTH_RELEASE.getTime())

  return new Date(Math.max(...releases))
}
