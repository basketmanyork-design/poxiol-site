import assert from 'node:assert/strict'
import {
  OWNER_DECISIONS,
  OWNER_DECISION_STATUSES,
  PROJECT_AUTHENTICITY_CLASSES,
  projectPublicationDecision,
} from '../lib/truth/owner-decisions.ts'
import {
  CATEGORY_PUBLICATION_DECISIONS,
  PRODUCT_CATEGORY_STATES,
  categoryPublicationGate,
} from '../lib/site-taxonomy.ts'
import {PRODUCTION_PROOF_SLOTS} from '../lib/evidence/production-proof-slots.ts'
import {publicEvidence} from '../lib/evidence/policy.ts'
import {publicEvidenceFromSanity} from '../lib/evidence/sanity.ts'
import type {EvidenceRecord} from '../lib/evidence/types.ts'
import {
  buildMigrationPlan,
  classifyMutationHttpResult,
  type SnapshotDocument,
} from './v9-sanity-truth-migration.mts'

assert.deepEqual(OWNER_DECISION_STATUSES, [
  'OWNER_CONFIRMED_RESTRICTION',
  'OWNER_CONFIRMED_CONDITIONAL',
  'OWNER_CONFIRMED_OPERATIONAL_TARGET',
  'OWNER_CONFIRMED_SEPARATION_REQUIRED',
  'OWNER_CONFIRMED_VERIFICATION_REQUIRED',
  'OWNER_CONFIRMED_CLASSIFICATION',
])
assert.deepEqual(Object.keys(OWNER_DECISIONS), [
  'CLAIM_FACTORY_RELATIONSHIP',
  'CLAIM_MOQ',
  'CLAIM_TIMELINE',
  'CLAIM_SHIPPING',
  'CLAIM_SIZE_TOLERANCE',
  'CLAIM_CERTIFICATION',
  'CLAIM_PROJECT_AUTHENTICITY',
])
assert.equal(OWNER_DECISIONS.CLAIM_FACTORY_RELATIONSHIP.publicDefault, 'Custom Teamwear Manufacturer')
assert.equal(OWNER_DECISIONS.CLAIM_MOQ.publicDefault, 'MOQ confirmed by product and project requirements.')
assert.equal(
  OWNER_DECISIONS.CLAIM_SHIPPING.publicDefault,
  'Shipping options and transit time are confirmed based on destination, shipping method and order requirements.',
)
assert.equal(OWNER_DECISIONS.CLAIM_CERTIFICATION.truthStatus, 'UNVERIFIED')
assert.equal(OWNER_DECISIONS.CLAIM_SIZE_TOLERANCE.returnPolicyStatus, 'POLICY_REVIEW_REQUIRED')

assert.deepEqual(PROJECT_AUTHENTICITY_CLASSES, [
  'VERIFIED_REAL_PROJECT',
  'BUYER_AUTHORIZED_PROJECT',
  'INTERNAL_SAMPLE',
  'DEMO',
  'SCENARIO',
  'UNVERIFIED',
])
assert.deepEqual(projectPublicationDecision('SCENARIO'), {public: true, requiredLabel: 'Example Project Scenario'})
assert.deepEqual(projectPublicationDecision('INTERNAL_SAMPLE'), {public: true, requiredLabel: 'Development Sample'})
assert.deepEqual(projectPublicationDecision('BUYER_AUTHORIZED_PROJECT'), {public: false})
assert.deepEqual(projectPublicationDecision('BUYER_AUTHORIZED_PROJECT', true), {public: true})
assert.deepEqual(projectPublicationDecision('UNVERIFIED'), {public: false})

assert.deepEqual(PRODUCT_CATEGORY_STATES, [
  'ACTIVE_VERIFIED',
  'MANUFACTURABLE_NOT_PROVEN',
  'PLANNED',
  'DISABLED',
])
assert.deepEqual(categoryPublicationGate('ACTIVE_VERIFIED'), {
  public: true, navigation: true, products: true, sitemap: true, internalLinks: true, seoLandingPage: true, noindex: false,
})
assert.deepEqual(categoryPublicationGate('PLANNED'), {
  public: false, navigation: false, products: false, sitemap: false, internalLinks: false, seoLandingPage: false, noindex: true,
})
assert.deepEqual(categoryPublicationGate('MANUFACTURABLE_NOT_PROVEN', true), {
  public: true, navigation: false, products: false, sitemap: true, internalLinks: true, seoLandingPage: true, noindex: false,
})
assert.equal(CATEGORY_PUBLICATION_DECISIONS['team-accessories'].state, 'MANUFACTURABLE_NOT_PROVEN')
for (const slug of [
  'american-football', 'esports', 'golf', 'ice-hockey', 'rugby', 'running-marathon', 'tennis', 'volleyball',
]) assert.equal(CATEGORY_PUBLICATION_DECISIONS[slug].state, 'PLANNED')

