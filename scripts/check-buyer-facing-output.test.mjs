import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {test} from 'node:test'

const routes = ['/', '/about/', '/factory/', '/manufacturing/', '/quality-control-process/', '/customization/', '/contact/', '/oem-odm/', '/free-mockup/', '/sample-order/', '/get-quote/']
const internalLanguage = /legacy POXIOL site|overridden in Sanity|Local editorial review|Owner-approved editorial wording only|Evidence pending|local source projection|pilot does not add a second form/i
const outputDirectory = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? 'out')

function outputFile(route) {
  return route === '/'
    ? path.join(outputDirectory, 'index.html')
    : path.join(outputDirectory, ...route.split('/').filter(Boolean), 'index.html')
}

function outputHtml(route) {
  return readFileSync(outputFile(route), 'utf8')
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
}

function visibleTextFromHtml(html) {
  return decodeHtml(html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim())
}

function attrValues(html, tag, key, value, wanted) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))]
    .map(([source]) => Object.fromEntries([...source.matchAll(/([:\w-]+)=["']([^"']*)["']/g)].map(([, name, attrValue]) => [name, decodeHtml(attrValue)])))
    .filter((attrs) => attrs[key] === value)
    .map((attrs) => attrs[wanted])
}

function one(values, label) {
  assert.equal(values.length, 1, `${label} must occur exactly once`)
  return values[0]
}

function digest(value) {
  return createHash('sha256').update(value).digest('hex')
}

function visibleText(route) {
  return visibleTextFromHtml(outputHtml(route))
}

for (const route of routes) {
  test(`${route} keeps internal construction language out of buyer-visible output`, () => {
    assert.doesNotMatch(visibleText(route), internalLanguage)
  })
}

const seo037Targets = [
  {
    route: '/products/basketball-uniforms/',
    title: 'Custom Basketball Uniform Manufacturer | POXIOL',
    description: 'Custom basketball uniforms for teamwear distributors, dealers, sportswear brands and custom resellers worldwide. Plan client orders, samples and reorders.',
    h1: 'Custom Basketball Uniform Manufacturer for Distributors and Brands',
    canonical: 'https://www.poxiol.com/products/basketball-uniforms/',
    schemaHashes: ['b9997cce7f1376e62f1c069cd7a7779b239a1f9cf5c17f6346f724f101c66792', '3e0c55404f79a276bc006cd8dcee1f98940caf59302e6aff2f1862ae053f0f09', '93072b88190249a0475e6e38a33e699a7d3fb3b1d9f6673e1b4699af3bab089c'],
    panelId: 'basketball-order-planning',
    copy: [
      'Basketball Order Planning',
      'Choose the Basketball Uniform Path Before You Request a Quote',
      'A basketball uniform project starts with the garment structure, roster and size breakdown, authorized artwork, sample expectations, quantity, destination and required in-hand date. Confirm these inputs before the project moves to mockup, sample or quotation review.',
      'Jersey and shorts set', 'Reversible set', 'Single-layer set', 'Personalized roster', 'Private-label or reorder planning',
      'Product structure', 'Expected quantity', 'Size breakdown', 'Final names and numbers', 'Authorized logos and color direction', 'Sample expectation', 'Destination', 'Required in-hand date',
    ],
    links: ['/guides/how-to-order-custom-basketball-uniforms/', '/sample-order/?product=Basketball+Uniforms&sport=Basketball&source=%2Fproducts%2Fbasketball-uniforms%2F#sample-request-form', '/quality-control-process/', '/get-quote/?product=Basketball+Uniforms&sport=Basketball&source=%2Fproducts%2Fbasketball-uniforms%2F#quote-form'],
    existingCta: '/get-quote/?product=Basketball+Uniforms&sport=Basketball&source=%2Fproducts%2Fbasketball-uniforms%2F#quote-form',
  },
  {
    route: '/oem-odm/',
    title: 'OEM/ODM Teamwear for Distributors and Brands | POXIOL',
    description: 'OEM/ODM teamwear for teamwear distributors, dealers, sportswear brands and custom resellers worldwide. Plan client collections, samples and repeat orders.',
    h1: 'OEM/ODM Teamwear for Channel Partners',
    canonical: 'https://www.poxiol.com/oem-odm/',
    schemaHashes: ['541fcce2dc307ba949c8d46dbabf436e9a5aa321e0f3dea7318babf3d6b745af'],
    panelId: 'oem-odm-project-planning',
    copy: [
      'OEM/ODM Project Planning',
      'Choose the Development Path Before You Request a Quote',
      'Choose OEM when the product, artwork and specification direction are already defined. Choose ODM when the concept, range structure or open product decisions still need development review. POXIOL confirms the appropriate path after reviewing the actual project brief.',
      'The buyer already has a reference style, artwork, product or technical direction.',
      'The buyer has a target market, sport category, collection goal or design direction but still has open product decisions.',
      'Buyer or company type', 'Target market', 'Sport category', 'Product range', 'Reference style or technical input', 'Authorized logos and brand assets', 'Estimated quantity', 'Size requirements', 'Label and packaging requirements', 'Destination', 'Required in-hand date',
    ],
    links: ['/guides/oem-odm-sportswear-manufacturing-guide-for-brands/', '/private-label-teamwear/', '/sample-order/?product=OEM+%2F+ODM+Teamwear&source=%2Foem-odm%2F#sample-request-form', '/get-quote/?product=OEM+%2F+ODM+Teamwear&source=%2Foem-odm%2F#quote-form'],
    existingCta: '/get-quote/?product=OEM+%2F+ODM+Teamwear&source=%2Foem-odm%2F#quote-form',
  },
]

