import assert from 'node:assert/strict'
import {pageContentHtml} from './helpers/page-content-html.mjs'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outputMode = process.argv.includes('--output')
const read = (relative: string) => readFileSync(path.join(root, relative), 'utf8')

const authorityMetadata = [
  {
    route: '/factory/',
    title: 'Teamwear Factory & Manufacturing Capability | POXIOL',
    description: 'Learn who POXIOL is, the custom teamwear categories supported and how factory capability connects to manufacturing and quality control.',
  },
  {
    route: '/manufacturing/',
    title: 'Custom Teamwear Manufacturing Process | POXIOL',
    description: 'See how POXIOL manufactures custom teamwear from design preparation and material selection through printing, cutting, sewing, inspection and packing.',
  },
  {
    route: '/quality-control-process/',
    title: 'Custom Uniform Quality Control Process | POXIOL',
    description: 'Review how POXIOL checks custom uniforms through material, printing, sewing, size, final and packing inspections before shipment.',
  },
] as const

for (const page of authorityMetadata) {
  const source = read(`app${page.route}page.tsx`)
  assert.match(source, /getV8AuthorityMetadata/, `${page.route} must use the shared V8 authority metadata.`)
}

const contactFormSource = read('components/forms/ContactForm.tsx')
assert.match(contactFormSource, /method=["']post["']/i, 'The project form needs a native POST fallback when JavaScript is unavailable.')
assert.match(contactFormSource, /action=\{process\.env\.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT\}/, 'The native form action must use the existing Formspree endpoint.')

const legacySource = read('lib/cms/legacy.ts')
assert.doesNotMatch(legacySource, /mockup-process\.webp/, 'Unverified legacy mockup visuals must not bypass the V8 verified-media gate.')

const basketballSource = read('components/v8/BasketballV8LandingPage.tsx')
assert.doesNotMatch(basketballSource, /<BreadcrumbSchema\b/, 'Basketball must not output a second BreadcrumbList beside ProductSchema.')
assert.doesNotMatch(read('lib/week3-guides.ts'), /href:\s*['"]\/products\/basketball-uniforms-1\/['"]/, 'Basketball commercial links must use the primary landing page.')
assert.match(read('public/_redirects'), /^\/custom-basketball-uniforms\/ \/products\/basketball-uniforms\/ 301$/m, 'The legacy basketball route needs an exact HTTP 301.')
assert.equal(existsSync(path.join(root, 'app/custom-basketball-uniforms/page.tsx')), false, 'The retired basketball route must not compete with its HTTP 301.')

const layoutSource = read('app/layout.tsx')
assert.doesNotMatch(layoutSource, /home_hero_v62_(?:desktop|mobile)\.webp/, 'Unverified legacy people visuals must not be preloaded or used as global social proof.')
assert.doesNotMatch(layoutSource, /MOQ 1|sample production in 2-3 days/i, 'Global metadata must not publish unverified fixed production claims.')

assert.doesNotMatch(read('lib/cms/legacy.ts'), /Elite B2B custom teamwear manufacturer offering[\s\S]{0,200}MOQ 1 set/i, 'Homepage fallback metadata must not contain the old fixed MOQ claim.')
assert.doesNotMatch(read('lib/buyer-decision.ts'), /Bulk production commonly takes 7-12 working days/i, 'Homepage FAQ must not publish an unverified fixed bulk timeline.')

const footerSource = read('components/ui.tsx')
assert.doesNotMatch(footerSource, /MOQ 1 Set|Fast Sample|Verified Alibaba Store/, 'The global footer must not publish unverified operating claims.')
assert.doesNotMatch(read('lib/sanity/content.ts'), /fast-track sample and production scheduling/i, 'Homepage fallback copy must not promise unverified fast-track scheduling.')

const allSportsSource = read('lib/sports-pages.ts')
const basketballStart = allSportsSource.indexOf('slug: "products/basketball-uniforms"')
const basketballEnd = allSportsSource.indexOf('slug: "products/soccer-jerseys"')
const sportsSource = allSportsSource.slice(basketballStart, basketballEnd)
for (const claim of [/1 set sample/i, /2-3 working days/i, /Verified sourcing on Alibaba/i, /160gsm to 180gsm/i, /100% manual QC/i, /±?1\.5cm/i]) {
  assert.doesNotMatch(sportsSource, claim, `Basketball source contains an unverified fixed claim: ${claim}`)
}

const schemaSource = read('components/seo/GEOStructuredData.tsx')
assert.doesNotMatch(schemaSource, /"availability":\s*"https:\/\/schema\.org\/InStock"/, 'Product schema must not claim live stock without verified inventory data.')
assert.doesNotMatch(schemaSource, /"minValue":\s*1/, 'Product schema must not publish an unverified fixed MOQ.')

const pageTemplateSource = read('components/cms/PageTemplate.tsx')
assert.match(pageTemplateSource, /<FAQSchema\b/, 'Visible CMS FAQ sections must publish FAQPage schema from the same page data.')
assert.match(pageTemplateSource, /VerifiedMediaPlaceholder/, 'Legacy CMS pages must use the verified-media rendering gate.')
assert.doesNotMatch(pageTemplateSource, /<img[^>]+(?:page\.image|section\.image|section\.gallery)/, 'Unverified legacy CMS images must not render directly.')

const blockedPublicClaims = [
  /MOQ 1 set/i,
  /\b1[- ]set sample\b/i,
  /2-3 working days/i,
  /7-12 working days/i,
  /within 2 hours/i,
  /Free Mockup in 2h/i,
] as const

assert.doesNotMatch(schemaSource, /\b1[- ]set sample\b/i, 'Service schema must not publish an unverified fixed sample quantity.')
assert.match('1-Set Sample Production', blockedPublicClaims[1], 'The fixed-claim guard must reject the previously missed hyphenated sample claim.')

if (outputMode) {
  const homepageHtml = read('out/index.html')
  for (const claim of blockedPublicClaims) {
    assert.doesNotMatch(homepageHtml, claim, `Homepage output contains an unverified fixed claim: ${claim}`)
  }

  const guardedOutputs = [
    {route: '/', file: 'out/index.html'},
    {route: '/products/', file: 'out/products/index.html'},
    {route: '/llms.txt', file: 'out/llms.txt'},
    {route: '/products/basketball-uniforms/', file: 'out/products/basketball-uniforms/index.html'},
    {route: '/free-mockup/', file: 'out/free-mockup/index.html'},
    {route: '/get-quote/', file: 'out/get-quote/index.html'},
    {route: '/sample-order/', file: 'out/sample-order/index.html'},
    {route: '/contact/', file: 'out/contact/index.html'},
    {route: '/customization/', file: 'out/customization/index.html'},
    {route: '/youth-team-uniforms/', file: 'out/youth-team-uniforms/index.html'},
    {route: '/school-teamwear/', file: 'out/school-teamwear/index.html'},
    {route: '/club-teamwear-program/', file: 'out/club-teamwear-program/index.html'},
    {route: '/private-label-teamwear/', file: 'out/private-label-teamwear/index.html'},
    {route: '/factory/', file: 'out/factory/index.html'},
    {route: '/manufacturing/', file: 'out/manufacturing/index.html'},
    {route: '/quality-control-process/', file: 'out/quality-control-process/index.html'},
  ] as const
  for (const output of guardedOutputs) {
    const content = read(output.file)
    for (const claim of blockedPublicClaims) {
      assert.doesNotMatch(content, claim, `${output.route} output contains an unverified fixed claim: ${claim}`)
    }
  }

  for (const page of authorityMetadata) {
    const html = read(`out${page.route}index.html`)
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].replace(/&amp;/g, '&')
    assert.equal(title, page.title, `${page.route} has the wrong title.`)
    const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]
    assert.equal(description, page.description)
  }

  for (const route of ['/free-mockup/', '/get-quote/', '/sample-order/', '/contact/']) {
    const html = read(`out${route}index.html`)
    const formTag = html.match(/<form\b[^>]*>/i)?.[0]
    assert.ok(formTag, `${route} is missing its project form.`)
    assert.match(formTag, /method=["']post["']/i, `${route} form must use POST without JavaScript.`)
  }

  for (const route of ['/customization/', '/free-mockup/', '/get-quote/', '/sample-order/', '/contact/']) {
    const html = read(`out${route}index.html`)
    assert.doesNotMatch(html, /<img[^>]+cdn\.sanity\.io/i, `${route} must not render unverified Sanity images.`)
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    assert.doesNotMatch(visibleHtml, /Verified production visual pending/i, `${route} must hide unverified public proof placeholders.`)
  }

  for (const route of ['/free-mockup/', '/get-quote/', '/sample-order/']) {
    const html = read(`out${route}index.html`)
    const visibleQuestions = [...pageContentHtml(html).matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)]
      .map((match) => match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    const faqSchemas = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .map((match) => JSON.parse(match[1]))
      .filter((schema) => schema['@type'] === 'FAQPage')
    assert.equal(faqSchemas.length, 1, `${route} needs one FAQPage schema.`)
    assert.deepEqual(faqSchemas[0].mainEntity.map((item: {name: string}) => item.name), visibleQuestions, `${route} FAQ schema must match visible FAQ questions.`)
  }

  const basketballHtml = read('out/products/basketball-uniforms/index.html')
  const breadcrumbCount = [...basketballHtml.matchAll(/"@type":"BreadcrumbList"/g)].length
  assert.equal(breadcrumbCount, 1, 'Basketball must output one BreadcrumbList.')
  for (const claim of [/1 set sample/i, /2-3 working days/i, /Verified sourcing on Alibaba/i, /160gsm to 180gsm/i, /100% manual QC/i, /1\.5cm/i, /schema\.org\/InStock/i]) {
    assert.doesNotMatch(basketballHtml, claim, `Basketball output contains an unverified fixed claim: ${claim}`)
  }
}

assert.equal(existsSync(path.join(root, 'app/custom-basketball-uniform-manufacturer/page.tsx')), false)
assert.equal(existsSync(path.join(root, 'app/production-process/page.tsx')), false)

console.log(`POXIOL V8 Phase 6 ${outputMode ? 'output' : 'source'} checks passed.`)
