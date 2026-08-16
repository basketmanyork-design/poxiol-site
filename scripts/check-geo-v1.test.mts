import assert from 'node:assert/strict'
import {
  GEO_V1,
  applyAboutGeoV1,
  buildCmsProductGeoDetails,
  buildSportsProductGeoDetails,
  resolveSportsFaqs,
} from '../lib/geo-v1.ts'

assert.equal(
  GEO_V1.homepage.heroHeading,
  'Custom Teamwear Manufacturer for Basketball, Soccer & Baseball Programs',
)
assert.equal(
  GEO_V1.homepage.heroDescription,
  'POXIOL provides custom basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors with design support, sample review and quality control.',
)
assert.equal(GEO_V1.organization.id, 'https://www.poxiol.com/#organization')
assert.deepEqual(GEO_V1.organization, {
  id: 'https://www.poxiol.com/#organization',
  name: 'POXIOL',
  url: 'https://www.poxiol.com',
  description: 'Custom Teamwear Manufacturer specializing in basketball, soccer and baseball uniforms.',
  industry: 'Sportswear Manufacturing',
})

const existingSection = {type: 'richText' as const, title: 'Existing section', body: 'Keep me'}
const about = applyAboutGeoV1({
  key: 'about',
  slug: 'about',
  title: 'About',
  eyebrow: 'Original eyebrow',
  heading: 'Old heading',
  description: 'Old description',
  sections: [existingSection],
  seo: {title: 'Existing SEO title', description: 'Existing SEO description'},
})

assert.equal(about.heading, 'B2B Custom Teamwear Manufacturer')
assert.match(about.description, /clubs, schools, teamwear brands and distributors/i)
assert.match(about.description, /OEM and private label production/i)
assert.equal(about.sections[0].type, 'processSteps')
assert.equal(about.sections[0].title, 'Manufacturing Process')
assert.deepEqual(
  about.sections[0].steps?.map((step) => step.title),
  ['Design Confirmation', 'Sample Development', 'Material Preparation', 'Production', 'Quality Inspection', 'International Shipping'],
)
assert.equal(about.sections[1], existingSection)
assert.equal(about.seo.title, 'Existing SEO title')

const aboutWithProcess = applyAboutGeoV1({
  ...about,
  sections: [
    {type: 'processSteps', title: 'Manufacturing Process', steps: [{title: 'Existing process', description: 'Existing description'}]},
    existingSection,
  ],
})
assert.equal(
  aboutWithProcess.sections.filter((section) => section.title === 'Manufacturing Process').length,
  1,
  'About safety override must not duplicate the Manufacturing Process section',
)

const product = buildCmsProductGeoDetails({
  slug: 'test-jersey',
  title: 'Test Jersey',
  categoryTitle: 'Basketball Uniforms',
  description: 'Fixture',
  detailImages: [],
  productionImages: [],
  qcImages: [],
  packagingImages: [],
  fabricOptions: [],
  fabric: 'Confirmed mesh',
  printing: 'Confirmed sublimation',
  customizationOptions: ['Logo', 'Name', 'Number'],
  sizeRange: 'Youth to adult',
  oem: true,
  privateLabel: true,
  procurementOverride: {moq: '1 sample set'},
  relatedFaqs: [],
  featured: false,
  seo: {title: 'Fixture', description: 'Fixture'},
  displayOrder: 0,
  active: true,
})

assert.deepEqual(product.overview.map((row) => row.label), [
  'Product Type',
  'Application',
  'Customization',
  'Production Type',
  'Suitable For',
])
assert.deepEqual(product.specifications.map((row) => row.label), [
  'Fabric',
  'Printing Technology',
  'Customization Options',
  'Available Sizes',
  'MOQ',
  'Production Type',
])
assert.equal(product.specifications.find((row) => row.label === 'Fabric')?.value, 'Confirmed mesh')
assert.equal(product.specifications.find((row) => row.label === 'Printing Technology')?.value, 'Confirmed sublimation')
assert.equal(product.specifications.find((row) => row.label === 'Available Sizes')?.value, 'Youth to adult')
assert.equal(product.specifications.find((row) => row.label === 'MOQ')?.value, '1 sample set')
assert.equal(product.specifications.find((row) => row.label === 'Production Type')?.value, 'OEM / Private Label')

const missingProduct = buildCmsProductGeoDetails({
  slug: 'fallback-jersey',
  title: 'Fallback Jersey',
  description: 'Fixture',
  detailImages: [],
  productionImages: [],
  qcImages: [],
  packagingImages: [],
  fabricOptions: [],
  customizationOptions: [],
  relatedFaqs: [],
  featured: false,
  seo: {title: 'Fallback fixture', description: 'Fallback fixture'},
  displayOrder: 0,
  active: true,
})
for (const label of ['Fabric', 'Printing Technology', 'Available Sizes', 'MOQ', 'Production Type']) {
  assert.equal(
    missingProduct.specifications.find((row) => row.label === label)?.value,
    'Confirmed during project consultation',
    `${label} must use the approved factual fallback`,
  )
}

const existingFaq = {question: 'Existing question?', answer: 'Existing answer.'}
const basketballFaqs = resolveSportsFaqs({
  slug: 'products/basketball-uniforms',
  faqs: [
    existingFaq,
    {
      question: '  IS POXIOL A MANUFACTURER OR TRADING COMPANY? ',
      answer: 'Outdated duplicate answer.',
    },
  ],
} as never)
assert.deepEqual(
  basketballFaqs.slice(0, 4).map((faq) => faq.question),
  [
    'Is POXIOL a manufacturer or trading company?',
    'Can small teams order custom basketball uniforms?',
    'Can basketball jerseys include custom names and numbers?',
    'What information is needed for a custom uniform quote?',
  ],
)
assert.equal(
  basketballFaqs.filter((faq) => faq.question.toLowerCase().includes('manufacturer or trading company')).length,
  1,
)
assert.equal(basketballFaqs.at(-1), existingFaq)

const nonBasketballFaqs = resolveSportsFaqs({slug: 'products/soccer-jerseys', faqs: [existingFaq]} as never)
assert.deepEqual(nonBasketballFaqs, [existingFaq])

const sportsDetails = buildSportsProductGeoDetails({
  slug: 'products/basketball-uniforms',
  h1: 'Custom Basketball Uniforms',
  primaryKeyword: 'custom basketball uniforms',
  procurementTable: [
    {item: 'Fabric', specification: 'Confirmed category fabric'},
    {item: 'Printing', specification: 'Confirmed category printing'},
    {item: 'MOQ', specification: 'Confirmed category MOQ'},
  ],
  buyerTypes: [{title: 'Sports Clubs', description: 'Fixture'}],
} as never)
assert.equal(sportsDetails.specifications.find((row) => row.label === 'Fabric')?.value, 'Confirmed category fabric')
assert.equal(sportsDetails.specifications.find((row) => row.label === 'Printing Technology')?.value, 'Confirmed category printing')
assert.equal(sportsDetails.specifications.find((row) => row.label === 'MOQ')?.value, 'Confirmed category MOQ')
assert.equal(
  sportsDetails.specifications.find((row) => row.label === 'Available Sizes')?.value,
  'Confirmed during project consultation',
)

console.log('POXIOL GEO V1 runtime checks passed')
