import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outputMode = process.argv.includes('--output')
const baseUrl = 'https://www.poxiol.com'

const expectedPages = [
  {
    id: 'youth-team-uniforms',
    route: '/youth-team-uniforms/',
    title: 'Youth Team Uniforms for Clubs and Team Managers | POXIOL',
    description: 'Plan youth basketball and multi-sport uniforms with mixed sizes, player names and numbers, coach apparel, mockup review and sample approval.',
    h1: 'Youth Team Uniforms Made Simple for Managers',
    cta: 'Create Your Team Uniform',
  },
  {
    id: 'school-teamwear',
    route: '/school-teamwear/',
    title: 'School Teamwear Programs for Schools and Academies | POXIOL',
    description: 'Coordinate seasonal school and academy teamwear with clear sizing, repeat supply planning and reliable production steps.',
    h1: 'School Teamwear Built for Seasonal Programs',
    cta: 'Request School Teamwear Solution',
  },
  {
    id: 'club-teamwear-program',
    route: '/club-teamwear-program/',
    title: 'Club Teamwear Programs for Multiple Teams | POXIOL',
    description: 'Manage multiple squads, club collections and repeat teamwear orders through one consistent approval and production workflow.',
    h1: 'One Club Teamwear Program for Every Squad',
    cta: 'Build Your Club Teamwear Program',
  },
  {
    id: 'private-label-teamwear',
    route: '/private-label-teamwear/',
    title: 'Private Label Teamwear for Sports Brands and Distributors | POXIOL',
    description: 'Plan OEM teamwear collections with custom labels, packaging, sample approval and repeat manufacturing requirements.',
    h1: 'Private Label Teamwear Built Around Your Brand',
    cta: 'Discuss Your OEM Project',
  },
] as const

for (const expected of expectedPages) {
  const routeFile = path.join(root, 'app', expected.id, 'page.tsx')
  assert.equal(existsSync(routeFile), true, `Missing approved buyer route: ${expected.route}`)
  const routeSource = readFileSync(routeFile, 'utf8')
  assert.match(routeSource, /V8BuyerLandingPage/)
  assert.match(routeSource, new RegExp(`pageId=["']${expected.id}["']`))
}

assert.equal(existsSync(path.join(root, 'lib/v8/buyer-pages.ts')), true, 'Missing shared buyer page data.')
const {V8_BUYER_PAGE_CONTENT, getV8BuyerPageContent} = await import('../lib/v8/buyer-pages.ts')

assert.equal(V8_BUYER_PAGE_CONTENT.length, expectedPages.length)
assert.equal(new Set(V8_BUYER_PAGE_CONTENT.map((page) => page.seoTitle)).size, expectedPages.length, 'Buyer page titles must be unique.')
assert.equal(new Set(V8_BUYER_PAGE_CONTENT.map((page) => page.heroTitle)).size, expectedPages.length, 'Buyer page H1 values must be unique.')
assert.equal(new Set(V8_BUYER_PAGE_CONTENT.map((page) => page.seoDescription)).size, expectedPages.length, 'Buyer page descriptions must be unique.')

for (const expected of expectedPages) {
  const page = getV8BuyerPageContent(expected.id)
  assert.equal(page.canonicalPath, expected.route)
  assert.equal(page.seoTitle, expected.title)
  assert.equal(page.seoDescription, expected.description)
  assert.equal(page.heroTitle, expected.h1)
  assert.equal(page.finalCta.label, expected.cta)
  assert.ok(page.problems.length >= 3, `${expected.id} needs buyer-specific pain points.`)
  assert.ok(page.solutions.length >= 3, `${expected.id} needs buyer-specific solutions.`)
  assert.ok(page.faqs.length >= 4, `${expected.id} needs a unique FAQ set.`)
  assert.equal(new Set(page.faqs.map((faq) => faq.question)).size, page.faqs.length)
  assert.doesNotMatch(`${page.seoTitle}\n${page.seoDescription}\n${page.heroTitle}`, /Custom Teamwear Manufacturer/i)
  assert.deepEqual(page.authorityLinks.map((item) => item.href), [
    '/customization/',
    '/manufacturing/',
    '/quality-control-process/',
    page.finalCta.href,
  ])
}

