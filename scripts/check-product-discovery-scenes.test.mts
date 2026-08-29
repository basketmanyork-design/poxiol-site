import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {test} from 'node:test'

import allowlist from '../content/release/asset-allowlist.json' with {type: 'json'}
import {SPORT_CATEGORIES, WEARING_SCENARIOS} from '../lib/product-taxonomy.ts'

const expectedSportScenes = [
  '/images/product-discovery/sport-soccer.webp',
  '/images/product-discovery/sport-basketball.webp',
  '/images/product-discovery/sport-track-field.webp',
  '/images/product-discovery/sport-badminton.webp',
  '/images/product-discovery/sport-volleyball.webp',
  '/images/product-discovery/sport-baseball-softball.webp',
  '/images/product-discovery/sport-ice-hockey.webp',
  '/images/product-discovery/sport-american-football.webp',
  '/images/product-discovery/sport-rugby.webp',
  '/images/product-discovery/sport-tennis.webp',
  '/images/product-discovery/sport-cricket.webp',
  '/images/product-discovery/sport-golf.webp',
]

const expectedScenarioScenes = [
  '/images/product-discovery/scenario-match-day.webp',
  '/images/product-discovery/scenario-warm-up-training.webp',
  '/images/product-discovery/scenario-off-field-travel.webp',
]

test('all 12 sports and 3 wearing scenarios expose reviewed scene backgrounds', () => {
  assert.deepEqual(SPORT_CATEGORIES.map((item) => item.sceneImage), expectedSportScenes)
  assert.deepEqual(WEARING_SCENARIOS.map((item) => item.sceneImage), expectedScenarioScenes)

  const scenePaths = [...expectedSportScenes, ...expectedScenarioScenes]
  assert.equal(new Set(scenePaths).size, 15)
  for (const scenePath of scenePaths) {
    assert.equal(existsSync(join('public', scenePath)), true, `Missing scene asset ${scenePath}`)
    const reviewed = allowlist.find((item) => item.path === scenePath)
    assert.equal(reviewed?.classification, 'ILLUSTRATION_NON_PROOF', scenePath)
    assert.equal(reviewed?.generatedByAI, true, scenePath)
    assert.equal(reviewed?.allowedUse, 'product-discovery-scene', scenePath)
    assert.equal(reviewed?.thirdPartyMarkReview, 'PASS', scenePath)
    assert.equal(reviewed?.poxiolMarkReview, 'PASS_RETAINED', scenePath)
    assert.equal(reviewed?.reviewSource, 'OWNER-APPROVED-2026-08-29', scenePath)
  }
})
