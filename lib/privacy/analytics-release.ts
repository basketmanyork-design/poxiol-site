import release from '../../content/privacy/analytics-release.json' with {type: 'json'}

export type AnalyticsReleaseInput = {
  legalApproved: boolean
  ga4Enabled: boolean
  clarityEnabled?: boolean
  cloudflareAnalyticsEnabled: boolean
}

export type AnalyticsSystem = 'ga4' | 'clarity' | 'cloudflareWebAnalytics'

export type AnalyticsReleaseRecord = {
  schemaVersion: number
  status: string
  ga4: string
  clarity?: string
  clarityProjectId?: string
  clarityApprovedBy?: string | null
  clarityApprovedAt?: string | null
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
  if (!analyticsReleaseApproved(record) || record[system] !== 'ENABLED') return false
  if (system !== 'clarity') return true
  return Boolean(
    record.clarityApprovedBy?.trim() &&
      record.clarityApprovedAt?.trim() &&
      !Number.isNaN(Date.parse(record.clarityApprovedAt)),
  )
}

export function governedAnalyticsConfiguration(record: AnalyticsReleaseRecord = release) {
  return {
    ga4Enabled: governedAnalyticsEnabled('ga4', record),
    clarityEnabled: governedAnalyticsEnabled('clarity', record),
    cloudflareAnalyticsEnabled: governedAnalyticsEnabled('cloudflareWebAnalytics', record),
  }
}

export function assertAnalyticsReleaseReady(input: AnalyticsReleaseInput) {
  const anyEnabled = input.ga4Enabled || input.clarityEnabled || input.cloudflareAnalyticsEnabled
  if (anyEnabled && (!input.legalApproved || !analyticsReleaseApproved())) {
    throw new Error('ANALYTICS_APPROVAL_REQUIRED:ga4,clarity,cloudflare-web-analytics')
  }
  return true
}
