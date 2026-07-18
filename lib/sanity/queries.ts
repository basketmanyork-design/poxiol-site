export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  brandName, siteUrl, logo, favicon, publicEmail, publicPhone,
  whatsappNumber, whatsappMessage, companyAddress, businessHours,
  socialLinks, defaultSeo
}`;

export const procurementStandardsQuery = `*[_type == "procurementStandards"][0]`;

export const productCategoryQuery = (slug: string) => `*[_type == "productCategory" && slug.current == "${slug}"][0]{
  name, slug, heroImage, heroTitle, heroDescription,
  shortDescription, description, gallery, displayOrder, active, featured,
  relatedCategories[]->{name, slug},
  seo{seoTitle, metaDescription, canonicalUrl, ogImage},
  resolvedPath, publishStatus
}`;

export const productListQuery = (categorySlug: string) => `*[_type == "product" && category->slug.current == "${categorySlug}" && publishStatus == "published"] | order(displayOrder asc){
  name, slug, mainImage, shortDescription, productType, sports, fabric, gsm,
  printingMethod, keySellingPoints, MOQ, customizationOptions,
  relatedFAQs[]->{question, answer, category->{name}},
  seo{seoTitle, metaDescription, canonicalUrl, ogImage},
  resolvedPath
}`;

export const faqByCategoryQuery = (catSlug: string) => `*[_type == "faqItem" && category->slug.current == "${catSlug}" && publishStatus == "published"] | order(displayOrder asc){
  question, answer, category->{name}, keywords, displayOrder
}`;

export const articleListQuery = `*[_type == "article" && publishStatus == "published"] | order(publishedAt desc)[0...20]{
  title, slug, excerpt, heroImage, articleType, author->{name, role},
  publishedAt, seo{seoTitle, metaDescription}, resolvedPath
}`;

export const caseStudyListQuery = `*[_type == "caseStudy" && publishStatus == "published"] | order(projectDate desc)[0...10]{
  title, slug, publicBuyerLabel, countryOrRegion, sportType, orderQuantity,
  heroImage, projectBackground, solution, fabric, printingMethod,
  seo{seoTitle, metaDescription}, resolvedPath
}`;

export const navigationQuery = `*[_type == "navigationSettings"][0]{ headerNavigation[]{
  label, linkType, externalUrl, openInNewWindow,
  internalPage->{title, slug, _type},
  subMenu[]{label, internalPage->{title, slug}}
}}`;

export const footerQuery = `*[_type == "footerSettings"][0]{ footerColumns[]{title, links[]{label, page->{title, slug}}}, copyright, policyLinks }`;
