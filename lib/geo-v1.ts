import type {CmsFaqItem, CmsPage, CmsPageSection, CmsProduct} from './cms/types'
import type {SportsPageData} from './sports-pages'

export type GeoFaq = CmsFaqItem
export type GeoRow = {label: string; value: string}
export type GeoProductDetails = {
  overview: GeoRow[]
  specifications: GeoRow[]
  recommendedFor: readonly string[]
}

export const GEO_V1 = {
  canonicalBaseUrl: 'https://www.poxiol.com',
  organization: {
    id: 'https://www.poxiol.com/#organization',
    name: 'POXIOL',
    url: 'https://www.poxiol.com',
    description: 'Custom Teamwear Manufacturer specializing in basketball, soccer and baseball uniforms.',
    industry: 'Sportswear Manufacturing',
  },
  homepage: {
    heroHeading: 'Custom Teamwear Manufacturer for Basketball, Soccer & Baseball Programs',
    heroDescription: 'POXIOL provides custom basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors with design support, sample review and quality control.',
    entityTitle: 'Who Is POXIOL?',
    entityParagraphs: [
      'POXIOL is a B2B custom teamwear manufacturer specializing in basketball uniforms, soccer kits and baseball uniforms.',
      'We support clubs, schools, teamwear brands and distributors with customized production including team logos, names, numbers, colors and private label solutions.',
    ],
    customerTitle: 'Who We Help',
    customerSegments: [
      {title: 'Youth Teams', description: 'Custom uniforms for basketball, soccer and baseball programs.'},
      {title: 'Schools & Academies', description: 'Teamwear solutions for school sports programs.'},
      {title: 'Sports Brands', description: 'OEM and private label manufacturing support.'},
      {title: 'Distributors', description: 'Bulk custom apparel production.'},
    ],
  },
  about: {
    heading: 'B2B Custom Teamwear Manufacturer',
    description: 'POXIOL is a B2B custom teamwear manufacturer specializing in basketball uniforms, soccer kits and baseball uniforms. We help sports clubs, schools, teamwear brands and distributors develop customized uniforms through OEM and private label production, from design confirmation to production and quality inspection.',
    processTitle: 'Manufacturing Process',
    processSteps: [
      {title: 'Design Confirmation', description: 'Confirm the uniform design, colors, logos, names, numbers and project requirements.'},
      {title: 'Sample Development', description: 'Develop a sample for design, material and construction review before bulk production.'},
      {title: 'Material Preparation', description: 'Prepare the materials confirmed for the approved product specification.'},
      {title: 'Production', description: 'Produce the customized teamwear according to the confirmed specification.'},
      {title: 'Quality Inspection', description: 'Inspect customization, sizing and packing details before shipment.'},
      {title: 'International Shipping', description: 'Arrange international shipping using the method confirmed for the order.'},
    ],
  },
  product: {
    missingValue: 'Confirmed during project consultation',
    confirmedCustomization: 'Logos, names, numbers and colors',
    overviewLabels: ['Product Type', 'Application', 'Customization', 'Production Type', 'Suitable For'],
    specificationLabels: ['Fabric', 'Printing Technology', 'Customization Options', 'Available Sizes', 'MOQ', 'Production Type'],
    recommendedFor: ['Youth Basketball Teams', 'School Programs', 'Sports Clubs', 'Teamwear Brands', 'Distributors'],
  },
  basketballFaqs: [
    {
      question: 'Is POXIOL a manufacturer or trading company?',
      answer: 'POXIOL specializes in custom teamwear manufacturing and provides OEM and private label production services for basketball, soccer and baseball apparel.',
    },
    {
      question: 'Can small teams order custom basketball uniforms?',
      answer: 'POXIOL supports sample development and flexible order quantities for teams testing new designs before bulk production.',
    },
    {
      question: 'Can basketball jerseys include custom names and numbers?',
      answer: 'Yes, teams can customize logos, player names, numbers and colors.',
    },
    {
      question: 'What information is needed for a custom uniform quote?',
      answer: 'Customers can provide team design, logo files, quantity, size breakdown and customization requirements.',
    },
  ],
} as const

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function applyAboutGeoV1(page: CmsPage): CmsPage {
  const processTitle = normalizeText(GEO_V1.about.processTitle)
  const hasProcess = page.sections.some((section) => normalizeText(section.title) === processTitle)
  const processSection: CmsPageSection = {
    type: 'processSteps',
    eyebrow: 'How We Work',
    title: GEO_V1.about.processTitle,
    body: 'A clear custom production workflow from approved design details through shipment preparation.',
    steps: GEO_V1.about.processSteps.map((step) => ({...step})),
  }

  return {
    ...page,
    heading: GEO_V1.about.heading,
    description: GEO_V1.about.description,
    sections: hasProcess ? page.sections : [processSection, ...page.sections],
  }
}

