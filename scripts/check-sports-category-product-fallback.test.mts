import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const cjsRequire = createRequire(import.meta.url)
const ts = cjsRequire('typescript') as typeof import('typescript')
const originalTsLoader = cjsRequire.extensions['.ts']

cjsRequire.extensions['.ts'] = (module, filename) => {
  const source = cjsRequire('node:fs').readFileSync(filename, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText
  ;(module as NodeJS.Module & {_compile(source: string, filename: string): void})._compile(compiled, filename)
}

const {mergeCmsList} = cjsRequire('../lib/cms/listMode.ts') as typeof import('../lib/cms/listMode.ts')

if (originalTsLoader) cjsRequire.extensions['.ts'] = originalTsLoader
else delete cjsRequire.extensions['.ts']

test('strict CMS lists still fail over to legacy items when the published read fails', () => {
  const legacy = [
    {slug: 'legacy-a', title: 'Legacy A'},
    {slug: 'legacy-b', title: 'Legacy B'},
  ]
  const result = mergeCmsList({
    legacy,
    cms: [],
    sourceState: 'failed',
    mode: 'strict',
    contentSource: 'sanity',
    mapCms: (item) => ({slug: item.slug || '', title: 'CMS'}),
  })

  assert.deepEqual(result, legacy)
})

test('strict CMS lists do not append unmatched legacy items after a successful read', () => {
  const result = mergeCmsList({
    legacy: [
      {slug: 'legacy-a', title: 'Legacy A'},
      {slug: 'legacy-b', title: 'Legacy B'},
    ],
    cms: [{slug: 'cms-a', title: 'CMS A', publishStatus: 'published'}],
    sourceState: 'ok',
    mode: 'strict',
    contentSource: 'sanity',
    mapCms: (item) => ({slug: item.slug || '', title: item.title}),
  })

  assert.deepEqual(result, [{slug: 'cms-a', title: 'CMS A'}])
})

test('guarded sports pages preserve a successful empty CMS result while other categories keep fallback behavior', () => {
  const source = readFileSync(path.resolve('lib/sanity/content.ts'), 'utf8')
  const functionMatch = source.match(/function resolveSportsProductCards[\s\S]*?\r?\n}\r?\n\r?\nexport async function getCmsSportsPageBySlug/)
  assert.ok(functionMatch, 'content resolver must expose the bounded product-card selection helper')

  const helperSource = functionMatch[0].replace(/\r?\n\r?\nexport async function getCmsSportsPageBySlug$/, '')
  const compiled = ts.transpileModule(`${helperSource}\nmodule.exports = {resolveSportsProductCards}`, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  }).outputText
  const helperModule = {exports: {}} as {exports: {resolveSportsProductCards?: Function}}
  new Function('module', 'exports', compiled)(helperModule, helperModule.exports)
  const resolveSportsProductCards = helperModule.exports.resolveSportsProductCards
  assert.equal(typeof resolveSportsProductCards, 'function')

  const legacyData = {
    productTypes: [{title: 'Legacy card', description: 'legacy'}],
    features: [{title: 'Legacy feature', description: 'legacy'}],
  }
  assert.deepEqual(resolveSportsProductCards?.([], legacyData, true), {productTypes: [], features: []})
  assert.deepEqual(resolveSportsProductCards?.([], legacyData, false), {
    productTypes: legacyData.productTypes,
    features: legacyData.features,
  })

  assert.match(source, /strictSportsProductCardCategories\.has\(categorySlug\)/)
  assert.match(source, /resolveSportsProductCards\(productCards, legacyData, strictProductCards\)/)
})

const OUTPUT_DIRECTORY = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? 'out')
const EXPECTED_PRODUCT_CARDS = new Map([
  ['training-wear', [
    'Training Wear Warm Up Jackets',
    'Training Wear Training Tops',
    'Training Wear Team Travel Suits',
    'Training Wear Tracksuits',
  ]],
  ['hoodies-jackets', [
    'Hoodies Jackets Fleece Outerwear',
    'Hoodies Jackets Pullover Hoodies',
    'Hoodies Jackets Zip Up Jackets',
  ]],
  ['team-accessories', [
    'Team Accessories Team Socks',
    'Team Accessories Custom Bags',
  ]],
])

const SUPPRESSED_COPY = [
  'Custom jacket and pants sets for team travel and warmups.',
  'Team jackets with custom colors, logos and graphics.',
  'Lightweight tops for practice and athletic programs.',
  'Unified apparel systems for clubs, schools and coaches.',
  'Premium custom hoodies with front pocket and drawstring hood.',
  'Full-zip or half-zip jackets for easy layering and team travel.',
  'Warm and durable materials for colder climate teamwear.',
  'Custom sublimated or knitted socks with team logos and colors.',
  'Durable gear bags and backpacks for team travel.',
]

function decodeHtml(value: string) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&#39;', "'")
}

function productOptionSection(html: string) {
  const headingIndex = html.indexOf('Choose the Right')
  assert.notEqual(headingIndex, -1, 'product option heading must exist')
  const start = html.lastIndexOf('<section', headingIndex)
  const end = html.indexOf('</section>', headingIndex)
  assert.ok(start >= 0 && end > headingIndex, 'product option section must be bounded')
  return html.slice(start, end)
}

function cardTitles(section: string) {
  return [...section.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
    .map(([, content]) => decodeHtml(content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()))
}

if (process.argv.includes('--output')) {
  test('the three guarded category pages render only current Published CMS product cards', async () => {
    for (const [slug, expectedTitles] of EXPECTED_PRODUCT_CARDS) {
      const html = await readFile(path.join(OUTPUT_DIRECTORY, 'products', slug, 'index.html'), 'utf8')
      const section = productOptionSection(html)
      assert.deepEqual(cardTitles(section), expectedTitles, `${slug} product card titles`)
      for (const copy of SUPPRESSED_COPY) assert.ok(!section.includes(copy), `${slug} must suppress: ${copy}`)
    }
  })
}
