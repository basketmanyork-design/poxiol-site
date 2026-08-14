import type {RealProductionAsset} from './types.ts'

const PUBLIC_STATUSES = new Set(['VERIFIED_POXIOL', 'VERIFIED_BUYER_AUTHORIZED', 'PRODUCT_ONLY_VERIFIED'])
const PROMOTIONAL_COPY = /\b(high quality|premium factory|best manufacturer|professional production|strictest|guaranteed)\b/i
const FACTORY_CONTEXTS = new Set(['factory', 'manufacturing', 'buyer-project'])

export function publicationIssues(asset: RealProductionAsset): string[] {
  const issues: string[] = []
  if (!PUBLIC_STATUSES.has(asset.verificationStatus)) issues.push('verification-status')
  if (!asset.sampleId.trim() || !asset.sourceId.trim()) issues.push('source-record')
  if (!asset.publicUseApproved) issues.push('public-use-approval')
  if (!asset.source.trim()) issues.push('source')
  if (!asset.photographerOrOwner.trim()) issues.push('owner')
  if (!asset.productRelationship.trim()) issues.push('product-relationship')
  if (!asset.verificationNote.trim() || !asset.verifiedAt.trim() || !asset.verifiedBy.trim()) issues.push('verification-record')
  if (!asset.publicPath.startsWith('/real-production/') || !asset.width || !asset.height) issues.push('public-file')
  if (!asset.alt.trim() || asset.alt.trim().length < 12 || PROMOTIONAL_COPY.test(asset.alt)) issues.push('alt')
  if (!asset.caption.trim() || PROMOTIONAL_COPY.test(asset.caption)) issues.push('caption')
  if (asset.privateInformationVisible) issues.push('private-information')
  if (asset.peopleVisible && asset.peopleAuthorization !== 'APPROVED') issues.push('people-authorization')
  if (asset.thirdPartyLogoVisible && asset.thirdPartyLogoAuthorization !== 'APPROVED') issues.push('third-party-logo')
  if (asset.customerArtworkVisible && asset.customerArtworkAuthorization !== 'APPROVED') issues.push('customer-artwork')
  if (asset.verificationStatus === 'VERIFIED_BUYER_AUTHORIZED' && asset.buyerAuthorization !== 'APPROVED') issues.push('buyer-authorization')
  if (asset.verificationStatus === 'PRODUCT_ONLY_VERIFIED' && FACTORY_CONTEXTS.has(asset.evidenceContext || 'product')) issues.push('product-only-context')
  if (asset.mediaType === 'video' && !asset.posterPath?.startsWith('/')) issues.push('video-poster')
  return Array.from(new Set(issues))
}

export function canPublishProductionAsset(asset: RealProductionAsset): boolean {
  return publicationIssues(asset).length === 0
}
