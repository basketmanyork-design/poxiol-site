import assert from 'node:assert/strict'
import {canPublishProductionAsset, publicationIssues} from '../lib/real-production/policy.ts'
import type {RealProductionAsset} from '../lib/real-production/types.ts'

const safe: RealProductionAsset = {
  assetId: 'sample-front', sampleId: 'POXIOL-RP-TEST', sourceId: 'POXIOL-SOURCE-TEST-FRONT',
  view: 'FRONT', completenessGrade: 'A',
  filename: 'sample-front.webp', source: 'Original POXIOL studio photograph', photographerOrOwner: 'POXIOL',
  productRelationship: 'POXIOL-owned basketball sample', verificationStatus: 'VERIFIED_POXIOL', publicUseApproved: true,
  peopleVisible: false, peopleAuthorization: 'NOT_APPLICABLE', thirdPartyLogoVisible: false, thirdPartyLogoAuthorization: 'NOT_APPLICABLE',
  customerArtworkVisible: false, customerArtworkAuthorization: 'NOT_APPLICABLE', privateInformationVisible: false,
  sport: 'basketball', category: 'front', alt: 'Front of a finished basketball uniform sample',
  caption: 'Finished basketball sample shown from the front.', intendedPages: ['home', 'basketball'],
  verificationNote: 'Original reviewed against the product sample record.', verifiedAt: '2026-08-13', verifiedBy: 'POXIOL content owner',
  publicPath: '/real-production/sample-front.webp', width: 1200, height: 800,
}

assert.equal(canPublishProductionAsset(safe), true)
assert.equal(canPublishProductionAsset({...safe, verificationStatus: 'REQUIRES_HUMAN_REVIEW'}), false)
assert.equal(canPublishProductionAsset({...safe, publicUseApproved: false}), false)
assert.equal(canPublishProductionAsset({...safe, source: ''}), false)
assert.equal(canPublishProductionAsset({...safe, publicPath: '/images/legacy.webp'}), false)
assert.equal(canPublishProductionAsset({...safe, photographerOrOwner: ''}), false)
assert.equal(canPublishProductionAsset({...safe, privateInformationVisible: true}), false)
assert.equal(canPublishProductionAsset({...safe, thirdPartyLogoVisible: true, thirdPartyLogoAuthorization: 'UNKNOWN'}), false)
assert.equal(canPublishProductionAsset({...safe, peopleVisible: true, peopleAuthorization: 'UNKNOWN'}), false)
assert.equal(canPublishProductionAsset({...safe, customerArtworkVisible: true, customerArtworkAuthorization: 'UNKNOWN'}), false)
assert.equal(canPublishProductionAsset({...safe, alt: 'High Quality'}), false)
assert.equal(canPublishProductionAsset({...safe, caption: 'Best Manufacturer'}), false)
assert.equal(canPublishProductionAsset({...safe, verificationStatus: 'VERIFIED_BUYER_AUTHORIZED', buyerAuthorization: 'UNKNOWN'}), false)
assert.equal(canPublishProductionAsset({...safe, verificationStatus: 'PRODUCT_ONLY_VERIFIED', evidenceContext: 'factory'}), false)
assert.equal(canPublishProductionAsset({...safe, verificationStatus: 'PRODUCT_VISUALIZATION'}), false)
assert.equal(canPublishProductionAsset({...safe, sampleId: ''}), false)
assert.equal(canPublishProductionAsset({...safe, sourceId: ''}), false)
assert.deepEqual(publicationIssues(safe), [])

console.log('Real Production publication policy checks passed')
