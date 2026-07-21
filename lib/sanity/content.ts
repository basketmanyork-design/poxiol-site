import 'server-only'

import type {SportsPageData} from '@/lib/sports-pages'
import {sanityFetch} from './client'
import {resolveContent, useLegacy} from './fallback'
import {cardImageUrl, heroImageUrl} from './image'
import {
  faqForBasketballQuery,
  procurementStandardsQuery,
  productCategoryQuery,
  productListQuery,
  siteSettingsQuery,
} from './queries'

type SanityImage = {
  asset?: {_ref?: string}
}

type SanitySiteSettings = {
  brandName?: string
  siteUrl?: string
  logo?: SanityImage
  globalSeo?: {
    seoTitle?: string
    metaDescription?: string
    canonicalUrl?: string
  }
}

type SanityProcurementStandards = {
  minimumSampleMOQ?: string
  sampleProductionTime?: string
  expressDeliveryTime?: string
  sizeTolerance?: string
  mockupPolicy?: string
}

type SanityProductCategory = {
  categoryName?: string
  shortName?: string
  heroTitle?: string
  heroDescription?: string
  heroImage?: SanityImage
  introduction?: string
  buyerTypes?: string[]
  keyFeatures?: string[]
  seo?: {
    seoTitle?: string
    metaDescription?: string
  }
}

type SanityProduct = {
  productName?: string
  shortDescription?: string
  fullDescription?: string
  primaryImage?: SanityImage
  productType?: string
  fabric?: string
  fabricComposition?: string
  gsm?: string
  printingMethod?: string
  sizeRange?: string
}

type PortableTextBlock = {
  children?: Array<{text?: string}>
}

type SanityFaq = {
  question?: string
  answer?: PortableTextBlock[]
}

export type HomeBrandContent = {
  brandName: string
  siteUrl: string
  seoTitle: string
  metaDescription: string
  canonicalUrl: string
}

const legacyHomeBrand: HomeBrandContent = {
  brandName: 'POXIOL',
  siteUrl: 'https://www.poxiol.com',
  seoTitle: 'Custom Teamwear Manufacturer | OEM Sports Uniform Supplier | POXIOL',
  metaDescription: 'Elite B2B custom teamwear manufacturer offering basketball uniforms, soccer kits and OEM sportswear with free mockup, MOQ 1 set and Sample Production: 2–3 Days After Mockup Confirmation.',
  canonicalUrl: 'https://www.poxiol.com/',
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((block) => block.children?.map((child) => child.text || '').join('') || '')
    .filter(Boolean)
    .join('\n')
}

export async function getHomeBrandContent(): Promise<HomeBrandContent> {
  return resolveContent(async () => {
    const settings = await sanityFetch<SanitySiteSettings>(siteSettingsQuery)
    if (!settings) return null

    const siteUrl = trimTrailingSlash(settings.siteUrl || legacyHomeBrand.siteUrl)
    return {
      brandName: settings.brandName || legacyHomeBrand.brandName,
      siteUrl,
      seoTitle: settings.globalSeo?.seoTitle || legacyHomeBrand.seoTitle,
      metaDescription: settings.globalSeo?.metaDescription || legacyHomeBrand.metaDescription,
      canonicalUrl: settings.globalSeo?.canonicalUrl || `${siteUrl}/`,
    }
  }, legacyHomeBrand)
}

function previewProcurementRows(
  standards: SanityProcurementStandards | null,
  product: SanityProduct | undefined,
): SportsPageData['procurementTable'] {
  const rows = [
    {item: 'Minimum Order (MOQ)', specification: standards?.minimumSampleMOQ},
    {item: 'Sample Production', specification: standards?.sampleProductionTime},
    {item: 'Express Delivery', specification: standards?.expressDeliveryTime},
    {item: 'Size Tolerance', specification: standards?.sizeTolerance},
    {item: 'Mockup Policy', specification: standards?.mockupPolicy},
    {item: 'Material Options', specification: [product?.fabricComposition, product?.fabric].filter(Boolean).join(' · ')},
    {item: 'Fabric Weight', specification: product?.gsm},
    {item: 'Printing', specification: product?.printingMethod},
    {item: 'Size Range', specification: product?.sizeRange},
  ]

  return rows.filter((row): row is {item: string; specification: string} => Boolean(row.specification))
}

export async function getBasketballPreviewPage(
  legacyData: SportsPageData,
): Promise<SportsPageData> {
  if (useLegacy()) return legacyData

  const [category, products, faqs, standards] = await Promise.all([
    resolveContent<SanityProductCategory | null>(
      () => sanityFetch<SanityProductCategory>(productCategoryQuery, {slug: 'basketball-uniforms'}),
      null,
    ),
    resolveContent<SanityProduct[]>(
      () => sanityFetch<SanityProduct[]>(productListQuery, {
        categorySlug: 'basketball-uniforms',
        sportType: 'Basketball',
      }),
      [],
    ),
    resolveContent<SanityFaq[]>(
      () => sanityFetch<SanityFaq[]>(faqForBasketballQuery),
      [],
    ),
    resolveContent<SanityProcurementStandards | null>(
      () => sanityFetch<SanityProcurementStandards>(procurementStandardsQuery),
      null,
    ),
  ])

  const mappedProducts = products
    .filter((product) => product.productName)
    .map((product) => ({
      title: product.productName as string,
      description: product.shortDescription || product.fullDescription || legacyData.heroText,
    }))

  const mappedCategoryFeatures = category?.keyFeatures?.map((feature) => ({
    title: feature,
    description: category.introduction || legacyData.heroText,
  })) || []

  const mappedFaqs = faqs
    .map((faq) => ({
      question: faq.question || '',
      answer: portableTextToPlainText(faq.answer),
    }))
    .filter((faq) => faq.question && faq.answer)

  const mappedDesigns = products
    .map((product) => {
      const image = cardImageUrl(product.primaryImage)
      if (!image || !product.productName) return null
      return {
        title: product.productName,
        description: product.shortDescription || product.fullDescription || legacyData.heroText,
        image,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item != null)

  const previewRows = previewProcurementRows(standards, products[0])
  const previewRowNames = new Set(previewRows.map((row) => row.item))

  return {
    ...legacyData,
    metaTitle: category?.seo?.seoTitle || legacyData.metaTitle,
    metaDescription: category?.seo?.metaDescription || legacyData.metaDescription,
    eyebrow: category?.shortName || category?.categoryName || legacyData.eyebrow,
    h1: category?.heroTitle || category?.categoryName || legacyData.h1,
    heroText: category?.heroDescription || category?.introduction || legacyData.heroText,
    heroImage: heroImageUrl(category?.heroImage) || legacyData.heroImage,
    primaryKeyword: category?.categoryName || legacyData.primaryKeyword,
    productTypes: mappedProducts.length ? mappedProducts : legacyData.productTypes,
    features: mappedProducts.length || mappedCategoryFeatures.length
      ? [...mappedProducts, ...mappedCategoryFeatures]
      : legacyData.features,
    designs: mappedDesigns.length ? mappedDesigns : legacyData.designs,
    buyerTypes: category?.buyerTypes?.length
      ? category.buyerTypes.map((buyerType) => ({
          title: buyerType,
          description: category.introduction || legacyData.heroText,
        }))
      : legacyData.buyerTypes,
    procurementTable: previewRows.length
      ? [
          ...previewRows,
          ...legacyData.procurementTable.filter((row) => !previewRowNames.has(row.item)),
        ]
      : legacyData.procurementTable,
    faqs: mappedFaqs.length ? mappedFaqs : legacyData.faqs,
  }
}

