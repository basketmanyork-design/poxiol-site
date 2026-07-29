import assert from 'node:assert/strict'
import {existsSync, readFileSync, rmSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {isAbsolute, relative, resolve, sep} from 'node:path'
import {createServer} from 'node:http'
import {once} from 'node:events'
import {spawn} from 'node:child_process'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const output = (path) => new URL(`../out/${path}`, import.meta.url)
const buildArtifactPaths = ['.next', 'out'].map((name) => resolve(root, name))

function containedBuildArtifactPath(path) {
  const resolvedPath = resolve(path)
  const relativePath = relative(root, resolvedPath)
  assert.equal(relativePath === '' || relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath), false, `build artifact path must stay within fixture root: ${resolvedPath}`)
  return resolvedPath
}

function cleanupBuildArtifacts() {
  for (const path of buildArtifactPaths) rmSync(containedBuildArtifactPath(path), {recursive: true, force: true})
}
let failCategoryQueries = false

const categories = {
  'basketball-uniforms': {categoryName: 'Hidden Basketball', slug: 'basketball-uniforms', activeStatus: false, publishStatus: 'unpublished', navigationVisibility: false, homepageVisibility: false, seo: {seoTitle: 'Hidden Basketball', metaDescription: 'Hidden', indexStatus: 'noindex'}},
  'soccer-jerseys': {categoryName: 'Fixture Active Soccer Jerseys', slug: 'soccer-jerseys', heroDescription: 'Visible homepage category fixture', activeStatus: true, publishStatus: 'published', navigationVisibility: true, homepageVisibility: true, seo: {seoTitle: 'Fixture Active Soccer Jerseys', metaDescription: 'Active', indexStatus: 'index'}},
  'soccer-kits': {categoryName: 'MVP Soccer Kits', slug: 'soccer-kits', activeStatus: false, publishStatus: 'unpublished', navigationVisibility: false, homepageVisibility: false, seo: {seoTitle: 'MVP Soccer Kits', metaDescription: 'Hidden MVP', indexStatus: 'noindex'}},
}
const cmsBasketballProduct = {productName: 'Fixture CMS Basketball Product', slug: 'basketball-uniforms-1', categorySlug: 'basketball-uniforms', categoryTitle: 'Hidden Basketball', shortDescription: 'Hidden', fullDescription: 'Hidden', publishStatus: 'published', displayOrder: 1, seo: {seoTitle: 'Hidden', metaDescription: 'Hidden'}}
const mvpProduct = {productName: 'Fixture MVP Product', slug: 'fixture-mvp-product', categorySlug: 'soccer-kits', categoryTitle: 'MVP Soccer Kits', shortDescription: 'Hidden', fullDescription: 'Hidden', publishStatus: 'published', displayOrder: 2, seo: {seoTitle: 'Hidden', metaDescription: 'Hidden'}}
const activeProduct = {productName: 'Fixture Active Soccer Product', slug: 'fixture-active-soccer-product', categorySlug: 'soccer-jerseys', categoryTitle: 'Fixture Active Soccer Jerseys', shortDescription: 'Visible', fullDescription: 'Visible', publishStatus: 'published', displayOrder: 3, seo: {seoTitle: 'Visible', metaDescription: 'Visible'}}
const articles = [
  {title: 'Fixture Blog', slug: 'fixture-blog', excerpt: 'Fixture article', articleType: 'blog', body: [], publishStatus: 'published', displayOrder: 1},
  {title: 'Fixture Resource', slug: 'fixture-resource', excerpt: 'Fixture article', articleType: 'resource', body: [], publishStatus: 'published', displayOrder: 2},
  {title: 'Fixture Guide', slug: 'fixture-guide', excerpt: 'Fixture article', articleType: 'guide', body: [], publishStatus: 'published', displayOrder: 3},
]
const projects = [{projectTitle: 'Fixture Project', slug: 'fixture-project', country: 'Fixture Country', product: 'Fixture Product', overview: 'Fixture project', publishStatus: 'published', displayOrder: 1}]
const headerNavigation = [
  {label: 'Fixture Contact Header', url: '/contact/'},
  {label: 'Hidden Basketball Header', url: '/products/basketball-uniforms/'},
  {label: 'Hidden Soccer Kits Header', url: '/products/soccer-kits/'},
  {label: 'Active Soccer Header', url: '/products/soccer-jerseys/'},
  {label: 'Basketball Product Header', url: '/products/basketball-uniforms-1/'},
]
const footerColumns = [{
  title: 'Fixture Footer',
  links: [
    {label: 'Fixture Contact Footer', url: '/contact/'},
    {label: 'Hidden Basketball Footer', url: '/products/basketball-uniforms/'},
    {label: 'Hidden Soccer Kits Footer', url: '/products/soccer-kits/'},
    {label: 'Active Soccer Footer', url: '/products/soccer-jerseys/'},
    {label: 'Basketball Product Footer', url: '/products/basketball-uniforms-1/'},
  ],
}]

