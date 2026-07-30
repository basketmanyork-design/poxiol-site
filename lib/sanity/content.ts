import 'server-only'

import {sportsPages, type SportsPageData} from '@/lib/sports-pages'
import {sportsCategories, uspCards, homeFaqs} from '@/lib/home-data'
import {
  legacyArticles,
  legacyFaqGroups,
  legacyPages,
  legacyProductCategories,
  legacyProducts,
  legacyProjects,
  legacySiteChrome,
} from '@/lib/cms/legacy'
import type {
  CmsArticle,
  CmsCta,
  CmsFaqGroup,
  CmsFaqItem,
  CmsHomeContent,
  CmsHomeCategory,
  CmsImage,
  CmsLink,
  CmsPage,
  CmsPageSection,
  CmsPageSectionType,
  CmsProduct,
  CmsProductCategory,
  CmsProject,
  CmsSeo,
  CmsSiteChrome,
} from '@/lib/cms/types'
import type {CmsPortableTextNode} from '@/lib/cms/portableText'
import {contentSource, sanityQuery} from './client'
import {isDocumentVisible} from '@/lib/cms/visibility'
import {getCmsListMode, mergeCmsList, resolveSingle, type SourceState} from '@/lib/cms/listMode'
import {resolveProductsForCategoryVisibility} from '@/lib/cms/category-visibility'
import {resolveContent} from './fallback'
import {cardImageUrl, getImageUrl, heroImageUrl} from './image'
import {
  articleBySlugQuery,
  articlesQuery,
  caseStudiesQuery,
  caseStudyBySlugQuery,
  faqItemsQuery,
  footerQuery,
  navigationQuery,
  procurementStandardsQuery,
  productBySlugQuery,
  productCategoriesQuery,
  productCategoryBySlugQuery,
  productsByCategoryQuery,
  productsQuery,
  sitePageByKeyQuery,
  siteSettingsQuery,
} from './queries'

type PortableTextChild = {text?: string}
type PortableTextBlock = {style?: string; children?: PortableTextChild[]}
type SanityImage = {asset?: {_ref?: string}; altText?: string; url?: string}
type Seo = {seoTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImage?: SanityImage; indexStatus?: string}
type SanityCta = {label?: string; url?: string; href?: string}
type SanityLink = {label?: string; externalUrl?: string; url?: string; href?: string; openInNewWindow?: boolean}

type SanitySiteSettings = {
  brandName?: string
  logo?: SanityImage
  siteUrl?: string
  contactInfo?: {
    publicEmail?: string
    salesEmail?: string
    whatsappNumber?: string
    whatsappMessage?: string
    alibabaStoreUrl?: string
    companyAddress?: string
  }
  footer?: {copyright?: string; address?: string}
  globalSeo?: Seo
}

type SanityNav = {headerNavigation?: SanityLink[]}
type SanityFooter = {footerColumns?: Array<{title?: string; links?: SanityLink[]}>; copyright?: string}

type SanityProcurementStandards = {
  defaultMOQ?: string
  sampleMOQ?: string
  sampleTime?: string
  sampleProductionTime?: string
  bulkProductionTime?: string
  bulkProductionNote?: string
  mockupTime?: string
  shippingNotes?: string
  qualityPromise?: string
  qcStandard?: string
  sizeTolerance?: string
  mixedSizes?: string
}

const HOMEPAGE_PRODUCTION_TIME_QUESTION = 'What is the standard production time for team orders?'
const HOMEPAGE_PRODUCTION_TIME_ANSWER = 'Sample production usually takes 2-3 working days after mockup approval. Bulk production usually takes 7-12 working days after sample or artwork approval. Large, complex or peak-season orders require a confirmed production schedule.'
const STANDARD_SAMPLE_MOQ = 'Sample MOQ: 1 set.'
const STANDARD_SAMPLE_PRODUCTION = 'Sample production: 2-3 working days after mockup approval.'
const STANDARD_BULK_PRODUCTION = 'Bulk production: 7-12 working days after sample or artwork approval.'
const STANDARD_BULK_NOTE = 'Large, complex or peak-season orders require a confirmed production schedule.'
const STANDARD_QC = 'Quality control: Inspection before shipment.'
const STANDARD_SIZE_TOLERANCE = 'Size tolerance: +/-2 cm.'
const STANDARD_MIXED_SIZES = 'Mixed adult and youth sizes are supported.'

type SanityPageSection = {
  sectionType?: CmsPageSectionType
  enabled?: boolean
  displayOrder?: number
  eyebrow?: string
  title?: string
  body?: PortableTextBlock[] | string
  image?: SanityImage
  facts?: string[]
  stats?: Array<{value?: string; label?: string}>
  steps?: Array<{title?: string; description?: string}>
  specifications?: Array<{label?: string; value?: string}>
  gallery?: SanityImage[]
  faqs?: Array<{question?: string; answer?: string}>
  cta?: SanityCta
}

type SanityHomepageUspCard = {metric?: string; title?: string; description?: string; displayOrder?: number}
type SanityHomepageSectionHeadings = {
  sourcingEyebrow?: string
  sourcingTitle?: string
  sourcingSubtitle?: string
  uspEyebrow?: string
  uspTitle?: string
  uspSubtitle?: string
  matrixEyebrow?: string
  matrixTitle?: string
  faqEyebrow?: string
  faqTitle?: string
}
type SanityInquirySupport = {title?: string; description?: string}

type SanityPage = {
  pageKey?: string
  internalName?: string
  slug?: string
  heroEyebrow?: string
  heroHeading?: string
  heroSubheading?: string
  heroImage?: SanityImage
  heroCTA?: SanityCta
  heroSecondaryCTA?: SanityCta
  contentSections?: SanityPageSection[]
  homepageUspCards?: SanityHomepageUspCard[]
  homepageSectionHeadings?: SanityHomepageSectionHeadings
  inquirySupport?: SanityInquirySupport
  bottomCTA?: SanityCta
  seo?: Seo
  publishStatus?: string
}

type SanityCategory = {
  categoryName?: string
  shortName?: string
  slug?: string
  heroTitle?: string
  heroDescription?: string
  introduction?: string
  heroImage?: SanityImage
  heroProofPoints?: string[]
  buyerTypes?: string[]
  targetMarkets?: string[]
  productTypes?: string[]
  keyFeatures?: string[]
  coreBenefits?: string[]
  decisionSections?: SanityPageSection[]
  relatedFaqs?: SanityFaq[]
  relatedCaseStudies?: RelatedDoc[]
  relatedGuides?: RelatedDoc[]
  primaryCta?: SanityCta
  secondaryCta?: SanityCta
  bottomCta?: SanityCta
  navigationVisibility?: boolean
  homepageVisibility?: boolean
  showOnHomepage?: boolean
  activeStatus?: boolean | 'inactive'
  displayOrder?: number
  publishStatus?: string
  seo?: Seo
}

