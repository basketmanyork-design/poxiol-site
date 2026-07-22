import 'server-only'

import {caseStudies} from '@/lib/case-studies'
import {faqData} from '@/lib/faq'
import {buyingGuides} from '@/lib/guides'
import {resourcePages} from '@/lib/resources-data'
import {sportsPages} from '@/lib/sports-pages'
import type {
  CmsArticle,
  CmsFaqGroup,
  CmsFooterColumn,
  CmsLink,
  CmsPage,
  CmsProduct,
  CmsProductCategory,
  CmsProject,
  CmsSiteChrome,
} from './types'

const publicEmail = 'york@basketman.cn'
const salesEmail = 'sales@poxiol.com'
const whatsappNumber = '+8613055646888'
const whatsappDigits = '8613055646888'
const alibabaStoreUrl = 'https://basketman.en.alibaba.com/'

export const legacyHeaderNavigation: CmsLink[] = [
  {label: 'Solutions', href: '/solutions/'},
  {label: 'Products', href: '/products/'},
  {label: 'Gallery', href: '/design-gallery/'},
  {label: 'Factory', href: '/factory/'},
  {label: 'Customization', href: '/customization/'},
  {label: 'About', href: '/about/'},
  {label: 'Contact', href: '/contact/'},
]

export const legacyFooterColumns: CmsFooterColumn[] = [
  {
    title: 'B2B Solutions',
    links: [
      {label: 'Basketball Program', href: '/solutions/'},
      {label: 'Soccer Program', href: '/solutions/'},
      {label: 'Private Label OEM', href: '/solutions/'},
      {label: 'Teamwear Package', href: '/solutions/'},
    ],
  },
  {
    title: 'Product Categories',
    links: [
      {label: 'Basketball Uniforms', href: '/products/basketball-uniforms/'},
      {label: 'Soccer Jerseys', href: '/products/soccer-jerseys/'},
      {label: 'Training Wear', href: '/products/training-wear/'},
      {label: 'Design Gallery', href: '/design-gallery/'},
    ],
  },
  {
    title: 'Manufacturing',
    links: [
      {label: 'Factory Overview', href: '/factory/'},
      {label: 'Quality Control', href: '/quality-control-process/'},
      {label: 'Customization Options', href: '/customization/'},
      {label: 'OEM/ODM Process', href: '/oem-odm/'},
    ],
  },
  {
    title: 'Company',
    links: [
      {label: 'About POXIOL', href: '/about/'},
      {label: 'Resources', href: '/resources/'},
      {label: 'FAQ Center', href: '/faq/'},
      {label: 'Contact Us', href: '/contact/'},
    ],
  },
]

export const legacySiteChrome: CmsSiteChrome = {
  brandName: 'POXIOL',
  siteUrl: 'https://www.poxiol.com',
  publicEmail,
  salesEmail,
  whatsappNumber,
  whatsappHref: `https://wa.me/${whatsappDigits}`,
  whatsappMessage: 'Hello POXIOL, I would like to discuss a custom teamwear project.',
  alibabaStoreUrl,
  headerNavigation: legacyHeaderNavigation,
  footerColumns: legacyFooterColumns,
  copyright: '© 2026 POXIOL Teamwear. All rights reserved.',
  address: 'China-based custom teamwear manufacturing partner for global B2B buyers.',
}

function pageSections(title: string) {
  return [
    {
      eyebrow: 'CMS Content',
      title: `${title} overview`,
      body: `${title} content can be managed in Sanity with legacy fallback until the production copy is published.`,
      facts: ['Factory-direct support', 'B2B order guidance', 'Quality controlled production'],
      cta: {label: 'Get factory quote', href: '/get-quote/'},
    },
  ]
}

export const legacyPages: CmsPage[] = [
  {
    key: 'homepage',
    slug: '',
    title: 'POXIOL',
    eyebrow: 'Factory-direct teamwear',
    heading: 'Custom Teamwear Manufacturer for Clubs, Schools and Sportswear Brands',
    description: 'Elite B2B custom teamwear manufacturer offering basketball uniforms, soccer kits and OEM sportswear with free mockup, MOQ 1 set and fast sample support.',
    heroCta: {label: 'Get free mockup', href: '/free-mockup/'},
    sections: pageSections('Homepage'),
    bottomCta: {label: 'Start your teamwear project', href: '/contact/'},
    seo: {
      title: 'Custom Teamwear Manufacturer | OEM Sports Uniform Supplier | POXIOL',
      description: 'Elite B2B custom teamwear manufacturer offering basketball uniforms, soccer kits and OEM sportswear with free mockup, MOQ 1 set and Sample Production: 2-3 Days After Mockup Confirmation.',
      canonicalUrl: 'https://www.poxiol.com/',
    },
  },
  ...[
    ['about', 'About POXIOL', 'Factory-direct teamwear partner'],
    ['factory', 'Factory', 'Manufacturing visibility'],
    ['manufacturing', 'Manufacturing', 'OEM and ODM production'],
    ['quality-control-process', 'Quality Control Process', 'Inspection before shipment'],
    ['customization', 'Customization', 'Teamwear customization'],
    ['contact', 'Contact', 'Talk to POXIOL'],
    ['oem-odm', 'OEM/ODM', 'Private-label production'],
    ['free-mockup', 'Free Mockup', 'Design before production'],
    ['sample-order', 'Sample Order', 'Physical sample support'],
    ['get-quote', 'Get Quote', 'Factory quote request'],
  ].map(([key, title, eyebrow]) => ({
    key,
    slug: key,
    title,
    eyebrow,
    heading: title,
    description: `${title} content is available from the legacy POXIOL site and can be overridden in Sanity.`,
    heroCta: {label: 'Contact POXIOL', href: '/contact/'},
    sections: pageSections(title),
    bottomCta: {label: 'Request a free mockup', href: '/free-mockup/'},
    seo: {
      title: `${title} | POXIOL`,
      description: `${title} information for POXIOL custom teamwear buyers.`,
      canonicalUrl: `https://www.poxiol.com/${key}/`,
    },
  })),
]

