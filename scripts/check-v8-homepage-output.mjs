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

assert.match(visibleText, /Custom Teamwear Manufacturer For Clubs, Schools & Sports Brands/i)
assert.match(visibleText, /POXIOL specializes in custom Basketball, Soccer and Baseball teamwear for clubs, schools, youth programs and sports brands, with design support, sample review and quality control\./i)

assert.match(html, /href="\/free-mockup\/"[^>]*>[^<]*Get Free Mockup/i)
assert.match(html, /href="\/sample-order\/"[^>]*>[^<]*Request Sample/i)

const buyerLinks = [
  ['Youth Teams', '/youth-team-uniforms/'],
  ['Schools', '/school-teamwear/'],
  ['Sports Clubs', '/club-teamwear-program/'],
  ['Sports Brands', '/private-label-teamwear/'],
]
for (const [label, href] of buyerLinks) {
  assert.match(visibleText, new RegExp(label, 'i'))
  assert.match(html, new RegExp(`href="${href.replaceAll('/', '\\/')}"`))
}

const problemPairs = [
  ['Will my design look correct?', 'Free Mockup Before Production'],
  ['Will quality match expectations?', 'Sample Approval Before Bulk Order'],
  ['Will production be reliable?', 'Quality Check Before Shipment'],
]
for (const [problem, solution] of problemPairs) {
  assert.match(visibleText, new RegExp(problem.replace(/[?]/g, '\\?'), 'i'))
  assert.match(visibleText, new RegExp(solution, 'i'))
}

const journeyHtml = html.match(/<section[^>]*aria-labelledby="v8-design-journey-title"[\s\S]*?<\/section>/i)?.[0] || ''
const journeyText = journeyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const journey = ['Idea', 'Mockup', 'Sample', 'Production', 'Quality Control', 'Shipment']
let previousIndex = -1
for (const label of journey) {
  const index = journeyText.indexOf(label)
  assert.ok(index > previousIndex, `Homepage design journey is missing or out of order: ${label}`)
  previousIndex = index
}
assert.match(visibleText, /Start Your Team Design/i)

assert.doesNotMatch(visibleText, /Verified production visual pending/i)

for (const solution of ['Custom Basketball Uniforms', 'Custom Soccer Kits', 'Custom Baseball Uniforms']) {
  assert.match(visibleText, new RegExp(solution, 'i'))
}

assert.match(visibleText, /Ready To Build Your Team Uniform\?/i)
assert.match(html, /"@type":"Organization"/)
assert.match(html, /"@type":"FAQPage"/)
assert.match(html, /"@type":"BreadcrumbList"/)

assert.doesNotMatch(html, /\/custom-basketball-uniform-manufacturer\//)
assert.doesNotMatch(html, /<h1[^>]+(?:hidden|sr-only)/i)

console.log('POXIOL V8 homepage output checks passed.')
