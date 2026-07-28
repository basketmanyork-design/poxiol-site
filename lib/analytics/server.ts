import 'server-only'

import {contentSource, sanityQuery} from '@/lib/sanity/client'
import {shouldEnableAnalytics} from './core'

type AnalyticsSettingsDocument = {
  analyticsEnabled?: boolean
  ga4Enabled?: boolean
  ga4MeasurementId?: string
  googleTagManagerEnabled?: boolean
  googleTagManagerContainerId?: string
  consentModeEnabled?: boolean
  debugMode?: boolean
  cloudflareAnalyticsEnabled?: boolean
}

export type AnalyticsRuntimeConfig = {
  enabled: boolean
  measurementId: string
  consentModeEnabled: boolean
  debugMode: boolean
  cloudflareAnalyticsEnabled: boolean
}

const analyticsSettingsQuery = `*[_id == "analyticsSettings"][0]{
  analyticsEnabled,
  ga4Enabled,
  ga4MeasurementId,
  googleTagManagerEnabled,
  googleTagManagerContainerId,
  consentModeEnabled,
  debugMode,
  cloudflareAnalyticsEnabled
}`

const disabledConfig: AnalyticsRuntimeConfig = {
  enabled: false,
  measurementId: '',
  consentModeEnabled: false,
  debugMode: false,
  cloudflareAnalyticsEnabled: false,
}

export async function getAnalyticsRuntimeConfig(): Promise<AnalyticsRuntimeConfig> {
  const response = await sanityQuery<AnalyticsSettingsDocument>(analyticsSettingsQuery)
  if (!response.ok || !response.result) return disabledConfig

  const settings = response.result
  const measurementId = String(settings.ga4MeasurementId || '').trim().toUpperCase()
  const enabled = shouldEnableAnalytics({
    analyticsEnabled: settings.analyticsEnabled === true,
    ga4Enabled: settings.ga4Enabled === true,
    measurementId,
    nodeEnv: process.env.NODE_ENV,
    contentSource,
    cloudflarePages: process.env.CF_PAGES,
    cloudflareBranch: process.env.CF_PAGES_BRANCH,
  })

  return {
    enabled,
    measurementId: enabled ? measurementId : '',
    consentModeEnabled: enabled && settings.consentModeEnabled === true,
    debugMode: enabled && settings.debugMode === true,
    cloudflareAnalyticsEnabled: settings.cloudflareAnalyticsEnabled === true,
  }
}
