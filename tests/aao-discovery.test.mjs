import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import test from 'node:test'

test('publishes qualified procurement discovery without machine files in sitemap', async () => {
  const [llms, summary, brand, aiPage, sitemap] = await Promise.all([
    readFile('public/llms.txt', 'utf8'),
    readFile('public/ai-summary.json', 'utf8').then(JSON.parse),
    readFile('public/brand.json', 'utf8').then(JSON.parse),
    readFile('out/ai-summary/index.html', 'utf8'),
    readFile('out/sitemap.xml', 'utf8'),
  ])

  assert.match(llms, /Sample MOQ: 1 set for design and quality confirmation/)
  assert.match(llms, /Bulk-order MOQ: confirmed according to product type/)
  assert.match(llms, /production booking/)
  assert.equal(summary.automaticCommerce, false)
  assert.equal(summary.humanReviewRequired, true)
  assert.match(brand.description, /one-set sample/i)
  assert.doesNotMatch(brand.description, /MOQ 1 custom orders/i)
  assert.match(aiPage, /one-set sample/i)
  assert.match(aiPage, /sample MOQ of one set/i)
  assert.match(aiPage, /Bulk-order MOQ depends/)
  assert.doesNotMatch(aiPage, /MOQ 1 flexible custom orders/i)
  assert.doesNotMatch(aiPage, /small teams and custom retail projects/i)
  assert.match(sitemap, /https:\/\/www\.poxiol\.com\/ai-summary\//)
  assert.doesNotMatch(sitemap, /\/ai-summary\.json/)
  assert.doesNotMatch(sitemap, /\/\.well-known\/poxiol-(?:capabilities|rfq-schema|agent)\.json/)
})
