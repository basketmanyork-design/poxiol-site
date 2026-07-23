const seoProjection = `seo{
  seoTitle,
  metaDescription,
  canonicalUrl,
  ogImage,
  indexStatus
}`

const imageProjection = `{
  asset,
  altText
}`

const ctaProjection = `{
  label,
  url,
  href
}`

const pageSectionProjection = `contentSections[]{
  sectionType,
  eyebrow,
  title,
  body,
  image${imageProjection},
  facts,
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
    companyAddress
  },
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
  policyLinks[]{label, url}
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
  keyFeatures,
  displayOrder,
  publishStatus,
  ${seoProjection}
}`

const productProjection = `{
  _id,
  productName,
  "slug": slug.current,
  "categorySlug": category->slug.current,
  "categoryTitle": category->categoryName,
  shortDescription,
  fullDescription,
  primaryImage${imageProjection},
  detailImages[]${imageProjection},
  productionImages[]${imageProjection},
  qcImages[]${imageProjection},
  packagingImages[]${imageProjection},
  fabricOptions,
  customizationOptions,
  procurementOverride,
  "relatedFaqs": relatedFaqs[] | order(displayOrder asc){"question": faq->question, "answer": faq->answer},
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
  category,
  displayOrder,
  publishStatus
}`

const articleProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
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

export const procurementStandardsQuery = `*[_type == "procurementStandards"][0]{
  defaultMOQ,
  sampleTime,
  bulkProductionTime,
  mockupTime,
  shippingNotes,
  qualityPromise
}`
