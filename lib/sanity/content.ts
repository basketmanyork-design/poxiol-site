import 'server-only'

import type {SportsPageData} from '@/lib/sports-pages'
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
import {contentSource, sanityQuery} from './client'
import {isDocumentVisible} from '@/lib/cms/visibility'
import {getCmsListMode, mergeCmsList, resolveSingle, type SourceState} from '@/lib/cms/listMode'
import {resolveContent} from './fallback'
import {cardImageUrl, heroImageUrl} from './image'
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
type SanityImage = {asset?: {_ref?: string}; altText?: string}
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
  sampleTime?: string
  bulkProductionTime?: string
  mockupTime?: string
  shippingNotes?: string
  qualityPromise?: string
}

type SanityPageSection = {
  sectionType?: CmsPageSectionType
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
  slug?: string
  country?: string
  countryOrRegion?: string
  product?: string
  productType?: string
  heroImage?: SanityImage
  projectBackground?: string
  overview?: string
  qualityControl?: string
  qcProcess?: string
  packingDelivery?: string
  packaging?: string
  solution?: string
  displayOrder?: number
  publishStatus?: string
  seo?: Seo
}

type SanityFaq = {question?: string; answer?: PortableTextBlock[] | string; category?: string; publishStatus?: string}
type RelatedDoc = {title?: string; productName?: string; categoryName?: string; projectTitle?: string; slug?: string; articleType?: string}

