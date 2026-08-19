import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outputMode = process.argv.includes('--output')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')
const baseUrl = 'https://www.poxiol.com'

const owners = [
  {
    id: 'basketball',
    route: '/products/basketball-uniforms/',
    file: 'app/products/basketball-uniforms/page.tsx',
    h1: 'Custom Basketball Uniform Manufacturer for Clubs, Schools and Sportswear Brands',
    terms: ['Jersey and Shorts', 'Front and Back', 'Reversible', 'Names and Numbers', 'Sample Review', 'Quality Control', 'Reorders', 'Private Label'],
  },
  {
    id: 'soccer',
    route: '/products/soccer-jerseys/',
    file: 'app/products/soccer-jerseys/page.tsx',
    h1: 'Custom Soccer Kit Manufacturer for Clubs, Schools and Sports Brands',
    terms: ['Jersey, Shorts and Socks', 'Full Soccer Kit', 'Goalkeeper', 'Team Crest', 'Sample Approval', 'Manufacturing', 'Quality Control', 'Packaging'],
  },
  {
    id: 'baseball',
    route: '/custom-baseball-softball-uniforms/',
    file: 'app/custom-baseball-softball-uniforms/page.tsx',
    h1: 'Custom Baseball Uniform Manufacturer for Teams, Schools and Clubs',
    terms: ['Baseball Jersey', 'Baseball Pants', 'Full Baseball Uniform', 'Front and Back', 'Player Numbers', 'Sample Review', 'Manufacturing', 'Quality Control'],
  },
] as const

assert.equal(existsSync(path.join(root, 'lib/core-sports.ts')), true, 'Missing shared Core Sports data layer.')
assert.equal(existsSync(path.join(root, 'components/core-sports/CoreSportLandingPage.tsx')), true, 'Missing reusable Core Sport landing page.')

const coreSource = read('lib/core-sports.ts')
const compositionSource = read('components/core-sports/CoreSportLandingPage.tsx')
for (const owner of owners) {
  assert.ok(coreSource.includes(owner.route), 'Missing canonical owner: ' + owner.route)
  assert.match(read(owner.file), /CoreSport|BasketballV8LandingPage/, owner.route + ' must use the approved reusable composition.')
}

for (const component of ['V8Hero', 'BuyerProblems', 'SolutionCards', 'DesignJourney', 'SampleApproval', 'ManufacturingTimeline', 'QualityControl', 'FAQSection', 'FinalCTA']) {
  assert.match(compositionSource, new RegExp('<' + component + '\\b'), 'Core Sport composition must reuse ' + component + '.')
}
for (const schema of ['ProductSchema', 'ServiceSchema', 'FAQSchema']) {
  assert.match(compositionSource, new RegExp(schema), 'Core Sport composition must output ' + schema + '.')
}
assert.match(compositionSource, /schema=\{false\}/, 'Visible FAQ and FAQPage JSON-LD must share the same data.')

const soccerSource = coreSource.slice(coreSource.indexOf("id: 'soccer'"), coreSource.indexOf("id: 'baseball'"))
assert.doesNotMatch(soccerSource, /basketball/i, 'Soccer data must not contain Basketball template residue.')

const {HEADER_NAV} = await import('../lib/navigation.ts')
assert.deepEqual(
  HEADER_NAV.find((item) => item.label === 'Products')?.children?.slice(0, 3).map((item) => item.href),
  owners.map((owner) => owner.route),
  'Navigation must prioritize Basketball, Soccer and Baseball in that order.',
)

const buyerData = read('lib/v8/buyer-pages.ts')
for (const owner of owners) assert.ok(buyerData.includes(owner.route), 'Buyer pages must link to ' + owner.route)
assert.match(read('app/[slug]/page.tsx'), /getPseoCoreSportLink/, 'Core sport guides and long-tail pages must link back to their owner URL.')

const {sitemapTaxonomyEntries} = await import('../lib/site-taxonomy.ts')
assert.ok(sitemapTaxonomyEntries().some((item) => item.path === '/custom-baseball-softball-uniforms/'), 'Baseball primary URL must be in the sitemap source.')
assert.match(read('public/_redirects'), /^\/custom-basketball-uniforms\/ \/products\/basketball-uniforms\/ 301$/m, 'Approved Basketball HTTP 301 must remain unchanged.')
assert.equal(existsSync(path.join(root, 'app/products/baseball-uniforms/page.tsx')), false, 'Do not create a duplicate Baseball commercial route.')
assert.equal(existsSync(path.join(root, 'app/custom-basketball-uniform-manufacturer/page.tsx')), false, 'Do not create a duplicate Basketball commercial route.')

