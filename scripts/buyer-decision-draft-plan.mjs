export const resource = {projectId: 'oqpv1xbc', dataset: 'production'}

export const draftPlan = [
  {
    id: 'drafts.67d89e7018894286',
    publishedId: '67d89e7018894286',
    expectedRevision: 'cy0PIHNgypUOR28qMEiVT4',
    role: 'Manufacturing page',
    set: {
      heroSubheading: 'POXIOL is a factory-direct custom teamwear manufacturer for clubs, schools, academies, distributors and sportswear brands.',
      'bottomCTA.label': 'Get a Free Mockup',
    },
  },
  {
    id: 'drafts.a01d7979a987463a',
    publishedId: 'a01d7979a987463a',
    expectedRevision: 'eJ7skWqptDvdh6OpbT1ny6',
    role: 'About page',
    set: {
      heroSubheading: 'POXIOL supports B2B custom teamwear projects through factory-direct design review, sampling, production planning, quality checks and shipment preparation.',
      'contentSections[_key=="fa07c4d58a04"].body[0].children[0].text': 'POXIOL is a factory-direct custom teamwear manufacturer supporting clubs, schools, academies, distributors and sportswear brands with custom sports uniforms, OEM sportswear, private-label programs and coordinated project review.',
      'contentSections[_key=="d04b09486caa"].body[0].children[0].text': 'Full sublimation printing, custom cut-and-sew, OEM/ODM private-label development, team uniform programs and corporate sportswear. Production planning is based on confirmed specifications, quantity, approvals and schedule.',
      'seo.metaDescription': 'Learn how POXIOL coordinates factory-direct custom teamwear design review, sampling, production planning, quality checks and shipment preparation.',
      'bottomCTA.label': 'Get a Free Mockup',
    },
  },
  {
    id: 'drafts.d17c91e8e04842c4',
    publishedId: 'd17c91e8e04842c4',
    expectedRevision: 'kqd32DnwMDSkqBnWPyMsge',
    role: 'Contact page',
    set: {
      'contentSections[_key=="985f00f2b3a9"].body[0].children[0].text': 'Share your sport category, logo, estimated quantity, colors, destination and target schedule. POXIOL will review the requirements and confirm the quotation assumptions in writing. Contact: york@basketman.cn. WhatsApp: +8613055646888.',
      'bottomCTA.label': 'Get a Free Mockup',
    },
  },
]

const forbiddenPatterns = [
  /15\+ years/i,
  /30,?000\+ units/i,
  /within 24 hours/i,
  /sales@poxiol\.com/i,
  /Request a free mockup/i,
]

export function validatePlan() {
  if (draftPlan.length !== 3) throw new Error('Draft allowlist must contain exactly three documents')
  if (draftPlan.some((item) => !item.id.startsWith('drafts.') || !item.expectedRevision)) throw new Error('Draft ID or Revision Guard missing')
  if (new Set(draftPlan.map((item) => item.id)).size !== draftPlan.length) throw new Error('Duplicate Draft target')
  const serialized = JSON.stringify(draftPlan)
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(serialized)) throw new Error(`Forbidden wording in Draft plan: ${pattern}`)
  }
  return true
}