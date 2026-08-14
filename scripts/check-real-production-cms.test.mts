import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const schema = readFileSync('studio/schemaTypes/objects/verifiedMediaAsset.ts', 'utf8')
for (const field of ['posterImage', 'verificationStatus', 'publicUseApproved', 'photographerOrOwner', 'productRelationship', 'peopleVisible', 'peopleAuthorization', 'thirdPartyLogoVisible', 'thirdPartyLogoAuthorization', 'customerArtworkVisible', 'customerArtworkAuthorization', 'privateInformationVisible', 'intendedCategory', 'verificationNote', 'verifiedAt', 'verifiedBy']) {
  assert.match(schema, new RegExp(`name:\\s*['"]${field}['"]`), `CMS media schema missing ${field}`)
}
assert.match(schema, /publicUseApproved[\s\S]*Rule\.required/, 'Public approval must be required')
assert.match(schema, /verificationNote[\s\S]*Rule\.required/, 'Verification note must be required')

const query = readFileSync('lib/sanity/queries.ts', 'utf8')
for (const field of ['posterImage', 'verificationStatus', 'publicUseApproved', 'photographerOrOwner', 'productRelationship', 'privateInformationVisible', 'intendedCategory', 'verifiedAt', 'verifiedBy']) assert.match(query, new RegExp(field))

const content = readFileSync('lib/sanity/content.ts', 'utf8')
assert.match(content, /canPublishCmsProductionMedia/)
assert.match(content, /verificationStatus/)
assert.match(content, /publicUseApproved/)
assert.match(content, /verificationNote/)

console.log('Real Production CMS contract checks passed')
