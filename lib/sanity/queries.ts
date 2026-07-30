const seoProjection = `seo{
  seoTitle,
  metaDescription,
  canonicalUrl,
  focusKeyword,
  secondaryKeywords,
  ogTitle,
  ogDescription,
  ogImage,
  nofollow,
  schemaType,
  indexStatus
}`

const imageProjection = `{
  asset,
  altText,
  caption,
  usageNotes,
  "url": asset->url
}`

const ctaProjection = `{
  label,
  url,
  href
}`

const pageSectionProjection = `contentSections[]{
  sectionType,
  enabled,
  displayOrder,
  eyebrow,
  title,
  body,
  image${imageProjection},
  facts,
  products[]->{productName, "slug": slug.current},
  productCategories[]->{categoryName, "slug": slug.current},
  caseStudies[]->{projectTitle, title, "slug": slug.current},
  stats[]{value, label},
  steps[]{title, description},
  specifications[]{label, value},
  gallery[]${imageProjection},
  faqs[]{question, answer},
  cta${ctaProjection}
}`

const linkProjection = `{
  label,
  externalUrl,
  url,
  href,
  openInNewWindow
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  _id,
  brandName,
  siteUrl,
  logo${imageProjection},
  contactInfo{
    publicEmail,
    salesEmail,
    whatsappNumber,
    whatsappMessage,
    alibabaStoreUrl,
    supportEmail,
    phone,
    businessHours,
    timezone,
    addressVisibility,
    companyAddress
  },
  socialLinks,
  favicon${imageProjection},
  defaultOgImage${imageProjection},
  footer{
    copyright,
    address
  },
  globalSeo{
    seoTitle,
    metaDescription,
    canonicalUrl,
    ogImage,
    indexStatus
  }
}`

export const navigationQuery = `*[_type == "navigationSettings"][0]{
  headerNavigation[]${linkProjection}
}`

export const footerQuery = `*[_type == "footerSettings"][0]{
  footerColumns[]{
    title,
    links[]${linkProjection}
  },
  copyright,
  policyLinks[]{label, externalUrl, url}
}`

export const sitePagesQuery = `*[_type == "sitePage"] | order(pageKey asc){
  _id,
  pageKey,
  internalName,
  "slug": slug.current,
  heroEyebrow,
  heroHeading,
  heroSubheading,
  heroImage${imageProjection},
  heroCTA${ctaProjection},
  heroSecondaryCTA${ctaProjection},
  homepageUspCards[]{metric, title, description, displayOrder},
  homepageSectionHeadings,
  inquirySupport,
  ${pageSectionProjection},
  bottomCTA${ctaProjection},
  ${seoProjection},
  publishStatus
}`

export const sitePageByKeyQuery = `*[_type == "sitePage" && pageKey == $key][0]{
  _id,
  pageKey,
  internalName,
  "slug": slug.current,
  heroEyebrow,
  heroHeading,
  heroSubheading,
  heroImage${imageProjection},
  heroCTA${ctaProjection},
  heroSecondaryCTA${ctaProjection},
  homepageUspCards[]{metric, title, description, displayOrder},
  homepageSectionHeadings,
  inquirySupport,
  ${pageSectionProjection},
  bottomCTA${ctaProjection},
  ${seoProjection},
  publishStatus
}`

export const productCategoriesQuery = `*[_type == "productCategory"] | order(displayOrder asc, _updatedAt desc){
  _id,
  categoryName,
  shortName,
  "slug": slug.current,
  heroDescription,
  introduction,
  heroImage${imageProjection},
  buyerTypes,
  targetMarkets,
  productTypes,
  coreBenefits,
  navigationVisibility,
  homepageVisibility,
  showOnHomepage,
  activeStatus,
  displayOrder,
  publishStatus,
  ${seoProjection}
}`

export const productCategoryBySlugQuery = `*[_type == "productCategory" && slug.current == $slug][0]{
  _id,
  categoryName,
  shortName,
  "slug": slug.current,
  heroTitle,
  heroDescription,
  introduction,
  heroImage${imageProjection},
  buyerTypes,
  targetMarkets,
  productTypes,
  keyFeatures,
  coreBenefits,
  "relatedFaqs": relatedFaqs[] | order(displayOrder asc){"question": faq->question, "answer": faq->answer},
  relatedCaseStudies[]->{projectTitle, title, "slug": slug.current},
  relatedGuides[]->{title, "slug": slug.current, articleType},
  displayOrder,
  navigationVisibility,
  homepageVisibility,
  showOnHomepage,
  activeStatus,
  publishStatus,
  ${seoProjection}
}`

