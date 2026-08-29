import assert from 'node:assert/strict'
import {test} from 'node:test'
import {
  SPORT_CATEGORIES,
  WEARING_SCENARIOS,
  getScenario,
  getSportCategory,
  productDiscoveryInquiryHref,
} from '../lib/product-taxonomy.ts'

const expectedSports = [
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

const expectedScenarios = [
  'Match Day',
  'Warm-Up & Training',
  'Off-Field & Travel',
]

test('buyers receive the approved sports and scenarios in owner order', () => {
  assert.deepEqual(SPORT_CATEGORIES.map((item) => item.label), expectedSports)
  assert.deepEqual(WEARING_SCENARIOS.map((item) => item.label), expectedScenarios)
  assert.equal(new Set(SPORT_CATEGORIES.map((item) => item.id)).size, 12)
  assert.notEqual(getSportCategory('american-football')?.id, getSportCategory('rugby')?.id)
})

test('mature sports retain canonical pages and other sports require project review', () => {
  assert.equal(getSportCategory('soccer')?.href, '/products/soccer-jerseys/')
  assert.equal(getSportCategory('basketball')?.href, '/products/basketball-uniforms/')
  assert.equal(getSportCategory('baseball-softball')?.href, '/custom-baseball-softball-uniforms/')
  assert.equal(getSportCategory('cricket')?.contentStage, 'project-review')
})

test('a selected sport and scenario reaches the safe quote form with editable context', () => {
  const href = productDiscoveryInquiryHref({
    sport: 'rugby',
    scenario: 'warm-up-training',
    source: '/products/',
  })
  const url = new URL(href, 'https://www.poxiol.com')
  assert.equal(url.pathname, '/get-quote/')
  assert.equal(url.hash, '#quote-form')
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    product: 'Rugby - Warm-Up & Training',
    sport: 'Rugby',
    source: '/products/',
  })
  assert.equal(productDiscoveryInquiryHref({sport: 'unknown', source: '/products/'}), '/products/')
  assert.equal(getScenario('unknown'), undefined)
})
