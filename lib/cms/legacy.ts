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


const corePageFallbacks: Record<string, {title: string; eyebrow: string; heading: string; description: string; seoTitle: string; metaDescription: string; image?: {url: string; alt: string}}> = {
  about: {title: 'About POXIOL', eyebrow: 'Our Identity', heading: 'Elite Custom Teamwear Manufacturing', description: 'POXIOL manufactures pro-grade custom teamwear directly from the factory floor, providing B2B buyers with 15+ years of expertise and 3,000+ team uniform projects.', seoTitle: 'About POXIOL | Professional Custom Teamwear Manufacturer', metaDescription: "Learn about POXIOL's journey in the custom teamwear industry. 15+ years of apparel experience, serving 3,000+ teams with high-performance sportswear.", image: {url: '/images/poxiol-v6/home_hero_custom_teamwear_manufacturer.png', alt: 'POXIOL Teamwear Manufacturing Expertise'}},
  factory: {title: 'Factory', eyebrow: 'Direct Manufacturer', heading: 'Custom Teamwear Factory in China for B2B Sportswear Buyers', description: 'Custom Teamwear Factory Direct. POXIOL operates a dedicated 30,000+ capacity facility in China, controlling every detail from digital mockup to manual QC checking and global export shipping.', seoTitle: 'Custom Teamwear Factory in China | POXIOL Sportswear Manufacturing', metaDescription: 'Visit the POXIOL teamwear factory. 15+ years experience, 30,000+ monthly capacity, high-color sublimation printing and precision sewing for B2B sports uniforms.', image: {url: '/images/poxiol-v6/manufacturing_sublimation_printing.png', alt: 'POXIOL production line for sublimated teamwear'}},
  manufacturing: {title: 'Manufacturing', eyebrow: 'Manufacturing Excellence', heading: 'Professional OEM & ODM Teamwear Manufacturing', description: 'POXIOL is a custom teamwear manufacturing platform specializing in OEM and ODM sports uniforms for clubs, schools, academies, distributors and sports brands worldwide.', seoTitle: 'OEM Sportswear Manufacturing | Custom Teamwear Factory | POXIOL', metaDescription: 'POXIOL is a professional OEM and ODM sportswear manufacturer specializing in custom basketball uniforms, soccer kits, baseball jerseys, volleyball apparel and private label teamwear.', image: {url: '/images/poxiol-v6/manufacturing_packing_global_delivery.png', alt: 'POXIOL teamwear packing inspection and global delivery preparation'}},
  'quality-control-process': {title: 'Quality Control Process', eyebrow: 'Quality Control', heading: 'Custom Teamwear Quality Control Process', description: 'POXIOL uses a multi-stage quality control workflow to help B2B buyers reduce production risk and ensure repeatable quality.', seoTitle: 'Custom Teamwear Quality Control Process | POXIOL Sports Uniform QC', metaDescription: 'Learn how POXIOL controls fabric, printing, sewing, sizing, packing and final inspection for custom basketball uniforms, soccer kits and OEM teamwear orders.', image: {url: '/images/poxiol-v6/manufacturing_quality_control.png', alt: 'POXIOL quality control inspection for custom sports uniforms'}},
  customization: {title: 'Customization', eyebrow: 'Customization', heading: 'Total Creative Control', description: 'At POXIOL, customization goes far beyond a logo. We help you engineer every detail of your uniform, from colors and graphics to private labels and packaging.', seoTitle: 'Unlimited Teamwear Customization Options | POXIOL', metaDescription: 'From custom logos and player names to private labels and specialized fabrics. POXIOL offers full-range teamwear customization for pro teams and brands.', image: {url: '/images/free-mockup/mockup-process.webp', alt: 'POXIOL free mockup process for custom teamwear'}},
  contact: {title: 'Contact', eyebrow: 'Start Your Project', heading: 'Get in Touch.', description: 'Share your sport category, logo, quantity, colors and deadline so POXIOL can prepare mockup, sample or quote guidance for your teamwear project.', seoTitle: 'Contact POXIOL | Get Free Custom Teamwear Mockup', metaDescription: 'Contact POXIOL to start your custom teamwear project. Submit sport category, logo, quantity, colors and deadline to get a free mockup and production plan.'},
  'oem-odm': {title: 'OEM/ODM', eyebrow: 'OEM/ODM Service', heading: 'OEM/ODM Partner', description: 'POXIOL helps sportswear brands, distributors, custom retailers and wholesalers develop private label teamwear collections across basketball, soccer, baseball, running, training wear and more.', seoTitle: 'OEM/ODM Sportswear Manufacturer for Custom Teamwear Brands | POXIOL', metaDescription: 'POXIOL supports OEM/ODM sportswear production for teamwear brands, distributors, wholesalers and custom uniform businesses with design support, sampling, sublimation printing and multi-sport collection development.', image: {url: '/images/poxiol-v6/home_oem_odm_solutions.png', alt: 'POXIOL OEM and ODM sportswear solutions'}},
  'free-mockup': {title: 'Free Mockup', eyebrow: 'Design Preview', heading: 'Free Mockup Design.', description: 'Request a free POXIOL custom teamwear mockup. Send your sport, logo, colors and quantity to get a professional uniform design preview within 24 hours.', seoTitle: 'Get a Free Custom Teamwear Mockup | POXIOL', metaDescription: 'Request a free POXIOL custom teamwear mockup. Send your sport, logo, colors and quantity to get a professional uniform design preview within 24 hours.', image: {url: '/images/free-mockup/mockup-process.webp', alt: 'POXIOL custom teamwear free mockup workflow'}},
  'sample-order': {title: 'Sample Order', eyebrow: 'Sample Support', heading: 'Sample Order Support.', description: 'Test fabric, fit and print quality before bulk production with a custom jersey sample order after mockup confirmation.', seoTitle: 'Start a Sample Order | POXIOL Custom Teamwear Testing', metaDescription: 'Test the fabric, fit, and print quality before bulk production. Start a 1-piece custom jersey sample order with Sample Production: 2-3 Days After Mockup Confirmation.'},
  'get-quote': {title: 'Get Quote', eyebrow: 'B2B Pricing', heading: 'Factory Direct Quote.', description: 'Request a POXIOL factory-direct quote and receive wholesale pricing and production plans for basketball, soccer and multi-sport teamwear within 24 hours.', seoTitle: 'Get a Factory Quote | POXIOL Custom Teamwear Wholesale', metaDescription: 'Request a wholesale factory quote for custom basketball uniforms, soccer kits, or OEM sportswear. Receive direct B2B pricing and production plans within 24 hours.'},
}

