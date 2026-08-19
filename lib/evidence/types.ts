export const EVIDENCE_VERIFICATION_STATUSES = ['VERIFIED', 'PENDING', 'INTERNAL_ONLY', 'REJECTED'] as const
export type EvidenceVerificationStatus = (typeof EVIDENCE_VERIFICATION_STATUSES)[number]

export const EVIDENCE_CAPABILITIES = [
  'Design', 'Artwork', 'Sublimation', 'Printing', 'Cutting', 'Sewing', 'Collar', 'Binding',
  'Fabric', 'Label', 'Measurement', 'Logo Placement', 'Name & Number', 'Color Check', 'QC',
  'Packing', 'Shipment Preparation',
] as const
export type EvidenceCapability = (typeof EVIDENCE_CAPABILITIES)[number]

export type EvidenceRecord = {
  id: string
  evidenceType: 'IMAGE' | 'VIDEO' | 'CERTIFICATE'
  image?: {url: string; alt: string}
  video?: {url: string; posterUrl: string}
  certificate?: {
    name: string
    holder: string
    issuer: string
    certificateNumber: string
    scope: string
    issuedDate: string
    expiryDate: string
    fileUrl: string
    offeringRelationship: string
  }
  caption: string
  processStage: string
  relatedProducts: string[]
  relatedSports: string[]
  relatedProjects: string[]
  sampleId?: string
  authorizationStatus?: 'APPROVED' | 'RESTRICTED' | 'UNKNOWN'
  relatedCapabilities: EvidenceCapability[]
  evidenceDate: string
  verificationStatus: EvidenceVerificationStatus
  internalNotes: string
  visibility: 'PUBLIC' | 'PRIVATE'
  publicUseApproved: boolean
}
