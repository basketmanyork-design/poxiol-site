import assert from 'node:assert/strict'
import {access, readFile, readdir} from 'node:fs/promises'
import path from 'node:path'
import {pathToFileURL} from 'node:url'

const root = process.cwd()
const sourceOnly = process.argv.includes('--source-only')

const seo033ContentPath = path.join(root, 'lib/seo-growth/seo-033-content.ts')
await assert.doesNotReject(
  access(seo033ContentPath),
  'SEO-037 buyer-decision content module is missing',
)

const [{default: typescript}, seo033ContentSource] = await Promise.all([
  import('typescript'),
  readFile(seo033ContentPath, 'utf8'),
])
const seo033ContentUrl = `data:text/javascript;base64,${Buffer.from(typescript.transpileModule(
  seo033ContentSource,
  {compilerOptions: {module: typescript.ModuleKind.ESNext, target: typescript.ScriptTarget.ES2022}},
).outputText).toString('base64')}`
const {
  SEO033_BASKETBALL_CONTENT,
  SEO033_OEM_ODM_CONTENT,
} = await import(seo033ContentUrl)

assert.notEqual(SEO033_BASKETBALL_CONTENT.id, SEO033_OEM_ODM_CONTENT.id, 'the two target pages must use unique panel IDs')

assert.deepEqual(SEO033_BASKETBALL_CONTENT, {
  id: 'basketball-order-planning',
  eyebrow: 'Basketball Order Planning',
  title: 'Choose the Basketball Uniform Path Before You Request a Quote',
  answer: 'A basketball uniform project starts with the garment structure, roster and size breakdown, authorized artwork, sample expectations, quantity, destination and required in-hand date. Confirm these inputs before the project moves to mockup, sample or quotation review.',
  rows: [
    {option: 'Jersey and shorts set', startingPoint: 'A coordinated standard game set.', confirm: 'Jersey and shorts quantities, size breakdown, colors and authorized artwork.', nextStep: 'Mockup, sample or quotation review.'},
    {option: 'Reversible set', startingPoint: 'Two coordinated wearing sides are required.', confirm: 'Both designs, construction preference, roster, sizes and sample expectations.', nextStep: 'Mockup and sample-requirement review.'},
    {option: 'Single-layer set', startingPoint: 'One primary uniform side is required.', confirm: 'Garment structure, artwork placement, fit direction and size breakdown.', nextStep: 'Mockup, sample or quotation review.'},
    {option: 'Personalized roster', startingPoint: 'Player names or numbers vary by garment.', confirm: 'Final spelling, numbers, garment sizes and approved placement.', nextStep: 'Roster validation before the next project step.'},
    {option: 'Private-label or reorder planning', startingPoint: 'A brand or distributor needs labels, packaging or a later repeat run.', confirm: 'Authorized brand assets, label and packaging requirements, current specification, quantity and timing.', nextStep: 'Private-label or current-specification review.'},
  ],
  checklist: ['Product structure', 'Expected quantity', 'Size breakdown', 'Final names and numbers', 'Authorized logos and color direction', 'Sample expectation', 'Destination', 'Required in-hand date'],
  links: [
    {label: 'Basketball Uniform Ordering Guide', href: '/guides/how-to-order-custom-basketball-uniforms/'},
    {label: 'Plan a Sample Order', href: '/sample-order/'},
    {label: 'Review the Quality Control Process', href: '/quality-control-process/'},
    {label: 'Request a Basketball Project Quote', href: '/get-quote/'},
  ],
})

