import type {EvidenceRecord} from './types.ts'

function hasText(value?: string): boolean {
  return Boolean(value?.trim())
}

function completeCertificate(record: EvidenceRecord): boolean {
  const certificate = record.certificate
  if (!certificate || ![
    certificate.name,
    certificate.holder,
    certificate.issuer,
    certificate.certificateNumber,
    certificate.scope,
    certificate.issuedDate,
    certificate.expiryDate,
    certificate.fileUrl,
    certificate.offeringRelationship,
  ].every(hasText)) return false
  const issued = Date.parse(`${certificate.issuedDate}T00:00:00Z`)
  const expiry = Date.parse(`${certificate.expiryDate}T23:59:59Z`)
  if (!Number.isFinite(issued) || !Number.isFinite(expiry) || issued > expiry || expiry < Date.now()) return false
  return /^https:\/\//i.test(certificate.fileUrl)
}

export function publicEvidence(record?: EvidenceRecord): EvidenceRecord | undefined {
  if (!record) return undefined
  if (record.verificationStatus !== 'VERIFIED' || record.visibility !== 'PUBLIC' || !record.publicUseApproved) return undefined
  if (!hasText(record.id) || !hasText(record.caption) || !hasText(record.processStage) || !hasText(record.evidenceDate)) return undefined
  if (!record.relatedCapabilities.length) return undefined
  if (record.evidenceType === 'IMAGE' && (!hasText(record.image?.url) || !hasText(record.image?.alt))) return undefined
  if (record.evidenceType === 'VIDEO' && (!hasText(record.video?.url) || !hasText(record.video?.posterUrl))) return undefined
  if (record.evidenceType === 'CERTIFICATE' && !completeCertificate(record)) return undefined
  if (record.relatedProjects.length && record.authorizationStatus !== 'APPROVED') return undefined
  return record
}
