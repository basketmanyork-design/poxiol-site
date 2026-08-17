export const resource = {projectId: 'oqpv1xbc', dataset: 'production'}

const ref = (_ref, _key) => ({_key, _type: 'reference', _ref})
const faqRef = (_ref, _key, displayOrder) => ({
  _key,
  _type: 'faqReference',
  faq: {_type: 'reference', _ref},
  displayOrder,
})
const block = (text, _key) => [{
  _key,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{_key: `${_key}-span`, _type: 'span', marks: [], text}],
}]

export const draftPlan = [
  {
    id: 'drafts.product-category-basketball-mvp',
    expectedRevision: 'eJ7skWqptDvdh6OpbT3BqJ',
    role: 'Basketball category',
    set: {
      categoryName: 'Custom Basketball Uniforms',
      shortName: 'Basketball Uniforms',
      heroTitle: 'Custom Basketball Uniform Manufacturer for Clubs, Schools and Sportswear Brands',
      heroDescription: 'Source custom basketball jerseys, shorts, reversible uniforms and full team sets with artwork support, sample confirmation, mixed sizing and inspection before shipment.',
      introduction: 'Use this buying page to compare uniform formats, customization choices, procurement standards, sample steps and quality checks before requesting a quote.',
      heroProofPoints: [
        'Sample MOQ: 1 set',
        'Sample production: 2–3 working days after mockup approval',
        'Bulk production: 7–12 working days after sample or artwork approval',
        'Inspection before shipment',
        'Mixed adult and youth sizes supported',
      ],
      buyerTypes: ['Basketball Clubs', 'Schools and Academies', 'Sportswear Brands'],
      targetMarkets: ['Clubs', 'Schools', 'Academies', 'Sportswear brands and distributors'],
      productTypes: ['Basketball Jerseys', 'Basketball Shorts', 'Reversible Jerseys', 'Full Team Sets'],
      keyFeatures: ['Roster-ready customization', 'Fabric and fit review', 'Sample confirmation', 'Inspection before shipment'],
      coreBenefits: [
        'Coordinate team names, player names, numbers, logos and colors from one confirmed artwork file.',
        'Review fabric hand feel, fit and size breakdown before bulk production.',
        'Use the confirmed project sample to review design and workmanship before the bulk schedule.',
        'Check measurements, print alignment, stitching and packing before shipment.',
      ],
      defaultProcurementStandards: {_type: 'reference', _ref: 'procurementStandards'},
      relatedFaqs: [
        faqRef('faq-5c385d15e15eaf8e', 'basketball-faq-reversible', 1),
        faqRef('faq-a2dc8dceb5f6bc7b', 'basketball-faq-fabric', 2),
        faqRef('faq-95c2f6a0a59a0ff9', 'basketball-faq-mixed-sizes', 3),
      ],
      relatedCaseStudies: [
        ref('case-study-case-003', 'basketball-case-academy'),
        ref('case-study-case-001', 'basketball-case-school'),
      ],
      relatedGuides: [ref('ac118ecd57c74a80', 'basketball-guide-buying')],
      primaryCta: {_type: 'callToAction', label: 'Get Free Basketball Mockup', url: '/free-mockup/?sport=basketball', style: 'primary'},
      secondaryCta: {_type: 'callToAction', label: 'Review Procurement Standards', url: '#procurement-specs', style: 'secondary'},
      bottomCta: {_type: 'callToAction', label: 'Start Your Basketball Uniform Request', url: '/get-quote/?sport=basketball', style: 'primary'},
      decisionSections: [
        {
          _key: 'basketball-customization',
          _type: 'pageSection',
          sectionType: 'evidenceGrid',
          enabled: true,
          displayOrder: 10,
          eyebrow: 'Customization',
          title: 'Confirm Every Basketball Uniform Detail',
          body: block('Prepare team colors, logos, player names, numbers, size breakdowns and label requirements before artwork approval.', 'basketball-customization-body'),
          facts: ['Team and sponsor logos', 'Player names and numbers', 'Custom colors and patterns', 'Youth and adult size breakdowns', 'Neck labels and packaging notes'],
        },
        {
          _key: 'basketball-process',
          _type: 'pageSection',
          sectionType: 'processSteps',
          enabled: true,
          displayOrder: 20,
          eyebrow: 'Manufacturing Process',
          title: 'From Requirements to Shipment',
          body: block('Each stage requires buyer confirmation before the next production decision.', 'basketball-process-body'),
          steps: [
            {_key: 'requirements', _type: 'object', title: 'Requirements', description: 'Confirm product format, quantities, size breakdown, artwork and delivery destination.'},
            {_key: 'mockup', _type: 'object', title: 'Mockup', description: 'Review colors, logo placement, names, numbers and pattern direction.'},
            {_key: 'sample', _type: 'object', title: 'Sample', description: 'Confirm fit, fabric, print appearance and workmanship before bulk production.'},
            {_key: 'bulk-qc', _type: 'object', title: 'Bulk and QC', description: 'Produce against approved details and inspect measurements, print, stitching and packing before shipment.'},
          ],
        },
        {
          _key: 'basketball-checklist',
          _type: 'pageSection',
          sectionType: 'buyerChecklist',
          enabled: true,
          displayOrder: 30,
          eyebrow: 'Buyer Checklist',
          title: 'Information Needed for an Accurate Quote',
          body: block('Complete these inputs to reduce artwork revisions and production scheduling delays.', 'basketball-checklist-body'),
          facts: ['Jersey, shorts, reversible or full-set format', 'Quantity and youth/adult size breakdown', 'Logo and color references', 'Player name and number list', 'Required delivery country and date', 'Label and packaging requirements'],
          cta: {_type: 'callToAction', label: 'Request a Basketball Quote', url: '/get-quote/?sport=basketball', style: 'primary'},
        },
      ],
      activeStatus: true,
      navigationVisibility: true,
      homepageVisibility: true,
      featured: true,
      displayOrder: 1,
      publishStatus: 'draft',
      seo: {
        _type: 'seoFields',
        seoTitle: 'Custom Basketball Uniform Manufacturer | POXIOL',
        metaDescription: 'Compare custom basketball jerseys, shorts, reversible sets, fabrics, sizing, sampling, production and QC for club, school and brand orders.',
        canonicalUrl: 'https://www.poxiol.com/products/basketball-uniforms/',
        focusKeyword: 'custom basketball uniforms',
        secondaryKeywords: ['basketball uniform manufacturer', 'custom basketball jerseys'],
        ogTitle: 'Custom Basketball Uniform Manufacturer | POXIOL',
        ogDescription: 'Plan basketball uniforms with clear product options, customization, samples, production standards and QC.',
        indexStatus: 'index',
        schemaType: 'Product',
      },
    },
  },
  {
    id: 'drafts.061bfa7135304966',
    expectedRevision: 'eJ7skWqptDvdh6OpbTcoab',
    role: 'Full team sets',
    set: {
      shortDescription: 'Coordinate matching basketball jerseys and shorts for complete club, school, academy or branded team programs.',
      fullDescription: 'Full team sets combine a confirmed jersey and shorts design with the same colors, logos, player details and size breakdown. Review artwork, fabric, fit and the confirmed project sample before confirming the bulk production schedule.',
      keyBenefits: ['Coordinated jersey and shorts artwork', 'Mixed youth and adult size support', 'Player name and number management', 'Private-label and packing notes supported'],
      fabricOptions: ['Polyester performance mesh', 'Polyester interlock', 'Breathable panel options'],
      customizationOptions: ['Sublimation printing', 'Team and sponsor logos', 'Player names and numbers', 'Custom colors and patterns'],
      relatedFaqs: [faqRef('faq-95c2f6a0a59a0ff9', 'full-set-faq-sizes', 1)],
      featured: true,
      displayOrder: 1,
      publishStatus: 'draft',
    },
  },
  {
    id: 'drafts.a116b52b29234e52',
    expectedRevision: 'eJ7skWqptDvdh6OpbT3CVw',
    role: 'Basketball jerseys',
    set: {
      shortDescription: 'Custom basketball jerseys with buyer-approved colors, logos, player names, numbers and fit details.',
      fullDescription: 'Choose a jersey construction and fabric that suits game, training or retail use. Confirm neckline, armhole, artwork placement, roster details and size breakdown during mockup and sample review.',
      keyBenefits: ['Buyer-approved roster details', 'Club, school and brand applications', 'Artwork and sample review', 'Measurement and print checks before shipment'],
      fabricOptions: ['Polyester performance mesh', 'Polyester interlock', 'Breathable panel options'],
      customizationOptions: ['Sublimation printing', 'Team and sponsor logos', 'Player names and numbers', 'Neckline and side-panel design'],
      relatedFaqs: [faqRef('faq-a2dc8dceb5f6bc7b', 'jersey-faq-fabric', 1)],
      featured: true,
      displayOrder: 2,
      publishStatus: 'draft',
    },
  },
  {
    id: 'drafts.6b8199fa3c644add',
    expectedRevision: 'kqd32DnwMDSkqBnWPyOkiG',
    role: 'Basketball shorts',
    set: {
      shortDescription: 'Matching basketball shorts planned around the confirmed jersey artwork, fabric, waistband and team size breakdown.',
      fullDescription: 'Basketball shorts can coordinate with the jersey through matching colors, side panels, logos and sublimated patterns. Confirm length, waistband, fabric and size breakdown during sample review.',
      keyBenefits: ['Coordinated team-set appearance', 'Custom side-panel and logo placement', 'Youth and adult size support', 'Fit and measurement review'],
      fabricOptions: ['Polyester performance mesh', 'Polyester interlock', 'Breathable panel options'],
      customizationOptions: ['Sublimation printing', 'Team logos', 'Custom side panels', 'Matching colors and patterns'],
      relatedFaqs: [faqRef('faq-95c2f6a0a59a0ff9', 'shorts-faq-sizes', 1)],
      displayOrder: 3,
      publishStatus: 'draft',
    },
  },
  {
    id: 'drafts.34811e3aade14fff',
    expectedRevision: 'eJ7skWqptDvdh6OpbT3CG9',
    role: 'Reversible jerseys',
    set: {
      shortDescription: 'Two-sided basketball jerseys for training, club, school and academy programs requiring two coordinated looks.',
      fullDescription: 'Reversible jerseys require clear artwork and contrast planning for both sides. Confirm fabric layers, neckline, armholes, logo placement, player details and finished measurements during sample review.',
      keyBenefits: ['Two coordinated designs in one jersey', 'Training and game-use planning', 'Roster customization', 'Sample review before bulk production'],
      fabricOptions: ['Reversible polyester mesh', 'Lightweight polyester interlock'],
      customizationOptions: ['Two-sided sublimation artwork', 'Team logos', 'Player names and numbers', 'Contrasting colorways'],
      relatedFaqs: [faqRef('faq-5c385d15e15eaf8e', 'reversible-faq', 1)],
      displayOrder: 4,
      publishStatus: 'draft',
    },
  },
]

export const forbiddenPatterns = [
  /15\s*[–-]\s*25\s+days/i,
  /10\s*[–-]\s*14\s+days/i,
  /30,?000\+\s+units\s+monthly/i,
  /\bKIAN\b/i,
  /\bEPSON\b/i,
]

export function validatePlan() {
  const serialized = JSON.stringify(draftPlan)
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(serialized)) throw new Error(`Forbidden claim found: ${pattern}`)
  }
  if (draftPlan.some((item) => !item.id.startsWith('drafts.'))) throw new Error('Draft-only allowlist violation')
  if (new Set(draftPlan.map((item) => item.id)).size !== draftPlan.length) throw new Error('Duplicate target ID')
  return true
}