assert.equal(PRODUCTION_PROOF_SLOTS.length, 9)
assert.ok(PRODUCTION_PROOF_SLOTS.every((slot) => slot.status === 'CONTENT_ASSET_REQUIRED'))
assert.deepEqual(PRODUCTION_PROOF_SLOTS.map((slot) => slot.label), [
  'Design / Artwork', 'Sublimation / Printing', 'Cutting', 'Sewing', 'Collar / Binding',
  'Measurement QC', 'Logo / Number QC', 'Packing', 'Shipment Preparation',
])

const certificate: EvidenceRecord = {
  id: 'certificate-1', evidenceType: 'CERTIFICATE', caption: 'Current certificate', processStage: 'Certification',
  relatedProducts: [], relatedSports: [], relatedProjects: [], relatedCapabilities: ['QC'], evidenceDate: '2026-08-19',
  verificationStatus: 'VERIFIED', internalNotes: 'Owner reviewed.', visibility: 'PUBLIC', publicUseApproved: true,
  certificate: {
    name: 'Example Standard', holder: 'Example Legal Entity', issuer: 'Example Issuer', certificateNumber: 'ABC-123',
    scope: 'Named product scope', issuedDate: '2026-01-01', expiryDate: '2099-01-01', fileUrl: 'https://cdn.example/certificate.pdf',
    offeringRelationship: 'Applies to the named POXIOL offering.',
  },
}
assert.equal(publicEvidence(certificate)?.id, 'certificate-1')
assert.equal(publicEvidence({...certificate, certificate: {...certificate.certificate!, holder: ''}}), undefined)
assert.equal(publicEvidence({...certificate, certificate: {...certificate.certificate!, expiryDate: '2020-01-01'}}), undefined)
assert.equal(publicEvidence({...certificate, relatedProjects: ['project-1'], authorizationStatus: 'UNKNOWN'}), undefined)
assert.equal(publicEvidence({...certificate, relatedProjects: ['project-1'], authorizationStatus: 'APPROVED'})?.id, 'certificate-1')
assert.equal(publicEvidenceFromSanity({
  _id: certificate.id,
  evidenceType: certificate.evidenceType,
  certificateName: certificate.certificate?.name,
  certificateHolder: certificate.certificate?.holder,
  certificateIssuer: certificate.certificate?.issuer,
  certificateNumber: certificate.certificate?.certificateNumber,
  certificateScope: certificate.certificate?.scope,
  certificateIssuedDate: certificate.certificate?.issuedDate,
  certificateExpiryDate: certificate.certificate?.expiryDate,
  certificateFileUrl: certificate.certificate?.fileUrl,
  offeringRelationship: certificate.certificate?.offeringRelationship,
  caption: certificate.caption,
  processStage: certificate.processStage,
  relatedProducts: [], relatedSports: [], relatedProjects: [], relatedCapabilities: ['QC'],
  evidenceDate: certificate.evidenceDate, verificationStatus: 'VERIFIED', visibility: 'PUBLIC', publicUseApproved: true,
})?.id, 'certificate-1')

const fixture: SnapshotDocument[] = [{
  _id: 'procurementStandards', _type: 'procurementStandards', _rev: 'rev-1',
  defaultMOQ: 'MOQ 1 Set', sampleProductionTime: '2-3 days', bulkProductionTime: '7-12 days',
  shippingNotes: 'Shipping 3-5 days', qualityPromise: '±2 cm, not a reason for returns', unknownField: 'preserve me',
}]
const plan = buildMigrationPlan(fixture, '2026-08-19T00:00:00.000Z')
assert.equal(plan.version, 'POXIOL_V9_1A')
assert.equal(plan.deleteCount, 0)
assert.deepEqual(plan.snapshot, {
  projectId: 'oqpv1xbc', dataset: 'production', capturedAt: '2026-08-19T00:00:00.000Z', documentCount: 1,
})
const patch = plan.patches[0]
assert.equal(patch.documentId, 'procurementStandards')
assert.equal(patch.documentType, 'procurementStandards')
assert.equal(patch.revision, 'rev-1')
assert.equal('unknownField' in patch.set, false)
for (const change of patch.changes) {
  assert.ok(change.fieldPath)
  assert.ok('before' in change)
  assert.ok('proposedAfter' in change)
  assert.ok(change.claimPolicy)
  assert.ok(change.reason)
  assert.ok(change.riskClassification)
}
assert.equal(
  patch.changes.find((change) => change.fieldPath === 'defaultMOQ')?.claimPolicy,
  'CLAIM_MOQ',
)
assert.equal(
  patch.changes.find((change) => change.fieldPath === 'shippingNotes')?.claimPolicy,
  'CLAIM_SHIPPING',
)
assert.equal(classifyMutationHttpResult(200), 'APPLIED')
assert.equal(classifyMutationHttpResult(409), 'REVISION_CONFLICT')
assert.equal(classifyMutationHttpResult(500), 'FAILED')

console.log('POXIOL V9.1A owner decision tests passed.')
