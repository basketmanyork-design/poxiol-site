export const siteSettingsQuery = `*[_type == "siteSettings"] | order(_updatedAt desc)[0]{
  _id,
  brandName,
  siteUrl,
  logo,
  contactInfo{
    publicEmail,
    whatsappNumber,
    whatsappMessage
  },
  footer{
    copyright,
    address
  },
  globalSeo{
    seoTitle,
    metaDescription,
    canonicalUrl,
    ogImage
  }
}`

export const procurementStandardsQuery = `*[_type == "procurementStandards"] | order(_updatedAt desc)[0]{
  _id,
  minimumSampleMOQ,
  sampleProductionTime,
  expressDeliveryTime,
  sizeTolerance,
  mockupPolicy
}`

export const productCategoryQuery = `*[
  _type == "productCategory" && slug.current == $slug
] | order(_updatedAt desc)[0]{
  _id,
  categoryName,
  shortName,
  slug,
  heroTitle,
  heroDescription,
  heroImage,
  introduction,
  buyerTypes,
  keyFeatures,
  fabricOptions,
  customizationOptions,
  displayOrder,
  seo{
    seoTitle,
    metaDescription,
    canonicalUrl,
    ogImage
  }
}`

export const productListQuery = `*[
  _type == "product" && (
    category->slug.current == $categorySlug || sportType == $sportType
  )
] | order(displayOrder asc, _updatedAt desc){
  _id,
  productName,
  slug,
  shortDescription,
  fullDescription,
  primaryImage,
  sportType,
  productType,
  fabric,
  fabricComposition,
  gsm,
  printingMethod,
  sizeRange,
  buyerTypes,
  quoteRequirements,
  packagingOptions,
  shippingNotes,
  displayOrder
}`

export const faqForBasketballQuery = `*[
  _type == "faqItem" && (
    category in ["Basketball", "Sample", "MOQ", "Shipping"] ||
    "Basketball" in applicableSports ||
    "products/basketball-uniforms" in applicablePages
  )
] | order(displayOrder asc, _updatedAt desc){
  _id,
  question,
  answer,
  category,
  displayOrder
}`