type SanityProduct = {
  productName?: string
  slug?: string
  categorySlug?: string
  categoryTitle?: string
  shortDescription?: string
  fullDescription?: string
  primaryImage?: SanityImage
  detailImages?: SanityImage[]
  productionImages?: SanityImage[]
  qcImages?: SanityImage[]
  packagingImages?: SanityImage[]
  fabricOptions?: string[]
  customizationOptions?: string[]
  procurementOverride?: {overriddenMOQ?: string; overriddenSampleTime?: string; overrideReason?: string}
  relatedFaqs?: SanityFaq[]
  featured?: boolean
  displayOrder?: number
  publishStatus?: string
  seo?: Seo
}

type SanityCaseStudy = {
  projectTitle?: string
  title?: string
  caseType?: string
  realOrExample?: 'real' | 'anonymized' | 'example'
  slug?: string
  country?: string
  countryOrRegion?: string
  buyerType?: string
  region?: string
  quantityDisplay?: string
  projectTimeline?: string
  product?: string
  productType?: string
  heroImage?: SanityImage
  images?: SanityImage[]
  projectBackground?: string
  challenge?: string
  requirements?: string[]
  overview?: string
  qualityControl?: string
  qcProcess?: string
  packingDelivery?: string
  packaging?: string
  solution?: string
  materials?: string
  customization?: string
  sampleProcess?: string
  production?: string
  delivery?: string
  result?: string
  testimonial?: string
  evidenceStatus?: string
  displayOrder?: number
  publishStatus?: string
  seo?: Seo
}

type SanityFaq = {
  question?: string
  answer?: PortableTextBlock[] | string
  shortAnswer?: string
  fullAnswer?: PortableTextBlock[] | string
  category?: unknown
  sports?: string[]
  products?: RelatedDoc[]
  productCategories?: RelatedDoc[]
  pages?: RelatedDoc[]
  guides?: RelatedDoc[]
  active?: boolean
  displayOrder?: number
  publishStatus?: string
}

function faqCategoryName(value: unknown): string {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : 'General'
}

function mapFaqItem(faq: SanityFaq): CmsFaqItem | null {
  if (!faq.question || faq.active === false || !isDocumentVisible(faq.publishStatus, contentSource)) return null
  const answer = textFromPortable(faq.fullAnswer) || faq.shortAnswer || textFromPortable(faq.answer)
  if (!answer) return null
  return {question: faq.question, answer: normalizeFaqAnswer(answer)}
}

function normalizedToken(value?: string) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function relatedSlugSet(docs?: RelatedDoc[]) {
  return new Set((docs || []).map((doc) => doc.slug).filter(Boolean) as string[])
}

function faqMatchesCategory(faq: SanityFaq, categorySlug: string, categoryTitle?: string) {
  const explicitCategorySlugs = relatedSlugSet(faq.productCategories)
  if (explicitCategorySlugs.has(categorySlug)) return true
  const categoryToken = normalizedToken(categorySlug)
  const titleToken = normalizedToken(categoryTitle)
  if ((faq.sports || []).some((sport) => normalizedToken(sport) === categoryToken || normalizedToken(sport) === titleToken)) return true
  const categoryName = normalizedToken(faqCategoryName(faq.category))
  return categoryName === categoryToken || (!!titleToken && categoryName === titleToken)
}

function faqMatchesProduct(faq: SanityFaq, productSlug: string, categorySlug?: string) {
  const productSlugs = relatedSlugSet(faq.products)
  if (productSlugs.has(productSlug)) return true
  return categorySlug ? faqMatchesCategory(faq, categorySlug) : false
}
type RelatedDoc = {title?: string; productName?: string; categoryName?: string; projectTitle?: string; slug?: string; articleType?: string}

type SanityArticle = {
  title?: string
  slug?: string
  excerpt?: string
  articleType?: string
  featuredImage?: SanityImage
  heroImage?: SanityImage
  body?: CmsPortableTextNode[] | string
  sections?: Array<{title?: string; content?: string | string[]}>
  authorName?: string
  reviewedByName?: string
  methodology?: string
  references?: string[]
  publishedAt?: string
  updatedAt?: string
  relatedProducts?: RelatedDoc[]
  relatedCategories?: RelatedDoc[]
  relatedCaseStudies?: RelatedDoc[]
  relatedArticles?: RelatedDoc[]
  relatedFaqs?: SanityFaq[]
  cta?: SanityCta
  displayOrder?: number
  publishStatus?: string
  seo?: Seo
}


function textFromPortable(value: Array<PortableTextBlock | CmsPortableTextNode> | string | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value
    .map((block) => 'children' in block ? block.children?.map((child) => child.text || '').join('') || '' : '')
    .filter(Boolean)
    .join('\n')
}

function cleanSiteUrl(url?: string) {
  return (url || legacySiteChrome.siteUrl).replace(/\/+$/, '')
}

function imageFrom(source: SanityImage | undefined, fallback: CmsImage, size: 'hero' | 'card' = 'card'): CmsImage {
  // Prefer direct URL from GROQ asset->url dereference (cdn.sanity.io)
  const directUrl = source?.url || null
  // Fall back to regex-built URL from asset._ref
  const builtUrl = size === 'hero' ? heroImageUrl(source) : cardImageUrl(source)
  const resolvedUrl = directUrl || builtUrl
  return {
    url: resolvedUrl || fallback.url,
    alt: source?.altText || fallback.alt,
  }
}

function optionalImage(source: SanityImage | undefined, fallback?: CmsImage, size: 'hero' | 'card' = 'card'): CmsImage | undefined {
  if (!source && !fallback) return undefined
  return imageFrom(source, fallback || {url: '', alt: ''}, size)
}

function queryState<T>(response: {ok: true; result: T | null} | {ok: false}): SourceState {
  return response.ok ? 'ok' : 'failed'
}

function sortByDisplayOrder<T extends {displayOrder?: number}>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
}
function normalizePublicContactText(text: string): string {
  return text
    .replace(/york@basketman\.cn/gi, 'the POXIOL public email')
    .replace(/sales@poxiol\.com/gi, 'the POXIOL sales email')
}

function normalizeFaqAnswer(answer: string): string {
  return answer
    .replace(/sample production can usually be arranged in 2\s*[-–]\s*3\s*days after mockup confirmation/gi, 'sample production can usually be arranged in 2-3 working days after mockup approval')
    .replace(/Sample Production:\s*2\s*[-–]\s*3\s*Days After Mockup Confirmation/gi, 'Sample production: 2-3 working days after mockup approval')
    .replace(/2\s*[-–]\s*3\s*Days After Mockup Confirmation/gi, '2-3 working days after mockup approval')
}


function imageListFrom(sources: SanityImage[] | undefined, fallbacks: CmsImage[] = []): CmsImage[] {
  return (sources || [])
    .map((image, index) => optionalImage(image, fallbacks[index], 'card'))
    .filter(Boolean) as CmsImage[]
}

