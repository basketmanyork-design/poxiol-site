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
  'Team-Based Packing',
  'Quality Checks Before Shipment',
]

for (const phrase of requiredSourceCopy) {
  assert.ok(source.includes(phrase), `Missing required Preview source copy: ${phrase}`)
}

const homepageSource = read('app/page.tsx')
assert.ok(homepageSource.includes('<SeedTrustConversionSections sections={content.trustSections}'), 'Homepage does not render CMS trust sections')
assert.equal((homepageSource.match(/<h1/g) || []).length, 1, 'Homepage must render exactly one h1')
assert.ok(!homepageSource.includes('Teams Served'), 'Homepage still renders unsupported team-count proof')
assert.ok(homepageSource.includes('<FAQSchema faqs={content.faqs'), 'Homepage JSON-LD must use the same FAQ resolver data as visible FAQ')

const projectListSource = read('app/projects/page.tsx')
const projectDetailSource = read('app/projects/[slug]/page.tsx')
const contentResolverSource = read('lib/sanity/content.ts')
assert.ok(projectListSource.includes('Project imagery pending verification'), 'Project cards need a safe missing-image state')
assert.ok(projectDetailSource.includes('Project imagery pending verification'), 'Project detail needs a safe missing-image state')
assert.ok(!contentResolverSource.includes("projects_basketball_academy_uniform_program.png', alt: title"), 'Project resolver still fabricates a basketball evidence image')

const forbiddenClaims = [
  '3,000+ Teams Served',
  'KIAN ink',
  'EPSON print heads',
  '15-25 Days',
  '15–25 Days',
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
  for (const phrase of requiredSourceCopy) {
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