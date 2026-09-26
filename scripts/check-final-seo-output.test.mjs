import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
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

test('only the maintained Basketball ordering guide remains discoverable', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  assert.match(sitemap, /\/guides\/how-to-order-custom-basketball-uniforms\//)
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.poxiol\.com\/how-to-order-custom-basketball-uniforms\/<\/loc>/)
  assert.doesNotMatch(sitemap, /\/guides\/how-to-order-custom-basketball-uniforms-for-your-team\//)
  assert.equal(existsSync('out/how-to-order-custom-basketball-uniforms/index.html'), false)
  assert.equal(existsSync('out/guides/how-to-order-custom-basketball-uniforms-for-your-team/index.html'), false)
  assert.equal(existsSync('out/guides/how-to-order-custom-basketball-uniforms/index.html'), true)
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

test('OEM and ODM decision guide renders the approved buyer path and minimal schema', () => {
  const guideRoute = '/guides/oem-odm-sportswear-manufacturing-guide-for-brands/'
  const serviceRoute = '/oem-odm/'
  const canonical = `https://www.poxiol.com${guideRoute}`
  const title = 'OEM vs ODM Sportswear: A Decision Guide for Brands | POXIOL'
  const description = 'Compare OEM and ODM paths for a custom sportswear project. Use a practical decision matrix and project brief checklist before requesting a quote.'
  const schemaDescription = 'Choose OEM when your team already controls the product specification and needs a supplier to review manufacturability. Choose ODM when the product direction is still being shaped and a development route must be defined before sampling. The exact scope must be confirmed for each project.'
  const guideHtml = readRouteHtml(guideRoute)
  const serviceHtml = readRouteHtml(serviceRoute)

  assert.equal((guideHtml.match(/<h1\b/gi) || []).length, 1)
  assert.match(guideHtml, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`))
  assert.match(guideHtml, new RegExp(`<meta[^>]+name="description"[^>]+content="${description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`))
  assert.match(guideHtml, new RegExp(`<link[^>]+rel="canonical"[^>]+href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`))

  for (const visibleCopy of [
    schemaDescription,
    'OEM and ODM compared',
    'Choose the OEM path when',
    'Choose the ODM path when',
    'What to prepare before requesting a quote',
    'Questions to settle before sampling',
    'How this guide connects to POXIOL',
    'Discuss Your OEM/ODM Project',
    'Review OEM/ODM Services',
  ]) {
    assert.equal(guideHtml.includes(visibleCopy), true, `guide output is missing approved copy: ${visibleCopy}`)
  }
  assert.equal(guideHtml.includes('Get Free Mockup Now'), false)

  const scripts = readRouteSchemas(guideRoute)
  assert.equal(scripts.length, 1, 'guide must render exactly one JSON-LD script')
  assert.deepEqual(scripts[0]['@graph'].map((node) => node['@type']), ['BreadcrumbList', 'WebPage'])
  const nodes = flattenSchemaNodes(scripts[0])
  const breadcrumb = nodes.find((node) => node['@type'] === 'BreadcrumbList')
  const webPage = nodes.find((node) => node['@type'] === 'WebPage')
  assert.equal(breadcrumb?.['@id'], `${canonical}#breadcrumb`)
  assert.equal(breadcrumb?.itemListElement?.at(-1)?.item, canonical)
  assert.equal(webPage?.['@id'], `${canonical}#webpage`)
  assert.equal(webPage?.url, canonical)
  assert.equal(webPage?.description, schemaDescription)
  assert.equal(guideHtml.includes(webPage.description), true, 'WebPage description must be visible verbatim')

  const schemaText = JSON.stringify(scripts[0])
  for (const forbidden of ['Article', 'Person', 'Organization', 'Service', 'Product', 'Offer', 'OfferCatalog', 'FAQPage', 'Review', 'AggregateRating', 'author', 'reviewer', 'datePublished', 'dateModified', 'provider', 'areaServed', 'price', 'availability']) {
    assert.equal(schemaText.includes(`"${forbidden}"`), false, `guide schema must not expose ${forbidden}`)
  }

  assert.equal((serviceHtml.match(/<h1\b/gi) || []).length, 1)
  assert.match(serviceHtml, /<title>OEM\/ODM Teamwear for Distributors and Brands \| POXIOL<\/title>/)
  assert.equal(serviceHtml.includes('Need help choosing between OEM and ODM?'), true)
  assert.equal(serviceHtml.includes('Use the decision guide to compare the two paths, identify which project inputs are already fixed, and prepare the open questions before requesting a quote.'), true)
  assert.equal(serviceHtml.includes('Compare OEM and ODM paths'), true)
  assert.equal((serviceHtml.match(/href="\/guides\/oem-odm-sportswear-manufacturing-guide-for-brands\/"/g) || []).length, 1)
  for (const preservedCta of ['Discuss Your OEM Project', 'Ask a Project Question', 'Start OEM/ODM Project']) {
    assert.equal(serviceHtml.includes(preservedCta), true, `service page lost preserved CTA: ${preservedCta}`)
  }
})
