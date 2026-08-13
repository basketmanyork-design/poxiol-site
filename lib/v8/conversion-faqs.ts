import type {CmsFaqItem, CmsPage, CmsPageSection} from '../cms/types.ts'

export const FREE_MOCKUP_FAQS = [
  {
    question: 'What information is needed for a mockup request?',
    answer: 'Share the sport or product type, team or brand context, preferred colors, design direction, estimated quantity and target date. If some details are not yet confirmed, provide what is available so the remaining requirements can be reviewed.',
  },
  {
    question: 'Can buyers upload logos or references?',
    answer: 'Yes. Buyers can attach a logo and a reference image through the mockup request form. Clear files help the design discussion cover colors, placement and the intended visual direction.',
  },
  {
    question: 'What happens after receiving a mockup?',
    answer: 'The buyer can review the design direction, logo and color placement, and relevant product details. Feedback can then guide revisions or the next discussion about a quotation or production sample.',
  },
  {
    question: 'What information is needed before production discussion?',
    answer: 'Before discussing production, confirm the design direction, product specifications, size requirements, quantity, customization details, sample expectations, target date and shipping destination.',
  },
] as const satisfies readonly CmsFaqItem[]

export const GET_QUOTE_FAQS = [
  {
    question: 'What information is needed to prepare a quote?',
    answer: 'Share the product or sport, buyer role, estimated quantity, customization requirements, target date, shipping destination and any available logo or reference files. These details help define the project before quotation items are confirmed.',
  },
  {
    question: 'What affects the final quotation?',
    answer: 'The quotation depends on the product format, quantity, materials, customization, size requirements, labels, packaging and shipping requirements confirmed for the project.',
  },
  {
    question: 'Can I include custom names, numbers, labels or packaging in the quote?',
    answer: 'Yes. Names, numbers, labels and packaging can be discussed as part of the project specification. Include the required options in the request so their availability and quotation details can be reviewed.',
  },
  {
    question: 'What happens after I submit a quote request?',
    answer: 'The project information is reviewed before quotation details are confirmed. If specifications are incomplete, the next discussion can clarify the product, customization, quantity, timing and shipping requirements.',
  },
] as const satisfies readonly CmsFaqItem[]

export const SAMPLE_ORDER_FAQS = [
  {
    question: 'What information is needed for a sample request?',
    answer: 'Share the product or sport, intended use, customization requirements, size information, estimated bulk quantity, target date and shipping destination. Sample requirements are reviewed according to the project before preparation is discussed.',
  },
  {
    question: 'Can I provide my logo, artwork or reference files for the sample?',
    answer: 'Yes. Buyers can provide available logos, artwork or reference files with the request. Artwork, fabric, construction and customization details are then confirmed for the project before sample preparation.',
  },
  {
    question: 'What should I review when the sample is received?',
    answer: 'Review the agreed design, fit, measurements, fabric, print details, logo placement, names or numbers, sewing and other construction details against the confirmed sample requirements.',
  },
  {
    question: 'What happens after the sample is approved?',
    answer: 'Bulk production planning begins only after the sample feedback and project specifications are confirmed. Quantity, sizes, customization, packaging, timing and shipping requirements are reviewed for the bulk project.',
  },
] as const satisfies readonly CmsFaqItem[]

function withConversionFaqs(page: CmsPage, faqs: readonly CmsFaqItem[], section: Pick<CmsPageSection, 'eyebrow' | 'title' | 'body'>): CmsPage {
  const sectionsWithoutFaqs = page.sections.filter((section) => section.type !== 'faq' && !section.faqs?.length)
  const faqSection: CmsPageSection = {
    type: 'faq',
    ...section,
    faqs: faqs.map((faq) => ({...faq})),
  }
  return {
    ...page,
    sections: [...sectionsWithoutFaqs, faqSection],
  }
}

export function withFreeMockupFaqs(page: CmsPage, faqs: readonly CmsFaqItem[]): CmsPage {
  return withConversionFaqs(page, faqs, {
    eyebrow: 'Mockup Request FAQ',
    title: 'Before You Request a Mockup',
    body: 'Review the project information, file uploads and next steps used for a custom teamwear mockup request.',
  })
}

export function withGetQuoteFaqs(page: CmsPage, faqs: readonly CmsFaqItem[]): CmsPage {
  return withConversionFaqs(page, faqs, {
    eyebrow: 'Quote Request FAQ',
    title: 'Before You Request a Quote',
    body: 'Review the project details that help define a custom teamwear quotation and its next steps.',
  })
}

export function withSampleOrderFaqs(page: CmsPage, faqs: readonly CmsFaqItem[]): CmsPage {
  const normalizeSampleOrderText = (value: string) => value
    .replace(/Sample Production:\s*\d+\s*[-–]\s*\d+\s*(?:working\s*)?Days? After Mockup (?:Confirmation|Approval)\.?/gi, 'Sample timing is confirmed after the project requirements are reviewed.')
    .replace(/Sample shipping:\s*\d+\s*[-–]\s*\d+\s*Business Days? depending on country\.?/gi, 'Sample shipping timing is confirmed after the destination and project requirements are reviewed.')
    .replace(/\b(?:a\s+)?1[-\s]piece custom jersey sample order\b/gi, 'a custom jersey sample order')
  const pageWithSafeClaims: CmsPage = {
    ...page,
    description: normalizeSampleOrderText(page.description),
    sections: page.sections.map((section) => ({
      ...section,
      body: section.body ? normalizeSampleOrderText(section.body) : section.body,
      facts: section.facts?.map(normalizeSampleOrderText),
      stats: section.stats?.map((stat) => ({...stat, value: normalizeSampleOrderText(stat.value)})),
      steps: section.steps?.map((step) => ({...step, description: normalizeSampleOrderText(step.description)})),
      specifications: section.specifications?.map((item) => ({...item, value: normalizeSampleOrderText(item.value)})),
      faqs: section.faqs?.map((faq) => ({...faq, answer: normalizeSampleOrderText(faq.answer)})),
    })),
    seo: {...page.seo, description: normalizeSampleOrderText(page.seo.description)},
  }
  return withConversionFaqs(pageWithSafeClaims, faqs, {
    eyebrow: 'Sample Request FAQ',
    title: 'Before You Request a Sample',
    body: 'Review the project information, sample checks and confirmation steps used before bulk production planning.',
  })
}
