import release from '../../content/privacy/analytics-release.json' with {type: 'json'}

export type AnalyticsReleaseInput = {
  legalApproved: boolean
  ga4Enabled: boolean
  cloudflareAnalyticsEnabled: boolean
}

export type AnalyticsSystem = 'ga4' | 'cloudflareWebAnalytics'

export type AnalyticsReleaseRecord = {
  schemaVersion: number
  status: string
  ga4: string
  cloudflareWebAnalytics: string
  approvedBy: string | null
  approvedAt: string | null
}

/**
 * `status` approves the governance record and its Owner metadata only.
 * Each analytics provider remains independently controlled by its own state.
 */
export function analyticsReleaseApproved(record: AnalyticsReleaseRecord = release) {
  return Boolean(
    record.status === 'APPROVED' &&
      record.approvedBy?.trim() &&
      record.approvedAt?.trim() &&
      !Number.isNaN(Date.parse(record.approvedAt)),
  )
}

export function governedAnalyticsEnabled(system: AnalyticsSystem, record: AnalyticsReleaseRecord = release) {
  return analyticsReleaseApproved(record) && record[system] === 'ENABLED'
}

export function governedAnalyticsConfiguration(record: AnalyticsReleaseRecord = release) {
  return {
    ga4Enabled: governedAnalyticsEnabled('ga4', record),
    cloudflareAnalyticsEnabled: governedAnalyticsEnabled('cloudflareWebAnalytics', record),
  }
}

export function assertAnalyticsReleaseReady(input: AnalyticsReleaseInput) {
  const anyEnabled = input.ga4Enabled || input.cloudflareAnalyticsEnabled
  if (anyEnabled && (!input.legalApproved || !analyticsReleaseApproved())) {
    throw new Error('ANALYTICS_APPROVAL_REQUIRED:ga4,cloudflare-web-analytics')
  }
  return true
}
