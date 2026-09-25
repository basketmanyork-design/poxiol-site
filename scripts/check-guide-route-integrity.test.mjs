import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const guidesDir = path.join(root, 'app', 'guides')
const dynamicSource = fs.readFileSync(path.join(guidesDir, '[slug]', 'page.tsx'), 'utf8')
const dedicatedSlugs = fs.readdirSync(guidesDir, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('['))
  .filter((entry) => fs.existsSync(path.join(guidesDir, entry.name, 'page.tsx')))
  .map((entry) => entry.name)
  .sort()

assert.ok(dedicatedSlugs.includes('b2b-sourcing-faq'), 'Dedicated B2B FAQ page is missing')
assert.ok(
  !dedicatedSlugs.includes('how-to-order-custom-basketball-uniforms-for-your-team'),
  'The retired Basketball ordering duplicate must not remain a dedicated 200 route',
)
const b2bSource = fs.readFileSync(path.join(guidesDir, 'b2b-sourcing-faq', 'page.tsx'), 'utf8')
assert.match(b2bSource, /DynamicGuidePage/, 'Dedicated B2B route must preserve the safe CMS guide implementation')
assert.doesNotMatch(b2bSource, /KIAN ink|EPSON print heads/, 'Dedicated B2B route must not restore unsafe legacy claims')
assert.match(
  dynamicSource,
  /filterDedicatedGuideSlugs\(await getArticles\('guide'\)\)/,
  'Dynamic guide generation must exclude dedicated static guide slugs',
)

const {DEDICATED_GUIDE_SLUGS, filterDedicatedGuideSlugs} = await import('../lib/guides/routes.ts')
const {pseoPages} = await import('../lib/pseo.ts')
assert.deepEqual([...DEDICATED_GUIDE_SLUGS].sort(), dedicatedSlugs, 'Dedicated guide slug registry is out of sync')

const candidates = [...dedicatedSlugs, 'how-to-order-custom-basketball-uniforms', 'dynamic-guide-example']
  .map((slug) => ({slug}))
const generated = filterDedicatedGuideSlugs(candidates)
const intersection = generated.filter(({slug}) => dedicatedSlugs.includes(slug))

assert.deepEqual(intersection, [], 'Dedicated and dynamic guide routes must not intersect')
assert.ok(!generated.some(({slug}) => slug === 'b2b-sourcing-faq'))
assert.ok(
  generated.some(({slug}) => slug === 'how-to-order-custom-basketball-uniforms'),
  'The maintained CMS Basketball buying guide must own the dynamic guide route',
)
assert.ok(generated.some(({slug}) => slug === 'dynamic-guide-example'))
assert.ok(
  !pseoPages.some(({slug}) => slug === 'how-to-order-custom-basketball-uniforms'),
  'The retired root PSEO Basketball ordering duplicate must not render as a 200 page',
)

const redirectRows = fs.readFileSync(path.join(root, 'public', '_redirects'), 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split(/\s+/))
const redirectMap = new Map(redirectRows.map(([source, destination, status]) => [source, {destination, status}]))
const survivor = '/guides/how-to-order-custom-basketball-uniforms/'
for (const source of [
  '/how-to-order-custom-basketball-uniforms/',
  '/guides/how-to-order-custom-basketball-uniforms-for-your-team/',
  '/guides/school-basketball-uniform-order-checklist/',
]) {
  assert.deepEqual(
    redirectMap.get(source),
    {destination: survivor, status: '301'},
    `${source} must redirect directly to the maintained Basketball buying guide`,
  )
}

console.log(JSON.stringify({dedicatedSlugs, duplicateRoutes: intersection.length}, null, 2))
