const siteOrigin = 'https://www.poxiol.com'
const campaignKeys = ['gclid','utm_source','utm_medium','utm_campaign','utm_term','utm_content'] as const
type CampaignKey = typeof campaignKeys[number]

export type GoogleAdsAttribution = Partial<Record<CampaignKey,string>> & {
  landing_path?: string
  source_path?: string
}

const piiPattern = /@/
const phonePattern = /^\+?\d[\d\s().-]{6,}\d$/
const gclidPattern = /^[A-Za-z0-9._-]+$/
const campaignValuePattern = /^[A-Za-z0-9][A-Za-z0-9 ._-]*$/

function safePath(value: string, expectedOrigin = siteOrigin) {
  if (!value || value.length > 500 || /[?&#%\\]/.test(value) || value.startsWith('//')) return ''
  try {
    const url = new URL(value, expectedOrigin)
    if (url.origin !== expectedOrigin || !/^\/(?:[a-z0-9][a-z0-9-]*\/)*[a-z0-9-]*\/?$/.test(url.pathname)) return ''
    return url.pathname === '/' ? '/' : `${url.pathname.replace(/\/+$/, '')}/`
  } catch { return '' }
}

function safeCampaignValue(key: CampaignKey, value: string | null) {
  const text = (value || '').trim()
  if (!text || text.length > 100 || piiPattern.test(text) || phonePattern.test(text)) return ''
  return (key === 'gclid' ? gclidPattern : campaignValuePattern).test(text) ? text : ''
}

export function sanitizeGoogleAdsAttribution(url: URL, sourcePath = ''): GoogleAdsAttribution {
  if (url.origin !== siteOrigin) return {}
  const landingPath = safePath(url.pathname)
  if (!landingPath) return {}
  const result: GoogleAdsAttribution = {landing_path: landingPath}
  for (const key of campaignKeys) {
    const value = safeCampaignValue(key, url.searchParams.get(key))
    if (value) result[key] = value
  }
  const safeSourcePath = safePath(sourcePath)
  if (safeSourcePath) result.source_path = safeSourcePath
  return result
}

export function appendGoogleAdsAttribution(body: FormData, attribution: GoogleAdsAttribution | undefined) {
  if (!attribution) return
  for (const key of campaignKeys) {
    const value = attribution[key]
    if (value) body.set(`ads_${key}`, value)
  }
  if (attribution.landing_path) body.set('ads_landing_path', attribution.landing_path)
  if (attribution.source_path) body.set('ads_source_path', attribution.source_path)
}

export function googleAdsAttributionQuery(attribution: GoogleAdsAttribution | undefined) {
  const query = new URLSearchParams()
  if (!attribution) return query
  for (const key of campaignKeys) {
    const value = safeCampaignValue(key, attribution[key] || '')
    if (value) query.set(key, value)
  }
  return query
}