const productProjection = `{
  _id,
  productName,
  productCode,
  "slug": slug.current,
  "categorySlug": category->slug.current,
  "categoryTitle": category->categoryName,
  sport,
  buyerTypes,
  targetMarkets,
  shortDescription,
  fullDescription,
  primaryImage${imageProjection},
  mainImage${imageProjection},
  gallery[]${imageProjection},
  detailImages[]${imageProjection},
  productionImages[]${imageProjection},
  qcImages[]${imageProjection},
  packagingImages[]${imageProjection},
  keyBenefits,
  fabricOptions,
  fabric,
  composition,
  gsm,
  printing,
  customizationOptions,
  customizationAreas,
  sizeRange,
  packaging,
  oem,
  privateLabel,
  procurementOverride,
  relatedProducts[]->{productName, "slug": slug.current},
  relatedCases[]->{projectTitle, title, "slug": slug.current},
  relatedGuides[]->{title, "slug": slug.current, articleType},
  "relatedFaqs": relatedFaqs[] | order(displayOrder asc){"question": faq->question, "answer": faq->answer},
  cta${ctaProjection},
  featured,
  displayOrder,
  publishStatus,
  ${seoProjection}
}`

export const productsQuery = `*[_type == "product"] | order(displayOrder asc, _updatedAt desc)${productProjection}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0]${productProjection}`

export const productsByCategoryQuery = `*[
  _type == "product" &&
  category->slug.current == $categorySlug
] | order(displayOrder asc, _updatedAt desc)${productProjection}`

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(displayOrder asc, _updatedAt desc){
  _id,
  projectTitle,
  title,
  caseType,
  realOrExample,
  "slug": slug.current,
  country,
  countryOrRegion,
  buyerType,
  region,
  quantityDisplay,
  projectTimeline,
  product,
  productType,
  heroImage${imageProjection},
  images[]${imageProjection},
  projectBackground,
  challenge,
  requirements,
  overview,
  qualityControl,
  qcProcess,
  packingDelivery,
  packaging,
  solution,
  materials,
  customization,
  sampleProcess,
  production,
  delivery,
  result,
  testimonial,
  evidenceStatus,
  relatedProducts[]->{productName, "slug": slug.current},
  relatedGuides[]->{title, "slug": slug.current, articleType},
  cta${ctaProjection},
  structuredDataType,
  displayOrder,
  publishStatus,
  ${seoProjection}
}`

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  projectTitle,
  title,
  "slug": slug.current,
  country,
  countryOrRegion,
  product,
  productType,
  heroImage${imageProjection},
  projectBackground,
  overview,
  qualityControl,
  qcProcess,
  packingDelivery,
  packaging,
  solution,
  displayOrder,
  publishStatus,
  ${seoProjection}
}`

export const faqItemsQuery = `*[_type == "faqItem"] | order(displayOrder asc, _updatedAt desc){
  _id,
  question,
  answer,
  shortAnswer,
  fullAnswer,
  sports,
  products[]->{productName, "slug": slug.current},
  productCategories[]->{categoryName, "slug": slug.current},
  pages[]->{internalName, pageKey, "slug": slug.current},
  guides[]->{title, "slug": slug.current, articleType},
  "category": select(
    category._type == "reference" =>
      coalesce(category->categoryName, "General"),
    defined(category) && category != "" =>
      category,
    defined(categoryRef) =>
      coalesce(categoryRef->categoryName, "General"),
    "General"
  ),
  displayOrder,
  publishStatus
}`

const articleProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  summary,
  category,
  tags,
  articleType,
  featuredImage${imageProjection},
  heroImage${imageProjection},
  body,
  sections,
  "authorName": author->name,
  "reviewedByName": reviewedBy->name,
  methodology,
  references,
  publishedAt,
  updatedAt,
  lastReviewedAt,
  relatedProducts[]->{productName, "slug": slug.current},
  relatedCategories[]->{categoryName, "slug": slug.current},
  relatedCaseStudies[]->{projectTitle, title, "slug": slug.current},
  relatedArticles[]->{title, "slug": slug.current, articleType},
  "relatedFaqs": faqReferences[] | order(displayOrder asc){"question": faq->question, "answer": faq->answer},
  cta${ctaProjection},
  displayOrder,
  publishStatus,
  ${seoProjection}
}`

export const articlesQuery = `*[_type == "article"] | order(displayOrder asc, publishedAt desc, _updatedAt desc)${articleProjection}`

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]${articleProjection}`

export const redirectRulesQuery = `*[_type == "redirectRule" && active == true] | order(sourcePath asc){
  sourcePath,
  destinationPath,
  redirectType
}`

export const procurementStandardsQuery = `*[_id == "procurementStandards"][0]{
  defaultMOQ,
  sampleMOQ,
  sampleTime,
  sampleProductionTime,
  bulkProductionTime,
  bulkProductionNote,
  mockupTime,
  shippingNotes,
  qualityPromise,
  qcStandard,
  sizeTolerance,
  mixedSizes
}`
