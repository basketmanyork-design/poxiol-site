import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const html = readFileSync('out/index.html', 'utf8')
const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#x27;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim()

const h1Count = (html.match(/<h1\b/gi) || []).length
assert.equal(h1Count, 1, 'Homepage must render exactly one H1.')

assert.match(visibleText, /Custom Teamwear Built for Repeatable Team Orders/i)
assert.match(visibleText, /For Teamwear Distributors, Dealers, Brands & Custom Resellers/i)
assert.match(visibleText, /Final feasibility remains project-specific and is confirmed during project review/i)

for (const label of ['Soccer','Basketball','Track & Field','Badminton','Volleyball','Baseball & Softball','Ice Hockey','American Football','Rugby','Tennis','Cricket','Golf']) {
  assert.match(visibleText, new RegExp(label.replace(/&/g, '&')))
}
for (const label of ['Match Day','Warm-Up & Training','Off-Field & Travel']) {
  assert.match(visibleText, new RegExp(label.replace(/&/g, '&')))
}
assert.match(visibleText, /Find the Right Teamwear Starting Point/)
assert.match(html, /id="product-discovery"/)
assert.ok(html.indexOf('hybrid-audience-title') < html.indexOf('product-discovery'))
assert.ok(html.indexOf('product-discovery') < html.indexOf('hybrid-risks-title'))
assert.match(html, /href="\/products\/#sports"/)
assert.match(html, /href="\/products\/#scenarios"/)

const anchors = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
  .map(match => ({url: new URL(match[1].replace(/&amp;/g, '&'), 'https://www.poxiol.com'), label: match[2].replace(/<[^>]+>/g, '').trim()}))
for (const [label, path] of [['Upload Your Design', '/free-mockup/'], ['Build Your Range', '/get-quote/'], ['Start a Sample', '/sample-order/']]) {
  const matches = anchors.filter(anchor => anchor.label === label)
  assert.ok(matches.length > 0, `Missing ${label}`)
  for (const {url} of matches) {
    assert.equal(url.origin, 'https://www.poxiol.com')
    assert.equal(url.pathname, path, `${label} must retain its distinct intent`)
    if (label === 'Build Your Range') {
      assert.equal(url.searchParams.get('product'), 'Full Teamwear')
      assert.equal(url.searchParams.get('source'), '/')
      assert.equal(url.hash, '#quote-form')
      assert.deepEqual([...url.searchParams.keys()].sort(), ['product', 'source'])
    }
  }
}

for (const label of ['Design Accuracy', 'Size & Fit', 'Project Deadline', 'Sample-to-Bulk', 'Reorder Consistency', 'Account Expansion']) assert.match(visibleText, new RegExp(label, 'i'))
for (const label of ['Approval checklist explanation', 'Milestone planning explanation', 'Sample and bulk comparison explanation', 'Retained project record explanation']) assert.match(visibleText, new RegExp(label, 'i'))
assert.match(visibleText, /Plan the approval path before production/i)
assert.match(visibleText, /Illustrative teamwear configuration/i)
assert.doesNotMatch(visibleText, /Local editorial review|Owner-approved editorial wording only|Evidence pending|local source projection|pilot does not add a second form/i)
for (const href of ['/products/basketball-uniforms/', '/products/soccer-jerseys/', '/custom-baseball-softball-uniforms/', '/private-label-teamwear/', '/oem-odm/', '/shipping-after-sales/', '/sample-order/']) assert.match(html, new RegExp(`href="${href.replaceAll('/', '\\/')}"`))

assert.match(html, /"@type":"Organization"/)
assert.match(html, /"@type":"BreadcrumbList"/)
assert.doesNotMatch(html, /"@type":"FAQPage"/)

assert.doesNotMatch(html, /\/custom-basketball-uniform-manufacturer\//)
assert.doesNotMatch(html, /<h1[^>]+(?:hidden|sr-only)/i)

console.log('POXIOL hybrid homepage output checks passed.')