assert.deepEqual(SEO033_OEM_ODM_CONTENT, {
  id: 'oem-odm-project-planning',
  eyebrow: 'OEM/ODM Project Planning',
  title: 'Choose the Development Path Before You Request a Quote',
  answer: 'Choose OEM when the product, artwork and specification direction are already defined. Choose ODM when the concept, range structure or open product decisions still need development review. POXIOL confirms the appropriate path after reviewing the actual project brief.',
  rows: [
    {option: 'OEM', startingPoint: 'The buyer already has a reference style, artwork, product or technical direction.', confirm: 'Construction, materials, customization, sizes, quantity, packaging and target date.', nextStep: 'Open-point review followed by a mockup, sample or quotation decision.'},
    {option: 'ODM', startingPoint: 'The buyer has a target market, sport category, collection goal or design direction but still has open product decisions.', confirm: 'Product scope, range structure, reference direction, authorized brand inputs, quantity and target date.', nextStep: 'Concept and range review followed by an agreed development step.'},
  ],
  checklist: ['Buyer or company type', 'Target market', 'Sport category', 'Product range', 'Reference style or technical input', 'Authorized logos and brand assets', 'Estimated quantity', 'Size requirements', 'Label and packaging requirements', 'Destination', 'Required in-hand date'],
  links: [
    {label: 'OEM/ODM Sportswear Manufacturing Guide', href: '/guides/oem-odm-sportswear-manufacturing-guide-for-brands/'},
    {label: 'Review Private Label Teamwear', href: '/private-label-teamwear/'},
    {label: 'Plan a Sample Order', href: '/sample-order/'},
    {label: 'Discuss an OEM/ODM Project', href: '/get-quote/'},
  ],
})

for (const content of [SEO033_BASKETBALL_CONTENT, SEO033_OEM_ODM_CONTENT]) {
  assert.ok(content.answer.length > 0, `${content.id} must have an answer-first paragraph`)
  assert.ok(content.rows.length >= 2, `${content.id} must have at least two decision rows`)
  assert.ok(content.checklist.length >= 5, `${content.id} must have at least five project-brief inputs`)
  assert.equal(content.links.length, 4, `${content.id} must expose exactly four approved next-step links`)
}

