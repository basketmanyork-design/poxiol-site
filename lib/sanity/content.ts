import 'server-only'

import type {SportsPageData} from '@/lib/sports-pages'
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
import {sanityFetch} from './client'
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

type SanityPage = {
  pageKey?: string
  internalName?: string
  slug?: string
  heroEyebrow?: string
  heroHeading?: string
  heroSubheading?: string
  heroImage?: SanityImage
  heroCTA?: SanityCta
  contentSections?: SanityPageSection[]
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
  shortDescription?: string
  fullDescription?: string
  primaryImage?: SanityImage
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

function isActive(status?: string) {
  return status !== 'unpublished'
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
  return resolveContent(async () => {
    const [settings, nav, footer] = await Promise.all([
      sanityFetch<SanitySiteSettings>(siteSettingsQuery),
      sanityFetch<SanityNav>(navigationQuery),
      sanityFetch<SanityFooter>(footerQuery),
    ])

    if (!settings && !nav && !footer) return null

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
      whatsappHref: digits ? `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessage)}` : legacySiteChrome.whatsappHref,
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
  }, legacySiteChrome)
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
  return resolveContent(async () => {
    const page = await sanityFetch<SanityPage>(sitePageByKeyQuery, {key})
    if (!page || !isActive(page.publishStatus)) return null
    return {
      key,
      slug: page.slug || legacy.slug,
      title: page.internalName || legacy.title,
      eyebrow: page.heroEyebrow || legacy.eyebrow,
      heading: page.heroHeading || legacy.heading,
      description: page.heroSubheading || legacy.description,
      image: optionalImage(page.heroImage, legacy.image || {url: '/images/poxiol-v62/about_hero.png', alt: page.internalName || legacy.title}, 'hero'),
      heroCta: mapCta(page.heroCTA, legacy.heroCta),
      sections: mapPageSections(page.contentSections, legacy.sections),
      bottomCta: mapCta(page.bottomCTA, legacy.bottomCta),
      seo: seoFrom(page.seo, legacy.seo),
    }
  }, legacy)
}

export async function getProductCategories(): Promise<CmsProductCategory[]> {
  return resolveContent(async () => {
    const categories = await sanityFetch<SanityCategory[]>(productCategoriesQuery)
    const mapped = (categories || [])
      .filter((category) => category.slug && category.categoryName && isActive(category.publishStatus))
      .map((category, index) => {
        const legacy = legacyProductCategories.find((item) => item.slug === category.slug) || legacyProductCategories[index] || legacyProductCategories[0]
        return {
          slug: category.slug as string,
          title: category.categoryName as string,
          shortName: category.shortName,
          description: category.heroDescription || category.introduction || legacy.description,
          image: imageFrom(category.heroImage, legacy.image, 'card'),
          seo: seoFrom(category.seo, legacy.seo),
          displayOrder: category.displayOrder ?? index,
          active: true,
        }
      })
    return mapped.length ? mapped : null
  }, legacyProductCategories)
}

export async function getProductCategory(slug: string): Promise<CmsProductCategory | null> {
  const fallback = legacyProductCategories.find((category) => category.slug === slug) || null
  return resolveContent(async () => {
    const category = await sanityFetch<SanityCategory>(productCategoryBySlugQuery, {slug})
    if (!category?.slug || !category.categoryName || !isActive(category.publishStatus)) return null
    return {
      slug: category.slug,
      title: category.categoryName,
      shortName: category.shortName,
      description: category.heroDescription || category.introduction || fallback?.description || '',
      image: imageFrom(category.heroImage, fallback?.image || {url: '/images/poxiol-v62/products_teamwear_matrix.png', alt: category.categoryName}, 'hero'),
      seo: seoFrom(category.seo, fallback?.seo || {title: `${category.categoryName} | POXIOL`, description: category.heroDescription || category.categoryName}),
      displayOrder: category.displayOrder ?? 0,
      active: true,
    }
  }, fallback)
}

export async function getProducts(categorySlug?: string): Promise<CmsProduct[]> {
  const legacy = categorySlug ? legacyProducts.filter((product) => product.categorySlug === categorySlug) : legacyProducts
  return resolveContent(async () => {
    const products = await sanityFetch<SanityProduct[]>(categorySlug ? productsByCategoryQuery : productsQuery, categorySlug ? {categorySlug} : {})
    const mapped = (products || [])
      .filter((product) => product.slug && product.productName && isActive(product.publishStatus))
      .map((product, index) => ({
        slug: product.slug as string,
        title: product.productName as string,
        categorySlug: product.categorySlug,
        description: product.shortDescription || product.fullDescription || '',
        image: product.primaryImage ? imageFrom(product.primaryImage, {url: '/images/poxiol-v62/products_teamwear_matrix.png', alt: product.productName as string}) : undefined,
        seo: seoFrom(product.seo, {title: `${product.productName} | POXIOL`, description: product.shortDescription || product.fullDescription || product.productName as string}),
        displayOrder: product.displayOrder ?? index,
        active: true,
      }))
    return mapped.length ? mapped : null
  }, legacy)
}

export async function getProjects(): Promise<CmsProject[]> {
  return resolveContent(async () => {
    const projects = await sanityFetch<SanityCaseStudy[]>(caseStudiesQuery)
    const mapped = (projects || [])
      .filter((project) => project.slug && (project.projectTitle || project.title) && isActive(project.publishStatus))
      .map((project, index) => {
        const title = project.projectTitle || project.title || 'POXIOL Project'
        const fallback = legacyProjects.find((item) => item.slug === project.slug) || legacyProjects[index] || legacyProjects[0]
        return {
          slug: project.slug as string,
          title,
          country: project.country || project.countryOrRegion || fallback.country,
          product: project.product || project.productType || fallback.product,
          image: imageFrom(project.heroImage, fallback.image, 'card'),
          qualityControl: project.qualityControl || project.qcProcess || fallback.qualityControl,
          packaging: project.packingDelivery || project.packaging || fallback.packaging,
          solution: project.solution || fallback.solution,
          overview: project.overview || project.projectBackground || fallback.overview,
          seo: seoFrom(project.seo, fallback.seo),
          displayOrder: project.displayOrder ?? index,
        }
      })
    return mapped.length ? mapped : null
  }, legacyProjects)
}

export async function getProject(slug: string): Promise<CmsProject | null> {
  const fallback = legacyProjects.find((project) => project.slug === slug) || null
  return resolveContent(async () => {
    const project = await sanityFetch<SanityCaseStudy>(caseStudyBySlugQuery, {slug})
    if (!project?.slug || !isActive(project.publishStatus)) return null
    const title = project.projectTitle || project.title || fallback?.title || 'POXIOL Project'
    return {
      slug: project.slug,
      title,
      country: project.country || project.countryOrRegion || fallback?.country || '',
      product: project.product || project.productType || fallback?.product || '',
      image: imageFrom(project.heroImage, fallback?.image || {url: '/images/poxiol-v62/projects_basketball_academy_uniform_program.png', alt: title}, 'hero'),
      qualityControl: project.qualityControl || project.qcProcess || fallback?.qualityControl || '',
      packaging: project.packingDelivery || project.packaging || fallback?.packaging || '',
      solution: project.solution || fallback?.solution || '',
      overview: project.overview || project.projectBackground || fallback?.overview || '',
      seo: seoFrom(project.seo, fallback?.seo || {title: `${title} | POXIOL`, description: project.overview || title}),
      displayOrder: project.displayOrder ?? fallback?.displayOrder ?? 0,
    }
  }, fallback)
}

export async function getFaqGroups(): Promise<CmsFaqGroup[]> {
  return resolveContent(async () => {
    const faqs = await sanityFetch<SanityFaq[]>(faqItemsQuery)
    const groups = new Map<string, CmsFaqGroup>()
    for (const faq of faqs || []) {
      if (!faq.question || !isActive(faq.publishStatus)) continue
      const category = faq.category || 'General'
      const group = groups.get(category) || {category, items: []}
      group.items.push({question: faq.question, answer: textFromPortable(faq.answer)})
      groups.set(category, group)
    }
    const mapped = Array.from(groups.values()).filter((group) => group.items.length)
    return mapped.length ? mapped : null
  }, legacyFaqGroups)
}

function mapArticle(article: SanityArticle, fallback: CmsArticle | undefined, index = 0): CmsArticle | null {
  if (!article.slug || !article.title || !isActive(article.publishStatus)) return null
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
  return resolveContent(async () => {
    const articles = await sanityFetch<SanityArticle[]>(articlesQuery)
    const mapped = (articles || [])
      .map((article, index) => mapArticle(article, legacyArticles.find((item) => item.slug === article.slug), index))
      .filter(Boolean) as CmsArticle[]
    const filtered = type ? mapped.filter((article) => article.articleType === type) : mapped
    return filtered.length ? filtered : null
  }, legacy)
}

export async function getArticle(slug: string): Promise<CmsArticle | null> {
  const fallback = legacyArticles.find((article) => article.slug === slug) || null
  return resolveContent(async () => {
    const article = await sanityFetch<SanityArticle>(articleBySlugQuery, {slug})
    const mapped = article ? mapArticle(article, fallback || undefined) : null
    return mapped
  }, fallback)
}

export async function getBasketballPreviewPage(legacyData: SportsPageData): Promise<SportsPageData> {
  const category = await getProductCategory('basketball-uniforms')
  const products = await getProducts('basketball-uniforms')
  const faqs = await getFaqGroups()
  const flatFaqs = faqs.flatMap((group) => group.items).slice(0, 8)

  if (!category) return legacyData
  const designs = products
    .filter((product) => product.image)
    .slice(0, 3)
    .map((product) => ({title: product.title, description: product.description, image: product.image?.url || legacyData.heroImage}))

  return {
    ...legacyData,
    metaTitle: category.seo.title,
    metaDescription: category.seo.description,
    eyebrow: category.shortName || legacyData.eyebrow,
    h1: category.title || legacyData.h1,
    heroText: category.description || legacyData.heroText,
    heroImage: category.image.url || legacyData.heroImage,
    primaryKeyword: category.title || legacyData.primaryKeyword,
    productTypes: products.length ? products.map((product) => ({title: product.title, description: product.description})) : legacyData.productTypes,
    features: products.length ? products.slice(0, 4).map((product) => ({title: product.title, description: product.description})) : legacyData.features,
    designs: designs.length ? designs : legacyData.designs,
    faqs: flatFaqs.length ? flatFaqs : legacyData.faqs,
  }
}
