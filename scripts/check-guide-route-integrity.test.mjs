import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const guidesDir = path.join(root, 'app', 'guides')
const dynamicSource = fs.readFileSync(path.join(guidesDir, '[slug]', 'page.tsx'), 'utf8')
const dedicatedSlugs = fs.readdirSync(guidesDir, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('['))
  .map((entry) => entry.name)
  .sort()

assert.ok(dedicatedSlugs.includes('b2b-sourcing-faq'), 'Dedicated B2B FAQ page is missing')
const b2bSource = fs.readFileSync(path.join(guidesDir, 'b2b-sourcing-faq', 'page.tsx'), 'utf8')
assert.match(b2bSource, /DynamicGuidePage/, 'Dedicated B2B route must preserve the safe CMS guide implementation')
assert.doesNotMatch(b2bSource, /KIAN ink|EPSON print heads/, 'Dedicated B2B route must not restore unsafe legacy claims')
assert.match(
  dynamicSource,
  /filterDedicatedGuideSlugs\(await getArticles\('guide'\)\)/,
  'Dynamic guide generation must exclude dedicated static guide slugs',
)

const {DEDICATED_GUIDE_SLUGS, filterDedicatedGuideSlugs} = await import('../lib/guides/routes.ts')
assert.deepEqual([...DEDICATED_GUIDE_SLUGS].sort(), dedicatedSlugs, 'Dedicated guide slug registry is out of sync')

const candidates = [...dedicatedSlugs, 'dynamic-guide-example'].map((slug) => ({slug}))
const generated = filterDedicatedGuideSlugs(candidates)
const intersection = generated.filter(({slug}) => dedicatedSlugs.includes(slug))

assert.deepEqual(intersection, [], 'Dedicated and dynamic guide routes must not intersect')
assert.ok(!generated.some(({slug}) => slug === 'b2b-sourcing-faq'))
assert.ok(generated.some(({slug}) => slug === 'dynamic-guide-example'))

console.log(JSON.stringify({dedicatedSlugs, duplicateRoutes: intersection.length}, null, 2))
