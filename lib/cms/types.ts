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
  noIndex?: boolean
}

export type CmsCta = {
  label: string
  href: string
}

export type CmsPageSectionType =
  | 'richText'
  | 'imageText'
  | 'stats'
  | 'evidenceGrid'
  | 'processSteps'
  | 'specificationsTable'
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
  image?: CmsImage
  facts?: string[]
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
  image: CmsImage
  seo: CmsSeo
  displayOrder: number
  active: boolean
}

export type CmsProduct = {
  slug: string
  title: string
  categorySlug?: string
  categoryTitle?: string
  description: string
  fullDescription?: string
  image?: CmsImage
  detailImages: CmsImage[]
  productionImages: CmsImage[]
  qcImages: CmsImage[]
  packagingImages: CmsImage[]
  fabricOptions: string[]
  customizationOptions: string[]
  procurementOverride?: {
    moq?: string
    sampleTime?: string
    reason?: string
  }
  relatedFaqs: CmsFaqItem[]
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
  image: CmsImage
  qualityControl: string
  packaging: string
  solution: string
  overview: string
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
  body: string
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
  heroEyebrow: string
  heroHeading: string
  heroDescription: string
  heroImage: CmsImage
  heroPrimaryCta: CmsCta
  heroSecondaryCta: CmsCta
  trustChips: string[]
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