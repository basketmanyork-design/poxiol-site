import type {CmsArticle, CmsFaqItem, CmsLink} from '@/lib/cms/types'

export const WEEK3_GUIDE_SLUGS = [
  'custom-basketball-uniform-manufacturer-guide',
  'custom-soccer-kits-wholesale-guide',
] as const

export type Week3GuideSlug = (typeof WEEK3_GUIDE_SLUGS)[number]

const siteUrl = 'https://www.poxiol.com'
const guideLinks = (items: Array<{label: string; href: string}>): CmsLink[] => items

const sharedFaqs = (sport: string): CmsFaqItem[] => [
  {
    question: `What should a buyer compare when choosing a ${sport} supplier?`,
    answer: `Compare the supplier's confirmed product scope, available samples, decoration options, size process, quality checks, packaging assumptions and written quotation. Treat capability statements as items to verify for the specific ${sport} program.`,
  },
  {
    question: 'What information should be sent before requesting a quotation?',
    answer: 'Send the garment type, quantity estimate, size breakdown, artwork, personalization, packaging, destination, target market requirements and requested schedule. The supplier can then confirm what is feasible for the project.',
  },
  {
    question: 'How can a buyer verify quality before bulk production?',
    answer: 'Request a representative sample or traceable swatch, record the approved measurements and artwork, and agree the inspection points and packing checks in writing before bulk production.',
  },
  {
    question: 'Can a supplier promise one fixed specification for every order?',
    answer: 'No. Fabric availability, construction, personalization, size mix, destination and buyer requirements can change the quotation. Confirm the current specification and schedule for each order.',
  },
]

const procurementSections = (sport: string, options: string[], links: CmsLink[]) => [
  {
    title: '30-second answer',
    content: `A ${sport} supplier should be evaluated through the complete procurement record: product construction, available materials, decoration, size range, sample process, quality checks, packaging, shipping assumptions and written schedule. Ask for evidence that applies to your project instead of relying on a generic factory claim.`,
  },
  {
    title: 'Why this decision matters',
    content: `The lowest headline quote may not describe the same garment or approval scope. Clarify the ${sport} configuration, artwork, sizes, labels, packaging and inspection points before comparing suppliers so price, timing and quality discussions refer to the same specification.`,
  },
  {
    title: 'Options and conditions to compare',
    content: options,
  },
  {
    title: 'Scenario-based guidance',
    content: [
      `For a club or school program, document the roster, size chart, artwork approval and repeat-order reference before asking for bulk pricing.`,
      `For a distributor or brand, confirm label, packaging, destination and target-market requirements before approving a sample.`,
      `For a new construction, fabric or complex personalization request, start with a representative sample and record the approved version.`,
    ],
  },
  {
    title: 'Questions to confirm with a supplier',
    content: [
      'Which parts of the requested construction and decoration are currently available?',
      'What sample, swatch or measurement evidence can be supplied for this exact specification?',
      'Which inspection and packing records are included, and when are they reviewed?',
      'Which assumptions could change the quotation, schedule or shipping plan?',
    ],
  },
  {
    title: 'Sample and evidence checklist',
    content: [
      'Approved artwork, colors, names, numbers and placement reference.',
      'Representative fabric or finished sample with size and construction notes.',
      'Written measurement, decoration, seam, label and packaging checks.',
      'Buyer approval record and confirmed production schedule for the final scope.',
    ],
  },
  {
    title: 'Inquiry information checklist',
    content: [
      'Product type, intended users, quantity estimate and size breakdown.',
      'Artwork files, personalization, labels, packaging and destination.',
      'Target market, required documents or testing questions, if applicable.',
      'Requested sample scope, approval sequence and schedule assumptions.',
    ],
  },
  {
    title: 'Continue the research',
    content: 'Use the related product, FAQ, quality and certificates links below to compare the next procurement step for this project.',
  },
]

const makeGuide = (
  slug: Week3GuideSlug,
  title: string,
  description: string,
  sport: string,
  options: string[],
  relatedProducts: CmsLink[],
  relatedCategories: CmsLink[],
): CmsArticle => {
  const faqs = sharedFaqs(sport)
  const relatedArticles = guideLinks([
    {label: 'Certificates & Testing', href: '/certificates-testing/'},
    {label: 'B2B Sourcing FAQ', href: '/guides/b2b-sourcing-faq/'},
  ])
  const links = [...relatedProducts, ...relatedCategories, ...relatedArticles]
  return {
    slug,
    title,
    excerpt: description,
    intro: description,
    eyebrow: 'Week 3 procurement guide',
    body: '',
    articleType: 'resource',
    author: 'POXIOL Editorial Team',
    reviewedBy: 'POXIOL Production Team',
    methodology: 'Claims are conditional and should be confirmed against the buyer specification, representative sample and written supplier record.',
    references: [],
    relatedProducts,
    relatedCategories,
    relatedCaseStudies: [],
    relatedArticles,
    faqs,
    cta: {label: 'Request a project review', href: '/get-quote/'},
    secondaryCta: {label: 'Request a free mockup', href: '/free-mockup/'},
    sections: procurementSections(sport, options, links),
    seo: {
      title,
      description,
      canonicalUrl: `${siteUrl}/resources/${slug}/`,
      focusKeyword: title,
      schemaType: 'Article',
    },
    displayOrder: 900,
  }
}

export const week3Guides: CmsArticle[] = [
  makeGuide(
    'custom-basketball-uniform-manufacturer-guide',
    'Custom Basketball Uniform Manufacturer Guide',
    'A procurement guide for comparing basketball uniform suppliers through construction, sample approval, quality checks and written order requirements.',
    'basketball uniform',
    ['Single-layer, reversible or other approved construction should be compared through a representative sample.', 'Decoration, names, numbers, trims and labels must be specified before quotations are compared.', 'Size charts, roster control, packaging and destination assumptions affect the final order scope.'],
    guideLinks([
      {label: 'Basketball Uniforms', href: '/products/basketball-uniforms/'},
      {label: 'Basketball Product Range', href: '/products/basketball-uniforms/'},
    ]),
    guideLinks([{label: 'Basketball manufacturing FAQ', href: '/faq/'}]),
  ),
  makeGuide(
    'custom-soccer-kits-wholesale-guide',
    'Custom Soccer Kits Wholesale Guide',
    'A procurement guide for clubs, schools, distributors and brands comparing custom soccer kit suppliers, samples, specifications and quality verification.',
    'soccer kit',
    ['Kit configuration, shirt and short details, socks, trims and personalization should be listed before comparing wholesale quotations.', 'Artwork, size grading, labels, packaging and destination requirements should be approved with the sample scope.', 'Inspection points and packing records should match the agreed kit components and quantity breakdown.'],
    guideLinks([
      {label: 'Soccer Jerseys', href: '/products/soccer-jerseys/'},
      {label: 'Soccer Product Range', href: '/products/soccer-jerseys/'},
    ]),
    guideLinks([{label: 'Factory and quality process', href: '/quality-control-process/'}]),
  ),
]

export function getWeek3GuideBySlug(slug: string): CmsArticle | null {
  return week3Guides.find((guide) => guide.slug === slug) || null
}
