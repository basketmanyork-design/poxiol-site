import test from 'node:test'
import assert from 'node:assert/strict'

import {
  catalog,
  createAgentManifest,
  createCapabilityDocument,
  createRfqSchema,
  validateCatalog,
} from '../lib/aao/catalog.mjs'

test('publishes comparable capability ranges with manual review', () => {
  assert.deepEqual(validateCatalog(catalog), [])

  const document = createCapabilityDocument(catalog)

  assert.equal(document.contractVersion, '1.0.0')
  assert.equal(document.procurement.sampleLeadTime.unit, 'business_day')
  assert.equal(document.procurement.sampleLeadTime.min, 2)
  assert.equal(document.procurement.sampleLeadTime.max, 3)
  assert.equal(document.actions.requestForQuote.humanReviewRequired, true)
  assert.equal(document.automaticCommerce.quote, false)
  assert.equal(document.automaticCommerce.payment, false)
  assert.equal(document.automaticCommerce.orderAcceptance, false)
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

test('links the RFQ schema and human form without advertising an API', () => {
  const schema = createRfqSchema(catalog)
  const manifest = createAgentManifest(catalog)

  assert.equal(schema.$id, 'https://www.poxiol.com/.well-known/poxiol-rfq-schema.json')
  assert.equal(schema.additionalProperties, false)
  assert.ok(schema.required.includes('manualReviewAccepted'))
  assert.deepEqual(
    schema.properties.sport.enum,
    catalog.sports.map(({id}) => id),
  )
  assert.equal(
    manifest.actions.requestForQuote.formUrl,
    'https://www.poxiol.com/get-quote/',
  )
  assert.equal(
    manifest.actions.requestForQuote.schemaUrl,
    'https://www.poxiol.com/.well-known/poxiol-rfq-schema.json',
  )
  assert.equal('apiUrl' in manifest.actions.requestForQuote, false)
})
