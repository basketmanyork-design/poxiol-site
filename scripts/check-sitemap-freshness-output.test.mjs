import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'

const xml = readFileSync('out/sitemap.xml', 'utf8')
const entries = new Map(
  [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
    .map((match) => [new URL(match[1]).pathname, match[2]]),
)

test('generated sitemap publishes route-specific content freshness', () => {
  assert.equal(entries.get('/about/'), '2026-09-13T00:00:00.000Z')
  assert.equal(entries.get('/soccer-jersey-supplier-australia/'), '2026-09-13T00:00:00.000Z')
  assert.equal(entries.get('/privacy-policy/'), '2026-08-29T00:00:00.000Z')
  assert.ok(new Set(entries.values()).size > 1, 'Sitemap must not stamp every route with one release date')
})
