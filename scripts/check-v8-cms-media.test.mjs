import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'

const schemaFiles = [
  'studio/schemaTypes/objects/verifiedMediaAsset.ts',
  'studio/schemaTypes/objects/productionMediaSet.ts',
]

for (const file of schemaFiles) {
  assert.equal(existsSync(file), true, `Missing CMS-ready V8 media schema: ${file}`)
}

const schemaSource = schemaFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
const requiredFields = [
  'fabricInspection',
  'printing',
  'cutting',
  'sewing',
  'qc',
  'packing',
  'factoryOverviewVideo',
  'productionWorkflowVideo',
  'qualityInspectionVideo',
  'verified',
  'altText',
  'caption',
]
for (const field of requiredFields) {
  assert.match(schemaSource, new RegExp(`(?:name:\\s*|mediaField\\()(['\"])${field}\\1`), `Missing V8 media field: ${field}`)
}

const indexSource = readFileSync('studio/schemaTypes/index.ts', 'utf8')
assert.match(indexSource, /verifiedMediaAsset/)
assert.match(indexSource, /productionMediaSet/)

const sitePageSource = readFileSync('studio/schemaTypes/documents/sitePage.ts', 'utf8')
const pageSectionSource = readFileSync('studio/schemaTypes/objects/pageSection.ts', 'utf8')
assert.match(sitePageSource, /productionMedia/)
assert.match(pageSectionSource, /productionMedia/)

const querySource = readFileSync('lib/sanity/queries.ts', 'utf8')
assert.match(querySource, /productionMedia/)
for (const field of requiredFields.slice(0, 9)) {
  assert.match(querySource, new RegExp(field), `GROQ projection is missing ${field}`)
}

const typeSource = readFileSync('lib/cms/types.ts', 'utf8')
assert.match(typeSource, /CmsVerifiedMediaAsset/)
assert.match(typeSource, /CmsProductionMediaSet/)

console.log('POXIOL V8 CMS media slot checks passed.')
