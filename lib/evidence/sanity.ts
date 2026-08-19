import {publicEvidence} from './policy.ts'
import {
  EVIDENCE_CAPABILITIES,
  EVIDENCE_VERIFICATION_STATUSES,
  type EvidenceCapability,
  type EvidenceRecord,
  type EvidenceVerificationStatus,
} from './types.ts'

export type SanityEvidenceRecord = {
  _id?: string
  evidenceType?: string
  imageUrl?: string
  imageAlt?: string
  videoUrl?: string
  videoPosterUrl?: string
  certificateName?: string
  certificateHolder?: string
  certificateIssuer?: string
  certificateNumber?: string
  certificateScope?: string
  certificateIssuedDate?: string
  certificateExpiryDate?: string
  certificateFileUrl?: string
  offeringRelationship?: string
  caption?: string
  processStage?: string
  relatedProducts?: string[]
  relatedSports?: string[]
  relatedProjects?: string[]
  sampleId?: string
  authorizationStatus?: 'APPROVED' | 'RESTRICTED' | 'UNKNOWN'
  relatedCapabilities?: string[]
  evidenceDate?: string
  verificationStatus?: string
  internalNotes?: string
  visibility?: string
  publicUseApproved?: boolean
}

const capabilitySet = new Set<string>(EVIDENCE_CAPABILITIES)
const verificationSet = new Set<string>(EVIDENCE_VERIFICATION_STATUSES)

export function publicEvidenceFromSanity(source?: SanityEvidenceRecord): EvidenceRecord | undefined {
  if (!source?._id || !source.evidenceType || !source.verificationStatus || !source.visibility) return undefined
  if (source.evidenceType !== 'IMAGE' && source.evidenceType !== 'VIDEO' && source.evidenceType !== 'CERTIFICATE') return undefined
  if (!verificationSet.has(source.verificationStatus)) return undefined
  if (source.visibility !== 'PUBLIC' && source.visibility !== 'PRIVATE') return undefined

  const record: EvidenceRecord = {
    id: source._id,
    evidenceType: source.evidenceType,
    ...(source.imageUrl || source.imageAlt ? {image: {url: source.imageUrl || '', alt: source.imageAlt || ''}} : {}),
    ...(source.videoUrl || source.videoPosterUrl ? {video: {url: source.videoUrl || '', posterUrl: source.videoPosterUrl || ''}} : {}),
    ...(source.evidenceType === 'CERTIFICATE' ? {certificate: {
      name: source.certificateName || '', holder: source.certificateHolder || '', issuer: source.certificateIssuer || '',
      certificateNumber: source.certificateNumber || '', scope: source.certificateScope || '',
      issuedDate: source.certificateIssuedDate || '', expiryDate: source.certificateExpiryDate || '',
      fileUrl: source.certificateFileUrl || '', offeringRelationship: source.offeringRelationship || '',
    }} : {}),
    caption: source.caption || '',
    processStage: source.processStage || '',
    relatedProducts: source.relatedProducts || [],
    relatedSports: source.relatedSports || [],
    relatedProjects: source.relatedProjects || [],
    sampleId: source.sampleId,
    authorizationStatus: source.authorizationStatus,
    relatedCapabilities: (source.relatedCapabilities || []).filter((item): item is EvidenceCapability => capabilitySet.has(item)),
    evidenceDate: source.evidenceDate || '',
    verificationStatus: source.verificationStatus as EvidenceVerificationStatus,
    internalNotes: source.internalNotes || '',
    visibility: source.visibility,
    publicUseApproved: source.publicUseApproved === true,
  }
  return publicEvidence(record)
}
