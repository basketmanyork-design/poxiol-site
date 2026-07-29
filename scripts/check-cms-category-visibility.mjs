import assert from 'node:assert/strict'
import {existsSync, readFileSync, rmSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {createServer} from 'node:http'
import {once} from 'node:events'
import {spawn} from 'node:child_process'

const root = fileURLToPath(new URL('..', import.meta.url))
const output = (path) => new URL(`../out/${path}`, import.meta.url)

const categories = {
  'basketball-uniforms': {categoryName: 'Hidden Basketball', slug: 'basketball-uniforms', activeStatus: false, publishStatus: 'unpublished', navigationVisibility: false, homepageVisibility: false, seo: {seoTitle: 'Hidden Basketball', metaDescription: 'Hidden', indexStatus: 'noindex'}},
  'soccer-jerseys': {categoryName: 'Soccer Jerseys', slug: 'soccer-jerseys', activeStatus: true, publishStatus: 'published', navigationVisibility: true, homepageVisibility: true, seo: {seoTitle: 'Soccer Jerseys', metaDescription: 'Active', indexStatus: 'index'}},
  'soccer-kits': {categoryName: 'MVP Soccer Kits', slug: 'soccer-kits', activeStatus: false, publishStatus: 'unpublished', navigationVisibility: false, homepageVisibility: false, seo: {seoTitle: 'MVP Soccer Kits', metaDescription: 'Hidden MVP', indexStatus: 'noindex'}},
}
const cmsBasketballProduct = {productName: 'Fixture CMS Basketball Product', slug: 'basketball-uniforms-1', categorySlug: 'basketball-uniforms', categoryTitle: 'Hidden Basketball', shortDescription: 'Hidden', fullDescription: 'Hidden', publishStatus: 'published', displayOrder: 1, seo: {seoTitle: 'Hidden', metaDescription: 'Hidden'}}
const mvpProduct = {productName: 'Fixture MVP Product', slug: 'fixture-mvp-product', categorySlug: 'soccer-kits', categoryTitle: 'MVP Soccer Kits', shortDescription: 'Hidden', fullDescription: 'Hidden', publishStatus: 'published', displayOrder: 2, seo: {seoTitle: 'Hidden', metaDescription: 'Hidden'}}
const articles = [
  {title: 'Fixture Blog', slug: 'fixture-blog', excerpt: 'Fixture article', articleType: 'blog', body: [], publishStatus: 'published', displayOrder: 1},
  {title: 'Fixture Resource', slug: 'fixture-resource', excerpt: 'Fixture article', articleType: 'resource', body: [], publishStatus: 'published', displayOrder: 2},
  {title: 'Fixture Guide', slug: 'fixture-guide', excerpt: 'Fixture article', articleType: 'guide', body: [], publishStatus: 'published', displayOrder: 3},
]

const fixture = createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1')
  const query = url.searchParams.get('query') || ''
  const slug = JSON.parse(url.searchParams.get('$slug') || 'null')
  const categorySlug = JSON.parse(url.searchParams.get('$categorySlug') || 'null')
  let result = null
  if (query.includes('_type == "productCategory"')) result = query.includes('slug.current == $slug') ? categories[slug] || null : Object.values(categories)
  else if (query.includes('_type == "product"')) {
    if (query.includes('slug.current == $slug')) result = slug === cmsBasketballProduct.slug ? cmsBasketballProduct : slug === mvpProduct.slug ? mvpProduct : null
    else if (query.includes('category->slug.current == $categorySlug')) result = categorySlug === 'basketball-uniforms' ? [cmsBasketballProduct] : categorySlug === 'soccer-kits' ? [mvpProduct] : []
    else result = [cmsBasketballProduct, mvpProduct]
  } else if (query.includes('_type == "article"')) result = query.includes('slug.current == $slug') ? articles.find((article) => article.slug === slug) || null : articles
  response.setHeader('content-type', 'application/json')
  response.end(JSON.stringify({result}))
})

function text(path) { return readFileSync(output(path), 'utf8') }
async function build(mode) {
  rmSync(new URL('../.next', import.meta.url), {recursive: true, force: true})
  const isWindows = process.platform === 'win32'
  const command = isWindows ? process.env.ComSpec : 'npm'
  const child = spawn(command, isWindows ? ['/d', '/s', '/c', 'npm run build'] : ['run', 'build'], {cwd: root, env: {...process.env, NEXT_PUBLIC_CONTENT_SOURCE: 'sanity', SANITY_API_BASE_URL: `http://127.0.0.1:${fixturePort}`, CMS_LEGACY_LIST_MODE: mode}, stdio: ['ignore', 'pipe', 'pipe']})
  let log = ''
  child.stdout.on('data', (chunk) => { log += chunk })
  child.stderr.on('data', (chunk) => { log += chunk })
  const [code] = await once(child, 'exit')
  assert.equal(code, 0, `fixture build failed:\n${log}`)
}

async function checkCategoryFailureDecision() {
  const child = spawn(process.execPath, ['--experimental-strip-types', 'scripts/check-category-visibility-decision.ts'], {cwd: root, stdio: ['ignore', 'pipe', 'pipe']})
  const [code] = await once(child, 'exit')
  assert.equal(code, 0, 'category-failure decision check failed')
}

await new Promise((resolve) => fixture.listen(0, '127.0.0.1', resolve))
const fixturePort = fixture.address().port
try {
  await checkCategoryFailureDecision()
  await build('merge')
  const products = text('products/index.html')
  const home = text('index.html')
  const basketball = text('products/basketball-uniforms/index.html')
  const sitemap = text('sitemap.xml')
  assert.equal(products.includes('MVP Soccer Kits'), false, 'hidden MVP category must be absent from cards and CollectionPage JSON-LD')
  assert.equal(products.includes('Fixture CMS Basketball Product'), false, 'hidden category products must be absent from the product collection')
  assert.equal(home.includes('MVP Soccer Kits'), false, 'hidden MVP category must be absent from homepage and navigation output')
  assert.equal(sitemap.includes('/products/soccer-kits/'), false, 'hidden MVP category must be absent from sitemap')
  assert.equal(existsSync(output('products/soccer-kits/index.html')), false, 'CMS-only MVP category must not produce an exported route')
  assert.equal(existsSync(output('products/fixture-mvp-product/index.html')), false, 'product under hidden MVP category must not produce output')
  assert.match(basketball, /Custom Basketball Uniform Manufacturer/, 'merge mode must keep the named legacy category route renderable')
  assert.match(basketball, /name="robots"\s+content="noindex,\s*nofollow"/, 'hidden CMS override of a named legacy route must emit noindex robots')
  assert.equal(sitemap.includes('/products/basketball-uniforms/'), false, 'hidden category must be absent from sitemap')
  assert.equal(sitemap.includes('/products/soccer-jerseys/'), true, 'active exported soccer route must remain in sitemap')
  console.log('cms category visibility fixture passed')
} finally {
  fixture.close()
}
