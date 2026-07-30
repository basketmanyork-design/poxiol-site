import test from 'node:test'
import assert from 'node:assert/strict'

import {
  toRfqFormData,
  validateRfq,
} from '../lib/aao/rfq-contract.mjs'

const now = new Date('2026-07-28T00:00:00Z')

const validInput = {
  fullName: '  Alex Buyer  ',
  email: ' ALEX@EXAMPLE.COM ',
  phone: ' +49 123 456 ',
  country: 'de',
  buyerType: 'distributor',
  sport: 'basketball',
  productType: 'jersey_shorts_set',
  quantity: '30',
  quantityUnit: 'set',
  targetDeliveryDate: '2026-09-30',
  teamOrBrandName: '  Example Sports  ',
  colors: ' Black + Lime ',
  customization: ['logo', 'player_name_number', 'logo'],
  notes: '  Please confirm fabric options.  ',
  manualReviewAccepted: true,
}

test('normalizes a valid RFQ into the published contract', () => {
  const result = validateRfq(validInput, now)

  assert.equal(result.ok, true)
  assert.equal(result.value.fullName, 'Alex Buyer')
  assert.equal(result.value.email, 'alex@example.com')
  assert.equal(result.value.country, 'DE')
  assert.equal(result.value.quantity, 30)
  assert.deepEqual(result.value.customization, ['logo', 'player_name_number'])
  assert.equal(result.value.schemaVersion, '1.0.0')
  assert.equal(result.value.submissionPolicy, 'human_review_required')
  assert.equal('unexpected' in result.value, false)
})

test('rejects invalid quantities, identifiers, dates, and consent', () => {
  const result = validateRfq({
    ...validInput,
    email: 'not-an-email',
    country: 'Germany',
    buyerType: 'unknown',
    sport: 'unknown',
    productType: 'unknown',
    quantity: '0',
    quantityUnit: 'box',
    targetDeliveryDate: '2026-07-27',
    customization: ['unknown'],
    manualReviewAccepted: false,
  }, now)

  assert.deepEqual(result, {
    ok: false,
    errors: {
      email: 'Enter a valid email address.',
      country: 'Use a two-letter ISO country code.',
      buyerType: 'Select a supported buyer type.',
      sport: 'Select a supported sport.',
      productType: 'Select a supported product type.',
      quantity: 'Quantity must be a positive whole number.',
      quantityUnit: 'Select piece or set.',
      targetDeliveryDate: 'Target delivery date cannot be in the past.',
      customization: 'Select only supported customization options.',
      manualReviewAccepted: 'Accept the human-review policy before submitting.',
    },
  })
})

test('serializes readable fields and canonical JSON for Formspree', () => {
  const result = validateRfq(validInput, now)
  assert.equal(result.ok, true)

  const formData = toRfqFormData(result.value)

  assert.equal(formData.get('formType'), 'Structured RFQ v1.0.0')
  assert.equal(formData.get('humanReviewRequired'), 'true')
  assert.equal(formData.get('quantity'), '30')
  assert.equal(formData.get('customization'), 'logo, player_name_number')
  assert.deepEqual(JSON.parse(formData.get('rfqPayload')), result.value)
})