function pageSections(key: string, title: string): CmsPageSection[] {
  const commonCta = {label: 'Get factory quote', href: '/get-quote/'}
  const pages: Record<string, CmsPageSection[]> = {
    homepage: [
      {type: 'stats', eyebrow: 'Factory proof', title: 'Supplier strength buyers can verify', body: 'A practical teamwear supply system for clubs, schools and sportswear brands.', stats: [{value: 'MOQ 1', label: 'Set for samples and team orders'}, {value: '2–5 days', label: 'Sample production after mockup approval'}, {value: 'OEM/ODM', label: 'Private-label and teamwear programs'}, {value: 'Global', label: 'Export support for B2B buyers'}]},
      {type: 'processSteps', eyebrow: 'Start simple', title: 'How custom teamwear projects move forward', steps: [{title: 'Send design needs', description: 'Share sport, quantity, deadline, logo files and reference styles.'}, {title: 'Confirm mockup', description: 'Review design direction, materials and price before production.'}, {title: 'Sample or bulk', description: 'Approve sample details or move into confirmed bulk production.'}, {title: 'QC and delivery', description: 'Check names, numbers, packaging and shipment details before dispatch.'}]},
    ],
    about: [
      {type: 'imageText', eyebrow: 'About POXIOL', title: 'Factory-direct support for custom teamwear buyers', body: 'POXIOL helps teams and sportswear brands coordinate design, sampling, production and delivery without losing control of quality details.', image: {url: '/images/poxiol-v62/home_hero_v62_desktop.webp', alt: 'POXIOL custom teamwear presentation'}, facts: ['B2B teamwear focus', 'Design-to-production coordination', 'Factory-direct supply chain']},
      {type: 'evidenceGrid', title: 'What buyers can manage', facts: ['15+ years of apparel experience', '3,000+ team projects served', '50+ countries shipped', 'High-color sublimation focus']},
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
      {type: 'stats', eyebrow: 'Creative scope', title: 'Uniform details buyers can control', stats: [{value: 'Logo', label: 'Team and sponsor graphics'}, {value: 'Names', label: 'Player names and numbers'}, {value: 'Fabric', label: 'Sport-specific material choices'}, {value: 'Label', label: 'Private-label packaging options'}]},
      {type: 'evidenceGrid', eyebrow: 'Customization', title: 'Teamwear options buyers can control', body: 'Keep fabric, logo, name, number, color, packaging and private-label options editable without changing public URLs.', facts: ['Sublimation printing', 'Logo/name/number personalization', 'Private-label packaging', 'Team reorder support']},
      {type: 'imageText', title: 'Design before production', body: 'Buyers can start with a free mockup, confirm key details and then move into sample or bulk production.', image: {url: '/images/free-mockup/mockup-process.webp', alt: 'POXIOL free mockup process'}, cta: {label: 'Request free mockup', href: '/free-mockup/'}},
    ],
    'oem-odm': [
      {type: 'imageText', eyebrow: 'Service overview', title: 'Teamwear Development Support', body: 'POXIOL supports buyers who want more than a one-time team order, from private-label planning to repeatable collection development.', image: {url: '/images/poxiol-v6/home_oem_odm_solutions.png', alt: 'POXIOL OEM and ODM sportswear solutions'}},
      {type: 'processSteps', eyebrow: 'OEM/ODM', title: 'Private-label sportswear project flow', steps: [{title: 'Brief', description: 'Define product line, fabric target, branding and quantity.'}, {title: 'Development', description: 'Align mockup, specs, sample and packaging direction.'}, {title: 'Production', description: 'Coordinate confirmed bulk production and QC.'}, {title: 'Delivery', description: 'Prepare export packing and shipment support.'}]},
      {type: 'cta', title: 'Plan an OEM/ODM program', body: 'Send your product concept, quantity range and target market so POXIOL can suggest the next practical step.', cta: commonCta},
    ],
    'free-mockup': [
      {type: 'imageText', eyebrow: 'Design preview', title: 'Request Free Mockup', body: 'Upload your team logo, reference design or color direction. POXIOL prepares a high-fidelity visual preview for review before sample or bulk production.', image: {url: '/images/free-mockup/mockup-process.webp', alt: 'POXIOL custom teamwear free mockup workflow'}},
      {type: 'processSteps', eyebrow: 'Next steps', title: 'After You Submit Your Request', steps: [{title: 'Send project details', description: 'Share sport category, logo, colors, quantity and deadline.'}, {title: 'Review mockup', description: 'Confirm front and back layout, color direction and names or numbers.'}, {title: 'Plan sample', description: 'Move into sample or quote once design direction is approved.'}, {title: 'Prepare production', description: 'Use confirmed mockup details for bulk planning and QC.'}]},
      {type: 'evidenceGrid', eyebrow: 'Preparation', title: 'What to Prepare for a Free Mockup', facts: ['Team or brand logo', 'Sport category and product type', 'Color references', 'Quantity and deadline']},
      {type: 'faq', eyebrow: 'Expert Answers', title: 'Mockup Sourcing FAQ', faqs: [{question: 'How long does a POXIOL free mockup take?', answer: 'Most complete requests can receive a design preview within 24 hours.'}, {question: 'Do I need production-ready artwork?', answer: 'No. A clear logo file and reference colors are enough to start.'}]},
    ],
    'sample-order': [
      {type: 'processSteps', eyebrow: 'Sample support', title: 'Request Physical Sample', steps: [{title: 'Confirm mockup', description: 'Approve visual direction before sampling.'}, {title: 'Choose fabric', description: 'Select sport-appropriate material and construction.'}, {title: 'Review sample', description: 'Check fit, printing, stitching and packaging direction.'}, {title: 'Plan bulk order', description: 'Move into final pricing and production schedule.'}]},
      {type: 'faq', eyebrow: 'Buying Guide', title: 'Teamwear Sampling FAQ', faqs: [{question: 'Can I order one custom sample?', answer: 'Yes. POXIOL supports sample orders for selected custom teamwear projects.'}, {question: 'What should I check on the sample?', answer: 'Review fabric, fit, print clarity, logo placement, size and sewing details.'}]},
    ],
    'get-quote': [
      {type: 'processSteps', eyebrow: 'B2B pricing', title: 'Factory quote preparation', steps: [{title: 'Volume-based OEM pricing', description: 'Locked pricing tiers based on quantity, product mix and customization level.'}, {title: 'Technical specification review', description: 'Quotes include fabric options, sublimation confirmation and label details.'}, {title: 'Global logistics estimates', description: 'Estimated door-to-door express shipping rates to key markets.'}]},
      {type: 'faq', eyebrow: 'Buying Guide', title: 'Quote Sourcing FAQ', faqs: [{question: 'How long does it take to get a teamwear quote?', answer: 'POXIOL provides professional B2B quotes within 24 hours after receiving complete project details.'}, {question: 'Does the quote include international shipping?', answer: 'Yes. POXIOL can include door-to-door shipping estimates in the formal quotation.'}]},
    ],
    contact: [
      {type: 'richText', eyebrow: 'Contact POXIOL', title: 'Send project details for a practical reply', body: 'Share sport type, quantity, deadline, logo files and delivery country. POXIOL can reply with mockup, sample or quote guidance.'},
    ],
  }
  return pages[key as keyof typeof pages] || [
    {type: 'richText', eyebrow: title, title: title + ' overview', body: 'POXIOL provides practical custom teamwear support for buyers who need clear production details, responsive quotation and reliable delivery planning.', facts: ['Factory-direct support', 'Project-specific quotation', 'Design and sample coordination', 'Export delivery planning'], cta: commonCta},
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
    fullDescription: product.description,
    image: {url: page.heroImage, alt: product.title},
    detailImages: [{url: page.heroImage, alt: product.title}],
    productionImages: [],
    qcImages: [],
    packagingImages: [],
    fabricOptions: [],
    customizationOptions: [],
    relatedFaqs: page.faqs,
    featured: index < 2,
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
  articleDefaults({
    slug: 'custom-teamwear-production-notes',
    title: 'Custom Teamwear Production Notes for B2B Buyers',
    excerpt: 'Practical POXIOL production notes covering custom teamwear sampling, quality checks and export-ready ordering details.',
    intro: 'Practical POXIOL production notes covering custom teamwear sampling, quality checks and export-ready ordering details.',
    eyebrow: 'POXIOL Blog',
    body: 'Custom teamwear buyers should confirm sport category, quantity, logo files, size breakdown, deadline and packaging needs before sampling. POXIOL uses these details to prepare mockup, sample and production guidance.',
    articleType: 'blog',
    sections: [
      {title: 'What to prepare before requesting a quote', content: ['Sport category and product type', 'Logo files and color references', 'Quantity and size breakdown', 'Delivery country and deadline']},
      {title: 'How POXIOL keeps production practical', content: 'The team reviews mockup feasibility, fabric options, customization areas and QC requirements before confirming sample or bulk production steps.'},
    ],
    faqs: [
      {question: 'How should buyers prepare before requesting production guidance?', answer: 'Share the sport category, quantity, logo files, size breakdown, deadline and delivery country so POXIOL can suggest a practical next step.'},
    ],
    seo: {
      title: 'Custom Teamwear Production Notes | POXIOL Blog',
      description: 'B2B production notes for custom teamwear buyers planning mockup, sample, QC and export delivery with POXIOL.',
      canonicalUrl: 'https://www.poxiol.com/blog/custom-teamwear-production-notes/',
    },
    displayOrder: 0,
  }),
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