function mapCategory(category: SanityCategory, fallback: CmsProductCategory | undefined, index = 0): CmsProductCategory | null {
  if (!category.slug || !category.categoryName) return null
  return {
    slug: category.slug,
    title: category.categoryName,
    shortName: category.shortName,
    description: category.heroDescription || category.introduction || fallback?.description || category.categoryName,
    image: imageFrom(category.heroImage, fallback?.image || {url: '/images/poxiol-v62/products_teamwear_matrix.png', alt: category.categoryName}, 'card'),
    buyerTypes: category.buyerTypes?.length ? category.buyerTypes : fallback?.buyerTypes,
    targetMarkets: category.targetMarkets?.length ? category.targetMarkets : fallback?.targetMarkets,
    productTypes: category.productTypes?.length ? category.productTypes : fallback?.productTypes,
    coreBenefits: category.coreBenefits?.length ? category.coreBenefits : fallback?.coreBenefits,
    relatedFaqs: category.relatedFaqs?.map(mapFaqItem).filter(Boolean) as CmsFaqItem[] || fallback?.relatedFaqs || [],
    relatedCaseStudies: mapRelated(category.relatedCaseStudies, '/projects/').length ? mapRelated(category.relatedCaseStudies, '/projects/') : fallback?.relatedCaseStudies,
    relatedGuides: mapArticleRelated(category.relatedGuides).length ? mapArticleRelated(category.relatedGuides) : fallback?.relatedGuides,
    navigationVisibility: category.navigationVisibility ?? fallback?.navigationVisibility,
    homepageVisibility: category.homepageVisibility ?? category.showOnHomepage ?? fallback?.homepageVisibility,
    seo: seoFrom(category.seo, fallback?.seo || {title: category.categoryName + ' | POXIOL', description: category.heroDescription || category.introduction || category.categoryName}),
    displayOrder: category.displayOrder ?? fallback?.displayOrder ?? index,
    active: category.activeStatus !== false && category.activeStatus !== 'inactive',
  }
}

function mapProject(project: SanityCaseStudy, fallback: CmsProject | undefined, index = 0): CmsProject | null {
  if (!project.slug || !(project.projectTitle || project.title)) return null
  const title = project.projectTitle || project.title || fallback?.title || 'POXIOL Project'
  return {
    slug: project.slug,
    title,
    country: project.country || project.countryOrRegion || fallback?.country || '',
    product: project.product || project.productType || fallback?.product || '',
    caseType: project.caseType || fallback?.caseType,
    realOrExample: project.realOrExample || fallback?.realOrExample || 'example',
    buyerType: project.buyerType || fallback?.buyerType,
    region: project.region || fallback?.region,
    quantityDisplay: project.quantityDisplay || fallback?.quantityDisplay,
    projectTimeline: project.projectTimeline || fallback?.projectTimeline,
    image: imageFrom(project.heroImage, fallback?.image || {url: '/images/poxiol-v62/projects_basketball_academy_uniform_program.png', alt: title}, 'card'),
    qualityControl: project.qualityControl || project.qcProcess || fallback?.qualityControl || '',
    packaging: project.packingDelivery || project.packaging || fallback?.packaging || '',
    solution: project.solution || fallback?.solution || '',
    overview: project.overview || project.projectBackground || fallback?.overview || '',
    challenge: project.challenge || fallback?.challenge,
    requirements: project.requirements?.length ? project.requirements : fallback?.requirements,
    materials: project.materials || fallback?.materials,
    customization: project.customization || fallback?.customization,
    sampleProcess: project.sampleProcess || fallback?.sampleProcess,
    production: project.production || fallback?.production,
    delivery: project.delivery || fallback?.delivery,
    result: project.result || fallback?.result,
    testimonial: project.testimonial || fallback?.testimonial,
    evidenceStatus: project.evidenceStatus || fallback?.evidenceStatus,
    seo: seoFrom(project.seo, fallback?.seo || {title: title + ' | POXIOL', description: project.overview || project.projectBackground || title}),
    displayOrder: project.displayOrder ?? fallback?.displayOrder ?? index,
  }
}

function mapProduct(product: SanityProduct, fallback: CmsProduct | undefined, index = 0): CmsProduct | null {
  if (!product.slug || !product.productName) return null
  const primaryImage = optionalImage(product.primaryImage, fallback?.image, 'hero')
  const fallbackDetailImages = fallback?.detailImages?.length ? fallback.detailImages : fallback?.image ? [fallback.image] : []
  return {
    slug: product.slug,
    title: product.productName,
    categorySlug: product.categorySlug || fallback?.categorySlug,
    categoryTitle: product.categoryTitle || fallback?.categoryTitle,
    description: product.shortDescription || fallback?.description || product.fullDescription || product.productName,
    fullDescription: product.fullDescription || fallback?.fullDescription || product.shortDescription || fallback?.description || '',
    image: primaryImage,
    detailImages: imageListFrom(product.detailImages, fallbackDetailImages),
    productionImages: imageListFrom(product.productionImages, fallback?.productionImages),
    qcImages: imageListFrom(product.qcImages, fallback?.qcImages),
    packagingImages: imageListFrom(product.packagingImages, fallback?.packagingImages),
    fabricOptions: product.fabricOptions?.length ? product.fabricOptions : fallback?.fabricOptions || [],
    customizationOptions: product.customizationOptions?.length ? product.customizationOptions : fallback?.customizationOptions || [],
    procurementOverride: product.procurementOverride
      ? {
          moq: product.procurementOverride.overriddenMOQ || fallback?.procurementOverride?.moq,
          sampleTime: product.procurementOverride.overriddenSampleTime || fallback?.procurementOverride?.sampleTime,
          reason: product.procurementOverride.overrideReason || fallback?.procurementOverride?.reason,
        }
      : fallback?.procurementOverride,
    relatedFaqs: product.relatedFaqs?.length ? product.relatedFaqs.map(mapFaqItem).filter(Boolean) as CmsFaqItem[] : fallback?.relatedFaqs || [],
    featured: product.featured ?? fallback?.featured ?? false,
    seo: seoFrom(product.seo, fallback?.seo || {title: `${product.productName} | POXIOL`, description: product.shortDescription || product.fullDescription || product.productName}),
    displayOrder: product.displayOrder ?? fallback?.displayOrder ?? index,
    active: true,
  }
}
function seoFrom(seo: Seo | undefined, fallback: CmsSeo): CmsSeo {
  return {
    title: seo?.seoTitle || fallback.title,
    description: seo?.metaDescription || fallback.description,
    canonicalUrl: seo?.canonicalUrl || fallback.canonicalUrl,
    ogImage: optionalImage(seo?.ogImage, fallback.ogImage),
    noIndex: seo?.indexStatus ? seo.indexStatus === 'noindex' : fallback.noIndex,
  }
}

function mapCta(cta: SanityCta | undefined, fallback?: CmsCta): CmsCta | undefined {
  const href = cta?.url || cta?.href || fallback?.href
  const label = cta?.label || fallback?.label
  return href && label ? {label, href} : fallback
}

function mapLink(link: SanityLink | undefined): CmsLink | null {
  const href = link?.externalUrl || link?.url || link?.href
  if (!link?.label || !href) return null
  return {label: link.label, href, openInNewWindow: link.openInNewWindow}
}

