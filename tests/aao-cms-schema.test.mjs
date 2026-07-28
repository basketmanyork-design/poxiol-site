import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import test from 'node:test'

const newFields = [
  'sampleMinimumOrderQuantity',
  'sampleQuantityUnit',
  'sampleLeadTimeMinWorkingDays',
  'sampleLeadTimeMaxWorkingDays',
  'bulkLeadTimeMinWorkingDays',
  'bulkLeadTimeMaxWorkingDays',
]

const removedFields = [
  'minimumOrderQuantity',
  'quantityUnit',
  'sampleLeadTimeMinDays',
  'sampleLeadTimeMaxDays',
  'bulkLeadTimeMinDays',
  'bulkLeadTimeMaxDays',
]

test('CMS procurement standards distinguish sample MOQ and working-day ranges', async () => {
  const [schema, queries] = await Promise.all([
    readFile('studio/schemaTypes/singletons/procurementStandards.ts', 'utf8'),
    readFile('lib/sanity/queries.ts', 'utf8'),
  ])

  for (const field of newFields) {
    assert.match(schema, new RegExp(`name: '${field}'`))
    assert.match(queries, new RegExp(`\\b${field}\\b`))
  }
  for (const field of removedFields) {
    assert.doesNotMatch(schema, new RegExp(`name: '${field}'`))
  }
  assert.match(schema, /Sample MOQ only/)
  assert.match(schema, /\.min\(1\)/)
  assert.match(queries, /\*\[_id == "procurementStandards"\]\[0\]/)
  assert.match(queries, /\bcustomizationStandard\b/)
})