const buyerTemplate = readFileSync(path.join(root, 'components/v8/V8BuyerLandingPage.tsx'), 'utf8')
for (const component of ['V8Hero', 'BuyerProblems', 'SolutionCards', 'DesignJourney', 'ManufacturingTimeline', 'QualityControl', 'FAQSection', 'FinalCTA']) {
  assert.match(buyerTemplate, new RegExp(`<${component}\\b`), `Buyer template must reuse ${component}.`)
}
assert.match(buyerTemplate, /ServiceSchema/)
assert.match(buyerTemplate, /BreadcrumbSchema/)
assert.match(buyerTemplate, /schema=\{false\}/, 'Visible FAQ and FAQPage JSON-LD must use the same resolved array.')
assert.match(buyerTemplate, /<V8Hero\b[^>]*primary=\{page\.finalCta\}/, 'The buyer-specific CTA must be visible in the Hero as well as the final section.')

const sitemapSource = readFileSync(path.join(root, 'app/sitemap.ts'), 'utf8')
for (const expected of expectedPages) assert.match(sitemapSource, new RegExp(expected.route.replaceAll('/', '\\/')))

if (outputMode) {
  const sitemapXml = readFileSync(path.join(root, 'out/sitemap.xml'), 'utf8')
  const questionSets: string[][] = []

  for (const expected of expectedPages) {
    const outputFile = path.join(root, 'out', expected.id, 'index.html')
    assert.equal(existsSync(outputFile), true, `Missing built buyer route: ${expected.route}`)
    const html = readFileSync(outputFile, 'utf8')
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]
    const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)?.[1]
    const canonicalTags = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)]
    const canonical = canonicalTags[0]?.[0].match(/href=["']([^"']+)["']/i)?.[1]
    const bodyWithoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    const ids = [...bodyWithoutScripts.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1])
    assert.equal(new Set(ids).size, ids.length, `${expected.id} must not contain duplicate HTML ids.`)
    const h1s = [...bodyWithoutScripts.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').trim())

    assert.equal(title, expected.title)
    assert.equal(description, expected.description)
    assert.equal(canonicalTags.length, 1)
    assert.equal(canonical, `${baseUrl}${expected.route}`)
    assert.deepEqual(h1s, [expected.h1])
    assert.match(bodyWithoutScripts, new RegExp(expected.cta))
    const heroHtml = bodyWithoutScripts.match(/<section\b[^>]*>[\s\S]*?<\/section>/i)?.[0] || ''
    assert.match(heroHtml, new RegExp(expected.cta), `${expected.id} needs its approved CTA in the first screen.`)
    const heroHrefs = [...heroHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((match) => match[1])
    assert.equal(new Set(heroHrefs).size, heroHrefs.length, `${expected.id} Hero must not repeat the same CTA destination.`)
    assert.match(html, /Verified production visual pending/)
    for (const href of ['/customization/', '/manufacturing/', '/quality-control-process/']) {
      assert.match(html, new RegExp(`href=["']${href.replaceAll('/', '\\/')}["']`))
    }
    const internalLinks = [...bodyWithoutScripts.matchAll(/<a\b[^>]*href=["'](\/[^"'#?]*\/?)(?:[?#][^"']*)?["'][^>]*>/gi)]
      .map((match) => match[1])
      .filter((href) => href !== '/')
    for (const href of new Set(internalLinks)) {
      const targetPath = href.replace(/^\/+|\/+$/g, '')
      const targetFile = path.join(root, 'out', targetPath, 'index.html')
      assert.equal(existsSync(targetFile), true, `${expected.id} contains a broken internal link: ${href}`)
    }

    const schemas = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .map((match) => JSON.parse(match[1]))
    assert.ok(schemas.some((schema) => schema['@type'] === 'Service'), `${expected.id} needs Service schema.`)
    assert.ok(schemas.some((schema) => schema['@type'] === 'BreadcrumbList'), `${expected.id} needs Breadcrumb schema.`)
    const faqSchema = schemas.find((schema) => schema['@type'] === 'FAQPage')
    assert.ok(faqSchema, `${expected.id} needs FAQPage schema.`)
    const schemaQuestions = faqSchema.mainEntity.map((item: {name: string}) => item.name)
    assert.deepEqual(schemaQuestions, getV8BuyerPageContent(expected.id).faqs.map((faq) => faq.question))
    questionSets.push(schemaQuestions)
    assert.match(sitemapXml, new RegExp(`<loc>${baseUrl}${expected.route.replaceAll('/', '\\/')}<\\/loc>`))
  }

  for (let index = 0; index < questionSets.length; index += 1) {
    for (let other = index + 1; other < questionSets.length; other += 1) {
      assert.equal(questionSets[index].some((question) => questionSets[other].includes(question)), false, 'Each buyer page needs a distinct FAQ set.')
    }
  }
}

console.log(`POXIOL V8 buyer page ${outputMode ? 'output' : 'source'} checks passed.`)
