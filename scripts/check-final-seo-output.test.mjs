import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

function readRouteHtml(route) {
  return readFileSync(`out${route}index.html`, 'utf8')
}

function readRouteSchemas(route) {
  const html = readRouteHtml(route)
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  return scripts.map(([, json]) => JSON.parse(json))
}

function flattenSchemaNodes(value) {
  if (Array.isArray(value)) return value.flatMap(flattenSchemaNodes)
  if (!value || typeof value !== 'object') return []
  return [value, ...flattenSchemaNodes(value['@graph'] ?? [])]
}

test('publishes approved legal policies in sitemap without noindex directives', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  for (const route of ['/privacy-policy/', '/terms/', '/intellectual-property-policy/']) {
    assert.equal(sitemap.includes(`<loc>https://www.poxiol.com${route}</loc>`), true)
    const html = readFileSync(`out${route}index.html`, 'utf8')
    assert.doesNotMatch(html, /noindex, nofollow, noarchive/)
  }
})

test('does not publish a structured image for a withheld proof asset', () => {
  const html = readFileSync('out/factory/index.html', 'utf8')
  assert.equal(/"image"\s*:\s*"[^"]*factory/i.test(html), false)
})

test('sitemap source consumes the Plan A publication policy', () => {
  const source = readFileSync('app/sitemap.ts', 'utf8')
  assert.match(source, /publicSectionDecision/)
})

test('the maintained guide receiving a legacy redirect remains discoverable', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  assert.match(sitemap, /\/guides\/how-to-order-custom-basketball-uniforms-for-your-team\//)
})

test('redirect sources are excluded from the sitemap', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  const redirects = readFileSync('public/_redirects', 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter(([, , status]) => /^30[1278]$/.test(status || ''))

  for (const [source] of redirects) {
    assert.equal(
      sitemap.includes(`<loc>https://www.poxiol.com${source}</loc>`),
      false,
      `Redirect source must not be discoverable in sitemap: ${source}`,
    )
  }
})

test('robots keeps approved legal policies crawlable', () => {
  const robots = readFileSync('public/robots.txt', 'utf8')
  for (const route of ['/privacy-policy/', '/terms/', '/intellectual-property-policy/']) {
    assert.match(robots, new RegExp(`^Allow: ${route.replaceAll('/', '\\/')}\\s*$`, 'm'))
  }
})

test('published structured data does not advertise missing logo or search resources', () => {
  const logoRoutes = [
    '/resources/',
    '/projects/',
    '/ai-summary/',
    '/how-to-order-custom-basketball-uniforms/',
    '/soccer-jersey-buying-guide/',
    '/oem-vs-odm-sportswear/',
    '/best-sportswear-fabrics/',
    '/how-sublimation-printing-works-for-teamwear/',
    '/how-to-choose-a-teamwear-manufacturer/',
    '/custom-soccer-uniforms-for-academies/',
    '/soccer-jersey-supplier-australia/',
  ]

  for (const route of logoRoutes) {
    assert.doesNotMatch(
      readRouteHtml(route),
      /https:\/\/www\.poxiol\.com\/logo\.png/,
      `Structured data must not reference the missing logo on ${route}`,
    )
  }

  for (const route of ['/resources/', '/projects/', '/ai-summary/']) {
    assert.doesNotMatch(
      readRouteHtml(route),
      /"@type":"SearchAction"/,
      `Structured data must not advertise the missing site search on ${route}`,
    )
  }
})

test('fabric and printing guide entity URLs match their public canonicals', () => {
  for (const route of ['/fabric-guide/', '/printing-guide/']) {
    const canonical = `https://www.poxiol.com${route}`
    const nodes = readRouteSchemas(route).flatMap(flattenSchemaNodes)
    const webPage = nodes.find((node) => node['@type'] === 'WebPage')
    const faqPage = nodes.find((node) => node['@type'] === 'FAQPage')
    const breadcrumb = nodes.find((node) => node['@type'] === 'BreadcrumbList')

    assert.equal(webPage?.['@id'], `${canonical}#webpage`)
    assert.equal(webPage?.url, canonical)
    assert.equal(faqPage?.['@id'], `${canonical}#faq`)
    assert.equal(breadcrumb?.['@id'], `${canonical}#breadcrumb`)
    assert.equal(breadcrumb?.itemListElement?.at(-1)?.item, canonical)
  }
})