function productionType(oem?: boolean, privateLabel?: boolean) {
  const values = [oem ? 'OEM' : '', privateLabel ? 'Private Label' : ''].filter(Boolean)
  return values.length ? values.join(' / ') : GEO_V1.product.missingValue
}

export function buildCmsProductGeoDetails(product: CmsProduct): GeoProductDetails {
  const missing = GEO_V1.product.missingValue
  const customization = product.customizationOptions.length
    ? product.customizationOptions.join(', ')
    : GEO_V1.product.confirmedCustomization
  const resolvedProductionType = productionType(product.oem, product.privateLabel)
  const suitableFor = GEO_V1.product.recommendedFor.join(', ')

  return {
    overview: [
      {label: 'Product Type', value: product.title},
      {label: 'Application', value: product.categoryTitle || product.categorySlug || missing},
      {label: 'Customization', value: customization},
      {label: 'Production Type', value: resolvedProductionType},
      {label: 'Suitable For', value: suitableFor},
    ],
    specifications: [
      {label: 'Fabric', value: product.fabric || (product.fabricOptions.length ? product.fabricOptions.join(', ') : missing)},
      {label: 'Printing Technology', value: product.printing || missing},
      {label: 'Customization Options', value: customization},
      {label: 'Available Sizes', value: product.sizeRange || missing},
      {label: 'MOQ', value: product.procurementOverride?.moq || missing},
      {label: 'Production Type', value: resolvedProductionType},
    ],
    recommendedFor: GEO_V1.product.recommendedFor,
  }
}

function procurementValue(data: SportsPageData, patterns: RegExp[]) {
  const row = data.procurementTable.find((item) => patterns.some((pattern) => pattern.test(item.item)))
  return row?.specification?.trim() || GEO_V1.product.missingValue
}

export function buildSportsProductGeoDetails(data: SportsPageData): GeoProductDetails {
  const missing = GEO_V1.product.missingValue
  const customization = procurementValue(data, [/customization/i])
  const production = procurementValue(data, [/production type/i, /oem/i, /private label/i])
  const buyerTypes = data.buyerTypes?.map((item) => item.title).filter(Boolean) || []

  return {
    overview: [
      {label: 'Product Type', value: data.h1},
      {label: 'Application', value: data.primaryKeyword || missing},
      {label: 'Customization', value: customization === missing ? GEO_V1.product.confirmedCustomization : customization},
      {label: 'Production Type', value: production},
      {label: 'Suitable For', value: buyerTypes.length ? buyerTypes.join(', ') : GEO_V1.product.recommendedFor.join(', ')},
    ],
    specifications: [
      {label: 'Fabric', value: procurementValue(data, [/^fabric/i, /material/i])},
      {label: 'Printing Technology', value: procurementValue(data, [/printing/i, /sublimation/i])},
      {label: 'Customization Options', value: customization === missing ? GEO_V1.product.confirmedCustomization : customization},
      {label: 'Available Sizes', value: procurementValue(data, [/size range/i, /available sizes/i, /^sizes?$/i])},
      {label: 'MOQ', value: procurementValue(data, [/\bmoq\b/i, /minimum order/i])},
      {label: 'Production Type', value: production},
    ],
    recommendedFor: GEO_V1.product.recommendedFor,
  }
}

export function mergeGeoFaqs(priority: readonly GeoFaq[], existing: readonly GeoFaq[]): GeoFaq[] {
  const seen = new Set<string>()
  return [...priority, ...existing].filter((faq) => {
    const key = normalizeText(faq.question)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function resolveSportsFaqs(data: SportsPageData): GeoFaq[] {
  if (data.slug !== 'products/basketball-uniforms') return [...data.faqs]
  return mergeGeoFaqs(GEO_V1.basketballFaqs, data.faqs)
}
