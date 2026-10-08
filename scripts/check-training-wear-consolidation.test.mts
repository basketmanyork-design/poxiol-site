import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const RETIRED_ROUTE = '/products/warm-up-wear/'
const SURVIVOR_ROUTE = '/products/training-wear/'

function redirectsFrom(text: string) {
  return text.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => /^30[1278]$/.test(parts[2] || ''))
    .map(([source, destination, status]) => ({source, destination, status: Number(status)}))
}

function quotedValues(text: string) {
  return [...text.matchAll(/["']([^"']+)["']/g)].map((match) => match[1])
}

function warmUpCardHref(source: string) {
  const line = source.split(/\r?\n/).find((candidate) => candidate.includes("name: 'Warm-Up Wear'"))
  assert.ok(line, 'homepage must retain the Warm-Up Wear card')
  const match = line.match(/href:\s*'([^']+)'/)
  assert.ok(match, 'Warm-Up Wear card must retain an href')
  return match[1]
}

test('source consolidates Warm-Up Wear into the Training Wear survivor', () => {
  const redirects = redirectsFrom(readFileSync('public/_redirects', 'utf8'))
  const retiredRedirects = redirects.filter(({source}) => source === RETIRED_ROUTE)
  assert.deepEqual(retiredRedirects, [{source: RETIRED_ROUTE, destination: SURVIVOR_ROUTE, status: 301}])

  const sitemapSource = readFileSync('app/sitemap.ts', 'utf8')
  assert.ok(!quotedValues(sitemapSource).includes(RETIRED_ROUTE), 'retired route must not be emitted by the sitemap')
  assert.equal(warmUpCardHref(readFileSync('components/home-optimization/HomepageOptimization.tsx', 'utf8')), SURVIVOR_ROUTE)

  const homepageOutputGate = readFileSync('scripts/check-v8-homepage-output.mjs', 'utf8')
  assert.match(homepageOutputGate, /\['warm-up','\/products\/training-wear\/'\]/)
  assert.doesNotMatch(homepageOutputGate, /\['warm-up','\/products\/warm-up-wear\/'\]/)
})

if (process.argv.includes('--output')) {
  test('static output exposes one direct redirect and only the survivor as indexable', () => {
    const outputRoot = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? 'out')
    const outputRedirects = redirectsFrom(readFileSync(path.join(outputRoot, '_redirects'), 'utf8'))
      .filter(({source}) => source === RETIRED_ROUTE)
    assert.deepEqual(outputRedirects, [{source: RETIRED_ROUTE, destination: SURVIVOR_ROUTE, status: 301}])

    const sitemap = readFileSync(path.join(outputRoot, 'sitemap.xml'), 'utf8')
    assert.ok(!sitemap.includes(`https://www.poxiol.com${RETIRED_ROUTE}`))
    assert.ok(sitemap.includes(`https://www.poxiol.com${SURVIVOR_ROUTE}`))

    const homepage = readFileSync(path.join(outputRoot, 'index.html'), 'utf8')
    assert.ok(!homepage.includes(`href="${RETIRED_ROUTE}"`))
    assert.ok((homepage.match(new RegExp(`href="${SURVIVOR_ROUTE}"`, 'g')) || []).length >= 2)

    const survivor = readFileSync(path.join(outputRoot, 'products', 'training-wear', 'index.html'), 'utf8')
    assert.equal((survivor.match(/<h1\b/gi) || []).length, 1)
    assert.match(survivor, /<link[^>]+rel="canonical"[^>]+href="https:\/\/www\.poxiol\.com\/products\/training-wear\/"/i)
  })
}
