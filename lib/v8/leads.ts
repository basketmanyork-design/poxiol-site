export type V8ConversionIntent = 'mockup' | 'quote' | 'sample' | 'contact'
export type V8LeadPriority = 'HIGH' | 'MEDIUM' | 'LOW'
export type BuyerRole = typeof BUYER_ROLE_OPTIONS[number]

export const BUYER_ROLE_OPTIONS = [
  'Team Manager',
  'School Representative',
  'Sports Club',
  'Sports Brand',
  'Distributor',
] as const

export const PROJECT_SPORT_OPTIONS = [
  'Soccer',
  'Basketball',
  'Track & Field',
  'Badminton',
  'Volleyball',
  'Baseball & Softball',
  'Ice Hockey',
  'American Football',
  'Rugby',
  'Tennis',
  'Cricket',
  'Golf',
  'Multi-Sport Teamwear',
  'Other',
] as const

export const PROJECT_QUANTITY_OPTIONS = [
  {value: 'research', label: 'Research stage / Not sure yet', minimum: 0},
  {value: '1-9', label: '1-9 sets', minimum: 1},
  {value: '10-49', label: '10-49 sets', minimum: 10},
  {value: '50-99', label: '50-99 sets', minimum: 50},
  {value: '100-299', label: '100-299 sets', minimum: 100},
  {value: '300+', label: '300+ sets', minimum: 300},
] as const

export type ProjectQualificationFields = {
  buyerRole: string
  sport: string
  quantity: string
  deadline: string
  customizationRequirements: string
  fullName: string
  company: string
  country: string
  whatsapp: string
  email: string
  selectedStyle: string
}

export type ProjectAttachments = {
  logo_file: File | null
  reference_design_file: File | null
  size_chart_tech_pack_file: File | null
}

export type LeadQualificationInput = {
  buyerRole: string
  quantity: string
  deadline: string
  assetCount: number
  requirements: string
}

export const MAX_PROJECT_FILE_BYTES = 10 * 1024 * 1024

export function validateProjectAttachment(file: File | null) {
  if (!file || file.size <= MAX_PROJECT_FILE_BYTES) return null
  return `${file.name} is larger than 10 MB. Please choose a smaller file or send it by email after submitting.`
}

export function requireContactFormEndpoint(endpoint: string | undefined) {
  if (!endpoint) throw new Error('Form endpoint is not configured. Add NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT in Cloudflare Pages.')
  return endpoint
}

const HIGH_PRIORITY_ROLES = new Set<string>(['Team Manager', 'Sports Club', 'Sports Brand'])

function hasValidDeadline(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function getQuantityMinimum(value: string) {
  return PROJECT_QUANTITY_OPTIONS.find((option) => option.value === value)?.minimum || 0
}

export function classifyLead(input: LeadQualificationInput): V8LeadPriority {
  const minimumQuantity = getQuantityMinimum(input.quantity)
  const hasRole = BUYER_ROLE_OPTIONS.includes(input.buyerRole as BuyerRole)
  const hasRequirements = input.requirements.trim().length >= 5
  const clearTimeline = hasValidDeadline(input.deadline)

  if (!hasRole || minimumQuantity < 10 || !hasRequirements || !clearTimeline) return 'LOW'

  if (
    HIGH_PRIORITY_ROLES.has(input.buyerRole)
    && minimumQuantity >= 50
    && clearTimeline
    && input.assetCount > 0
  ) {
    return 'HIGH'
  }

  return 'MEDIUM'
}

export const V8_CONVERSION_ENTRIES = [
  {
    intent: 'mockup',
    path: '/free-mockup/',
    formAnchorId: 'free-mockup-form',
    purpose: 'Early design interest and visual concept review.',
    formTitle: 'Request a Free Mockup',
    subtitle: 'Share your sport, logo, reference and project requirements for an initial design review.',
    ctaLabel: 'Submit Free Mockup Request',
    successUrl: '/thank-you/',
  },
  {
    intent: 'quote',
    path: '/get-quote/',
    formAnchorId: 'quote-form',
    purpose: 'Pricing and production planning for a defined purchasing project.',
    formTitle: 'Request a Factory Quote',
    subtitle: 'Share quantity, deadline and customization requirements for a fact-based project quotation.',
    ctaLabel: 'Send Quote Request',
    successUrl: '/quote-received/',
  },
  {
    intent: 'sample',
    path: '/sample-order/',
    formAnchorId: 'sample-request-form',
    purpose: 'High-intent sample approval before bulk production.',
    formTitle: 'Request a Production Sample',
    subtitle: 'Share the approved design direction and project requirements for sample planning before bulk production.',
    ctaLabel: 'Send Sample Request',
    successUrl: '/sample-request-received/',
  },
  {
    intent: 'contact',
    path: '/contact/',
    formAnchorId: 'contact-form',
    purpose: 'General company, service or existing-project questions.',
    formTitle: 'Send a General Inquiry',
    subtitle: 'Use this form for general questions. For design, pricing or sample requests, choose the matching project path.',
    ctaLabel: 'Send My Question',
    successUrl: '/thank-you/',
  },
] as const satisfies readonly {
  intent: V8ConversionIntent
  path: string
  formAnchorId: string
  purpose: string
  formTitle: string
  subtitle: string
  ctaLabel: string
  successUrl: string
}[]

export function getV8ConversionEntry(intent: V8ConversionIntent) {
  const entry = V8_CONVERSION_ENTRIES.find((item) => item.intent === intent)
  if (!entry) throw new Error(`Unknown V8 conversion intent: ${intent}`)
  return entry
}

export function createProjectSubmissionFormData({
  intent,
  formType,
  sourcePage,
  fields,
  attachments,
}: {
  intent: V8ConversionIntent
  formType: string
  sourcePage: string
  fields: ProjectQualificationFields
  attachments: ProjectAttachments
}) {
  const formData = new FormData()
  const assetCount = Object.values(attachments).filter(Boolean).length
  const leadPriority = classifyLead({
    buyerRole: fields.buyerRole,
    quantity: fields.quantity,
    deadline: fields.deadline,
    assetCount,
    requirements: fields.customizationRequirements,
  })

  formData.append('formType', formType)
  formData.append('intent', intent)
  formData.append('sourcePage', sourcePage)
  formData.append('leadPriority', leadPriority)

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key === 'selectedStyle' ? 'selected_style' : key, value)
  }

  for (const [key, file] of Object.entries(attachments)) {
    if (file) formData.append(key, file)
  }

  return formData
}
