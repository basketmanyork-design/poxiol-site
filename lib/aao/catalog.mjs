const baseUrl = 'https://www.poxiol.com'

const choices = {
  buyerTypes: [
    ['club_team', 'Club or team'],
    ['school_university', 'School or university'],
    ['sportswear_brand', 'Sportswear brand'],
    ['distributor', 'Distributor or wholesaler'],
    ['event_organizer', 'Event organizer'],
    ['custom_retailer', 'Custom retailer'],
    ['other', 'Other'],
  ],
  sports: [
    ['basketball', 'Basketball'],
    ['soccer', 'Soccer'],
    ['baseball_softball', 'Baseball or softball'],
    ['american_football', 'American football'],
    ['volleyball', 'Volleyball'],
    ['ice_hockey', 'Ice hockey'],
    ['running', 'Running or marathon'],
    ['training', 'Training wear'],
    ['tennis', 'Tennis'],
    ['golf', 'Golf'],
    ['rugby', 'Rugby'],
    ['esports', 'Esports'],
    ['other', 'Other'],
  ],
  products: [
    ['jersey', 'Jersey only'],
    ['jersey_shorts_set', 'Jersey and shorts set'],
    ['full_team_package', 'Full team package'],
    ['training_wear', 'Training wear'],
    ['outerwear', 'Hoodies or jackets'],
    ['accessories', 'Team accessories'],
    ['oem_odm_collection', 'OEM or ODM collection'],
    ['other', 'Other'],
  ],
  customization: [
    ['sublimation', 'Full sublimation'],
    ['logo', 'Team or brand logo'],
    ['player_name_number', 'Player names and numbers'],
    ['private_label', 'Private label'],
    ['custom_packaging', 'Custom packaging'],
  ],
}

const asOptions = (items) => items.map(([id, label]) => ({id, label}))

export const catalog = Object.freeze({
  contractVersion: '1.0.0',
  lastReviewed: '2026-07-28',
  organization: {
    id: `${baseUrl}/#organization`,
    name: 'POXIOL',
    legalName: 'POXIOL Teamwear',
    url: `${baseUrl}/`,
    category: 'custom_teamwear_manufacturer',
    description:
      'POXIOL is a factory-direct custom teamwear manufacturer serving clubs, schools, events, brands, wholesalers, distributors, and custom retailers.',
  },
  buyerTypes: asOptions(choices.buyerTypes),
  sports: asOptions(choices.sports),
  products: asOptions(choices.products),
  customization: asOptions(choices.customization),
  serviceRegions: [
    {id: 'global', label: 'Global', qualification: 'Shipping feasibility and schedule require project confirmation.'},
  ],
  procurement: {
    minimumOrder: {
      value: 1,
      unit: 'set',
      qualification: 'Sample and small-order support; project confirmation required.',
    },
    mockupLeadTime: {
      min: 2,
      max: 24,
      unit: 'hour',
      qualification: 'After complete project requirements are received.',
    },
    sampleLeadTime: {
      min: 2,
      max: 3,
      unit: 'business_day',
      qualification: 'After mockup approval.',
    },
    bulkLeadTime: {
      min: 7,
      max: 12,
      unit: 'business_day',
      qualification:
        'After sample or artwork approval; large, complex, and peak-season orders require schedule confirmation.',
    },
  },
  qualityControl: {
    inspectionBeforeShipment: true,
    sizeTolerance: {min: -2, max: 2, unit: 'centimeter'},
    evidenceUrls: [
      `${baseUrl}/quality-control-process/`,
      `${baseUrl}/certificates-testing/`,
      `${baseUrl}/factory/`,
      `${baseUrl}/projects/`,
    ],
  },
  actions: {
    requestForQuote: {
      formUrl: `${baseUrl}/get-quote/`,
      schemaUrl: `${baseUrl}/.well-known/poxiol-rfq-schema.json`,
      humanReviewRequired: true,
      automaticQuote: false,
      automaticOrderAcceptance: false,
    },
  },
})

