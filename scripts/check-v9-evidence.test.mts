import assert from 'node:assert/strict'
import {publicEvidence} from '../lib/evidence/policy.ts'
import {publicEvidenceFromSanity} from '../lib/evidence/sanity.ts'
import type {EvidenceRecord} from '../lib/evidence/types.ts'
import {
  articleBySlugQuery,
  articlesQuery,
  caseStudiesQuery,
  caseStudyBySlugQuery,
  evidenceRecordsQuery,
  productBySlugQuery,
  productCategoriesQuery,
  productCategoryBySlugQuery,
  productsQuery,
  sitePageByKeyQuery,
  sitePagesQuery,
} from '../lib/sanity/queries.ts'

const verified: EvidenceRecord = {
  id: 'evidence-printing-001',
  evidenceType: 'IMAGE',
  image: {url: '/verified/printing.webp', alt: 'Verified printing process'},
  caption: 'Printing process for an approved POXIOL product sample.',
  processStage: 'Printing',
  relatedProducts: ['basketball-uniforms'],
  relatedSports: ['Basketball'],
  relatedProjects: [],
  relatedCapabilities: ['Printing'],
  evidenceDate: '2026-08-17',
  verificationStatus: 'VERIFIED',
  internalNotes: 'Source and approval recorded in CMS.',
  visibility: 'PUBLIC',
  publicUseApproved: true,
}

assert.equal(publicEvidence(verified)?.id, verified.id)

for (const verificationStatus of ['PENDING', 'INTERNAL_ONLY', 'REJECTED'] as const) {
  assert.equal(publicEvidence({...verified, verificationStatus}), undefined)
}
assert.equal(publicEvidence({...verified, visibility: 'PRIVATE'}), undefined)
assert.equal(publicEvidence({...verified, publicUseApproved: false}), undefined)
assert.equal(publicEvidence({...verified, image: undefined}), undefined)
assert.equal(publicEvidence({...verified, evidenceType: 'VIDEO', image: undefined, video: undefined}), undefined)

assert.equal(publicEvidenceFromSanity({
  _id: verified.id,
  evidenceType: 'IMAGE',
  imageUrl: verified.image?.url,
  imageAlt: verified.image?.alt,
  caption: verified.caption,
  processStage: verified.processStage,
  relatedProducts: verified.relatedProducts,
  relatedSports: verified.relatedSports,
  relatedProjects: verified.relatedProjects,
  relatedCapabilities: verified.relatedCapabilities,
  evidenceDate: verified.evidenceDate,
  verificationStatus: verified.verificationStatus,
  internalNotes: verified.internalNotes,
  visibility: verified.visibility,
  publicUseApproved: verified.publicUseApproved,
})?.id, verified.id)

for (const query of [sitePagesQuery, sitePageByKeyQuery, productCategoriesQuery, productCategoryBySlugQuery, productsQuery, productBySlugQuery, caseStudiesQuery, caseStudyBySlugQuery, articlesQuery, articleBySlugQuery]) {
  assert.match(query, /claimPolicies/)
}
for (const query of [sitePagesQuery, sitePageByKeyQuery, productCategoriesQuery, productCategoryBySlugQuery, productsQuery, productBySlugQuery, caseStudiesQuery, caseStudyBySlugQuery, articlesQuery, articleBySlugQuery]) {
  assert.match(query, /evidenceRecordIds/)
}
assert.match(evidenceRecordsQuery, /publicUseApproved/)

console.log('POXIOL V9.1 evidence policy tests passed.')
