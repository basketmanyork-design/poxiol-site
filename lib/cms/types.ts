import type {CmsPortableTextNode} from './portableText'

export type CmsMode = 'legacy' | 'sanity-preview' | 'sanity'

export type CmsLink = {
  label: string
  href: string
  openInNewWindow?: boolean
}

export type CmsFooterColumn = {
  title: string
  links: CmsLink[]
}

export type CmsImage = {
  url: string
  alt: string
  caption?: string
  usageNotes?: string
}

export type CmsVerifiedMediaAsset = {
  kind: 'image' | 'video'
  stage: string
  url: string
  alt?: string
  caption?: string
  verified: true
}

export type CmsProductionMediaSet = {
  fabricInspection?: CmsVerifiedMediaAsset
  printing?: CmsVerifiedMediaAsset
  cutting?: CmsVerifiedMediaAsset
  sewing?: CmsVerifiedMediaAsset
  qc?: CmsVerifiedMediaAsset
  packing?: CmsVerifiedMediaAsset
  factoryOverviewVideo?: CmsVerifiedMediaAsset
  productionWorkflowVideo?: CmsVerifiedMediaAsset
  qualityInspectionVideo?: CmsVerifiedMediaAsset
}

export type CmsSiteChrome = {
  brandName: string
  logo?: CmsImage
  siteUrl: string
  publicEmail: string
  salesEmail?: string
  whatsappNumber: string
  whatsappHref: string
  whatsappMessage: string
  alibabaStoreUrl?: string
  headerNavigation: CmsLink[]
  footerColumns: CmsFooterColumn[]
  copyright: string
  address?: string
}

export type CmsSeo = {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: CmsImage
  focusKeyword?: string
  secondaryKeywords?: string[]
  ogTitle?: string
  ogDescription?: string
  noIndex?: boolean
  nofollow?: boolean
  schemaType?: string
}

export type CmsCta = {
  label: string
  href: string
}

export type CmsPageSectionType =
  | 'hero'
  | 'intro'
  | 'richText'
  | 'imageText'
  | 'stats'
  | 'productGrid'
  | 'featureGrid'
  | 'evidenceGrid'
  | 'processSteps'
  | 'specificationsTable'
  | 'comparisonTable'
  | 'buyerChecklist'
  | 'factoryEvidence'
  | 'qcProcess'
  | 'caseStudies'
  | 'gallery'
  | 'faq'
  | 'cta'

export type CmsStat = {label: string; value: string}
export type CmsStep = {title: string; description: string}
export type CmsSpec = {label: string; value: string}
export type CmsFaqItem = {question: string; answer: string}

export type CmsPageSection = {
  type?: CmsPageSectionType
  title: string
  eyebrow?: string
  body?: string
  enabled?: boolean
  displayOrder?: number
  image?: CmsImage
  productionMedia?: CmsProductionMediaSet
  facts?: string[]
  productSlugs?: string[]
  categorySlugs?: string[]
  caseStudySlugs?: string[]
  stats?: CmsStat[]
  steps?: CmsStep[]
  specifications?: CmsSpec[]
  gallery?: CmsImage[]
  faqs?: CmsFaqItem[]
  cta?: CmsCta
}

export type CmsPage = {
  key: string
  slug: string
  title: string
  eyebrow: string
  heading: string
  description: string
  image?: CmsImage
  productionMedia?: CmsProductionMediaSet
  heroCta?: CmsCta
  sections: CmsPageSection[]
  bottomCta?: CmsCta
  seo: CmsSeo
}

export type CmsProductCategory = {
  slug: string
  title: string
  shortName?: string
  description: string
  fullDescription?: string
  image: CmsImage
  buyerTypes?: string[]
  targetMarkets?: string[]
  productTypes?: string[]
  coreBenefits?: string[]
  relatedFaqs?: CmsFaqItem[]
  relatedCaseStudies?: CmsLink[]
  relatedGuides?: CmsLink[]
  navigationVisibility?: boolean
  homepageVisibility?: boolean
  seo: CmsSeo
  displayOrder: number
  active: boolean
}

