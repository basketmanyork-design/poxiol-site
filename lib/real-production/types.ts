import type {V8PageId} from '../v8/types.ts'

export type ProductionVerificationStatus =
  | 'VERIFIED_POXIOL'
  | 'VERIFIED_BUYER_AUTHORIZED'
  | 'PRODUCT_ONLY_VERIFIED'
  | 'PRODUCT_VISUALIZATION'
  | 'REQUIRES_HUMAN_REVIEW'
  | 'REJECTED'

export type AuthorizationStatus = 'APPROVED' | 'NOT_APPLICABLE' | 'UNKNOWN' | 'REJECTED'

export type ProductionEvidenceContext = 'product' | 'sample' | 'mockup' | 'qc' | 'packing' | 'manufacturing' | 'factory' | 'buyer-project'

export type ProductionAssetCategory =
  | 'idea' | 'mockup' | 'front' | 'back' | 'shorts' | 'shorts-front' | 'shorts-back' | 'full-set' | 'fabric' | 'collar' | 'stitching'
  | 'print' | 'number' | 'waistband' | 'reversible' | 'sample-review' | 'measurement' | 'artwork-placement'
  | 'finished-garment' | 'individual-packaging' | 'grouped-order' | 'carton-preparation'
  | 'printing' | 'cutting' | 'sewing' | 'inspection' | 'packing' | 'factory-overview' | 'video'

export type RealProductionAsset = {
  assetId: string
  sampleId: string
  sourceId: string
  view: 'FRONT' | 'BACK' | 'FULL_SET' | 'SHORTS_FRONT' | 'SHORTS_BACK' | 'DETAIL' | 'VIDEO' | 'OTHER'
  completenessGrade: 'S' | 'A' | 'B' | 'C' | 'D' | 'UNPAIRED' | 'MANUAL_REVIEWED_COMPLETE'
  filename: string
  source: string
  photographerOrOwner: string
  productRelationship: string
  verificationStatus: ProductionVerificationStatus
  publicUseApproved: boolean
  peopleVisible: boolean
  peopleAuthorization: AuthorizationStatus
  thirdPartyLogoVisible: boolean
  thirdPartyLogoAuthorization: AuthorizationStatus
  customerArtworkVisible: boolean
  customerArtworkAuthorization: AuthorizationStatus
  privateInformationVisible: boolean
  buyerAuthorization?: AuthorizationStatus
  sport: string
  category: ProductionAssetCategory
  evidenceContext?: ProductionEvidenceContext
  alt: string
  caption: string
  intendedPages: V8PageId[]
  verificationNote: string
  verifiedAt: string
  verifiedBy: string
  publicPath: string
  width: number
  height: number
  mediaType?: 'image' | 'video'
  posterPath?: string
  transformation?: string
}

export type RealProductionManifest = {version: 1; assets: RealProductionAsset[]}
