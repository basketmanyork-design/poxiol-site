import assert from 'node:assert/strict'
import test from 'node:test'

import {publicSectionDecision} from '../lib/release/publication-policy.ts'

test('withholds every unsupported proof family', () => {
  for (const id of [
    'factory-process',
    'quality-control-proof',
    'customer-projects',
    'delivery-proof',
    'repeat-order-proof',
  ] as const) {
    assert.equal(publicSectionDecision(id), 'WITHHELD')
  }
})

test('allows the governed basketball sample only as evidence', () => {
  assert.equal(
    publicSectionDecision('basketball-sample-poxiol-rp-001'),
    'EVIDENCE',
  )
})

test('keeps non-proof buyer education explicitly qualified', () => {
  for (const id of [
    'solutions-planning',
    'design-planning',
    'manufacturing-planning',
    'accessories-planning',
  ] as const) {
    assert.equal(publicSectionDecision(id), 'QUALIFIED_EXPLANATION')
  }
})
