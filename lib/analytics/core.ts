export type AnalyticsEventName =
  | 'page_view'
  | 'form_start'
  | 'form_submit'
  | 'generate_lead'
  | 'whatsapp_click'
  | 'email_click'
  | 'free_mockup_click'
  | 'get_quote_click'
  | 'file_select'
  | 'file_upload'
  | 'alibaba_click'
  | 'product_view'
  | 'product_category_view'
  | 'case_study_view'
  | 'guide_view'
  | 'qualify_lead'
  | 'close_convert_lead'

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>

export type LeadType = 'free_mockup' | 'factory_quote' | 'production_sample' | 'general_inquiry'

export type LeadFormId =
  | 'free_mockup_form'
  | 'factory_quote_form'
  | 'production_sample_form'
  | 'general_inquiry_form'
  | 'homepage_project_inquiry'

export type LeadEventContext = {
  lead_type: LeadType
  form_id: LeadFormId
  form_type: string
}

const leadTypeByFormId: Record<LeadFormId, LeadType> = {
  free_mockup_form: 'free_mockup',
  factory_quote_form: 'factory_quote',
  production_sample_form: 'production_sample',
  general_inquiry_form: 'general_inquiry',
  homepage_project_inquiry: 'free_mockup',
}

export function createLeadEventContext(formId: LeadFormId, formType: string): LeadEventContext {
  return {lead_type: leadTypeByFormId[formId], form_id: formId, form_type: formType}
}

export const CTA_LOCATIONS = [
  'header',
  'hero',
  'product_section',
  'factory_section',
  'case_study',
  'form_recovery',
  'sticky_mobile',
  'footer',
] as const

export type CtaLocation = (typeof CTA_LOCATIONS)[number]

export function normalizeCtaLocation(value: string | undefined): CtaLocation | undefined {
  return CTA_LOCATIONS.find(location => location === value)
}

export type AnalyticsAttribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  landing_page?: string
}

export function buildAttributionFromUrl(href: string): AnalyticsAttribution {
  const url = new URL(href)
  return {
    utm_source: url.searchParams.get('utm_source') || undefined,
    utm_medium: url.searchParams.get('utm_medium') || undefined,
    utm_campaign: url.searchParams.get('utm_campaign') || undefined,
    utm_content: url.searchParams.get('utm_content') || undefined,
    landing_page: url.pathname,
  }
}

const allowedParameterNames = new Set([
  'page_path',
  'page_title',
  'content_type',
  'content_slug',
  'sport',
  'product_category',
  'product_slug',
  'buyer_type',
  'lead_type',
  'form_id',
  'form_type',
  'cta_location',
  'link_domain',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'landing_page',
])

const forbiddenValuePattern = /@|(?:\+?\d[\d\s().-]{6,}\d)/i

export function sanitizeEventParams(params: AnalyticsEventParams): AnalyticsEventParams {
  return Object.fromEntries(
    Object.entries(params).filter(([name, value]) => {
      if (!allowedParameterNames.has(name) || value === undefined) return false
      if (typeof value === 'string' && forbiddenValuePattern.test(value)) return false
      return true
    }),
  )
}

export function normalizeUtmValue(value: string | undefined): string {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
  if (!normalized || forbiddenValuePattern.test(String(value || ''))) return ''
  return normalized
}

export function classifyOutboundLink(href: string): AnalyticsEventName | null {
  const normalized = href.trim().toLowerCase()
  if (normalized.startsWith('mailto:')) return 'email_click'
  if (normalized.includes('wa.me/') || normalized.includes('api.whatsapp.com/')) return 'whatsapp_click'
  if (normalized.includes('alibaba.com/')) return 'alibaba_click'
  return null
}

export function shouldEnableAnalytics(input: {
  analyticsEnabled: boolean
  ga4Enabled: boolean
  measurementId: string
  nodeEnv?: string
  contentSource?: string
  cloudflarePages?: string
  cloudflareBranch?: string
}): boolean {
  return Boolean(
    input.analyticsEnabled &&
      input.ga4Enabled &&
      /^G-[A-Z0-9]+$/.test(input.measurementId) &&
      input.nodeEnv === 'production' &&
      input.contentSource !== 'sanity-preview' &&
      input.cloudflarePages === '1' &&
      input.cloudflareBranch === 'main',
  )
}

export function buildUtmUrl(input: {
  destination: string
  source: string
  medium: string
  campaign: string
  content?: string
  term?: string
}): string {
  const url = new URL(input.destination)
  const values = {
    utm_source: normalizeUtmValue(input.source),
    utm_medium: normalizeUtmValue(input.medium),
    utm_campaign: normalizeUtmValue(input.campaign),
    utm_content: normalizeUtmValue(input.content),
    utm_term: normalizeUtmValue(input.term),
  }
  for (const [name, value] of Object.entries(values)) {
    if (value) url.searchParams.set(name, value)
  }
  return url.toString()
}
