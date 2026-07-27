export type AnalyticsEventName =
  | 'page_view'
  | 'form_start'
  | 'form_submit'
  | 'generate_lead'
  | 'whatsapp_click'
  | 'email_click'
  | 'free_mockup_click'
  | 'get_quote_click'
  | 'file_upload'
  | 'alibaba_click'
  | 'product_view'
  | 'product_category_view'
  | 'case_study_view'
  | 'guide_view'

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>

const allowedParameterNames = new Set([
  'page_path',
  'page_title',
  'content_type',
  'content_slug',
  'sport',
  'product_category',
  'product_slug',
  'buyer_type',
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
