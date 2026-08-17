import type {EvidenceRecord} from './types.ts'

function hasText(value?: string): boolean {
  return Boolean(value?.trim())
}
export function publicEvidence(record?: EvidenceRecord): EvidenceRecord | undefined {
  if (!record) return undefined
  if (record.verificationStatus !== 'VERIFIED' || record.visibility !== 'PUBLIC' || !record.publicUseApproved) return undefined
  if (!hasText(record.id) || !hasText(record.caption) || !hasText(record.processStage) || !hasText(record.evidenceDate)) return undefined
  if (!record.relatedCapabilities.length) return undefined
  if (record.evidenceType === 'IMAGE' && (!hasText(record.image?.url) || !hasText(record.image?.alt))) return undefined
  if (record.evidenceType === 'VIDEO' && (!hasText(record.video?.url) || !hasText(record.video?.posterUrl))) return undefined
  return record
}