for (const target of seo037Targets) {
  test(`${target.route} renders one evidence-safe SEO-037 decision panel without SEO or form drift`, () => {
    const html = outputHtml(target.route)
    const visible = visibleTextFromHtml(html)
    assert.equal((html.match(/data-seo033-panel=/g) || []).length, 1)
    assert.match(html, new RegExp(`data-seo033-panel=["']${target.panelId}["']`))
    assert.equal((html.match(/<h1\b/gi) || []).length, 1)
    assert.equal(one([...html.matchAll(/<title>(.*?)<\/title>/gi)].map((match) => decodeHtml(match[1])), `${target.route} title`), target.title)
    assert.equal(one(attrValues(html, 'meta', 'name', 'description', 'content'), `${target.route} description`), target.description)
    assert.equal(one(attrValues(html, 'link', 'rel', 'canonical', 'href'), `${target.route} canonical`), target.canonical)
    assert.ok(visible.includes(target.h1), `${target.route} H1 changed`)
    assert.equal(one(attrValues(html, 'meta', 'property', 'og:title', 'content'), `${target.route} og:title`), target.title)
    assert.equal(one(attrValues(html, 'meta', 'property', 'og:description', 'content'), `${target.route} og:description`), target.description)
    assert.equal(one(attrValues(html, 'meta', 'name', 'twitter:title', 'content'), `${target.route} twitter:title`), target.title)
    assert.equal(one(attrValues(html, 'meta', 'name', 'twitter:description', 'content'), `${target.route} twitter:description`), target.description)
    const schemaSources = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1].trim())
    for (const source of schemaSources) assert.doesNotThrow(() => JSON.parse(source))
    assert.deepEqual(schemaSources.map(digest), target.schemaHashes, `${target.route} Schema changed`)
    assert.equal((html.match(/<form\b/gi) || []).length, 0, `${target.route} must not gain a form`)
    assert.ok(decodeHtml(html).includes(target.existingCta), `${target.route} existing contextual quote destination changed`)
    for (const copy of target.copy) assert.ok(visible.includes(copy), `${target.route} missing frozen copy: ${copy}`)
    for (const href of target.links) assert.match(decodeHtml(html), new RegExp(`href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`), `${target.route} missing survivor link ${href}`)
    for (const forbidden of ['guaranteed delivery', 'fixed lead time', '30,000+ units', '50+ countries', 'best manufacturer']) {
      assert.ok(!visible.toLowerCase().includes(forbidden), `${target.route} contains forbidden claim: ${forbidden}`)
    }
  })
}

test('SEO-037 controls remain outside the pilot', () => {
  const home = outputHtml('/')
  const quote = outputHtml('/get-quote/')
  assert.equal((home.match(/data-seo033-panel=/g) || []).length, 0)
  assert.equal((quote.match(/data-seo033-panel=/g) || []).length, 0)
  assert.equal((quote.match(/<form\b/gi) || []).length, 1, 'Get Quote must retain its single form')
  assert.match(quote, /id=["']quote-form["']/, 'Get Quote form marker changed')
})
