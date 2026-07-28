import test from 'node:test'
import assert from 'node:assert/strict'

import {
  catalog,
  createAgentManifest,
  createCapabilityDocument,
  createRfqSchema,
  validateCatalog,
} from '../lib/aao/catalog.mjs'

const prohibitedCapabilityClaims = [
  'Sample and small-order support',
  'MOQ 1 orders',
  'MOQ 1 custom orders',
  'MOQ 1 set supported',
]

test('publishes sample MOQ separately from qualified bulk MOQ', () => {
  assert.deepEqual(validateCatalog(catalog), [])
  const capability = createCapabilityDocument(catalog)

  assert.equal(capability.procurement.sampleMinimumOrder.value, 1)
  assert.equal(capability.procurement.sampleMinimumOrder.unit, 'set')
  assert.ok(capability.procurement.sampleMinimumOrder.purpose)
  assert.equal(capability.procurement.bulkMinimumOrder.fixedValueAvailable, false)
  assert.equal('minimumOrder' in capability.procurement, false)

  const serialized = JSON.stringify(capability)
  for (const claim of prohibitedCapabilityClaims) {
    assert.doesNotMatch(serialized, new RegExp(claim, 'i'))
  }
})

test('publishes comparable lead-time ranges with manual review', () => {
  const capability = createCapabilityDocument(catalog)
  assert.equal(capability.contractVersion, '1.0.0')
  assert.equal(capability.procurement.sampleLeadTime.unit, 'working_day')
  assert.equal(capability.procurement.sampleLeadTime.min, 2)
  assert.equal(capability.procurement.sampleLeadTime.max, 3)
  assert.equal(capability.actions.requestForQuote.humanReviewRequired, true)
  assert.equal(capability.automaticCommerce.quote, false)
  assert.equal(capability.automaticCommerce.payment, false)
  assert.equal(capability.automaticCommerce.orderAcceptance, false)
})

test('rejects inverted lead-time ranges and duplicate identifiers', () => {
  const invalid = structuredClone(catalog)
  invalid.procurement.sampleLeadTime = {
    ...invalid.procurement.sampleLeadTime,
    min: 4,
    max: 2,
  }
  invalid.sports.push({...invalid.sports[0]})

  assert.deepEqual(validateCatalog(invalid), [
    'procurement.sampleLeadTime min must not exceed max',
    'sports identifiers must be unique',
  ])
})

test('keeps RFQ quantity units and human form without advertising an API', () => {
  const schema = createRfqSchema(catalog)
  const manifest = createAgentManifest(catalog)

  assert.equal(schema.$id, 'https://www.poxiol.com/.well-known/poxiol-rfq-schema.json')
  assert.equal(schema.additionalProperties, false)
  assert.ok(schema.required.includes('manualReviewAccepted'))
  assert.deepEqual(schema.properties.quantityUnit.enum, ['piece', 'set'])
  assert.equal(manifest.actions.requestForQuote.formUrl, 'https://www.poxiol.com/get-quote/')
  assert.equal(
    manifest.actions.requestForQuote.schemaUrl,
    'https://www.poxiol.com/.well-known/poxiol-rfq-schema.json',
  )
  assert.equal('apiUrl' in manifest.actions.requestForQuote, false)
})