const productManifest = JSON.parse(read('content/product-visualization/assets.json')) as Array<{assetId: string; classification: string; recommendedPages: string[]}>
for (const assetId of ['PV-SOCCER-001', 'PV-BASEBALL-001']) {
  const asset = productManifest.find((item) => item.assetId === assetId)
  assert.equal(asset?.classification, 'PRODUCT_VISUALIZATION', assetId + ' classification changed.')
}
assert.ok(productManifest.find((item) => item.assetId === 'PV-SOCCER-001')?.recommendedPages.includes('/products/soccer-jerseys/'), 'Soccer visualization must be approved for the Soccer pillar.')
assert.ok(productManifest.find((item) => item.assetId === 'PV-BASEBALL-001')?.recommendedPages.includes('/custom-baseball-softball-uniforms/'), 'Baseball visualization must be approved for the Baseball pillar.')

const realManifest = JSON.parse(read('content/real-production/manifest/assets.json')) as {assets: Array<{sport: string; verificationStatus: string}>}
assert.ok(realManifest.assets.every((asset) => asset.sport === 'basketball'), 'Do not invent Soccer or Baseball real-production evidence.')
assert.ok(realManifest.assets.every((asset) => asset.verificationStatus !== 'PRODUCT_VISUALIZATION'), 'Product visualizations must never enter the real-production manifest.')

const {getPublicProofAssets} = await import('../lib/v8/media.ts')
const verified = (id: string) => ({id, kind: 'image' as const, url: '/' + id + '.webp', alt: id, verified: true})
assert.deepEqual(getPublicProofAssets([]), [], 'Zero verified assets must hide the public proof section.')
assert.equal(getPublicProofAssets([verified('one')]).length, 1)
assert.equal(getPublicProofAssets([verified('one'), verified('two')]).length, 2)
assert.equal(getPublicProofAssets([verified('one'), verified('two'), verified('three')]).length, 3)
assert.equal(getPublicProofAssets([{...verified('unsafe'), verified: false}]).length, 0, 'Unverified media must not pass the public proof selector.')

if (outputMode) {
  const sitemap = read('out/sitemap.xml')
  const titles = new Set<string>()

  for (const owner of owners) {
    const html = read('out' + owner.route + 'index.html')
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    const visibleText = visibleHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
    const h1s = [...visibleHtml.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').trim())
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].replace(/&amp;/g, '&') || ''
    const canonicalTags = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)]
    const canonical = canonicalTags[0]?.[0].match(/href=["']([^"']+)["']/i)?.[1]

    assert.deepEqual(h1s, [owner.h1], owner.route + ' must have exactly one approved H1.')
    assert.equal(canonicalTags.length, 1, owner.route + ' must have one canonical.')
    assert.equal(canonical, baseUrl + owner.route)
    assert.ok(title.length > 20)
    assert.equal(titles.has(title), false, 'Duplicate Core Sports title: ' + title)
    titles.add(title)
    assert.ok(sitemap.includes('<loc>' + baseUrl + owner.route + '</loc>'), owner.route + ' must be in sitemap.')

    for (const term of owner.terms) assert.ok(visibleText.includes(term), owner.route + ' is missing: ' + term)
    for (const href of ['/customization/', '/sample-order/', '/manufacturing/', '/quality-control-process/', '/get-quote/']) {
      assert.ok(visibleHtml.includes('href="' + href + '"'), owner.route + ' is missing link ' + href)
    }

    const schemas = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap((match) => {
        const parsed = JSON.parse(match[1])
        const roots = Array.isArray(parsed) ? parsed : [parsed]
        return roots.flatMap((rootValue) => [rootValue, ...(Array.isArray(rootValue?.['@graph']) ? rootValue['@graph'] : [])])
      })
    for (const type of ['Product', 'Service', 'FAQPage']) assert.ok(schemas.some((schema) => schema['@type'] === type), owner.route + ' is missing ' + type + ' schema.')
    const faqSchema = schemas.find((schema) => schema['@type'] === 'FAQPage')
    const visibleFaqs = [...visibleHtml.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map((match) => match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    assert.deepEqual(faqSchema.mainEntity.map((item: {name: string}) => item.name), visibleFaqs, owner.route + ' FAQ and schema must match.')
  }

  const soccerHtml = read('out/products/soccer-jerseys/index.html')
  for (const residue of ['Basketball Solutions', 'Basketball Uniform Format', 'Youth Basketball Teams']) {
    assert.doesNotMatch(soccerHtml, new RegExp(residue, 'i'), 'Soccer output contains Basketball residue: ' + residue)
  }

  const previewRoutes = [
    '/',
    '/products/basketball-uniforms/',
    '/products/soccer-jerseys/',
    '/custom-baseball-softball-uniforms/',
    '/youth-team-uniforms/',
    '/school-teamwear/',
    '/club-teamwear-program/',
    '/private-label-teamwear/',
    '/customization/',
    '/free-mockup/',
    '/get-quote/',
    '/sample-order/',
  ] as const
  for (const route of previewRoutes) {
    const outputFile = route === '/' ? 'out/index.html' : 'out' + route + 'index.html'
    const visibleHtml = read(outputFile).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    assert.doesNotMatch(visibleHtml, /Verified production visual pending/i, route + ' must hide unverified public proof placeholders.')
  }
}

console.log('POXIOL Core Sports V1 ' + (outputMode ? 'output' : 'source') + ' checks passed.')
