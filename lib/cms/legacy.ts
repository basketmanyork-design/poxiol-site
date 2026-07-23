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
  CmsPageSection,
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
  whatsappHref: `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hello POXIOL, I would like to discuss a custom teamwear project.')}`,
  whatsappMessage: 'Hello POXIOL, I would like to discuss a custom teamwear project.',
  alibabaStoreUrl,
  headerNavigation: legacyHeaderNavigation,
  footerColumns: legacyFooterColumns,
  copyright: '© 2026 POXIOL Teamwear. All rights reserved.',
  address: 'China-based custom teamwear manufacturing partner for global B2B buyers.',
}

function pageSections(key: string, title: string): CmsPageSection[] {
  const commonCta = {label: 'Get factory quote', href: '/get-quote/'}
  const pages: Record<string, CmsPageSection[]> = {
    homepage: [
      {type: 'stats', eyebrow: 'Factory proof', title: 'Supplier strength buyers can verify', body: 'A practical teamwear supply system for clubs, schools and sportswear brands.', stats: [{value: 'MOQ 1', label: 'Set for samples and team orders'}, {value: '2–5 days', label: 'Sample production after mockup approval'}, {value: 'OEM/ODM', label: 'Private-label and teamwear programs'}, {value: 'Global', label: 'Export support for B2B buyers'}]},
      {type: 'processSteps', eyebrow: 'Start simple', title: 'How custom teamwear projects move forward', steps: [{title: 'Send design needs', description: 'Share sport, quantity, deadline, logo files and reference styles.'}, {title: 'Confirm mockup', description: 'Review design direction, materials and price before production.'}, {title: 'Sample or bulk', description: 'Approve sample details or move into confirmed bulk production.'}, {title: 'QC and delivery', description: 'Check names, numbers, packaging and shipment details before dispatch.'}]},
    ],
    about: [
      {type: 'imageText', eyebrow: 'About POXIOL', title: 'Factory-direct support for custom teamwear buyers', body: 'POXIOL helps teams and sportswear brands coordinate design, sampling, production and delivery without losing control of quality details.', image: {url: '/images/poxiol-v62/home_hero_v62_desktop.webp', alt: 'POXIOL custom teamwear presentation'}, facts: ['B2B teamwear focus', 'Design-to-production coordination', 'Legacy content preserved with CMS fallback']},
      {type: 'evidenceGrid', title: 'What buyers can manage', facts: ['Brand story and positioning', 'Factory capability copy', 'Contact and sales channels', 'Page-level SEO and CTA modules']},
    ],
    factory: [
      {type: 'imageText', eyebrow: 'Factory visibility', title: 'Production capability that can be explained clearly', body: 'Use the CMS to maintain factory overview, workshop imagery, buyer proof points and quote guidance while keeping the original POXIOL URL structure.', image: {url: '/images/factory/factory-main.webp', alt: 'POXIOL factory production area'}, facts: ['Cutting and sewing coordination', 'Sublimation and decoration support', 'Packing and export delivery']},
      {type: 'stats', title: 'Factory parameters', stats: [{value: 'MOQ 1', label: 'Available for selected custom teamwear orders'}, {value: '2–5 days', label: 'Typical sample production after mockup approval'}, {value: 'QC', label: 'Inspection before shipment'}, {value: 'OEM', label: 'Private-label support'}]},
    ],
    manufacturing: [
      {type: 'processSteps', eyebrow: 'Manufacturing workflow', title: 'From artwork to packed teamwear', steps: [{title: 'Artwork check', description: 'Confirm logo, color, name and number requirements.'}, {title: 'Material selection', description: 'Match fabric, print method and sport use case.'}, {title: 'Production', description: 'Coordinate cutting, printing, sewing and finishing.'}, {title: 'Packing', description: 'Prepare team sets, labels and shipment documentation.'}]},
      {type: 'gallery', title: 'Manufacturing modules', gallery: [{url: '/images/manufacturing/sublimation.webp', alt: 'Sublimation printing for custom teamwear'}, {url: '/images/manufacturing/factory-line.webp', alt: 'POXIOL factory production line'}, {url: '/images/manufacturing/packing-shipping.webp', alt: 'Packing and shipping custom uniforms'}]},
    ],
    'quality-control-process': [
      {type: 'processSteps', eyebrow: 'Quality control', title: 'Checks before custom teamwear leaves the factory', steps: [{title: 'Artwork check', description: 'Names, numbers, logos and colors are checked against approved mockup files.'}, {title: 'Fabric and sewing check', description: 'Material, seams and sizing details are reviewed during production.'}, {title: 'Packing check', description: 'Team sets and carton details are checked before shipment.'}]},
      {type: 'specificationsTable', title: 'QC checkpoints', specifications: [{label: 'Identity details', value: 'Names, numbers, logo placement and color consistency.'}, {label: 'Physical details', value: 'Fabric handfeel, stitching, trims and size specs.'}, {label: 'Delivery details', value: 'Packaging, quantity and export shipment labels.'}]},
    ],
    customization: [
      {type: 'evidenceGrid', eyebrow: 'Customization', title: 'Teamwear options buyers can control', body: 'Keep fabric, logo, name, number, color, packaging and private-label options editable without changing public URLs.', facts: ['Sublimation printing', 'Logo/name/number personalization', 'Private-label packaging', 'Team reorder support']},
      {type: 'imageText', title: 'Design before production', body: 'Buyers can start with a free mockup, confirm key details and then move into sample or bulk production.', image: {url: '/images/free-mockup/mockup-process.webp', alt: 'POXIOL free mockup process'}, cta: {label: 'Request free mockup', href: '/free-mockup/'}},
    ],
    'oem-odm': [
      {type: 'processSteps', eyebrow: 'OEM/ODM', title: 'Private-label sportswear project flow', steps: [{title: 'Brief', description: 'Define product line, fabric target, branding and quantity.'}, {title: 'Development', description: 'Align mockup, specs, sample and packaging direction.'}, {title: 'Production', description: 'Coordinate confirmed bulk production and QC.'}, {title: 'Delivery', description: 'Prepare export packing and shipment support.'}]},
      {type: 'cta', title: 'Plan an OEM/ODM program', body: 'Send your product concept, quantity range and target market so POXIOL can suggest the next practical step.', cta: commonCta},
    ],
    contact: [
      {type: 'richText', eyebrow: 'Contact POXIOL', title: 'Send project details for a practical reply', body: 'Share sport type, quantity, deadline, logo files and delivery country. POXIOL can reply with mockup, sample or quote guidance.'},
    ],
  }
  return pages[key as keyof typeof pages] || [
    {type: 'richText', eyebrow: title, title: title + ' overview', body: title + ' content remains available through legacy fallback and can be managed in Sanity once published.', facts: ['SEO metadata', 'Hero content', 'Body modules', 'Bottom CTA'], cta: commonCta},
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
    sections: pageSections('homepage', 'Homepage'),
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
    sections: pageSections(key, title),
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