export type CmsProduct = {
  slug: string
  title: string
  productCode?: string
  categorySlug?: string
  categoryTitle?: string
  description: string
  fullDescription?: string
  image?: CmsImage
  detailImages: CmsImage[]
  productionImages: CmsImage[]
  qcImages: CmsImage[]
  packagingImages: CmsImage[]
  gallery?: CmsImage[]
  keyBenefits?: string[]
  fabricOptions: string[]
  fabric?: string
  composition?: string
  gsm?: string
  printing?: string
  customizationOptions: string[]
  customizationAreas?: string[]
  sizeRange?: string
  packaging?: string
  oem?: boolean
  privateLabel?: boolean
  procurementOverride?: {
    moq?: string
    sampleTime?: string
    reason?: string
  }
  relatedProducts?: CmsLink[]
  relatedCases?: CmsLink[]
  relatedGuides?: CmsLink[]
  relatedFaqs: CmsFaqItem[]
  cta?: CmsCta
  featured: boolean
  seo: CmsSeo
  displayOrder: number
  active: boolean
}

export type CmsProject = {
  slug: string
  title: string
  country: string
  product: string
  caseType?: string
  realOrExample?: 'real' | 'anonymized' | 'example'
  buyerType?: string
  region?: string
  quantityDisplay?: string
  projectTimeline?: string
  image?: CmsImage
  images?: CmsImage[]
  qualityControl: string
  packaging: string
  solution: string
  overview: string
  challenge?: string
  requirements?: string[]
  materials?: string
  customization?: string
  sampleProcess?: string
  production?: string
  delivery?: string
  result?: string
  testimonial?: string
  evidenceStatus?: string
  buyerAuthorizationStatus?: 'publicApproved' | 'internalOnly' | 'notApproved' | 'unknown'
  approvedImageStatus?: 'approved' | 'pending' | 'notAvailable'
  evidenceNote?: string
  verifiedProcess?: string[]
  verifiableResultStatement?: string
  seo: CmsSeo
  displayOrder: number
}

export type CmsFaqGroup = {
  category: string
  items: CmsFaqItem[]
}

export type CmsArticle = {
  slug: string
  title: string
  excerpt: string
  intro: string
  eyebrow: string
  featuredImage?: CmsImage
  imageStatus?: string
  body: string
  bodyBlocks?: CmsPortableTextNode[]
  articleType: 'blog' | 'guide' | 'resource'
  author?: string
  reviewedBy?: string
  methodology?: string
  references: string[]
  publishedAt?: string
  updatedAt?: string
  relatedProducts: CmsLink[]
  relatedCategories: CmsLink[]
  relatedCaseStudies: CmsLink[]
  relatedArticles: CmsLink[]
  faqs: CmsFaqItem[]
  cta?: CmsCta
  secondaryCta?: CmsCta
  sections: Array<{title: string; content: string | string[]}>
  seo: CmsSeo
  displayOrder: number
}

export type CmsHomeCategory = {
  title: string
  description: string
  cta: string
  href: string
  image: CmsImage
}

export type CmsHomeContent = {
  brandName: string
  siteUrl: string
  productionMedia?: CmsProductionMediaSet
  heroEyebrow: string
  heroHeading: string
  heroDescription: string
  heroImage: CmsImage
  heroPrimaryCta: CmsCta
  heroSecondaryCta: CmsCta
  trustChips: string[]
  trustSections: CmsPageSection[]
  sourcingRows: Array<{item: string; capability: string}>
  sectionHeadings: {
    sourcing: {eyebrow: string; title: string; subtitle?: string}
    usp: {eyebrow: string; title: string; subtitle?: string}
    matrix: {eyebrow: string; title: string}
    faq: {eyebrow: string; title: string}
  }
  uspCards: Array<{metric: string; title: string; description: string; label?: string}>
  categories: CmsHomeCategory[]
  inquiryTitle: string
  inquiryDescription: string
  inquirySupportTitle: string
  inquirySupportDescription: string
  faqs: CmsFaqItem[]
  bottomCta?: CmsCta
  seo: CmsSeo
}
