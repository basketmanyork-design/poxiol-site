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

export type CmsSiteChrome = {
  brandName: string
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

export type CmsImage = {
  url: string
  alt: string
}

export type CmsCta = {
  label: string
  href: string
}

export type CmsPageSection = {
  title: string
  eyebrow?: string
  body: string
  image?: CmsImage
  facts?: string[]
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
  description: string
  image?: CmsImage
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
  items: Array<{question: string; answer: string}>
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
  faqs: Array<{question: string; answer: string}>
  cta?: CmsCta
  sections: Array<{title: string; content: string | string[]}>
  seo: CmsSeo
  displayOrder: number
}
