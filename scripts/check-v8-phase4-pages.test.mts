import assert from 'node:assert/strict'
import {pageContentHtml} from './helpers/page-content-html.mjs'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outputMode = process.argv.includes('--output')
const baseUrl = 'https://www.poxiol.com'
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

const expectedRoutes = [
  {
    id: 'basketball',
    route: '/products/basketball-uniforms/',
    routeFile: 'app/products/basketball-uniforms/page.tsx',
    component: 'BasketballV8LandingPage',
    h1: 'Custom Basketball Uniform Manufacturer for Distributors and Brands',
    requiredText: [
      'Common Basketball Uniform Ordering Challenges',
      'Basketball Uniform Customization',
      'From Basketball Design to Shipment',
      'Approve the Sample Before Bulk Production',
      'Basketball Uniform Production Process',
      'Basketball Uniform Quality Checks',
      'Can teams order mixed sizes?',
      'Can names and numbers be customized?',
      'How does sample approval work?',
      'How long does production take?',
    ],
    links: ['/manufacturing/', '/quality-control-process/', '/sample-order/', '/free-mockup/'],
    schemas: ['Product', 'Service', 'FAQPage', 'BreadcrumbList'],
  },
  {
    id: 'manufacturing',
    route: '/manufacturing/',
    routeFile: 'app/manufacturing/page.tsx',
    component: 'V8AuthorityPage',
    h1: 'How POXIOL Manufactures Custom Teamwear',
    requiredText: ['Design Preparation', 'Material Selection', 'Printing', 'Cutting', 'Sewing', 'Inspection', 'Packing'],
    links: ['/quality-control-process/', '/get-quote/'],
    schemas: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'],
  },
  {
    id: 'factory',
    route: '/factory/',
    routeFile: 'app/factory/page.tsx',
    component: 'V8AuthorityPage',
    h1: 'POXIOL Teamwear Manufacturing Capability',
    requiredText: ['Who POXIOL Is', 'Manufacturing Capability', 'Sportswear Categories', 'Why Teams Choose POXIOL'],
    forbiddenText: ['Design Preparation', 'Material Selection', 'Inspection Preparation'],
    links: ['/manufacturing/', '/quality-control-process/'],
    schemas: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'],
  },
  {
    id: 'quality-control',
    route: '/quality-control-process/',
    routeFile: 'app/quality-control-process/page.tsx',
    component: 'V8AuthorityPage',
    h1: 'How POXIOL Verifies Custom Uniform Quality',
    requiredText: ['Material Inspection', 'Printing Inspection', 'Sewing Inspection', 'Size Checking', 'Final Inspection', 'Packing Verification', 'Request Sample'],
    links: ['/sample-order/', '/get-quote/'],
    schemas: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'],
  },
] as const

for (const expected of expectedRoutes) {
  assert.equal(existsSync(path.join(root, expected.routeFile)), true, `Missing route file: ${expected.route}`)
  assert.match(read(expected.routeFile), new RegExp(expected.component), `${expected.route} is not connected to ${expected.component}.`)
}

assert.equal(existsSync(path.join(root, 'components/v8/BasketballV8LandingPage.tsx')), true, 'Missing basketball V8 composition.')
assert.equal(existsSync(path.join(root, 'components/v8/V8AuthorityPage.tsx')), true, 'Missing authority page V8 composition.')
assert.equal(existsSync(path.join(root, 'lib/v8/phase4.ts')), true, 'Missing shared Phase 4 data.')

const basketballSource = read('components/v8/BasketballV8LandingPage.tsx')
for (const component of ['V8Hero', 'BuyerProblems', 'SolutionCards', 'DesignJourney', 'SampleApproval', 'ManufacturingTimeline', 'QualityControl', 'FAQSection', 'FinalCTA']) {
  assert.match(basketballSource, new RegExp(`<${component}\\b`), `Basketball page must reuse ${component}.`)
}
for (const schema of ['ProductSchema', 'ServiceSchema', 'FAQSchema']) assert.match(basketballSource, new RegExp(schema))
assert.doesNotMatch(basketballSource, /BreadcrumbSchema/, 'ProductSchema already owns the basketball BreadcrumbList; do not render a duplicate.')
assert.match(basketballSource, /schema=\{false\}/, 'Basketball visible FAQ and JSON-LD must share one array.')

const authoritySource = read('components/v8/V8AuthorityPage.tsx')
for (const schema of ['PageJsonLd', 'ServiceSchema', 'FAQSchema']) assert.match(authoritySource, new RegExp(schema))
assert.match(authoritySource, /schema=\{false\}/, 'Authority visible FAQ and JSON-LD must share one array.')
assert.match(authoritySource, /cmsProductionMediaToV8Assets/, 'Authority pages must only use verified CMS production media.')

