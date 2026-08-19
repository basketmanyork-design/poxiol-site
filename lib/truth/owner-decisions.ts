import type {ClaimStatus} from './claim-policy.ts'
import {
  MANUFACTURING_PARTNER,
  MEASUREMENT_TOLERANCE_REVIEW,
  ORDER_QUANTITY_CONFIRMED,
  SHIPPING_TIMING_CONFIRMED,
  TIMELINE_CONFIRMED,
} from './public-copy.ts'

export const OWNER_DECISION_STATUSES = [
  'OWNER_CONFIRMED_RESTRICTION',
  'OWNER_CONFIRMED_CONDITIONAL',
  'OWNER_CONFIRMED_OPERATIONAL_TARGET',
  'OWNER_CONFIRMED_SEPARATION_REQUIRED',
  'OWNER_CONFIRMED_VERIFICATION_REQUIRED',
  'OWNER_CONFIRMED_CLASSIFICATION',
] as const

export type OwnerDecisionStatus = (typeof OWNER_DECISION_STATUSES)[number]

export const OWNER_CLAIM_POLICY_IDS = [
  'CLAIM_FACTORY_RELATIONSHIP',
  'CLAIM_MOQ',
  'CLAIM_TIMELINE',
  'CLAIM_SHIPPING',
  'CLAIM_SIZE_TOLERANCE',
  'CLAIM_CERTIFICATION',
  'CLAIM_PROJECT_AUTHENTICITY',
] as const

export type OwnerClaimPolicyId = (typeof OWNER_CLAIM_POLICY_IDS)[number]

export type OwnerDecision = {
  id: OwnerClaimPolicyId
  decisionStatus: OwnerDecisionStatus
  truthStatus: ClaimStatus
  publicDefault?: string
  publicAlternatives?: readonly string[]
  publicRule: string
  reason: string
  riskClassification: string
  returnPolicyStatus?: 'POLICY_REVIEW_REQUIRED'
}

export const OWNER_DECISIONS: Readonly<Record<OwnerClaimPolicyId, OwnerDecision>> = {
  CLAIM_FACTORY_RELATIONSHIP: {
    id: 'CLAIM_FACTORY_RELATIONSHIP',
    decisionStatus: 'OWNER_CONFIRMED_RESTRICTION',
    truthStatus: 'CONDITIONAL',
    publicDefault: MANUFACTURING_PARTNER,
    publicAlternatives: ['Teamwear Manufacturing Partner'],
    publicRule: 'Do not publish Factory Direct unless the legal, manufacturing and website operating relationship is fully evidenced.',
    reason: 'The owner restricted factory-relationship wording until entity and facility evidence exists.',
    riskClassification: 'ENTITY_RELATIONSHIP_CLAIM',
  },
  CLAIM_MOQ: {
    id: 'CLAIM_MOQ',
    decisionStatus: 'OWNER_CONFIRMED_CONDITIONAL',
    truthStatus: 'CONDITIONAL',
    publicDefault: ORDER_QUANTITY_CONFIRMED,
    publicRule: 'Publish only product-, material-, process- or project-specific quantities when confirmed.',
    reason: 'A universal one-set MOQ is not an approved site-wide commitment.',
    riskClassification: 'COMMERCIAL_COMMITMENT',
  },
  CLAIM_TIMELINE: {
    id: 'CLAIM_TIMELINE',
    decisionStatus: 'OWNER_CONFIRMED_OPERATIONAL_TARGET',
    truthStatus: 'OPERATIONAL_TARGET',
    publicDefault: TIMELINE_CONFIRMED,
    publicRule: 'Keep numeric mockup, sample and bulk timing internal unless separately verified; never publish it as a guarantee.',
    reason: 'Numeric turnaround values are operating targets, not unconditional public promises.',
    riskClassification: 'DELIVERY_COMMITMENT',
  },
  CLAIM_SHIPPING: {
    id: 'CLAIM_SHIPPING',
    decisionStatus: 'OWNER_CONFIRMED_CONDITIONAL',
    truthStatus: 'CONDITIONAL',
    publicDefault: SHIPPING_TIMING_CONFIRMED,
    publicRule: 'Confirm options and transit time from destination, method and order requirements; publish no global fixed duration.',
    reason: 'Shipping timing depends on lane, method and order conditions.',
    riskClassification: 'SHIPPING_COMMITMENT',
  },
  CLAIM_SIZE_TOLERANCE: {
    id: 'CLAIM_SIZE_TOLERANCE',
    decisionStatus: 'OWNER_CONFIRMED_SEPARATION_REQUIRED',
    truthStatus: 'CONDITIONAL',
    publicDefault: MEASUREMENT_TOLERANCE_REVIEW,
    publicRule: 'A manufacturing tolerance never creates an automatic return or claim exclusion.',
    reason: 'The approved basketball size-chart tolerance must remain separate from returns policy.',
    riskClassification: 'POLICY_SEPARATION',
    returnPolicyStatus: 'POLICY_REVIEW_REQUIRED',
  },
  CLAIM_CERTIFICATION: {
    id: 'CLAIM_CERTIFICATION',
    decisionStatus: 'OWNER_CONFIRMED_VERIFICATION_REQUIRED',
    truthStatus: 'UNVERIFIED',
    publicRule: 'Publish only when holder, name, scope, number or document, issuer, validity and offering relationship are all verified.',
    reason: 'An image or filename alone does not prove a current, in-scope certificate.',
    riskClassification: 'CERTIFICATION_CLAIM',
  },
  CLAIM_PROJECT_AUTHENTICITY: {
    id: 'CLAIM_PROJECT_AUTHENTICITY',
    decisionStatus: 'OWNER_CONFIRMED_CLASSIFICATION',
    truthStatus: 'UNVERIFIED',
    publicRule: 'Use the approved authenticity class and buyer authorization; unverified projects are not public evidence.',
    reason: 'Project truth and publication permission must be explicit rather than inferred from media.',
    riskClassification: 'PROJECT_AUTHENTICITY',
  },
}

