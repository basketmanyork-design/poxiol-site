import ledger from '../../content/governance/claim-ledger.json' with {type: 'json'}

export type ApprovedClaimId =
  | 'inquiry-information-purpose'
  | 'order-quantity-confirmation'
  | 'sublimation-comparison'
  | 'fabric-review'
  | 'decoration-placement-review'
  | 'packaging-review'
  | 'private-label-review'

type ClaimRecord = {
  id: string
  approvedWording: string
  ownerApproval: {status: string}
}

const approvedClaims = new Map(
  (ledger.claims as ClaimRecord[])
    .filter((claim) => claim.ownerApproval.status === 'APPROVED')
    .map((claim) => [claim.id, claim.approvedWording] as const),
)

export function getApprovedClaimWording(id: ApprovedClaimId): string {
  const wording = approvedClaims.get(id)
  if (!wording) throw new Error(`Approved claim not found: ${id}`)
  return wording
}