const clone = (value) => structuredClone(value)
const idsAreUnique = (items) => new Set(items.map(({id}) => id)).size === items.length

export function validateCatalog(value) {
  const errors = []
  for (const field of ['mockupLeadTime', 'sampleLeadTime', 'bulkLeadTime']) {
    const range = value.procurement?.[field]
    if (range && range.min > range.max) {
      errors.push(`procurement.${field} min must not exceed max`)
    }
  }
  for (const field of ['buyerTypes', 'sports', 'products', 'customization', 'serviceRegions']) {
    if (!Array.isArray(value[field]) || !idsAreUnique(value[field])) {
      errors.push(`${field} identifiers must be unique`)
    }
  }
  return errors
}

export function createCapabilityDocument(value = catalog) {
  return clone({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${baseUrl}/.well-known/poxiol-capabilities.json`,
    contractVersion: value.contractVersion,
    lastReviewed: value.lastReviewed,
    organization: value.organization,
    buyerTypes: value.buyerTypes,
    sports: value.sports,
    products: value.products,
    customization: value.customization,
    serviceRegions: value.serviceRegions,
    procurement: value.procurement,
    qualityControl: value.qualityControl,
    actions: value.actions,
    automaticCommerce: {
      quote: false,
      payment: false,
      orderAcceptance: false,
    },
    qualification:
      'All capabilities, feasibility, prices, production schedules, compliance requirements, and order terms require POXIOL human review and written confirmation.',
  })
}

export function createRfqSchema(value = catalog) {
  return clone({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${baseUrl}/.well-known/poxiol-rfq-schema.json`,
    title: 'POXIOL Request for Quotation',
    description:
      'A structured inquiry schema. Submission does not create an automatic quote, order, payment, or contractual acceptance.',
    type: 'object',
    additionalProperties: false,
    required: [
      'schemaVersion',
      'fullName',
      'email',
      'country',
      'buyerType',
      'sport',
      'productType',
      'quantity',
      'quantityUnit',
      'manualReviewAccepted',
    ],
    properties: {
      schemaVersion: {const: value.contractVersion},
      fullName: {type: 'string', minLength: 1, maxLength: 120},
      email: {type: 'string', format: 'email', maxLength: 254},
      phone: {type: 'string', maxLength: 80},
      country: {type: 'string', pattern: '^[A-Z]{2}$'},
      buyerType: {type: 'string', enum: value.buyerTypes.map(({id}) => id)},
      sport: {type: 'string', enum: value.sports.map(({id}) => id)},
      productType: {type: 'string', enum: value.products.map(({id}) => id)},
      quantity: {type: 'integer', minimum: 1},
      quantityUnit: {type: 'string', enum: ['piece', 'set']},
      targetDeliveryDate: {type: 'string', format: 'date'},
      teamOrBrandName: {type: 'string', maxLength: 160},
      colors: {type: 'string', maxLength: 240},
      customization: {
        type: 'array',
        uniqueItems: true,
        items: {type: 'string', enum: value.customization.map(({id}) => id)},
      },
      notes: {type: 'string', maxLength: 4000},
      manualReviewAccepted: {const: true},
    },
  })
}

export function createAgentManifest(value = catalog) {
  return clone({
    schemaVersion: '1.0.0',
    name: 'POXIOL procurement information',
    organization: value.organization,
    capabilitiesUrl: `${baseUrl}/.well-known/poxiol-capabilities.json`,
    actions: {
      requestForQuote: {
        formUrl: value.actions.requestForQuote.formUrl,
        schemaUrl: value.actions.requestForQuote.schemaUrl,
        method: 'browser_form',
        humanReviewRequired: true,
        automaticQuote: false,
        automaticOrderAcceptance: false,
      },
    },
    evidenceUrls: value.qualityControl.evidenceUrls,
    policy:
      'Prepare schema-aligned requirements and submit through the website form. POXIOL staff must review and confirm every inquiry.',
  })
}