export const legacyProductCategories: CmsProductCategory[] = sportsPages.map((page, index) => ({
  slug: page.slug.replace(/^products\//, ''),
  title: page.primaryKeyword || page.h1,
  shortName: page.eyebrow,
  description: page.heroText,
  image: {url: page.heroImage, alt: page.h1},
  seo: {
    title: page.metaTitle,
    description: page.metaDescription,
    canonicalUrl: `https://www.poxiol.com/${page.slug}/`,
  },
  displayOrder: index,
  active: true,
}))

export const legacyProducts: CmsProduct[] = sportsPages.flatMap((page) =>
  page.productTypes.map((product, index) => ({
    slug: `${page.slug.replace(/^products\//, '')}-${index + 1}`,
    title: product.title,
    categorySlug: page.slug.replace(/^products\//, ''),
    description: product.description,
    image: {url: page.heroImage, alt: product.title},
    seo: {
      title: `${product.title} | POXIOL`,
      description: product.description,
    },
    displayOrder: index,
    active: true,
  })),
)

export const legacyProjects: CmsProject[] = caseStudies.map((project, index) => ({
  slug: project.slug,
  title: project.title,
  country: project.country,
  product: project.product,
  image: {url: project.image, alt: project.title},
  qualityControl: project.qualityControl,
  packaging: project.packingDelivery,
  solution: project.solution,
  overview: project.overview,
  seo: {
    title: `${project.title} | POXIOL B2B Case Study`,
    description: project.overview,
    canonicalUrl: `https://www.poxiol.com/projects/${project.slug}/`,
  },
  displayOrder: index,
}))

export const legacyFaqGroups: CmsFaqGroup[] = faqData

function articleDefaults(article: Partial<CmsArticle>): CmsArticle {
  return {
    slug: article.slug || '',
    title: article.title || '',
    excerpt: article.excerpt || article.intro || '',
    intro: article.intro || article.excerpt || '',
    eyebrow: article.eyebrow || 'Guide',
    featuredImage: article.featuredImage,
    body: article.body || article.intro || '',
    articleType: article.articleType || 'guide',
    author: article.author || 'POXIOL Editorial Team',
    reviewedBy: article.reviewedBy,
    methodology: article.methodology || '',
    references: article.references || [],
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    relatedProducts: article.relatedProducts || [],
    relatedCategories: article.relatedCategories || [],
    relatedCaseStudies: article.relatedCaseStudies || [],
    relatedArticles: article.relatedArticles || [],
    faqs: article.faqs || [],
    cta: article.cta || {label: 'Request free mockup', href: '/free-mockup/'},
    sections: article.sections || [],
    seo: article.seo || {title: article.title || 'POXIOL Article', description: article.excerpt || article.intro || ''},
    displayOrder: article.displayOrder || 0,
  }
}

export const legacyArticles: CmsArticle[] = [
  ...buyingGuides.map((guide, index) => articleDefaults({
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.intro,
    intro: guide.intro,
    eyebrow: guide.eyebrow,
    body: guide.sections.map((section) => `${section.title}\n${section.content}`).join('\n\n'),
    articleType: 'guide',
    sections: guide.sections,
    faqs: guide.faqs,
    seo: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      canonicalUrl: `https://www.poxiol.com/guides/${guide.slug}/`,
    },
    displayOrder: index,
  })),
  ...resourcePages.map((resource, index) => articleDefaults({
    slug: resource.slug,
    title: resource.h1,
    excerpt: resource.intro,
    intro: resource.intro,
    eyebrow: 'B2B Resource Guide',
    body: resource.sections.map((section) => `${section.title}\n${Array.isArray(section.content) ? section.content.join('\n') : section.content}`).join('\n\n'),
    articleType: 'resource',
    sections: resource.sections,
    cta: {label: resource.ctaText || 'Talk to POXIOL', href: '/contact/'},
    seo: {
      title: resource.metaTitle,
      description: resource.metaDescription,
      canonicalUrl: `https://www.poxiol.com/resources/${resource.slug}/`,
    },
    displayOrder: index,
  })),
]
