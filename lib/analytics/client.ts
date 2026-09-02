'use client'

import type {AnalyticsAttribution, AnalyticsEventName, AnalyticsEventParams, CtaLocation, LeadEventContext} from './core'
import {buildAttributionFromUrl, sanitizeEventParams} from './core'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __poxiolAnalyticsEnabled?: boolean
  }
}

const firstTouchKey = 'poxiol.analytics.first-touch'
const sessionTouchKey = 'poxiol.analytics.session-touch'
const startedForms = new Set<string>()
const recordedSubmissions = new Set<string>()

function safeStorage(storage: Storage | undefined, key: string): AnalyticsAttribution {
  if (!storage) return {}
  try {
    const stored = JSON.parse(storage.getItem(key) || '{}') as AnalyticsAttribution
    const landingPage = stored.landing_page
      ? new URL(stored.landing_page, 'https://www.poxiol.com').pathname
      : undefined
    return {
      utm_source: stored.utm_source,
      utm_medium: stored.utm_medium,
      utm_campaign: stored.utm_campaign,
      utm_content: stored.utm_content,
      landing_page: landingPage,
    }
  } catch {
    return {}
  }
}

function currentAttribution(): AnalyticsAttribution {
  if (typeof window === 'undefined') return {}
  const first = safeStorage(window.localStorage, firstTouchKey)
  const session = safeStorage(window.sessionStorage, sessionTouchKey)
  return {...first, ...session}
}

export function captureAttribution() {
  if (typeof window === 'undefined') return
  const attribution = buildAttributionFromUrl(window.location.href)
  const safe = sanitizeEventParams(attribution)
  if (!Object.keys(safe).length) return
  try {
    const existingFirstTouch = safeStorage(window.localStorage, firstTouchKey)
    if (Object.keys(existingFirstTouch).length) {
      window.localStorage.setItem(firstTouchKey, JSON.stringify(sanitizeEventParams(existingFirstTouch)))
    } else {
      window.localStorage.setItem(firstTouchKey, JSON.stringify(safe))
    }
    window.sessionStorage.setItem(sessionTouchKey, JSON.stringify(safe))
  } catch {
    // Storage denial must never block navigation or forms.
  }
}

export function clearAttributionStorage() {
  if (typeof window === 'undefined') return
  window.__poxiolAnalyticsEnabled = false
  try {
    window.localStorage.removeItem(firstTouchKey)
  } catch {
    // Rejection remains effective in memory when storage is unavailable.
  }
  try {
    window.sessionStorage.removeItem(sessionTouchKey)
  } catch {
    // Rejection remains effective in memory when storage is unavailable.
  }
}

export function trackEvent(event: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === 'undefined' || !window.__poxiolAnalyticsEnabled || !window.gtag) return
  window.gtag('event', event, sanitizeEventParams({...currentAttribution(), ...params}))
}

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {page_path: pagePath, page_title: pageTitle})
}

function formParams(context: LeadEventContext): AnalyticsEventParams {
  return {...context, page_path: typeof window === 'undefined' ? '' : window.location.pathname}
}

export function trackFormStart(context: LeadEventContext) {
  const key = `${context.form_id}:${typeof window === 'undefined' ? '' : window.location.pathname}`
  if (startedForms.has(key)) return
  startedForms.add(key)
  trackEvent('form_start', formParams(context))
}

export function trackFormSubmit(context: LeadEventContext, submissionId: string) {
  if (recordedSubmissions.has(`submit:${submissionId}`)) return
  recordedSubmissions.add(`submit:${submissionId}`)
  trackEvent('form_submit', formParams(context))
}

export function trackLead(context: LeadEventContext, submissionId: string) {
  if (recordedSubmissions.has(`lead:${submissionId}`)) return
  recordedSubmissions.add(`lead:${submissionId}`)
  trackEvent('generate_lead', formParams(context))
}

export function trackOutboundClick(event: AnalyticsEventName, href: string, location?: CtaLocation) {
  let domain = ''
  try {
    domain = href.startsWith('mailto:') ? 'email' : new URL(href, window.location.origin).hostname
  } catch {
    domain = ''
  }
  trackEvent(event, {link_domain: domain, cta_location: location, page_path: window.location.pathname})
}

export function trackFileSelect(context: LeadEventContext) {
  trackEvent('file_select', formParams(context))
}

export function trackFileUpload(context: LeadEventContext, submissionId: string) {
  if (recordedSubmissions.has(`upload:${submissionId}`)) return
  recordedSubmissions.add(`upload:${submissionId}`)
  trackEvent('file_upload', formParams(context))
}

export function trackContentView(event: AnalyticsEventName, params: AnalyticsEventParams) {
  trackEvent(event, params)
}
