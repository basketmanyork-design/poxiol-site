import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

test('keeps withheld legal drafts out of sitemap and noindex', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  for (const route of ['/privacy-policy/', '/terms/', '/intellectual-property-policy/']) {
    assert.equal(sitemap.includes(route), false)
    const html = readFileSync(`out${route}index.html`, 'utf8')
    assert.match(html, /noindex, nofollow, noarchive/)
  }
})

test('does not publish a structured image for a withheld proof asset', () => {
  const html = readFileSync('out/factory/index.html', 'utf8')
  assert.equal(/"image"\s*:\s*"[^"]*factory/i.test(html), false)
})

test('sitemap source consumes the Plan A publication policy', () => {
  const source = readFileSync('app/sitemap.ts', 'utf8')
  assert.match(source, /publicSectionDecision/)
})

test('the maintained guide receiving a legacy redirect remains discoverable', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  assert.match(sitemap, /\/guides\/how-to-order-custom-basketball-uniforms-for-your-team\//)
})

test('redirect sources are excluded from the sitemap', () => {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8')
  const redirects = readFileSync('public/_redirects', 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter(([, , status]) => /^30[1278]$/.test(status || ''))

  for (const [source] of redirects) {
    assert.equal(
      sitemap.includes(`<loc>https://www.poxiol.com${source}</loc>`),
      false,
      `Redirect source must not be discoverable in sitemap: ${source}`,
    )
  }
})

test('robots keeps legal drafts crawlable so their noindex directives can be seen', () => {
  const robots = readFileSync('public/robots.txt', 'utf8')
  for (const route of ['/privacy-policy/', '/terms/', '/intellectual-property-policy/']) {
    assert.match(robots, new RegExp(`^Allow: ${route.replaceAll('/', '\\/')}\\s*$`, 'm'))
  }
})