const {PHASE4_BASKETBALL, PHASE4_AUTHORITY_PAGES, getPhase4AuthorityPage} = await import('../lib/v8/phase4.ts')
assert.deepEqual(PHASE4_BASKETBALL.faqs.slice(-4).map((faq) => faq.question), [
  'Can teams order mixed sizes?',
  'Can names and numbers be customized?',
  'How does sample approval work?',
  'How long does production take?',
])
assert.equal(new Set(PHASE4_BASKETBALL.faqs.map((faq) => faq.question)).size, PHASE4_BASKETBALL.faqs.length)
assert.deepEqual(PHASE4_BASKETBALL.authorityLinks.map((item) => item.href), ['/manufacturing/', '/quality-control-process/', '/sample-order/'])
assert.deepEqual(getPhase4AuthorityPage('manufacturing').processSteps.map((step) => step.title), ['Design Preparation', 'Material Selection', 'Printing', 'Cutting', 'Sewing', 'Inspection', 'Packing'])
assert.deepEqual(getPhase4AuthorityPage('quality-control').processSteps.map((step) => step.title), ['Material Inspection', 'Printing Inspection', 'Sewing Inspection', 'Size Checking', 'Final Inspection', 'Packing Verification'])
assert.equal(getPhase4AuthorityPage('quality-control').primaryCta.label, 'Request Sample')
assert.equal(getPhase4AuthorityPage('factory').processSteps.length, 0, 'Factory must not duplicate the detailed production workflow.')
assert.equal(PHASE4_AUTHORITY_PAGES.length, 3)

assert.equal(existsSync(path.join(root, 'app/custom-basketball-uniform-manufacturer/page.tsx')), false)
assert.equal(existsSync(path.join(root, 'app/production-process/page.tsx')), false)
assert.match(read('public/_redirects'), /^\/custom-basketball-uniforms\/ \/products\/basketball-uniforms\/ 301$/m)

if (outputMode) {
  const sitemap = read('out/sitemap.xml')

  for (const expected of expectedRoutes) {
    const outputFile = path.join(root, 'out', expected.route.replace(/^\/+|\/+$/g, ''), 'index.html')
    assert.equal(existsSync(outputFile), true, `Missing built route: ${expected.route}`)
    const html = readFileSync(outputFile, 'utf8')
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    const visibleText = visibleHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
    const h1s = [...visibleHtml.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').trim())
    const canonicals = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)]
    const canonical = canonicals[0]?.[0].match(/href=["']([^"']+)["']/i)?.[1]
    const ids = [...visibleHtml.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1])

    assert.deepEqual(h1s, [expected.h1])
    assert.equal(canonicals.length, 1)
    assert.equal(canonical, `${baseUrl}${expected.route}`)
    assert.equal(new Set(ids).size, ids.length, `${expected.route} must not contain duplicate HTML IDs.`)
    assert.doesNotMatch(visibleHtml, /Verified production visual pending/i, `${expected.route} must hide unverified public proof placeholders.`)
    for (const phrase of expected.requiredText) assert.ok(visibleText.includes(phrase), `${expected.route} is missing: ${phrase}`)
    for (const phrase of ('forbiddenText' in expected ? expected.forbiddenText : [])) assert.equal(visibleText.includes(phrase), false, `${expected.route} must not duplicate: ${phrase}`)
    const outgoingLinks = [...visibleHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)].map(match=>new URL(match[1].replace(/&amp;/g,'&'),'https://www.poxiol.com'))
    for (const href of expected.links) assert.ok(outgoingLinks.some(link=>link.origin==='https://www.poxiol.com' && link.pathname===href), `${expected.route} is missing link ${href}`)

    const schemas = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap((match) => {
        const parsed = JSON.parse(match[1])
        const roots = Array.isArray(parsed) ? parsed : [parsed]
        return roots.flatMap((root) => [root, ...(Array.isArray(root?.['@graph']) ? root['@graph'] : [])])
      })
    for (const schemaType of expected.schemas) assert.ok(schemas.some((schema) => schema['@type'] === schemaType), `${expected.route} is missing ${schemaType} schema.`)
    assert.match(sitemap, new RegExp(`<loc>${baseUrl}${expected.route.replaceAll('/', '\\/')}<\\/loc>`))
  }

  const basketballHtml = read('out/products/basketball-uniforms/index.html')
  const basketballFaqSchema = [...basketballHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .find((schema) => schema['@type'] === 'FAQPage')
  assert.ok(basketballFaqSchema)
  const basketballVisibleHtml = basketballHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  const visibleFaqQuestions = [...pageContentHtml(basketballVisibleHtml).matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim())
  const schemaFaqQuestions = basketballFaqSchema.mainEntity.map((item: {name: string}) => item.name)

  assert.deepEqual(schemaFaqQuestions, visibleFaqQuestions, 'Visible basketball FAQs and FAQPage schema must use the same merged data source.')
  for (const faq of PHASE4_BASKETBALL.faqs.slice(-4)) {
    assert.ok(schemaFaqQuestions.includes(faq.question), `Basketball FAQ is missing required question: ${faq.question}`)
  }
}

console.log(`POXIOL V8 Phase 4 ${outputMode ? 'output' : 'source'} checks passed.`)