const fixture = createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1')
  const query = url.searchParams.get('query') || ''
  const slug = JSON.parse(url.searchParams.get('$slug') || 'null')
  const categorySlug = JSON.parse(url.searchParams.get('$categorySlug') || 'null')
  if (failCategoryQueries && query.includes('_type == "productCategory"')) {
    response.statusCode = 500
    response.end('category fixture failure')
    return
  }
  let result = null
  if (query.includes('_type == "productCategory"')) result = query.includes('slug.current == $slug') ? categories[slug] || null : Object.values(categories)
  else if (query.includes('_type == "product"')) {
    const products = [cmsBasketballProduct, mvpProduct, activeProduct]
    if (query.includes('slug.current == $slug')) result = products.find((product) => product.slug === slug) || null
    else if (query.includes('category->slug.current == $categorySlug')) result = products.filter((product) => product.categorySlug === categorySlug)
    else result = products
  } else if (query.includes('_type == "article"')) result = query.includes('slug.current == $slug') ? articles.find((article) => article.slug === slug) || null : articles
  else if (query.includes('_type == "caseStudy"')) result = query.includes('slug.current == $slug') ? projects.find((project) => project.slug === slug) || null : projects
  else if (query.includes('_type == "navigationSettings"')) result = {headerNavigation}
  else if (query.includes('_type == "footerSettings"')) result = {footerColumns}
  else if (query.includes('_type == "siteSettings"')) result = {brandName: 'POXIOL'}
  response.setHeader('content-type', 'application/json')
  response.end(JSON.stringify({result}))
})

function text(path) { return readFileSync(output(path), 'utf8') }
async function build(mode) {
  cleanupBuildArtifacts()
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
  assert.equal(home.includes('Fixture Active Soccer Jerseys'), true, 'active homepage category must be present in actual homepage output')
  assert.equal(home.includes('MVP Soccer Kits'), false, 'hidden MVP category must be absent from homepage and navigation output')
  assert.equal(home.includes('Hidden Basketball Header'), false, 'hidden category header link must be absent from actual output')
  assert.equal(home.includes('Hidden Basketball Footer'), false, 'hidden category footer link must be absent from actual output')
  assert.equal(home.includes('Hidden Soccer Kits Header') || home.includes('Hidden Soccer Kits Footer'), false, 'hidden CMS-only category links must be absent from actual output')
  assert.equal(home.includes('Active Soccer Header'), true, 'active category header link must remain in actual output')
  assert.equal(home.includes('Active Soccer Footer'), true, 'active category footer link must remain in actual output')
  assert.equal(home.includes('Basketball Product Header') && home.includes('Basketball Product Footer'), true, 'product-detail navigation links must remain in actual output')
  assert.equal(home.includes('Fixture Contact Header') && home.includes('Fixture Contact Footer'), true, 'non-category navigation links must remain')
  assert.equal(sitemap.includes('/products/soccer-kits/'), false, 'hidden MVP category must be absent from sitemap')
  assert.equal(existsSync(output('products/soccer-kits/index.html')), false, 'CMS-only MVP category must not produce an exported route')
  assert.equal(existsSync(output('products/fixture-mvp-product/index.html')), false, 'product under hidden MVP category must not produce output')
  assert.match(basketball, /Custom Basketball Uniform Manufacturer/, 'merge mode must keep the named legacy category route renderable')
  assert.match(basketball, /name="robots"\s+content="noindex,\s*nofollow"/, 'hidden CMS override of a named legacy route must emit noindex robots')
  assert.equal(sitemap.includes('/products/basketball-uniforms/'), false, 'hidden category must be absent from sitemap')
  assert.equal(sitemap.includes('/products/soccer-jerseys/'), true, 'active exported soccer route must remain in sitemap')
  await build('strict')
  const strictHome = text('index.html')
  const strictBasketball = text('products/basketball-uniforms/index.html')
  const strictTraining = text('products/training-wear/index.html')
  const strictSoccer = text('products/soccer-jerseys/index.html')
  assert.equal(strictBasketball.includes('Custom Basketball Uniform Manufacturer'), false, 'strict mode must not render Legacy for a suppressed category')
  assert.equal(strictTraining.includes('Custom Training Wear and Warm-up Suits'), false, 'strict mode must not render Legacy when the category query succeeds without that category')
  assert.equal(strictSoccer.includes('Fixture Active Soccer Jerseys'), true, 'strict mode must retain an active published category route')
  assert.equal(strictHome.includes('Hidden Basketball Header') || strictHome.includes('Hidden Basketball Footer'), false, 'strict navigation must exclude hidden category links')
  assert.equal(strictHome.includes('Active Soccer Header') && strictHome.includes('Active Soccer Footer'), true, 'strict navigation must retain active category links')
  assert.equal(strictHome.includes('Fixture Active Soccer Jerseys'), true, 'strict homepage must retain active homepage categories')
  assert.equal(strictHome.includes('MVP Soccer Kits'), false, 'strict homepage must exclude hidden homepage categories')
  failCategoryQueries = true
  await build('merge')
  const failureHome = text('index.html')
  assert.equal(failureHome.includes('Hidden Basketball Header') && failureHome.includes('Hidden Basketball Footer'), true, 'category-query failure must preserve emergency navigation')
  assert.equal(existsSync(output('products/fixture-active-soccer-product/index.html')), false, 'category-query failure must use Legacy-only product generation')
} finally {
  await new Promise((resolve, reject) => fixture.close((error) => error ? reject(error) : resolve()))
  cleanupBuildArtifacts()
}
assert.equal(existsSync(buildArtifactPaths[0]), false, 'fixture must remove .next after assertions and server closure')
assert.equal(existsSync(buildArtifactPaths[1]), false, 'fixture must remove out after assertions and server closure')
console.log('cms category visibility fixture passed')
