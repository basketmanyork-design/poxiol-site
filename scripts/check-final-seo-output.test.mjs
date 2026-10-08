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

test('soccer product pillar aligns global supplier intent and exposes five bounded sourcing paths', () => {
  const route = '/products/soccer-jerseys/'
  const html = readRouteHtml(route)
  const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  const visibleText = visibleHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
  const anchors = [...visibleHtml.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(([, attributes, body]) => ({
    href: (attributes.match(/\bhref="([^"]+)"/i)?.[1] ?? '').replace(/&amp;/g, '&'),
    text: body.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(),
  }))

  assert.match(html, /<title>Custom Soccer Kit Manufacturer &amp; Wholesale Supplier \| POXIOL<\/title>/)
  assert.match(html, /<meta[^>]+name="description"[^>]+content="Custom soccer kits for distributors, brands and custom resellers\. Compare full-kit scope, sample approval, wholesale sourcing and reorder planning\."/)
  assert.equal((visibleHtml.match(/<h1\b/gi) || []).length, 1)
  assert.match(visibleHtml, /<h1[^>]*>Custom Soccer Kit Manufacturer and Wholesale Supplier<\/h1>/)
  assert.equal(visibleText.includes('Soccer Sourcing Paths'), true)
  assert.equal(visibleText.includes('Choose the Right Soccer Kit Buying Path'), true)
  assert.equal(visibleText.includes('Review the global product scope, compare wholesale sourcing decisions or continue to a market-specific supplier page.'), true)

  const expectedLinks = [
    ['/resources/custom-soccer-kits-wholesale-guide/', 'Read Wholesale Soccer Kit Guide'],
    ['/soccer-jersey-buying-guide/', 'Review Soccer Kit Buying Guide'],
    ['/soccer-teamwear-supplier-usa/', 'View USA Soccer Teamwear'],
    ['/soccer-teamwear-supplier-uk/', 'View UK Soccer Teamwear'],
    ['/soccer-jersey-supplier-australia/', 'View Australia Soccer Teamwear'],
  ]
  for (const [href, text] of expectedLinks) {
    assert.equal(anchors.some((anchor) => anchor.href === href && anchor.text === text), true, `Missing exact Soccer sourcing path: ${text}`)
  }
})

test('sitemap source consumes the Plan A publication policy', () => {
  const source = readFileSync('app/sitemap.ts', 'utf8')
  assert.match(source, /publicSectionDecision/)
})

test('project planning hub and scenarios use evidence-neutral search contracts', () => {
  const hubRoute = '/projects/'
  const scenarios = [
    ['/projects/usa-basketball-academy-uniform-program/', 'Basketball Academy Planning Scenario | POXIOL', 'Plan a basketball academy uniform program, including reversible sets, player numbers, size grouping, sample review and tournament scheduling.'],
    ['/projects/australia-soccer-club-kit-project/', 'Soccer Club Kit Planning Scenario | POXIOL', 'Plan a soccer club home-and-away kit program, including color matching, mockup confirmation, player details and bulk-order checkpoints.'],
    ['/projects/school-athletics-multi-sport-program/', 'School Multi-Sport Planning Scenario | POXIOL', 'Plan a school multi-sport uniform program across basketball, volleyball and training wear with coordinated branding, sizing and review steps.'],
    ['/projects/middle-east-sports-event-program/', 'Sports Event Uniform Planning Scenario | POXIOL', 'Plan a sports-event uniform program for staff and participants, including quantity planning, packing organization and delivery checkpoints.'],
    ['/projects/distributor-bulk-teamwear-program/', 'Teamwear Distributor Planning Scenario | POXIOL', 'Plan a distributor teamwear program across multiple product categories with repeat-order structure, quality checkpoints and packing requirements.'],
  ]
  const hubHtml = readRouteHtml(hubRoute)
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url)

  assert.equal(sitemapUrls.length, 78)
  assert.equal(new Set(sitemapUrls).size, 78)
  assert.equal(sitemapUrls.includes('https://www.poxiol.com/projects/'), true)
  assert.match(hubHtml, /<title>Teamwear Planning Scenarios \| POXIOL<\/title>/)
  assert.match(hubHtml, /<meta[^>]+name="description"[^>]+content="Explore planning scenarios for custom teamwear briefs, sample review, quality checkpoints, packing needs and target delivery windows\."/)
  assert.equal((hubHtml.match(/View Planning Scenario/g) || []).length >= 5, true)
  assert.doesNotMatch(hubHtml, /View Case Study/)
  assert.match(hubHtml, /This is a planning explanation, not a customer project, factory record, quality result, delivery result or production guarantee\./)

  for (const [route, title, description] of scenarios) {
    const html = readRouteHtml(route)
    const canonical = `https://www.poxiol.com${route}`
    assert.equal(sitemapUrls.includes(canonical), true)
    assert.equal((html.match(/<h1\b/gi) || []).length, 1)
    assert.equal(html.includes(`<title>${title}</title>`), true)
    assert.equal(html.includes(`name="description" content="${description}"`), true)
    assert.equal(html.includes(`rel="canonical" href="${canonical}"`), true)
    assert.match(html, /Planning Scenario/)
    assert.match(html, /This is a planning explanation, not a customer project, factory record, quality result, delivery result or production guarantee\./)
    assert.deepEqual(readRouteSchemas(route).map((schema) => schema['@type']), ['BreadcrumbList'])
  }
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

test('only the maintained survivors serve the three retired template-guide intents', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  const routes = [
    {
      source: '/guides/how-to-choose-a-custom-soccer-kit-manufacturer/',
      survivor: '/how-to-choose-a-teamwear-manufacturer/',
      title: 'How To Choose A Teamwear Manufacturer | Complete Buyer Guide | POXIOL',
      h1: 'How To Choose A Teamwear Manufacturer',
      ctaHref: '/free-mockup/',
      ctaText: 'Request Free Mockup',
      schemaTypes: ['FAQPage', 'Article'],
    },
    {
      source: '/guides/moq-1-custom-teamwear-how-it-works/',
      survivor: '/resources/custom-teamwear-moq-production-time/',
      title: 'Custom Teamwear MOQ and Production Time Guide | POXIOL',
      h1: 'Custom Teamwear MOQ and Production Time Guide',
      ctaHref: '/get-quote/',
      ctaText: 'Request Factory Quote',
      schemaTypes: ['Article', 'BreadcrumbList', 'FAQPage'],
    },
    {
      source: '/guides/sublimation-vs-screen-printing-for-custom-teamwear/',
      survivor: '/printing-guide/',
      title: 'Sportswear Printing Guide | Sublimation, Screen Printing &amp; Embroidery | POXIOL',
      h1: 'Sportswear Printing Guide For Custom Teamwear',
      ctaHref: '/free-mockup/',
      ctaText: 'Get a Free Mockup',
      schemaTypes: ['Organization', 'WebPage', 'FAQPage', 'BreadcrumbList'],
    },
  ]

  for (const {source, survivor, title, h1, ctaHref, ctaText, schemaTypes} of routes) {
    assert.equal(sitemap.includes(`<loc>https://www.poxiol.com${source}</loc>`), false)
    assert.equal(existsSync(`out${source}index.html`), false)
    assert.equal(sitemap.includes(`<loc>https://www.poxiol.com${survivor}</loc>`), true)
    assert.equal(existsSync(`out${survivor}index.html`), true)

    const html = readRouteHtml(survivor)
    assert.equal(html.includes(`<title>${title}</title>`), true)
    assert.equal(html.includes(`<h1`), true)
    assert.match(html, new RegExp(`<h1[^>]*>\\s*${h1.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s*</h1>`, 'i'))
    assert.equal(html.includes(`rel="canonical" href="https://www.poxiol.com${survivor}"`), true)
    const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(([, attributes, body]) => ({
      href: (attributes.match(/\bhref="([^"]+)"/i)?.[1] ?? '').replace(/&amp;/g, '&'),
      text: body.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim(),
    }))
    assert.equal(anchors.some(({href, text}) => href === ctaHref && text === ctaText), true)

    const actualSchemaTypes = readRouteSchemas(survivor)
      .flatMap(flattenSchemaNodes)
      .map((schema) => schema['@type'])
      .filter(Boolean)
    for (const schemaType of schemaTypes) assert.equal(actualSchemaTypes.includes(schemaType), true)
  }
})

test('only the maintained private-label page serves distributor intent', () => {
  const retiredRoute = '/custom-sports-apparel-distributor/'
  const survivorRoute = '/private-label-teamwear/'
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  const survivorHtml = readRouteHtml(survivorRoute)

  assert.equal(sitemap.includes(`<loc>https://www.poxiol.com${retiredRoute}</loc>`), false)
  assert.equal(sitemap.includes(`<loc>https://www.poxiol.com${survivorRoute}</loc>`), true)
  assert.equal(existsSync(`out${retiredRoute}index.html`), false)
  assert.equal(existsSync(`out${survivorRoute}index.html`), true)
  assert.match(survivorHtml, /<title>Private Label Teamwear for Sports Brands and Distributors \| POXIOL<\/title>/)
  assert.match(survivorHtml, /<h1[^>]*>Private Label Teamwear Built Around Your Brand<\/h1>/)
  assert.match(survivorHtml, /<link[^>]+rel="canonical"[^>]+href="https:\/\/www\.poxiol\.com\/private-label-teamwear\/"/)

  const anchors = [...survivorHtml.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(([, attributes, body]) => ({
    href: (attributes.match(/\bhref="([^"]+)"/i)?.[1] ?? '').replace(/&amp;/g, '&'),
    text: body.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim(),
  }))
  const quoteHref = '/get-quote/?product=Private+Label+Teamwear&source=%2Fprivate-label-teamwear%2F#quote-form'
  const sampleHref = '/sample-order/?product=Private+Label+Teamwear&source=%2Fprivate-label-teamwear%2F#sample-request-form'
  assert.equal(anchors.filter(({href, text}) => href === quoteHref && text === 'Discuss Your OEM Project').length, 3)
  assert.equal(anchors.filter(({href, text}) => href === sampleHref && text === 'Request Sample').length, 1)

  assert.deepEqual(readRouteSchemas(survivorRoute), [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Custom Manufacturing',
      name: 'Private Label Teamwear',
      description: 'Private-label teamwear for teamwear distributors, dealers, sportswear brands and custom resellers worldwide. Plan client collections, samples and repeat orders.',
      provider: {'@id': 'https://www.poxiol.com/#operator'},
      areaServed: {'@type': 'Country', name: 'Global'},
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Custom Teamwear Services',
        itemListElement: [
          {'@type': 'Offer', itemOffered: {'@type': 'Service', name: 'Free 3D Mockup'}},
          {'@type': 'Offer', itemOffered: {'@type': 'Service', name: 'B2B Factory Quote'}},
          {'@type': 'Offer', itemOffered: {'@type': 'Service', name: 'Project-Specific Sample Planning'}},
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {'@type': 'Question', name: 'Does POXIOL support OEM private label teamwear projects?', acceptedAnswer: {'@type': 'Answer', text: 'Yes. POXIOL can review OEM and private label requirements for sports brands and distributors based on confirmed product specifications.'}},
        {'@type': 'Question', name: 'Can custom labels and packaging be included?', acceptedAnswer: {'@type': 'Answer', text: 'Label and packaging options are confirmed during project consultation according to the brand requirements and available production options.'}},
        {'@type': 'Question', name: 'Can a brand review a sample before bulk manufacturing?', acceptedAnswer: {'@type': 'Answer', text: 'Sample requirements and approval details can be agreed before bulk production proceeds.'}},
        {'@type': 'Question', name: 'What is reconfirmed for a repeat private label production run?', acceptedAnswer: {'@type': 'Answer', text: 'Product specifications, materials, artwork, labels, packaging, quantity and timing are reconfirmed before the new production run.'}},
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
        {'@type': 'ListItem', position: 2, name: 'Private Label Teamwear', item: 'https://www.poxiol.com/private-label-teamwear/'},
      ],
    },
  ])
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

test('retires the orphan AI summary surface and keeps the About survivor canonical', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  const aboutHtml = readRouteHtml('/about/')
  const summaryJsonText = readFileSync('out/ai-summary.json', 'utf8')
  const summaryJson = JSON.parse(summaryJsonText)

  assert.equal(existsSync('out/ai-summary/index.html'), false)
  assert.equal(sitemap.includes('<loc>https://www.poxiol.com/ai-summary/</loc>'), false)
  assert.match(aboutHtml, /<title>About POXIOL \| Professional Custom Teamwear Manufacturer<\/title>/)
  assert.match(aboutHtml, /<h1[^>]*>B2B Custom Teamwear Manufacturer<\/h1>/)
  assert.match(aboutHtml, /<link[^>]+rel="canonical"[^>]+href="https:\/\/www\.poxiol\.com\/about\/"/)
  assert.equal(summaryJson.url, 'https://www.poxiol.com/')
  assert.deepEqual(summaryJson.primaryCallToAction, {
    name: 'Get Free Mockup',
    url: 'https://www.poxiol.com/free-mockup/',
  })
  assert.doesNotMatch(summaryJsonText, /https:\/\/poxiol\.com(?:\/|\")/)
})

test('does not publish unapproved CMS product-detail routes', () => {
  const unapprovedProductSlugs = [
    'basketball-uniforms-1',
    'basketball-uniforms-2',
    'basketball-uniforms-3',
    'basketball-uniforms-4',
    'hoodies-jackets-1',
    'hoodies-jackets-2',
    'hoodies-jackets-3',
    'soccer-jerseys-1',
    'soccer-jerseys-2',
    'soccer-jerseys-3',
    'soccer-jerseys-4',
    'team-accessories-1',
    'team-accessories-2',
    'training-wear-1',
    'training-wear-2',
    'training-wear-3',
    'training-wear-4',
  ]

  for (const slug of unapprovedProductSlugs) {
    assert.equal(existsSync(`out/products/${slug}/index.html`), false, `${slug} HTML must remain withheld`)
    assert.equal(existsSync(`out/products/${slug}/index.txt`), false, `${slug} RSC output must remain withheld`)
  }
})

test('published structured data does not advertise missing logo or search resources', () => {
  const logoRoutes = [
    '/resources/',
    '/projects/',
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

  for (const route of ['/resources/', '/projects/']) {
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
  assert.equal((serviceHtml.match(/href="\/guides\/oem-odm-sportswear-manufacturing-guide-for-brands\/"/g) || []).length, 2)
  for (const preservedCta of ['Discuss Your OEM Project', 'Ask a Project Question', 'Start OEM/ODM Project']) {
    assert.equal(serviceHtml.includes(preservedCta), true, `service page lost preserved CTA: ${preservedCta}`)
  }

  const serviceCanonical = 'https://www.poxiol.com/oem-odm/'
  const serviceTitle = 'OEM/ODM Teamwear for Channel Partners'
  const serviceDescription = 'OEM/ODM teamwear for teamwear distributors, dealers, sportswear brands and custom resellers worldwide. Plan client collections, samples and repeat orders.'
  const serviceScripts = readRouteSchemas(serviceRoute)
  assert.equal(serviceScripts.length, 1, 'service page must render exactly one JSON-LD script')
  assert.deepEqual(serviceScripts[0]['@graph'].map((node) => node['@type']), ['BreadcrumbList', 'Service'])

  const serviceNodes = flattenSchemaNodes(serviceScripts[0])
  const serviceBreadcrumb = serviceNodes.find((node) => node['@type'] === 'BreadcrumbList')
  const service = serviceNodes.find((node) => node['@type'] === 'Service')
  assert.deepEqual(serviceBreadcrumb, {
    '@type': 'BreadcrumbList',
    '@id': `${serviceCanonical}#breadcrumb`,
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
      {'@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://www.poxiol.com/solutions/'},
      {'@type': 'ListItem', position: 3, name: serviceTitle, item: serviceCanonical},
    ],
  })
  assert.deepEqual(service, {
    '@type': 'Service',
    '@id': `${serviceCanonical}#service`,
    name: serviceTitle,
    description: serviceDescription,
    url: serviceCanonical,
    provider: {'@type': 'Organization', name: 'POXIOL', url: 'https://www.poxiol.com/'},
  })
  assert.equal(serviceHtml.includes(service.description), true, 'Service description must be visible verbatim')

  const serviceSchemaText = JSON.stringify(serviceScripts[0])
  for (const forbidden of ['Product', 'Offer', 'OfferCatalog', 'FAQPage', 'Review', 'AggregateRating', 'areaServed', 'price', 'priceCurrency', 'availability', 'MOQ', 'leadTime', 'capacity', 'certification', 'customer', 'datePublished', 'dateModified', 'author', 'reviewer']) {
    assert.equal(serviceSchemaText.includes(`"${forbidden}"`), false, `service schema must not expose ${forbidden}`)
  }
})
