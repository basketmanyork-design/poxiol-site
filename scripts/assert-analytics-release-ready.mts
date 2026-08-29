import {legalPolicyApproved} from '../lib/legal-release.ts'
import {
  assertAnalyticsReleaseReady,
  governedAnalyticsConfiguration,
} from '../lib/privacy/analytics-release.ts'

try {
  const configuration = governedAnalyticsConfiguration()
  assertAnalyticsReleaseReady({legalApproved: legalPolicyApproved(), ...configuration})
  console.log(
    configuration.ga4Enabled || configuration.cloudflareAnalyticsEnabled
      ? 'Approved analytics release record verified.'
      : 'Optional analytics release remains disabled pending approval.',
  )
} catch (cause) {
  console.error(cause instanceof Error ? cause.message : 'ANALYTICS_APPROVAL_REQUIRED:ga4,cloudflare-web-analytics')
  process.exit(1)
}
