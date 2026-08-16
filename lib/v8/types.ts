export type V8BuyerId = 'youth-teams' | 'schools' | 'clubs' | 'sports-brands' | 'distributors'

export type V8PageId =
  | 'home'
  | 'basketball'
  | 'soccer'
  | 'baseball'
  | 'youth-team-uniforms'
  | 'school-teamwear'
  | 'private-label-teamwear'
  | 'club-teamwear-program'
  | 'customization'
  | 'factory'
  | 'manufacturing'
  | 'quality-control'

export type V8CtaId = 'free-mockup' | 'start-project' | 'start-design' | 'get-quote' | 'request-sample'

export type V8MediaStage =
  | 'fabric-inspection'
  | 'printing'
  | 'cutting'
  | 'sewing'
  | 'qc'
  | 'packing'
  | 'factory-overview-video'
  | 'production-workflow-video'
  | 'quality-inspection-video'
  | 'idea'
  | 'mockup'
  | 'front'
  | 'back'
  | 'shorts'
  | 'shorts-front'
  | 'shorts-back'
  | 'full-set'
  | 'fabric'
  | 'collar'
  | 'stitching'
  | 'print'
  | 'number'
  | 'waistband'
  | 'reversible'
  | 'sample-review'
  | 'measurement'
  | 'artwork-placement'
  | 'finished-garment'
  | 'individual-packaging'
  | 'grouped-order'
  | 'carton-preparation'
  | 'inspection'
  | 'factory-overview'

export type V8Buyer = {
  id: V8BuyerId
  title: string
  description: string
  href?: string
}

export type V8ProcessStep = {
  id: string
  title: string
  description: string
}

export type V8ContentCard = {
  id: string
  title: string
  description: string
  audience?: string
  href?: string
  ctaLabel?: string
}

export type V8Cta = {
  id: V8CtaId
  label: string
  href: string
  description: string
}

export type V8MediaAsset = {
  id: string
  kind: 'image' | 'video'
  stage: V8MediaStage
  url: string
  alt?: string
  caption?: string
  verified: boolean
  verificationNote?: string
  width?: number
  height?: number
  poster?: string
}

export type V8MediaSlot = {
  id: V8MediaStage
  label: string
  kind: 'image' | 'video'
}

export type V8FaqItem = {
  id: string
  question: string
  answer: string
  pageIds: readonly V8PageId[]
  buyerIds?: readonly V8BuyerId[]
}

export type V8HeroConfig = {
  eyebrow: string
  title: string
  description: string
  primaryCtaId: V8CtaId
  secondaryCtaId?: V8CtaId
}

export type V8PageConfig = {
  id: V8PageId
  label: string
  canonicalPath: string
  purpose: string
  primaryKeyword?: string
  hero: V8HeroConfig
  buyerIds: readonly V8BuyerId[]
  problemIds: readonly string[]
  solutionIds: readonly string[]
}

export type V8AuthorityLink = V8ContentCard & {
  href: string
}

export type V8BuyerPageContent = {
  pageId: Extract<V8PageId, 'youth-team-uniforms' | 'school-teamwear' | 'private-label-teamwear' | 'club-teamwear-program'>
  label: string
  canonicalPath: string
  purpose: string
  seoTitle: string
  seoDescription: string
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  heroPrimaryCtaId: V8CtaId
  heroSecondaryCtaId?: V8CtaId
  buyerIds: readonly V8BuyerId[]
  problems: readonly V8ContentCard[]
  solutions: readonly V8ContentCard[]
  authorityLinks: readonly V8AuthorityLink[]
  faqs: readonly V8FaqItem[]
  finalCta: V8Cta
}