type SanityArticle = {
  title?: string
  slug?: string
  excerpt?: string
  articleType?: string
  featuredImage?: SanityImage
  heroImage?: SanityImage
  body?: PortableTextBlock[] | string
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


function textFromPortable(value: PortableTextBlock[] | string | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value
    .map((block) => block.children?.map((child) => child.text || '').join('') || '')
    .filter(Boolean)
    .join('\n')
}

function cleanSiteUrl(url?: string) {
  return (url || legacySiteChrome.siteUrl).replace(/\/+$/, '')
}

function imageFrom(source: SanityImage | undefined, fallback: CmsImage, size: 'hero' | 'card' = 'card'): CmsImage {
  const url = size === 'hero' ? heroImageUrl(source) : cardImageUrl(source)
  return {
    url: url || fallback.url,
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
    seo: seoFrom(category.seo, fallback?.seo || {title: category.categoryName + ' | POXIOL', description: category.heroDescription || category.introduction || category.categoryName}),
    displayOrder: category.displayOrder ?? fallback?.displayOrder ?? index,
    active: true,
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
    image: imageFrom(project.heroImage, fallback?.image || {url: '/images/poxiol-v62/projects_basketball_academy_uniform_program.png', alt: title}, 'card'),
    qualityControl: project.qualityControl || project.qcProcess || fallback?.qualityControl || '',
    packaging: project.packingDelivery || project.packaging || fallback?.packaging || '',
    solution: project.solution || fallback?.solution || '',
    overview: project.overview || project.projectBackground || fallback?.overview || '',
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
    relatedFaqs: product.relatedFaqs?.length ? product.relatedFaqs.filter((faq) => faq.question).map((faq) => ({question: faq.question as string, answer: textFromPortable(faq.answer)})) : fallback?.relatedFaqs || [],
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
        body: textFromPortable(section.body) || fb?.body || '',
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
  const body = textFromPortable(article.body)
  if (body) return [{title: 'Article body', content: body}]
  return fallback?.sections || []
}

export async function getSiteChrome(): Promise<CmsSiteChrome> {
  if (contentSource === 'legacy') return legacySiteChrome
  const [settingsResponse, navResponse, footerResponse] = await Promise.all([
    sanityQuery<SanitySiteSettings>(siteSettingsQuery),
    sanityQuery<SanityNav>(navigationQuery),
    sanityQuery<SanityFooter>(footerQuery),
  ])

  if (!settingsResponse.ok && !navResponse.ok && !footerResponse.ok) return legacySiteChrome

  const settings = settingsResponse.ok ? settingsResponse.result : null
  const nav = navResponse.ok ? navResponse.result : null
  const footer = footerResponse.ok ? footerResponse.result : null
  const siteUrl = cleanSiteUrl(settings?.siteUrl)
  const whatsappNumber = settings?.contactInfo?.whatsappNumber || legacySiteChrome.whatsappNumber
  const whatsappMessage = settings?.contactInfo?.whatsappMessage || legacySiteChrome.whatsappMessage
  const digits = whatsappNumber.replace(/\D/g, '')

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
    headerNavigation: nav?.headerNavigation?.length
      ? nav.headerNavigation.map(mapLink).filter(Boolean) as CmsLink[]
      : legacySiteChrome.headerNavigation,
    footerColumns: footer?.footerColumns?.length
      ? footer.footerColumns.map((column) => ({
          title: column.title || 'Links',
          links: (column.links || []).map(mapLink).filter(Boolean) as CmsLink[],
        }))
      : legacySiteChrome.footerColumns,
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

export async function getProductCategories(): Promise<CmsProductCategory[]> {
  const response = await sanityQuery<SanityCategory[]>(productCategoriesQuery)
  return mergeCmsList({
    legacy: legacyProductCategories,
    cms: response.ok ? response.result || [] : [],
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (category, fallback, index) => mapCategory(category, fallback, index),
  }).sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
}

export async function getProductCategory(slug: string): Promise<CmsProductCategory | null> {
  const fallback = legacyProductCategories.find((category) => category.slug === slug) || null
  const response = await sanityQuery<SanityCategory>(productCategoryBySlugQuery, {slug})
  return resolveSingle({
    slug,
    legacy: fallback,
    cms: response.ok ? response.result : null,
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (category, itemFallback) => mapCategory(category, itemFallback),
  })
}

export async function getProducts(categorySlug?: string): Promise<CmsProduct[]> {
  const legacy = categorySlug ? legacyProducts.filter((product) => product.categorySlug === categorySlug) : legacyProducts
  const response = await sanityQuery<SanityProduct[]>(categorySlug ? productsByCategoryQuery : productsQuery, categorySlug ? {categorySlug} : {})
  return mergeCmsList({
    legacy,
    cms: response.ok ? response.result || [] : [],
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (product, fallback, index) => mapProduct(product, fallback || legacyProducts.find((item) => item.slug === product.slug), index),
  }).sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
}

export async function getProduct(slug: string): Promise<CmsProduct | null> {
  const fallback = legacyProducts.find((product) => product.slug === slug) || null
  const response = await sanityQuery<SanityProduct>(productBySlugQuery, {slug})
  return resolveSingle({
    slug,
    legacy: fallback,
    cms: response.ok ? response.result : null,
    sourceState: queryState(response),
    mode: getCmsListMode(),
    contentSource,
    mapCms: (product, itemFallback) => mapProduct(product, itemFallback),
  })
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
  const legacyItems = legacyFaqGroups.flatMap((group) => group.items.map((item) => ({category: group.category, ...item})))
  const suppressed = new Set(cms.filter((faq) => faq.publishStatus === 'unpublished' && faq.question).map((faq) => faqKey(faq.question as string, faq.category)))
  const visibleCms = cms
    .filter((faq) => faq.question && isDocumentVisible(faq.publishStatus, contentSource))
    .map((faq) => ({category: faq.category || 'General', question: faq.question as string, answer: textFromPortable(faq.answer)}))

  if (getCmsListMode() === 'strict') return groupsFromFaqItems(visibleCms)

  const cmsByKey = new Map(visibleCms.map((faq) => [faqKey(faq.question, faq.category), faq]))
  const merged: Array<{category?: string; question: string; answer: string}> = []
  for (const legacy of legacyItems) {
    const key = faqKey(legacy.question, legacy.category)
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
    faqs: article.relatedFaqs?.length ? article.relatedFaqs.filter((faq) => faq.question).map((faq) => ({question: faq.question as string, answer: textFromPortable(faq.answer)})) : fallback?.faqs || [],
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

export async function getCmsSportsPageBySlug(legacyData: SportsPageData): Promise<SportsPageData> {
  const categorySlug = legacyData.slug.replace(/^products\//, '')
  const [category, products, faqs] = await Promise.all([getProductCategory(categorySlug), getProducts(categorySlug), getFaqGroups()])
  const flatFaqs = faqs.flatMap((group) => group.items).slice(0, 8)

  if (!category) return legacyData
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
    faqs: flatFaqs.length ? flatFaqs : legacyData.faqs,
  }
}

export async function getBasketballPreviewPage(legacyData: SportsPageData): Promise<SportsPageData> {
  return getCmsSportsPageBySlug(legacyData)
}

function legacyHomeRows(): CmsHomeContent['sourcingRows'] {
  return [
    {item: 'Core Expertise', capability: '15+ years experience in custom sports uniforms and private label sportswear manufacturing.'},
    {item: 'Main Products', capability: 'Sublimated basketball uniforms, soccer kits, training wear, hoodies and sports team accessories.'},
    {item: 'Minimum Order (MOQ)', capability: 'MOQ 1 set support for B2B samples, team trials and original brand development projects.'},
    {item: 'Sampling Timeline', capability: 'Sample Production: 2–5 Days After Mockup Confirmation with express global delivery.'},
    {item: 'Design Support', capability: 'Free high-fidelity 3D mockup design in 1-2 hours based on your logo and color direction.'},
    {item: 'Production Capacity', capability: 'Specialized facility with 30,000+ monthly capacity and 100% manual quality inspection protocol.'},
    {item: 'Custom Options', capability: 'Full sublimation, team logos, player names, numbers, private labels and custom packaging.'},
    {item: 'Compliance & QC', capability: 'Strict pre-shipment QC checking for print clarity, stitching durability and size accuracy.'},
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

export async function getHomepageContent(): Promise<CmsHomeContent> {
  const [chrome, page, categories, faqGroups, procurement] = await Promise.all([
    getSiteChrome(),
    getSitePage('homepage'),
    getProductCategories(),
    getFaqGroups(),
    sanityQuery<SanityProcurementStandards>(procurementStandardsQuery),
  ])
  const cmsCategories = categories.slice(0, 12).map((category) => ({
    title: category.title,
    description: category.description,
    cta: `View ${category.title}`,
    href: `/products/${category.slug}/`,
    image: category.image,
  }))
  const faqs = faqGroups.flatMap((group) => group.items).slice(0, 7)
  const procurementData = procurement.ok ? procurement.result : null
  const procurementRows = procurementData
    ? [
        {item: 'Minimum Order (MOQ)', capability: procurementData.defaultMOQ || 'MOQ 1 set support for B2B samples, team trials and original brand development projects.'},
        {item: 'Sampling Timeline', capability: procurementData.sampleTime || 'Sample Production: 2–5 Days After Mockup Confirmation with express global delivery.'},
        {item: 'Mockup Time', capability: procurementData.mockupTime || 'Free high-fidelity 3D mockup design based on your logo and color direction.'},
        {item: 'Bulk Production', capability: procurementData.bulkProductionTime || 'Production capacity and timing are confirmed against quantity, deadline and customization complexity.'},
        {item: 'Compliance & QC', capability: procurementData.qualityPromise || 'Strict pre-shipment QC checking for print clarity, stitching durability and size accuracy.'},
        {item: 'Shipping Notes', capability: procurementData.shippingNotes || 'Reliable door-to-door logistics serving global clubs, schools and brands.'},
      ]
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
    trustChips: evidenceSection?.facts?.length ? evidenceSection.facts : ['MOQ 1 Set', 'Free 3D Mockup', '2–5 Days Sample Production', 'Quality Support', 'Global Shipping'],
    sourcingRows: procurementRows,
    uspCards: pageAny.homepageUspCards?.length ? sortByDisplayOrder(pageAny.homepageUspCards).filter((card) => card.metric && card.title && card.description).map((card) => ({metric: card.metric, title: card.title, description: card.description})) : uspCards,
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
    faqs: faqs.length ? faqs : homeFaqs,
    bottomCta: page.bottomCta,
    seo: page.seo,
  }
}