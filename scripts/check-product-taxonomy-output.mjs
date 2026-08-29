import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const html = readFileSync('out/products/index.html', 'utf8')
const visible = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim()

const sports = [
  'Soccer',
  'Basketball',
  'Track & Field',
  'Badminton',
  'Volleyball',
  'Baseball & Softball',
  'Ice Hockey',
  'American Football',
  'Rugby',
  'Tennis',
  'Cricket',
  'Golf',
]
const scenarios = ['Match Day', 'Warm-Up & Training', 'Off-Field & Travel']

assert.equal((html.match(/<h1\b/gi) || []).length, 1)
assert.match(visible, /Browse by Sport/)
assert.match(visible, /Browse by Wearing Scenario/)
for (const label of [...sports, ...scenarios]) {
  assert.match(visible, new RegExp(label.replace(/&/g, '&(?:amp;)?')))
}
assert.match(visible, /Product construction, material, quantity and timing are confirmed after the project brief is reviewed\./)
assert.doesNotMatch(visible, /Nike|Adidas|Puma|Under Armour/i)
assert.match(html, /motion-reduce:transition-none/)
assert.match(html, /motion-reduce:transform-none/)

for (const id of ['sports', 'scenarios']) assert.match(html, new RegExp(`id="${id}"`))
for (const href of [
  '/products/basketball-uniforms/',
  '/products/soccer-jerseys/',
  '/custom-baseball-softball-uniforms/',
]) {
  assert.ok(html.includes(`href="${href}"`), `Missing mature link ${href}`)
}

const quoteLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)]
  .map((match) => new URL(match[1].replace(/&amp;/g, '&'), 'https://www.poxiol.com'))
  .filter((url) => url.pathname === '/get-quote/' && url.searchParams.get('source') === '/products/')
assert.ok(quoteLinks.some((url) => url.searchParams.get('sport') === 'Rugby'))
assert.ok(quoteLinks.some((url) => url.searchParams.get('sport') === 'American Football'))

const schemas = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  .map((match) => JSON.parse(match[1]))
const collection = schemas.find((schema) => schema['@type'] === 'CollectionPage')
assert.deepEqual(
  collection?.mainEntity?.itemListElement?.map((item) => item.url),
  [
    'https://www.poxiol.com/products/soccer-jerseys/',
    'https://www.poxiol.com/products/basketball-uniforms/',
    'https://www.poxiol.com/custom-baseball-softball-uniforms/',
  ],
)
const faqSchema = schemas.find((schema) => schema['@type'] === 'FAQPage')
const faqNames = faqSchema?.mainEntity?.map((item) => item.name) || []
const visibleFaqs = [...html.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)]
  .map((match) => match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim())
  .filter((name) => faqNames.includes(name))
assert.deepEqual(faqNames, visibleFaqs)

console.log('POXIOL dual-dimension Products output checks passed.')