const exportedCategorySlugs = new Set(sportsPages.map((page) => page.slug.replace(/^products\//, '')))

function categorySlugFromNavigationHref(href: string): string | null {
  const path = href.split(/[?#]/, 1)[0]
  return path.match(/^\/products\/([^/]+)\/?$/)?.[1] || null
}

function filterCategoryNavigationLinks(links: CmsLink[], resolution: ProductCategoriesResolution): CmsLink[] {
  if (!resolution.visibilityResolved) return links
  const visibleNavigationSlugs = new Set(
    resolution.categories
      .filter((category) => category.navigationVisibility !== false)
      .map((category) => category.slug),
  )
  return links.filter((link) => {
    const slug = categorySlugFromNavigationHref(link.href)
    if (!slug || !resolution.knownCategorySlugs.has(slug)) return true
    return visibleNavigationSlugs.has(slug)
  })
}

function mapRelated(docs: RelatedDoc[] | undefined, basePath: string): CmsLink[] {
  return (docs || [])
    .map((doc) => {
      const title = doc.title || doc.productName || doc.categoryName || doc.projectTitle
      return title && doc.slug ? {label: title, href: `${basePath}${doc.slug}/`} : null
    })
    .filter(Boolean) as CmsLink[]
}

function mapArticleRelated(docs: RelatedDoc[] | undefined): CmsLink[] {
  return (docs || [])
    .map((doc) => {
      if (!doc.title || !doc.slug) return null
      const base = doc.articleType === 'resource' ? '/resources/' : doc.articleType === 'blog' ? '/blog/' : '/guides/'
      return {label: doc.title, href: `${base}${doc.slug}/`}
    })
    .filter(Boolean) as CmsLink[]
}

function mapPageSections(sections: SanityPageSection[] | undefined, fallback: CmsPageSection[]): CmsPageSection[] {
  const mapped = (sections || [])
    .filter((section) => section.title || section.body || section.image || section.facts?.length)
    .map((section, index) => {
      const fb = fallback[index]
      return {
        type: section.sectionType || fb?.type,
        eyebrow: section.eyebrow || fb?.eyebrow,
        title: section.title || fb?.title || 'Page section',
        body: normalizePublicContactText(textFromPortable(section.body) || fb?.body || ''),
        image: optionalImage(section.image, fb?.image, 'card'),
        facts: section.facts?.length ? section.facts : fb?.facts || [],
        stats: section.stats?.length ? section.stats.filter((item) => item.value && item.label).map((item) => ({value: item.value || '', label: item.label || ''})) : fb?.stats || [],
        steps: section.steps?.length ? section.steps.filter((item) => item.title && item.description).map((item) => ({title: item.title || '', description: item.description || ''})) : fb?.steps || [],
        specifications: section.specifications?.length ? section.specifications.filter((item) => item.label && item.value).map((item) => ({label: item.label || '', value: item.value || ''})) : fb?.specifications || [],
        gallery: section.gallery?.length ? section.gallery.map((image, imageIndex) => optionalImage(image, fb?.gallery?.[imageIndex], 'card')).filter(Boolean) as CmsPageSection['gallery'] : fb?.gallery || [],
        faqs: section.faqs?.length ? section.faqs.filter((item) => item.question && item.answer).map((item) => ({question: item.question || '', answer: item.answer || ''})) : fb?.faqs || [],
        cta: mapCta(section.cta, fb?.cta),
      }
    })
  return mapped.length ? mapped : fallback
}

function sectionsFromArticle(article: SanityArticle, fallback?: CmsArticle) {
  if (article.sections?.length) {
    return article.sections.map((section) => ({title: section.title || 'Section', content: section.content || ''}))
  }
  if (Array.isArray(article.body) && article.body.length) return []
  const body = textFromPortable(article.body)
  if (body) return [{title: 'Article body', content: body}]
  return fallback?.sections || []
}

export async function getSiteChrome(): Promise<CmsSiteChrome> {
  if (contentSource === 'legacy') return legacySiteChrome
  const [settingsResponse, navResponse, footerResponse, categoryResolution] = await Promise.all([
    sanityQuery<SanitySiteSettings>(siteSettingsQuery),
    sanityQuery<SanityNav>(navigationQuery),
    sanityQuery<SanityFooter>(footerQuery),
    resolveProductCategories(),
  ])

  if (!settingsResponse.ok && !navResponse.ok && !footerResponse.ok && !categoryResolution.visibilityResolved) return legacySiteChrome

  const settings = settingsResponse.ok ? settingsResponse.result : null
  const nav = navResponse.ok ? navResponse.result : null
  const footer = footerResponse.ok ? footerResponse.result : null
  const siteUrl = cleanSiteUrl(settings?.siteUrl)
  const whatsappNumber = settings?.contactInfo?.whatsappNumber || legacySiteChrome.whatsappNumber
  const whatsappMessage = settings?.contactInfo?.whatsappMessage || legacySiteChrome.whatsappMessage
  const digits = whatsappNumber.replace(/\D/g, '')
  const headerLinks = nav?.headerNavigation?.length
    ? nav.headerNavigation.map(mapLink).filter(Boolean) as CmsLink[]
    : legacySiteChrome.headerNavigation
  const footerColumns = footer?.footerColumns?.length
    ? footer.footerColumns.map((column) => ({
        title: column.title || 'Links',
        links: (column.links || []).map(mapLink).filter(Boolean) as CmsLink[],
      }))
    : legacySiteChrome.footerColumns

  return {
    ...legacySiteChrome,
    brandName: settings?.brandName || legacySiteChrome.brandName,
    logo: optionalImage(settings?.logo, legacySiteChrome.logo, 'card'),
    siteUrl,
    publicEmail: settings?.contactInfo?.publicEmail || legacySiteChrome.publicEmail,
    salesEmail: settings?.contactInfo?.salesEmail || legacySiteChrome.salesEmail,
    whatsappNumber,
    whatsappMessage,
    whatsappHref: digits ? 'https://wa.me/' + digits + '?text=' + encodeURIComponent(whatsappMessage) : legacySiteChrome.whatsappHref,
    alibabaStoreUrl: settings?.contactInfo?.alibabaStoreUrl || legacySiteChrome.alibabaStoreUrl,
    headerNavigation: filterCategoryNavigationLinks(headerLinks, categoryResolution),
    footerColumns: footerColumns.map((column) => ({...column, links: filterCategoryNavigationLinks(column.links, categoryResolution)})),
    copyright: footer?.copyright || settings?.footer?.copyright || legacySiteChrome.copyright,
    address: settings?.contactInfo?.companyAddress || settings?.footer?.address || legacySiteChrome.address,
  }
}

export async function getHomeBrandContent() {
  const chrome = await getSiteChrome()
  const page = await getSitePage('homepage')
  return {
    brandName: chrome.brandName,
    siteUrl: chrome.siteUrl,
    seoTitle: page.seo.title,
    metaDescription: page.seo.description,
    canonicalUrl: page.seo.canonicalUrl || `${chrome.siteUrl}/`,
  }
}

export async function getSitePage(key: string): Promise<CmsPage> {
  const legacy = legacyPages.find((page) => page.key === key) || legacyPages[0]
  if (contentSource === 'legacy') return legacy
  const response = await sanityQuery<SanityPage>(sitePageByKeyQuery, {key})
  const page = response.ok ? response.result : null
  if (!response.ok) return legacy
  if (!page || !isDocumentVisible(page.publishStatus, contentSource)) return legacy
  return {
    key,
    slug: page.slug || legacy.slug,
    title: page.internalName || legacy.title,
    eyebrow: page.heroEyebrow || legacy.eyebrow,
    heading: page.heroHeading || legacy.heading,
    description: page.heroSubheading || legacy.description,
    image: optionalImage(page.heroImage, legacy.image || {url: '/images/poxiol-v62/about_hero.png', alt: page.internalName || legacy.title}, 'hero'),
    heroCta: mapCta(page.heroCTA, legacy.heroCta),
    heroSecondaryCta: mapCta(page.heroSecondaryCTA),
    homepageUspCards: page.homepageUspCards?.filter((card) => card.metric && card.title && card.description).map((card) => ({metric: card.metric || '', title: card.title || '', description: card.description || '', displayOrder: card.displayOrder})),
    homepageSectionHeadings: page.homepageSectionHeadings ? {
      sourcing: {eyebrow: page.homepageSectionHeadings.sourcingEyebrow || 'Factory Specs', title: page.homepageSectionHeadings.sourcingTitle || 'Factory Sourcing Summary', subtitle: page.homepageSectionHeadings.sourcingSubtitle},
      usp: {eyebrow: page.homepageSectionHeadings.uspEyebrow || 'Why POXIOL', title: page.homepageSectionHeadings.uspTitle || 'POXIOL Manufacturing Advantage', subtitle: page.homepageSectionHeadings.uspSubtitle},
      matrix: {eyebrow: page.homepageSectionHeadings.matrixEyebrow || 'Products', title: page.homepageSectionHeadings.matrixTitle || 'Custom Teamwear Matrix'},
      faq: {eyebrow: page.homepageSectionHeadings.faqEyebrow || 'FAQ', title: page.homepageSectionHeadings.faqTitle || 'Custom Teamwear Sourcing Guide'},
    } : undefined,
    inquirySupport: page.inquirySupport,
    sections: mapPageSections(page.contentSections, legacy.sections),
    bottomCta: mapCta(page.bottomCTA, legacy.bottomCta),
    seo: seoFrom(page.seo, legacy.seo),
  } as CmsPage
}

type ProductCategoriesResolution = {categories: CmsProductCategory[]; knownCategorySlugs: Set<string>; visibilityResolved: boolean}

async function resolveProductCategories(): Promise<ProductCategoriesResolution> {
  const response = await sanityQuery<SanityCategory[]>(productCategoriesQuery)
  const cmsCategories = response.ok ? response.result || [] : []
  const knownCategorySlugs = new Set([
    ...Array.from(exportedCategorySlugs),
    ...cmsCategories.flatMap((category) => category.slug ? [category.slug] : []),
  ])
  const categories = mergeCmsList({
    legacy: legacyProductCategories,
    cms: cmsCategories,
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (category, fallback, index) => mapCategory(category, fallback, index),
  })
    .filter((category) => category.active)
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
  return {categories, knownCategorySlugs, visibilityResolved: response.ok || contentSource === 'legacy'}
}

export async function getProductCategories(): Promise<CmsProductCategory[]> {
  return (await resolveProductCategories()).categories
}

export async function getProductCategory(slug: string): Promise<CmsProductCategory | null> {
  const fallback = legacyProductCategories.find((category) => category.slug === slug) || null
  const response = await sanityQuery<SanityCategory>(productCategoryBySlugQuery, {slug})
  const category = resolveSingle({
    slug,
    legacy: fallback,
    cms: response.ok ? response.result : null,
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (category, itemFallback) => mapCategory(category, itemFallback),
  })
  return category?.active ? category : null
}

type ProductCategoryResolution = {category: CmsProductCategory | null; suppressed: boolean}

async function resolveProductCategory(slug: string): Promise<ProductCategoryResolution> {
  const fallback = legacyProductCategories.find((category) => category.slug === slug) || null
  const response = await sanityQuery<SanityCategory>(productCategoryBySlugQuery, {slug})
  if (!response.ok || contentSource === 'legacy') return {category: fallback, suppressed: false}

  const cms = response.result
  if (cms?.publishStatus === 'unpublished') return {category: null, suppressed: true}
  if (cms && isDocumentVisible(cms.publishStatus, contentSource)) {
    const category = mapCategory(cms, fallback || undefined)
    return category?.active ? {category, suppressed: false} : {category: null, suppressed: true}
  }
  if (getCmsListMode() === 'strict') return {category: null, suppressed: false}
  return {category: fallback, suppressed: false}
}

export async function getProducts(categorySlug?: string): Promise<CmsProduct[]> {
  const categoryResolution = await resolveProductCategories()
  const visibleCategorySlugs = new Set(categoryResolution.categories.map((category) => category.slug))
  const legacy = categorySlug ? legacyProducts.filter((product) => product.categorySlug === categorySlug) : legacyProducts
  const response = await sanityQuery<SanityProduct[]>(categorySlug ? productsByCategoryQuery : productsQuery, categorySlug ? {categorySlug} : {})
  return resolveProductsForCategoryVisibility(categoryResolution.visibilityResolved, legacy, () => mergeCmsList({
    legacy: legacy.filter((product) => !product.categorySlug || visibleCategorySlugs.has(product.categorySlug)),
    cms: response.ok ? response.result || [] : [],
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (product, fallback, index) => mapProduct(product, fallback || legacyProducts.find((item) => item.slug === product.slug), index),
  })
    .filter((product) => !product.categorySlug || visibleCategorySlugs.has(product.categorySlug))
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999)))
}

export async function getProduct(slug: string): Promise<CmsProduct | null> {
  const fallback = legacyProducts.find((product) => product.slug === slug) || null
  const categoryResolution = await resolveProductCategories()
  const response = await sanityQuery<SanityProduct>(productBySlugQuery, {slug})
  if (!categoryResolution.visibilityResolved) return fallback
  const product = resolveSingle({
    slug,
    legacy: fallback,
    cms: response.ok ? response.result : null,
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (product, itemFallback) => mapProduct(product, itemFallback),
  })
  if (product?.categorySlug && !categoryResolution.categories.some((category) => category.slug === product.categorySlug)) return null
  return product
}

export async function getProjects(): Promise<CmsProject[]> {
  const response = await sanityQuery<SanityCaseStudy[]>(caseStudiesQuery)
  return mergeCmsList({
    legacy: legacyProjects,
    cms: response.ok ? response.result || [] : [],
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (project, fallback, index) => mapProject(project, fallback, index),
  }).sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
}

export async function getProject(slug: string): Promise<CmsProject | null> {
  const fallback = legacyProjects.find((project) => project.slug === slug) || null
  const response = await sanityQuery<SanityCaseStudy>(caseStudyBySlugQuery, {slug})
  return resolveSingle({
    slug,
    legacy: fallback,
    cms: response.ok ? response.result : null,
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (project, itemFallback) => mapProject(project, itemFallback),
  })
}

function faqKey(question: string, category?: string) {
  return (category || 'General') + '::' + question
}

function groupsFromFaqItems(items: Array<{category?: string; question: string; answer: string}>): CmsFaqGroup[] {
  const groups = new Map<string, CmsFaqGroup>()
  for (const faq of items) {
    const category = faq.category || 'General'
    const group = groups.get(category) || {category, items: []}
    group.items.push({question: faq.question, answer: faq.answer})
    groups.set(category, group)
  }
  return Array.from(groups.values()).filter((group) => group.items.length)
}

export async function getFaqGroups(): Promise<CmsFaqGroup[]> {
  if (contentSource === 'legacy') return legacyFaqGroups
  const response = await sanityQuery<SanityFaq[]>(faqItemsQuery)
  if (!response.ok) return legacyFaqGroups

  const cms = response.result || []
  const legacyItems = legacyFaqGroups.flatMap((group) => group.items.map((item) => ({category: group.category, ...item, answer: normalizeFaqAnswer(item.answer)})))
  const suppressed = new Set(cms.filter((faq) => faq.publishStatus === 'unpublished' && faq.question).map((faq) => faqKey(faq.question as string, faqCategoryName(faq.category))))
  const visibleCms = cms
    .filter((faq) => faq.question && isDocumentVisible(faq.publishStatus, contentSource))
    .map((faq) => ({category: faqCategoryName(faq.category), question: faq.question as string, answer: normalizeFaqAnswer(textFromPortable(faq.answer))}))

  if (getCmsListMode() === 'strict') return groupsFromFaqItems(visibleCms)

  const cmsByKey = new Map(visibleCms.map((faq) => [faqKey(faq.question, faq.category), faq]))
  const merged: Array<{category?: string; question: string; answer: string}> = []
  for (const legacy of legacyItems) {
    const key = faqKey(legacy.question, faqCategoryName(legacy.category))
    if (suppressed.has(key)) continue
    merged.push(cmsByKey.get(key) || legacy)
    cmsByKey.delete(key)
  }
  merged.push(...Array.from(cmsByKey.values()))
  return groupsFromFaqItems(merged)
}

function mapArticle(article: SanityArticle, fallback: CmsArticle | undefined, index = 0): CmsArticle | null {
  if (!article.slug || !article.title || !isDocumentVisible(article.publishStatus, contentSource)) return null
  const articleType = article.articleType === 'blog' || article.articleType === 'resource' ? article.articleType : 'guide'
  const body = textFromPortable(article.body)
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || fallback?.excerpt || body || article.title,
    intro: article.excerpt || fallback?.intro || body || article.title,
    eyebrow: fallback?.eyebrow || (articleType === 'blog' ? 'Blog' : articleType === 'resource' ? 'Resource' : 'Guide'),
    featuredImage: optionalImage(article.featuredImage || article.heroImage, fallback?.featuredImage, 'hero'),
    body: body || fallback?.body || article.excerpt || '',
    bodyBlocks: Array.isArray(article.body) ? article.body : fallback?.bodyBlocks,
    articleType,
    author: article.authorName || fallback?.author || 'POXIOL Editorial Team',
    reviewedBy: article.reviewedByName || fallback?.reviewedBy,
    methodology: article.methodology || fallback?.methodology || '',
    references: article.references?.length ? article.references : fallback?.references || [],
    publishedAt: article.publishedAt || fallback?.publishedAt,
    updatedAt: article.updatedAt || fallback?.updatedAt,
    relatedProducts: mapRelated(article.relatedProducts, '/products/').length ? mapRelated(article.relatedProducts, '/products/') : fallback?.relatedProducts || [],
    relatedCategories: mapRelated(article.relatedCategories, '/products/').length ? mapRelated(article.relatedCategories, '/products/') : fallback?.relatedCategories || [],
    relatedCaseStudies: mapRelated(article.relatedCaseStudies, '/projects/').length ? mapRelated(article.relatedCaseStudies, '/projects/') : fallback?.relatedCaseStudies || [],
    relatedArticles: mapArticleRelated(article.relatedArticles).length ? mapArticleRelated(article.relatedArticles) : fallback?.relatedArticles || [],
    faqs: article.relatedFaqs?.length ? article.relatedFaqs.filter((faq) => faq.question).map((faq) => ({question: faq.question as string, answer: normalizeFaqAnswer(textFromPortable(faq.answer))})) : fallback?.faqs || [],
    cta: mapCta(article.cta, fallback?.cta),
    sections: sectionsFromArticle(article, fallback),
    seo: seoFrom(article.seo, fallback?.seo || {title: article.title, description: article.excerpt || body || article.title}),
    displayOrder: article.displayOrder ?? fallback?.displayOrder ?? index,
  }
}

export async function getArticles(type?: CmsArticle['articleType']): Promise<CmsArticle[]> {
  const legacy = type ? legacyArticles.filter((article) => article.articleType === type) : legacyArticles
  const response = await sanityQuery<SanityArticle[]>(articlesQuery)
  const merged = mergeCmsList({
    legacy,
    cms: response.ok ? response.result || [] : [],
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (article, fallback, index) => mapArticle(article, fallback || legacyArticles.find((item) => item.slug === article.slug), index),
  })
  return (type ? merged.filter((article) => article.articleType === type) : merged).sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
}

export async function getArticle(slug: string): Promise<CmsArticle | null> {
  const fallback = legacyArticles.find((article) => article.slug === slug) || null
  const response = await sanityQuery<SanityArticle>(articleBySlugQuery, {slug})
  return resolveSingle({
    slug,
    legacy: fallback,
    cms: response.ok ? response.result : null,
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (article, itemFallback) => mapArticle(article, itemFallback),
  })
}

export async function getMatchedFaqsForProductCategory(categorySlug: string, fallback: CmsFaqItem[] = [], categoryTitle?: string): Promise<CmsFaqItem[]> {
  if (contentSource === 'legacy') return fallback
  const response = await sanityQuery<SanityFaq[]>(faqItemsQuery)
  if (!response.ok) return fallback
  const matched = (response.result || [])
    .filter((faq) => faqMatchesCategory(faq, categorySlug, categoryTitle))
    .map(mapFaqItem)
    .filter(Boolean) as CmsFaqItem[]
  return matched.length ? matched.slice(0, 8) : fallback
}

export async function getMatchedFaqsForProduct(productSlug: string, fallback: CmsFaqItem[] = [], categorySlug?: string): Promise<CmsFaqItem[]> {
  if (contentSource === 'legacy') return fallback
  const response = await sanityQuery<SanityFaq[]>(faqItemsQuery)
  if (!response.ok) return fallback
  const matched = (response.result || [])
    .filter((faq) => faqMatchesProduct(faq, productSlug, categorySlug))
    .map(mapFaqItem)
    .filter(Boolean) as CmsFaqItem[]
  return matched.length ? matched.slice(0, 8) : fallback
}

export async function getCmsSportsPageBySlug(legacyData: SportsPageData): Promise<SportsPageData | null> {
  const categorySlug = legacyData.slug.replace(/^products\//, '')
  const [resolution, products] = await Promise.all([resolveProductCategory(categorySlug), getProducts(categorySlug)])
  if (resolution.suppressed) {
    if (getCmsListMode() === 'strict') return null
    return {...legacyData, noIndex: true}
  }
  const {category} = resolution


  if (!category) return getCmsListMode() === 'strict' ? null : legacyData
  const matchedFaqs = await getMatchedFaqsForProductCategory(categorySlug, category.relatedFaqs?.length ? category.relatedFaqs : legacyData.faqs, category.title)
  const productCards = products.map((product) => ({title: product.title, description: product.description}))
  const designs = products
    .filter((product) => product.image)
    .slice(0, 3)
    .map((product) => ({title: product.title, description: product.description, image: product.image?.url || legacyData.heroImage, href: `/products/${product.slug}/`}))

  return {
    ...legacyData,
    metaTitle: category.seo.title,
    metaDescription: category.seo.description,
    eyebrow: category.shortName || legacyData.eyebrow,
    h1: category.title || legacyData.h1,
    heroText: category.description || legacyData.heroText,
    heroImage: category.image.url || legacyData.heroImage,
    primaryKeyword: category.title || legacyData.primaryKeyword,
    productTypes: productCards.length ? productCards : legacyData.productTypes,
    features: productCards.length ? productCards.slice(0, 4) : legacyData.features,
    designs: designs.length ? designs : legacyData.designs,
    faqs: matchedFaqs.length ? matchedFaqs : legacyData.faqs,
    noIndex: category.seo.noIndex,
  }
}

function basketballProcurementTable(
  fallback: SportsPageData['procurementTable'],
  standards: SanityProcurementStandards | null,
): SportsPageData['procurementTable'] {
  if (!standards) return fallback
  const approved = [
    {item: 'Sample MOQ', specification: standards.sampleMOQ || '1 set'},
    {item: 'Sample production', specification: standards.sampleProductionTime || '2–3 working days after mockup approval'},
    {
      item: 'Bulk production',
      specification: [standards.bulkProductionTime || '7–12 working days after sample or artwork approval', standards.bulkProductionNote]
        .filter(Boolean)
        .join(' '),
    },
    {item: 'Quality control', specification: standards.qcStandard || 'Inspection before shipment'},
    {item: 'Size tolerance', specification: standards.sizeTolerance || '±2 cm'},
    {item: 'Mixed sizes', specification: standards.mixedSizes || 'Mixed adult and youth sizes are supported'},
  ]
  const replacementTokens = ['sample support', 'sample moq', 'sample production', 'bulk production', 'quality control', 'size tolerance', 'mixed sizes']
  return [...fallback.filter((row) => !replacementTokens.includes(row.item.toLowerCase())), ...approved]
}

export async function getBasketballDecisionPage(legacyData: SportsPageData): Promise<SportsPageData | null> {
  const base = await getCmsSportsPageBySlug(legacyData)
  if (!base || contentSource === 'legacy') return base

  const [categoryResponse, procurementResponse] = await Promise.all([
    sanityQuery<SanityCategory>(productCategoryBySlugQuery, {slug: 'basketball-uniforms'}),
    sanityQuery<SanityProcurementStandards>(procurementStandardsQuery),
  ])
  if (!categoryResponse.ok || !categoryResponse.result) return base
  const category = categoryResponse.result
  if (!isDocumentVisible(category.publishStatus, contentSource)) return base

  const decisionSections = mapPageSections(
    sortByDisplayOrder((category.decisionSections || []).filter((section) => section.enabled !== false)),
    [],
  )
  const relatedCases = mapRelated(category.relatedCaseStudies, '/projects/').map((item) => ({title: item.label, href: item.href}))
  const relatedGuides = mapArticleRelated(category.relatedGuides).map((item) => ({title: item.label, href: item.href}))

  return {
    ...base,
    h1: category.heroTitle || base.h1,
    heroImageAlt: category.heroImage?.altText || base.heroImageAlt || base.h1,
    heroProofPoints: category.heroProofPoints?.length ? category.heroProofPoints : base.heroProofPoints,
    buyerTypes: category.buyerTypes?.length
      ? category.buyerTypes.map((title, index) => ({
          title,
          description: base.buyerTypes[index]?.description || 'Basketball uniform sourcing support based on the confirmed roster, artwork and delivery plan.',
        }))
      : base.buyerTypes,
    features: category.keyFeatures?.length
      ? category.keyFeatures.map((title, index) => ({
          title,
          description: category.coreBenefits?.[index] || base.features[index]?.description || 'Confirm this specification during artwork and sample review.',
        }))
      : base.features,
    decisionSections: decisionSections.length ? decisionSections : base.decisionSections,
    relatedCases: relatedCases.length ? relatedCases : base.relatedCases,
    relatedGuides: relatedGuides.length ? relatedGuides : base.relatedGuides,
    primaryCta: mapCta(category.primaryCta, base.primaryCta),
    secondaryCta: mapCta(category.secondaryCta, base.secondaryCta),
    bottomCta: mapCta(category.bottomCta, base.bottomCta),
    procurementTable: basketballProcurementTable(base.procurementTable, procurementResponse.ok ? procurementResponse.result : null),
  }
}

export async function getBasketballPreviewPage(legacyData: SportsPageData): Promise<SportsPageData | null> {
  return getBasketballDecisionPage(legacyData)
}

function legacyHomeRows(): CmsHomeContent['sourcingRows'] {
  return [
    {item: 'Core Expertise', capability: '15+ years experience in custom sports uniforms and private label sportswear manufacturing.'},
    {item: 'Main Products', capability: 'Sublimated basketball uniforms, soccer kits, training wear, hoodies and sports team accessories.'},
    {item: 'Sample MOQ', capability: 'Sample MOQ: 1 set.'},
    {item: 'Sample Production', capability: 'Sample production: 2-3 working days after mockup approval.'},
    {item: 'Bulk Production', capability: 'Bulk production: 7-12 working days after sample or artwork approval. Large, complex or peak-season orders require a confirmed production schedule.'},
    {item: 'Quality Control', capability: 'Quality control: Inspection before shipment.'},
    {item: 'Size Tolerance', capability: 'Size tolerance: +/-2 cm.'},
    {item: 'Mixed Sizes', capability: 'Mixed adult and youth sizes are supported.'},
    {item: 'Export Markets', capability: 'Reliable door-to-door logistics serving clubs and brands in 50+ countries including USA, EU, AU.'},
  ]
}

function homeCategoriesFromLegacy(): CmsHomeCategory[] {
  return sportsCategories.map((sport) => ({
    title: sport.title,
    description: sport.description,
    cta: sport.cta,
    href: sport.href,
    image: {url: sport.image, alt: `POXIOL ${sport.title} Custom Manufacturer`},
  }))
}

function normalizeHomepageSeo(seo: CmsSeo): CmsSeo {
  return {
    ...seo,
    description: seo.description
      .replace(/MOQ\s*1\s*set\s*and\s*Sample Production:\s*2\s*[-–]\s*3\s*Days After Mockup Confirmation/gi, 'Sample MOQ: 1 set and sample production: 2-3 working days after mockup approval')
      .replace(/Sample Production:\s*2\s*[-–]\s*3\s*Days After Mockup Confirmation/gi, 'Sample production: 2-3 working days after mockup approval')
      .replace(/2\s*[-–]\s*3\s*Days Sample Production/gi, '2-3 working days sample production'),
  }
}
function normalizeSampleMoq(value?: string): string {
  return value && /1\s*set/i.test(value) ? STANDARD_SAMPLE_MOQ : STANDARD_SAMPLE_MOQ
}

function normalizeSampleProduction(value?: string): string {
  return value && /2\s*[-–]\s*3/i.test(value) ? STANDARD_SAMPLE_PRODUCTION : STANDARD_SAMPLE_PRODUCTION
}

function normalizeBulkProduction(time?: string, note?: string): string {
  const timeline = time && /7\s*[-–]\s*12/i.test(time) ? STANDARD_BULK_PRODUCTION : STANDARD_BULK_PRODUCTION
  const scheduleNote = note || STANDARD_BULK_NOTE
  return `${timeline} ${scheduleNote}`
}

function normalizeQualityControl(qc?: string, tolerance?: string): string {
  const qcText = qc && /inspection/i.test(qc) ? STANDARD_QC : STANDARD_QC
  const toleranceText = tolerance && /2\s*cm/i.test(tolerance) ? STANDARD_SIZE_TOLERANCE : STANDARD_SIZE_TOLERANCE
  return `${qcText} ${toleranceText}`
}
function normalizeHomepageFaqs(faqs: CmsHomeContent['faqs']): CmsHomeContent['faqs'] {
  const normalized = faqs.map((faq) => faq.question === HOMEPAGE_PRODUCTION_TIME_QUESTION ? {...faq, answer: HOMEPAGE_PRODUCTION_TIME_ANSWER} : faq)
  return normalized.some((faq) => faq.question === HOMEPAGE_PRODUCTION_TIME_QUESTION)
    ? normalized.slice(0, 7)
    : [...normalized.slice(0, 6), {question: HOMEPAGE_PRODUCTION_TIME_QUESTION, answer: HOMEPAGE_PRODUCTION_TIME_ANSWER}]
}

function normalizeHomepageUspCards(cards: Array<{metric: string; title: string; description: string}>): Array<{metric: string; title: string; description: string}> {
  return cards.map((card) => {
    const text = `${card.metric} ${card.title} ${card.description}`
    if (/bulk production|7-21|7–21|15-25|15–25/i.test(text)) {
      return {
        metric: '7-12 working days',
        title: 'Bulk Production',
        description: 'Bulk production usually takes 7-12 working days after sample or artwork approval. Large, complex or peak-season orders require a confirmed production schedule.',
      }
    }
    if (/sample production|2-3|2–3/i.test(text)) {
      return {
        ...card,
        metric: card.metric.replace(/2–3/g, '2-3'),
        title: card.title.replace(/2–3/g, '2-3 working days'),
        description: card.description.replace(/2–3/g, '2-3'),
      }
    }
    return card
  })
}

export async function getHomepageContent(): Promise<CmsHomeContent> {
  const [chrome, page, categories, faqGroups, procurement] = await Promise.all([
    getSiteChrome(),
    getSitePage('homepage'),
    getProductCategories(),
    getFaqGroups(),
    sanityQuery<SanityProcurementStandards>(procurementStandardsQuery),
  ])
  const cmsCategories = categories.filter((category) => category.homepageVisibility !== false).slice(0, 12).map((category) => ({
    title: category.title,
    description: category.description,
    cta: `View ${category.title}`,
    href: `/products/${category.slug}/`,
    image: category.image,
  }))
  const faqs = normalizeHomepageFaqs(faqGroups.flatMap((group) => group.items).slice(0, 7))
  const procurementData = procurement.ok ? procurement.result : null
  const procurementRows = procurementData
    ? [
        {item: 'Sample MOQ', capability: normalizeSampleMoq(procurementData.sampleMOQ || procurementData.defaultMOQ)},
        {item: 'Sample Production', capability: normalizeSampleProduction(procurementData.sampleProductionTime || procurementData.sampleTime)},
        {item: 'Mockup Time', capability: procurementData.mockupTime || 'Free mockup: Usually within 2 hours after receiving complete project requirements.'},
        {item: 'Bulk Production', capability: normalizeBulkProduction(procurementData.bulkProductionTime, procurementData.bulkProductionNote)},
        {item: 'Quality Control', capability: normalizeQualityControl(procurementData.qcStandard || procurementData.qualityPromise, procurementData.sizeTolerance)},
        {item: 'Shipping Notes', capability: procurementData.mixedSizes || STANDARD_MIXED_SIZES},      ]
    : legacyHomeRows()

  const pageAny = page as CmsPage & {
    heroSecondaryCta?: CmsCta
    homepageUspCards?: Array<{metric: string; title: string; description: string; displayOrder?: number}>
    homepageSectionHeadings?: CmsHomeContent['sectionHeadings']
    inquirySupport?: {title?: string; description?: string}
  }
  const ctaSection = page.sections.find((section) => section.type === 'cta')
  const evidenceSection = page.sections.find((section) => section.type === 'evidenceGrid')

  return {
    brandName: chrome.brandName,
    siteUrl: chrome.siteUrl,
    heroEyebrow: page.eyebrow || 'Elite B2B Teamwear Partner',
    heroHeading: page.heading || 'Build Your Elite Team Identity.',
    heroDescription: page.description,
    heroImage: page.image || {url: '/images/poxiol-v62/home_hero_v62_desktop.webp', alt: 'POXIOL Custom Teamwear Uniforms Factory'},
    heroPrimaryCta: page.heroCta || {label: 'Get Free Mockup', href: '/free-mockup/'},
    heroSecondaryCta: pageAny.heroSecondaryCta || {label: 'Get Factory Quote', href: '/get-quote/'},
    trustChips: evidenceSection?.facts?.length ? evidenceSection.facts : ['Sample MOQ: 1 set', 'Free 3D Mockup', '2-3 working days sample production', 'QC before shipment', 'Global Shipping'],
    sourcingRows: procurementRows,
    uspCards: normalizeHomepageUspCards(pageAny.homepageUspCards?.length ? sortByDisplayOrder(pageAny.homepageUspCards).filter((card) => card.metric && card.title && card.description).map((card) => ({metric: card.metric, title: card.title, description: card.description})) : uspCards),
    categories: cmsCategories.length ? cmsCategories : homeCategoriesFromLegacy(),
    sectionHeadings: pageAny.homepageSectionHeadings || {
      sourcing: {eyebrow: 'Factory Specs', title: 'Factory Sourcing Summary'},
      usp: {eyebrow: 'Why POXIOL', title: 'POXIOL Manufacturing Advantage'},
      matrix: {eyebrow: 'Products', title: 'Custom Teamwear Matrix'},
      faq: {eyebrow: 'FAQ', title: 'Custom Teamwear Sourcing Guide'},
    },
    inquiryTitle: ctaSection?.title || 'Build Your Teamwear Project',
    inquiryDescription: ctaSection?.body || 'Submit your project details for a factory-direct evaluation. POXIOL reviews your logo, quantity and deadline to prepare a 3D mockup and production plan.',
    inquirySupportTitle: pageAny.inquirySupport?.title || 'B2B Support',
    inquirySupportDescription: pageAny.inquirySupport?.description || 'Facing a tight tournament deadline? Chat with our production manager via WhatsApp for fast-track sample and production scheduling.',
    faqs: faqs.length ? faqs : normalizeHomepageFaqs(homeFaqs),
    bottomCta: page.bottomCta,
    seo: normalizeHomepageSeo(page.seo),
  }
}
