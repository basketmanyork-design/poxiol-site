import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {spawn} from 'node:child_process'
import {once} from 'node:events'

const categories = {
  'basketball-uniforms': {
    categoryName: 'Hidden Basketball', shortName: 'Basketball', slug: 'basketball-uniforms', heroDescription: 'Hidden category',
    activeStatus: false, publishStatus: 'unpublished', navigationVisibility: false, homepageVisibility: false, showOnHomepage: false,
    seo: {seoTitle: 'Hidden Basketball', metaDescription: 'Hidden category', indexStatus: 'noindex'},
  },
  'soccer-jerseys': {
    categoryName: 'Soccer Jerseys', shortName: 'Soccer', slug: 'soccer-jerseys', heroDescription: 'Active category',
    activeStatus: true, publishStatus: 'published', navigationVisibility: true, homepageVisibility: true,
    seo: {seoTitle: 'Soccer Jerseys', metaDescription: 'Active category', indexStatus: 'noindex'},
  },
}

const hiddenProduct = {
  productName: 'Hidden Basketball Jersey', slug: 'basketball-uniforms-1', categorySlug: 'basketball-uniforms', categoryTitle: 'Hidden Basketball',
  shortDescription: 'Must not render', fullDescription: 'Must not render', publishStatus: 'published', displayOrder: 1,
  seo: {seoTitle: 'Hidden Basketball Jersey', metaDescription: 'Must not render'},
}

const fixture = createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1')
  const query = url.searchParams.get('query') || ''
  const slug = JSON.parse(url.searchParams.get('$slug') || 'null')
  const categorySlug = JSON.parse(url.searchParams.get('$categorySlug') || 'null')
  let result = null

  if (query.includes('_type == "productCategory"')) {
    result = query.includes('slug.current == $slug') ? categories[slug] || null : Object.values(categories)
  } else if (query.includes('_type == "product"')) {
    if (query.includes('slug.current == $slug')) result = slug === hiddenProduct.slug ? hiddenProduct : null
    else if (query.includes('category->slug.current == $categorySlug')) result = categorySlug === 'basketball-uniforms' ? [hiddenProduct] : []
    else result = [hiddenProduct]
  }

  response.setHeader('content-type', 'application/json')
  response.end(JSON.stringify({result}))
})

await new Promise((resolve) => fixture.listen(0, '127.0.0.1', resolve))
const fixturePort = fixture.address().port
const appPort = fixturePort + 1
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', String(appPort)], {
  env: {...process.env, NEXT_PUBLIC_CONTENT_SOURCE: 'sanity', SANITY_API_BASE_URL: `http://127.0.0.1:${fixturePort}`},
  stdio: ['ignore', 'pipe', 'pipe'],
})
let appOutput = ''
app.stdout.on('data', (chunk) => { appOutput += chunk })
app.stderr.on('data', (chunk) => { appOutput += chunk })

async function get(pathname) {
  let lastError
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${appPort}${pathname}`)
      if (response.status < 500) return {status: response.status, body: await response.text()}
      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Next fixture did not respond: ${lastError}\n${appOutput}`)
}

try {
  const products = await get('/products/')
  assert.equal(products.status, 200)
  assert.equal(products.body.includes('Hidden Basketball'), false, 'hidden category must be absent from product cards and CollectionPage JSON-LD')

  const hiddenCategory = await get('/products/basketball-uniforms/')
  assert.equal(hiddenCategory.status, 404, 'explicitly suppressed CMS category must not revive a static legacy category route')

  const hiddenProductPage = await get('/products/basketball-uniforms-1/')
  assert.equal(hiddenProductPage.status, 404, 'product in a hidden category must not render Product or Breadcrumb JSON-LD')

  const soccer = await get('/products/soccer-jerseys/')
  assert.equal(soccer.status, 200, 'active soccer category must continue to render')
  assert.match(soccer.body, /name="robots" content="noindex,nofollow"/, 'active noindex category must emit robots metadata')

  const sitemap = await get('/sitemap.xml')
  assert.equal(sitemap.status, 200)
  assert.equal(sitemap.body.includes('/products/basketball-uniforms/'), false, 'hidden category must be absent from sitemap')
  assert.equal(sitemap.body.includes('/products/soccer-jerseys/'), false, 'noindex category must be absent from sitemap')

  console.log('cms category visibility fixture passed')
} finally {
  app.kill('SIGTERM')
  await Promise.race([once(app, 'exit'), new Promise((resolve) => setTimeout(resolve, 5000))])
  fixture.close()
}
