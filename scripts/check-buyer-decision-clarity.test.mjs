import assert from 'node:assert/strict'
import {access, readFile, readdir} from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourceOnly = process.argv.includes('--source-only')

const requiredSourceFiles = [
  'lib/buyer-decision.ts',
  'components/sections/BuyerDecisionSections.tsx',
  'app/shipping-after-sales/page.tsx',
]

for (const file of requiredSourceFiles) {
  await assert.doesNotReject(
    access(path.join(root, file)),
    `buyer decision implementation is missing ${file}`,
  )
}

const [homeSource, buyerSource, geoSource, shippingSource, sitemapSource, caseSchema, projectSource, projectDetailSource, faqSource] = await Promise.all([
  readFile(path.join(root, 'app/page.tsx'), 'utf8'),
  readFile(path.join(root, 'lib/buyer-decision.ts'), 'utf8'),
  readFile(path.join(root, 'lib/geo-v1.ts'), 'utf8'),
  readFile(path.join(root, 'app/shipping-after-sales/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/sitemap.ts'), 'utf8'),
  readFile(path.join(root, 'studio/schemaTypes/documents/caseStudy.ts'), 'utf8'),
  readFile(path.join(root, 'app/projects/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/projects/[slug]/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/faq/page.tsx'), 'utf8'),
])

assert.match(homeSource, /BuyerDecisionSections/, 'homepage must render the shared buyer decision flow')
assert.match(buyerSource, /GEO_V1\.homepage\.heroHeading/, 'homepage heading must use the shared GEO V1 entity conclusion')
assert.match(geoSource, /Custom Teamwear Manufacturer for Basketball, Soccer & Multi-Sport Teams/, 'shared GEO V1 brand-level homepage conclusion is missing')

for (const heading of [
  'Who We Are',
  'What We Make',
  'How Pricing Works',
  'Sample and Quality Approval',
  'Production and Shipping',
  'Project Evidence',
  'Why POXIOL',
  'Start Your Project',
]) {
  assert.ok(buyerSource.includes(heading), `buyer decision flow is missing ${heading}`)
}

for (const factor of [
  'Product format',
  'Fabric',
  'Order quantity',
  'Names, numbers and artwork',
  'Labels and packaging',
  'Shipping destination',
  'Shipping method',
]) {
  assert.ok(buyerSource.includes(factor), `pricing explanation is missing ${factor}`)
}

