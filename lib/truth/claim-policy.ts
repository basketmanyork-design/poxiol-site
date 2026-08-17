export const CLAIM_STATUSES = [
  'VERIFIED',
  'CONDITIONAL',
  'OPERATIONAL_TARGET',
  'UNVERIFIED',
  'PLACEHOLDER',
  'OWNER_CONFIRMATION_REQUIRED',
] as const

export type ClaimStatus = (typeof CLAIM_STATUSES)[number]

export type PublicClaimPolicy = {
  status: ClaimStatus
  publicValue?: string
  replacement?: string
  legacyValue?: string
  evidence?: string
  publicRule: string
  reviewedAt?: string
  reviewedBy?: string
  internalNotes?: string
}
const DIRECT_PUBLIC_STATUSES = new Set<ClaimStatus>(['VERIFIED', 'CONDITIONAL'])

export function publicClaimValue(policy?: PublicClaimPolicy): string | undefined {
  if (!policy) return undefined
  const candidate = DIRECT_PUBLIC_STATUSES.has(policy.status) ? policy.publicValue : policy.replacement
  const value = candidate?.trim()
  return value || undefined
}
