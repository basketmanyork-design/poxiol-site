const BASELINE_LAST_MODIFIED = new Date('2026-08-29T00:00:00.000Z')
const AI_DISCOVERY_TRUTH_RELEASE = new Date('2026-09-13T00:00:00.000Z')

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
  '/how-to-order-custom-basketball-uniforms/',
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
  '/custom-sports-apparel-distributor/',
])

function normalizeRoute(route: string): string {
  if (!route || route === '/') return '/'
  return `/${route.replace(/^\/+|\/+$/g, '')}/`
}

export function getRouteLastModified(route: string, sourceLastModified = BASELINE_LAST_MODIFIED): Date {
  const routeRelease = AI_DISCOVERY_TRUTH_ROUTES.has(normalizeRoute(route))
    ? AI_DISCOVERY_TRUTH_RELEASE
    : BASELINE_LAST_MODIFIED

  return new Date(Math.max(sourceLastModified.getTime(), routeRelease.getTime()))
}