assert.match(shippingSource, /alternates:\s*\{\s*canonical:\s*["']\/shipping-after-sales\/["']/, 'shipping page must have a self-canonical')
assert.match(shippingSource, /Breadcrumb/, 'shipping page must expose breadcrumb data')
assert.match(sitemapSource, /shipping-after-sales/, 'sitemap must include the shipping and after-sales page')

for (const field of ['buyerAuthorizationStatus', 'approvedImageStatus', 'evidenceNote', 'verifiedProcess', 'verifiableResultStatement']) {
  assert.ok(caseSchema.includes(field), `case-study evidence schema is missing ${field}`)
}

assert.match(projectSource + projectDetailSource, /Manufacturing Scenario|Example Scenario/, 'unverified project records must render as scenarios')
assert.match(projectSource + projectDetailSource, /Project imagery pending verification/, 'unverified project imagery must use the neutral placeholder')
assert.match(faqSource, /faqPageSchemaFromGroups/, 'visible FAQ and FAQPage JSON-LD must share the resolved groups')

const articleTemplateSource = await readFile(path.join(root, 'components/cms/ArticleTemplate.tsx'), 'utf8')
assert.match(articleTemplateSource, /References[\s\S]*break-all/, 'article reference URLs must wrap on mobile')

const layoutSource = await readFile(path.join(root, 'app/layout.tsx'), 'utf8')
assert.match(layoutSource, /rel="icon"[\s\S]*data:image\/svg\+xml/, 'root layout must declare an inline favicon so browsers do not request missing favicon.ico')

const ctaSource = (await Promise.all([
  'components/cms/PageTemplate.tsx',
  'components/sports/SportsLandingPage.tsx',
  'app/products/[slug]/page.tsx',
  'app/projects/page.tsx',
  'app/fabric-guide/page.tsx',
  'app/printing-guide/page.tsx',
].map((file) => readFile(path.join(root, file), 'utf8')))).join('\\n')
for (const oldLabel of ['Talk to POXIOL', 'Request Quote', 'Start Custom Order', 'Start My Request', 'Start Free Mockup']) {
  assert.ok(!ctaSource.includes(`>${oldLabel}<`), `legacy navigational CTA remains: ${oldLabel}`)
}

const publicSourceFiles = []
for (const directory of ['app', 'components', 'lib']) {
  const walk = async (folder) => {
    for (const entry of await readdir(folder, {withFileTypes: true})) {
      const full = path.join(folder, entry.name)
      if (entry.isDirectory()) await walk(full)
      else if (/\.(?:ts|tsx)$/.test(entry.name)) publicSourceFiles.push(full)
    }
  }
  await walk(path.join(root, directory))
}
const publicSource = (await Promise.all(publicSourceFiles.map((file) => readFile(file, 'utf8')))).join('\n')
for (const claim of [
  '15+ years of expertise',
  '15+ years experience',
  '30,000+ units monthly',
  '50+ countries',
  'within 24 hours',
  'they may be sub-contracting',
  'they may be subcontracting',
]) {
  assert.ok(!publicSource.toLowerCase().includes(claim.toLowerCase()), `unsupported public claim remains: ${claim}`)
}

for (const tokenName of ['SANITY_READ_TOKEN', 'SANITY_WRITE_TOKEN']) {
  assert.ok(!homeSource.includes(tokenName) && !shippingSource.includes(tokenName), `${tokenName} must not enter client-facing page modules`)
}

if (!sourceOnly) {
  const routeFiles = {
    home: 'out/index.html',
    shipping: 'out/shipping-after-sales/index.html',
    faq: 'out/faq/index.html',
    projects: 'out/projects/index.html',
  }

  const htmlByRoute = Object.fromEntries(await Promise.all(Object.entries(routeFiles).map(async ([name, file]) => [name, await readFile(path.join(root, file), 'utf8')])))

  for (const [name, html] of Object.entries(htmlByRoute)) {
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${name} must render exactly one H1`)
    assert.equal((html.match(/<link\b[^>]*rel=["']canonical["']/gi) || []).length, 1, `${name} must render exactly one canonical`)
    for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      assert.doesNotThrow(() => JSON.parse(match[1]), `${name} contains invalid JSON-LD`)
    }
  }

  assert.match(htmlByRoute.home, /Custom Teamwear Manufacturer — Factory-Direct for Clubs, Schools & Brands/, 'built homepage must render the brand-level H1')
  assert.match(htmlByRoute.shipping, /Production Planning/, 'built shipping page must render production planning guidance')
  assert.match(htmlByRoute.projects, /Manufacturing Scenario|Example Scenario/, 'built projects page must keep unverified records labeled as scenarios')

  const faqSchemas = [...htmlByRoute.faq.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter((value) => value?.['@type'] === 'FAQPage')
  assert.equal(faqSchemas.length, 1, 'FAQ page must render one FAQPage schema')
  const schemaQuestions = faqSchemas[0].mainEntity.map((entry) => entry.name)
  for (const question of schemaQuestions) assert.ok(htmlByRoute.faq.includes(question), `FAQ schema question is not visible: ${question}`)

  const outputHtmlFiles = []
  const walkOutput = async (folder) => {
    for (const entry of await readdir(folder, {withFileTypes: true})) {
      const full = path.join(folder, entry.name)
      if (entry.isDirectory()) await walkOutput(full)
      else if (entry.name.endsWith('.html')) outputHtmlFiles.push(full)
    }
  }
  await walkOutput(path.join(root, 'out'))
  const outputText = (await Promise.all(outputHtmlFiles.map((file) => readFile(file, 'utf8')))).join('\n')
  for (const claim of ['15+ years', '30,000+ units', '50+ countries', 'within 24 hours', 'they may be sub-contracting']) {
    assert.ok(!outputText.toLowerCase().includes(claim.toLowerCase()), `built output contains unsupported claim: ${claim}`)
  }
}

console.log(`buyer decision clarity contracts passed (${sourceOnly ? 'source' : 'source and output'})`)