export const PROJECT_AUTHENTICITY_CLASSES = [
  'VERIFIED_REAL_PROJECT',
  'BUYER_AUTHORIZED_PROJECT',
  'INTERNAL_SAMPLE',
  'DEMO',
  'SCENARIO',
  'UNVERIFIED',
] as const

export type ProjectAuthenticityClass = (typeof PROJECT_AUTHENTICITY_CLASSES)[number]

export function projectPublicationDecision(classification: ProjectAuthenticityClass, buyerAuthorizationApproved = false): {public: boolean; requiredLabel?: string} {
  if (classification === 'UNVERIFIED') return {public: false}
  if (classification === 'BUYER_AUTHORIZED_PROJECT') return {public: buyerAuthorizationApproved}
  if (classification === 'INTERNAL_SAMPLE') return {public: true, requiredLabel: 'Development Sample'}
  if (classification === 'DEMO') return {public: true, requiredLabel: 'Demo'}
  if (classification === 'SCENARIO') return {public: true, requiredLabel: 'Example Project Scenario'}
  return {public: true}
}

export const OWNER_POLICY_BY_LEGACY_KIND: Readonly<Record<string, OwnerClaimPolicyId>> = {
  FACTORY_DIRECT: 'CLAIM_FACTORY_RELATIONSHIP',
  MOQ: 'CLAIM_MOQ',
  MOCKUP_TIMING: 'CLAIM_TIMELINE',
  SAMPLE_TIMING: 'CLAIM_TIMELINE',
  PRODUCTION_TIMING: 'CLAIM_TIMELINE',
  FIXED_TIMELINE: 'CLAIM_TIMELINE',
  SHIPPING_TIMING: 'CLAIM_SHIPPING',
  TOLERANCE_RETURN_POLICY: 'CLAIM_SIZE_TOLERANCE',
  CERTIFICATION: 'CLAIM_CERTIFICATION',
  PROJECT_AUTHENTICITY: 'CLAIM_PROJECT_AUTHENTICITY',
  PROJECT_CLASSIFICATION: 'CLAIM_PROJECT_AUTHENTICITY',
}

export function ownerPolicyIdForLegacyKind(kind: string): OwnerClaimPolicyId | `CLAIM_${string}` {
  return OWNER_POLICY_BY_LEGACY_KIND[kind] || `CLAIM_${kind}`
}