const seo033PanelPath = path.join(root, 'components/seo-growth/BuyerDecisionPanel.tsx')
await assert.doesNotReject(
  access(seo033PanelPath),
  'SEO-037 BuyerDecisionPanel component is missing',
)
const seo033PanelSource = await readFile(seo033PanelPath, 'utf8')
for (const contract of [
  '<section',
  'data-seo033-panel={content.id}',
  'aria-labelledby={`${content.id}-title`}',
  '<h2',
  '{content.answer}',
  '<table',
  'md:hidden',
  'content.checklist.map',
  'content.links.map',
  '<Link',
]) {
  assert.ok(seo033PanelSource.includes(contract), `BuyerDecisionPanel is missing source contract: ${contract}`)
}
assert.match(seo033PanelSource, /className="[^"]*\bhidden\b[^"]*\bmd:block\b/, 'desktop decision table must be hidden below md')
for (const forbidden of ["'use client'", '"use client"', 'dangerouslySetInnerHTML', '<form', 'application/ld+json']) {
  assert.ok(!seo033PanelSource.includes(forbidden), `BuyerDecisionPanel must not contain ${forbidden}`)
}

const [seo033BasketballSource, seo033OemSource, seo033HomeSource, seo033QuoteSource] = await Promise.all([
  readFile(path.join(root, 'components/v8/BasketballV8LandingPage.tsx'), 'utf8'),
  readFile(path.join(root, 'app/oem-odm/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/get-quote/page.tsx'), 'utf8'),
])
const occurrenceCount = (source, token) => source.split(token).length - 1
for (const [name, source, contentName] of [
  ['Basketball', seo033BasketballSource, 'SEO033_BASKETBALL_CONTENT'],
  ['OEM/ODM', seo033OemSource, 'SEO033_OEM_ODM_CONTENT'],
]) {
  assert.equal(occurrenceCount(source, "import {BuyerDecisionPanel} from '@/components/seo-growth/BuyerDecisionPanel'"), 1, `${name} must import BuyerDecisionPanel exactly once`)
  assert.equal(occurrenceCount(source, contentName), 2, `${name} must import and render its own frozen content exactly once`)
  assert.equal(occurrenceCount(source, `<BuyerDecisionPanel content={${contentName}} />`), 1, `${name} must render exactly one buyer-decision panel`)
}
for (const [name, source] of [['homepage', seo033HomeSource], ['Get Quote', seo033QuoteSource]]) {
  assert.equal(occurrenceCount(source, 'BuyerDecisionPanel'), 0, `${name} must not render the SEO-037 panel`)
  assert.equal(occurrenceCount(source, 'data-seo033-panel'), 0, `${name} must not expose an SEO-037 marker`)
}

const projectPlanningSeoPath = path.join(root, 'lib/project-planning-seo.ts')
await assert.doesNotReject(
  access(projectPlanningSeoPath),
  'planning-safe project SEO resolver is missing',
)

const {
  projectPlanningSeo,
  resolveProjectSeoForEvidence,
} = await import(pathToFileURL(projectPlanningSeoPath).href)

const planningSeoBySlug = {
  'usa-basketball-academy-uniform-program': {
    title: 'Basketball Academy Planning Scenario | POXIOL',
    description: 'Plan a basketball academy uniform program, including reversible sets, player numbers, size grouping, sample review and tournament scheduling.',
  },
  'australia-soccer-club-kit-project': {
    title: 'Soccer Club Kit Planning Scenario | POXIOL',
    description: 'Plan a soccer club home-and-away kit program, including color matching, mockup confirmation, player details and bulk-order checkpoints.',
  },
  'school-athletics-multi-sport-program': {
    title: 'School Multi-Sport Planning Scenario | POXIOL',
    description: 'Plan a school multi-sport uniform program across basketball, volleyball and training wear with coordinated branding, sizing and review steps.',
  },
  'middle-east-sports-event-program': {
    title: 'Sports Event Uniform Planning Scenario | POXIOL',
    description: 'Plan a sports-event uniform program for staff and participants, including quantity planning, packing organization and delivery checkpoints.',
  },
  'distributor-bulk-teamwear-program': {
    title: 'Teamwear Distributor Planning Scenario | POXIOL',
    description: 'Plan a distributor teamwear program across multiple product categories with repeat-order structure, quality checkpoints and packing requirements.',
  },
}

for (const [slug, expected] of Object.entries(planningSeoBySlug)) {
  assert.deepEqual(projectPlanningSeo(slug), {
    ...expected,
    canonicalUrl: `https://www.poxiol.com/projects/${slug}/`,
  })
}

assert.deepEqual(projectPlanningSeo('future-project'), {
  title: 'Teamwear Planning Scenario | POXIOL',
  description: 'Plan a custom teamwear program using an evidence-neutral scenario for briefing, sample review, quality checkpoints, packing requirements and target delivery timing.',
  canonicalUrl: 'https://www.poxiol.com/projects/future-project/',
})

for (const slug of ['constructor', '__proto__', 'toString']) {
  assert.deepEqual(projectPlanningSeo(slug), {
    title: 'Teamwear Planning Scenario | POXIOL',
    description: 'Plan a custom teamwear program using an evidence-neutral scenario for briefing, sample review, quality checkpoints, packing requirements and target delivery timing.',
    canonicalUrl: `https://www.poxiol.com/projects/${slug}/`,
  })
}

const resolvedCmsSeo = {
  title: 'Unverified Customer Case Study',
  description: 'Unverified completed-project claim.',
  canonicalUrl: 'https://www.poxiol.com/projects/custom-canonical/',
  noIndex: true,
}
assert.deepEqual(resolveProjectSeoForEvidence({
  slug: 'usa-basketball-academy-uniform-program',
  evidenceVerified: false,
  resolvedSeo: resolvedCmsSeo,
}), {
  ...resolvedCmsSeo,
  ...planningSeoBySlug['usa-basketball-academy-uniform-program'],
})
assert.deepEqual(resolveProjectSeoForEvidence({
  slug: 'usa-basketball-academy-uniform-program',
  evidenceVerified: true,
  resolvedSeo: resolvedCmsSeo,
}), resolvedCmsSeo)

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

const [homeSource, homepageV8Source, buyerSource, geoSource, shippingSource, sitemapSource, caseSchema, projectSource, projectDetailSource, faqSource] = await Promise.all([
  readFile(path.join(root, 'app/page.tsx'), 'utf8'),
  readFile(path.join(root, 'components/v8/HomepageV8.tsx'), 'utf8'),
  readFile(path.join(root, 'lib/buyer-decision.ts'), 'utf8'),
  readFile(path.join(root, 'lib/geo-v1.ts'), 'utf8'),
  readFile(path.join(root, 'app/shipping-after-sales/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/sitemap.ts'), 'utf8'),
  readFile(path.join(root, 'studio/schemaTypes/documents/caseStudy.ts'), 'utf8'),
  readFile(path.join(root, 'app/projects/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/projects/[slug]/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/faq/page.tsx'), 'utf8'),
])

const [categoryLandingSource, runningTrackSource, warmUpSource] = await Promise.all([
  readFile(path.join(root, 'components/home-optimization/CategoryLanding.tsx'), 'utf8'),
  readFile(path.join(root, 'app/products/running-track-uniforms/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/products/warm-up-wear/page.tsx'), 'utf8'),
])

const [oemDecisionGuideSource, oemServiceSource] = await Promise.all([
  readFile(path.join(root, 'app/guides/oem-odm-sportswear-manufacturing-guide-for-brands/page.tsx'), 'utf8'),
  readFile(path.join(root, 'app/oem-odm/page.tsx'), 'utf8'),
])

for (const contract of [
  ['guide', oemDecisionGuideSource, 'OEM vs ODM Sportswear: A Decision Guide for Brands'],
  ['guide', oemDecisionGuideSource, 'Choose OEM when your team already controls the product specification and needs a supplier to review manufacturability.'],
  ['guide', oemDecisionGuideSource, 'OEM and ODM compared'],
  ['guide', oemDecisionGuideSource, 'What to prepare before requesting a quote'],
  ['guide', oemDecisionGuideSource, 'Questions to settle before sampling'],
  ['guide', oemDecisionGuideSource, 'Discuss Your OEM/ODM Project'],
  ['guide', oemDecisionGuideSource, "'@type': 'BreadcrumbList'"],
  ['guide', oemDecisionGuideSource, "'@type': 'WebPage'"],
  ['service page', oemServiceSource, 'Need help choosing between OEM and ODM?'],
  ['service page', oemServiceSource, 'Compare OEM and ODM paths'],
  ['service page', oemServiceSource, '/guides/oem-odm-sportswear-manufacturing-guide-for-brands/'],
  ['service page', oemServiceSource, "'@type': 'BreadcrumbList'"],
  ['service page', oemServiceSource, "'@type': 'Service'"],
  ['service page', oemServiceSource, "'@id': 'https://www.poxiol.com/oem-odm/#breadcrumb'"],
  ['service page', oemServiceSource, "'@id': 'https://www.poxiol.com/oem-odm/#service'"],
  ['service page', oemServiceSource, "name: 'OEM/ODM Teamwear for Channel Partners'"],
  ['service page', oemServiceSource, "item: 'https://www.poxiol.com/solutions/'"],
  ['service page', oemServiceSource, "url: 'https://www.poxiol.com/oem-odm/'"],
  ['service page', oemServiceSource, "provider: { '@type': 'Organization', name: 'POXIOL', url: 'https://www.poxiol.com/' }"],
  ['service page', oemServiceSource, 'application/ld+json'],
]) {
  assert.ok(contract[1].includes(contract[2]), `${contract[0]} is missing approved OEM/ODM decision contract: ${contract[2]}`)
}

for (const forbidden of ['OfferCatalog', 'FAQPage', 'AggregateRating', 'areaServed', 'priceCurrency', 'availability', 'datePublished', 'dateModified', 'author', 'reviewer']) {
  const schemaField = new RegExp(`(?:['"]${forbidden}['"]|\\b${forbidden})\\s*:`)
  assert.doesNotMatch(oemServiceSource, schemaField, `OEM/ODM service schema must not expose ${forbidden}`)
}

assert.ok(!oemDecisionGuideSource.includes('Get Free Mockup Now'), 'OEM/ODM decision guide must not retain the generic free-mockup CTA')
for (const forbidden of ["'@type': 'Article'", "'@type': 'Person'", "'@type': 'Organization'", "'@type': 'Service'", "'@type': 'Product'", "'@type': 'Offer'", "'@type': 'FAQPage'", "'@type': 'Review'", "'@type': 'AggregateRating'"]) {
  assert.ok(!oemDecisionGuideSource.includes(forbidden), `OEM/ODM decision guide schema must not expose ${forbidden}`)
}

for (const contract of [
  ['shared template', categoryLandingSource, 'How the project review works'],
  ['shared template', categoryLandingSource, '1. Brief review'],
  ['shared template', categoryLandingSource, '2. Planning confirmation'],
  ['shared template', categoryLandingSource, '3. Next-step decision'],
  ['shared template', categoryLandingSource, 'application/ld+json'],
  ['shared template', categoryLandingSource, 'BreadcrumbList'],
  ['shared template', categoryLandingSource, "'@type': 'Service'"],
  ['running page', runningTrackSource, 'Plan a running and track uniform brief'],
  ['running page', runningTrackSource, 'Running and track uniform planning starts with the garment set, fit, artwork, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.'],
  ['running page', runningTrackSource, 'Singlet, shorts or coordinated set'],
  ['warm-up page', warmUpSource, 'Plan a warm-up wear brief'],
  ['warm-up page', warmUpSource, 'Warm-up wear planning starts with the jacket-and-trouser configuration, fit, branding, quantity and required in-hand date. POXIOL reviews these inputs for the specific project rather than presenting one fixed specification for every buyer.'],
  ['warm-up page', warmUpSource, 'Jacket, trousers or coordinated set'],
]) {
  assert.ok(contract[1].includes(contract[2]), `${contract[0]} is missing approved contract: ${contract[2]}`)
}

for (const forbidden of ['OfferCatalog', 'FAQPage', 'AggregateRating', 'areaServed', 'availability']) {
  assert.ok(!categoryLandingSource.includes(forbidden), `category landing schema must not expose ${forbidden}`)
}

assert.match(homeSource, /HomepageOptimization/, 'homepage must render the approved nine-module buyer decision composition')
for (const sharedSection of ['CustomerSegmentation', 'BuyerProblems', 'DesignJourney', 'ProductionProof', 'SolutionCards']) {
  assert.ok(homepageV8Source.includes(`<${sharedSection}`), `HomepageV8 must render ${sharedSection}`)
}
assert.match(buyerSource, /GEO_V1\.homepage\.heroHeading/, 'homepage heading must use the shared GEO V1 entity conclusion')
assert.match(geoSource, /Custom Teamwear Manufacturer for Basketball, Soccer & Baseball Programs/, 'shared GEO V1 brand-level homepage conclusion is missing')

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

assert.match(projectSource + projectDetailSource, /Planning Scenario/, 'unverified project records must render as planning scenarios')
assert.doesNotMatch(projectSource + projectDetailSource, /Project imagery pending verification|Verified Project/, 'unsupported project proof must be withheld instead of shown as an unfinished frame')
assert.match(projectSource + projectDetailSource, /QualifiedExplanationNotice/, 'retained project planning content must carry the public limitation')
assert.match(projectSource, /Teamwear Planning Scenarios \| POXIOL/, 'project hub must publish planning-safe metadata')
assert.match(projectSource, /View Planning Scenario/, 'project hub cards must identify planning scenarios')
assert.doesNotMatch(projectSource, /View Case Study/, 'project hub cards must not imply verified case studies')
assert.match(sitemapSource, /["']\/projects\/["']/, 'sitemap must include the project planning hub')
assert.match(faqSource, /faqPageSchemaFromGroups/, 'visible FAQ and FAQPage JSON-LD must share the resolved groups')

const articleTemplateSource = await readFile(path.join(root, 'components/cms/ArticleTemplate.tsx'), 'utf8')
assert.match(articleTemplateSource, /References[\s\S]*break-all/, 'article reference URLs must wrap on mobile')

const layoutSource = await readFile(path.join(root, 'app/layout.tsx'), 'utf8')
assert.match(layoutSource, /rel="icon"[\s\S]*data:image\/svg\+xml/, 'root layout must declare an inline favicon so browsers do not request missing favicon.ico')

const ctaSource = (await Promise.all([
  'components/cms/PageTemplate.tsx',
  'components/sports/SportsLandingPage.tsx',
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

  assert.match(htmlByRoute.home, /Custom Teamwear Built for Repeatable Team Orders/, 'built pilot homepage must render the approved global B2B H1')
  assert.match(htmlByRoute.shipping, /Production Planning/, 'built shipping page must render production planning guidance')
  assert.match(htmlByRoute.projects, /Planning Scenario/, 'built projects page must keep unverified records labeled as planning scenarios')
  assert.doesNotMatch(htmlByRoute.projects, /Project imagery pending verification|Verified Project/, 'built projects page must withhold unsupported project proof')
  assert.match(htmlByRoute.projects, /<title>Teamwear Planning Scenarios \| POXIOL<\/title>/, 'built projects hub must expose planning-safe title')
  assert.match(htmlByRoute.projects, /View Planning Scenario/, 'built projects hub must use the planning-safe card CTA')
  assert.doesNotMatch(htmlByRoute.projects, /View Case Study/, 'built projects hub must not label scenarios as case studies')

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
