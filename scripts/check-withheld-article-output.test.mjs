import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import test from 'node:test'

const withheldRoute = '/blog/custom-teamwear-production-notes/'
const placeholderRoute = '/blog/__no-public-blog-articles__/'

test('the owner-excluded article is absent from the static release', () => {
  assert.equal(existsSync(`out${withheldRoute}index.html`), false)
  assert.doesNotMatch(readFileSync('out/sitemap.xml', 'utf8'), new RegExp(withheldRoute))
  assert.doesNotMatch(readFileSync('out/blog/index.html', 'utf8'), new RegExp(withheldRoute))
})

test('the static-export placeholder is a non-discoverable 404 document', () => {
  const html = readFileSync(`out${placeholderRoute}index.html`, 'utf8')
  assert.match(html, /<meta name="robots" content="noindex"/)
  assert.match(html, /NEXT_HTTP_ERROR_FALLBACK;404/)
  assert.doesNotMatch(readFileSync('out/sitemap.xml', 'utf8'), new RegExp(placeholderRoute))
  assert.doesNotMatch(readFileSync('out/blog/index.html', 'utf8'), new RegExp(placeholderRoute))
})
