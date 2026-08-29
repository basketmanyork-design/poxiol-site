import release from '../../content/privacy/analytics-release.json' with {type: 'json'}

export type AnalyticsReleaseInput = {
  legalApproved: boolean
  ga4Enabled: boolean
  cloudflareAnalyticsEnabled: boolean
}

type AnalyticsSystem = 'ga4' | 'cloudflareWebAnalytics'

export function analyticsReleaseApproved() {
  return Boolean(
    release.status === 'APPROVED' &&
      release.approvedBy &&
      release.approvedAt &&
      release.ga4 === 'ENABLED' &&
      release.cloudflareWebAnalytics === 'ENABLED',
  )
}

export function governedAnalyticsEnabled(system: AnalyticsSystem) {
  return analyticsReleaseApproved() && release[system] === 'ENABLED'
}

export function governedAnalyticsConfiguration() {
  return {
    ga4Enabled: governedAnalyticsEnabled('ga4'),
    cloudflareAnalyticsEnabled: governedAnalyticsEnabled('cloudflareWebAnalytics'),
  }
}

export function assertAnalyticsReleaseReady(input: AnalyticsReleaseInput) {
  const anyEnabled = input.ga4Enabled || input.cloudflareAnalyticsEnabled
  if (anyEnabled && (!input.legalApproved || !analyticsReleaseApproved())) {
    throw new Error('ANALYTICS_APPROVAL_REQUIRED:ga4,cloudflare-web-analytics')
  }
  return true
}
