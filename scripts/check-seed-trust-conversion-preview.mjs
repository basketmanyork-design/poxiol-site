import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const args = new Set(process.argv.slice(2))
const sourceOnly = args.has('--source-only')
const outArgIndex = process.argv.indexOf('--out')
const outDir = outArgIndex >= 0 ? process.argv[outArgIndex + 1] : 'out'

const sourceFiles = [
  'app/page.tsx',
  'app/projects/page.tsx',
  'components/cms/PageTemplate.tsx',
  'components/sections/SeedTrustConversionSections.tsx',
  'components/sports/SportsLandingPage.tsx',
  'lib/home-data.ts',
  'lib/cms/legacy.ts',
  'lib/sanity/content.ts',
]

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function collectFiles(directory, extension) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectFiles(entryPath, extension)
    return entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : []
  })
}

const source = sourceFiles.filter((file) => fs.existsSync(path.join(root, file))).map(read).join('\n')

const requiredSourceCopy = [
  'Custom Basketball Uniforms for Growing Youth Clubs',
  'Start with 1 Sample. Scale from One Roster to Every Team in Your Program.',
  'One Club, Multiple Teams',
  'Logo to Design Preview to Sample',
  'Youth and Adult Size Breakdown',
  'Names and Numbers Check',
  'Real Sample Evidence',
  'Team-Based Packing',
  'Quality Checks Before Shipment',
]

for (const phrase of requiredSourceCopy) {
  assert.ok(source.includes(phrase), `Missing required Preview source copy: ${phrase}`)
}

const requiredOutputCopy = [
  'Custom Teamwear Manufacturer — Factory-Direct for Clubs, Schools & Brands',
  'Who We Help',
  'Remove Uncertainty Before Production',
  'From Your Idea to Finished Uniforms',
  'Production Proof, Only When Verified',
  'This is a planning explanation, not a customer project, factory record, quality result, delivery result or production guarantee.',
  'Ready To Build Your Team Uniform?',
]

const contentResolverSource = read('lib/sanity/content.ts')
const homepageSource = read('app/page.tsx')
const homepageV8Source = read('components/v8/HomepageV8.tsx')
assert.ok(homepageSource.includes('<HomepageHybrid'), 'Pilot homepage must render the approved hybrid composition')
for (const sharedSection of ['CustomerSegmentation', 'BuyerProblems', 'DesignJourney', 'ProductionProof', 'SolutionCards']) {
  assert.ok(homepageV8Source.includes(`<${sharedSection}`), `HomepageV8 does not render ${sharedSection}`)
}
assert.ok(contentResolverSource.includes('trustSections:'), 'CMS resolver must continue to resolve trust sections for compatible consumers')
assert.ok(!homepageSource.includes('Teams Served') && !homepageV8Source.includes('Teams Served'), 'Homepage still renders unsupported team-count proof')
assert.ok(!homepageSource.includes('<FAQSchema'), 'Pilot homepage without visible FAQs must not publish FAQ schema')

const projectListSource = read('app/projects/page.tsx')
const projectDetailSource = read('app/projects/[slug]/page.tsx')

assert.ok(projectListSource.includes('QualifiedExplanationNotice'), 'Project cards need an explicit non-proof planning limitation')
assert.equal((projectListSource.match(/<h1/g) || []).length, 1, 'Projects page must render one visible h1')
assert.ok(projectDetailSource.includes('QualifiedExplanationNotice'), 'Project detail needs an explicit non-proof planning limitation')
assert.ok(!projectListSource.includes('Project imagery pending verification') && !projectDetailSource.includes('Project imagery pending verification'), 'Plan A must remove unfinished project image frames')
assert.ok(!contentResolverSource.includes("projects_basketball_academy_uniform_program.png', alt: title"), 'Project resolver still fabricates a basketball evidence image')

const ledgerPath = path.join(root, 'docs/POXIOL_SEED_TRUST_CONVERSION_DRAFT_LEDGER.json')
if (fs.existsSync(ledgerPath)) {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
  assert.equal(ledger.drafts.length, 5, 'Draft ledger must contain exactly five approved documents')
  assert.equal(ledger.publishedWrites, 0, 'Draft ledger must record zero Published writes')
  assert.equal(ledger.releaseCreated, false, 'Draft ledger must record no Sanity Release')
  for (const draft of ledger.drafts) {
    assert.ok(draft.id.startsWith('drafts.'), `Non-Draft ID in ledger: ${draft.id}`)
    assert.equal(draft.publishedChanged, false, `Published change recorded for ${draft.id}`)
  }
}

const forbiddenClaims = [
  '3,000+ Teams Served',
  'KIAN ink',
  'EPSON print heads',
  '15-25 Days',
  '15\u201325 Days',
]

for (const phrase of forbiddenClaims) {
  assert.ok(!source.includes(phrase), `Unsupported claim remains in Preview source: ${phrase}`)
}

if (!sourceOnly) {
  const outputRoot = path.resolve(root, outDir)
  const routes = [
    'index.html',
    'products/basketball-uniforms/index.html',
    'customization/index.html',
    'quality-control-process/index.html',
    'projects/index.html',
  ]

  for (const route of routes) {
    assert.ok(fs.existsSync(path.join(outputRoot, route)), `Missing static Preview route: ${route}`)
  }

  const html = collectFiles(outputRoot, '.html').map((file) => fs.readFileSync(file, 'utf8')).join('\n')
  for (const phrase of requiredOutputCopy) {
    assert.ok(html.includes(phrase), `Missing required Preview HTML copy: ${phrase}`)
  }

  for (const phrase of [...forbiddenClaims, 'NBA', 'NCAA', 'AAU official']) {
    assert.ok(!html.toLowerCase().includes(phrase.toLowerCase()), `Forbidden Preview HTML term: ${phrase}`)
  }

  assert.ok(fs.existsSync(path.join(outputRoot, 'sitemap.xml')), 'Missing sitemap.xml')
  assert.ok(fs.existsSync(path.join(outputRoot, 'robots.txt')), 'Missing robots.txt')
  assert.ok(fs.existsSync(path.join(outputRoot, 'llms.txt')), 'Missing llms.txt')
}

console.log(sourceOnly ? 'seed trust conversion source contracts passed' : 'seed trust conversion Preview contracts passed')
