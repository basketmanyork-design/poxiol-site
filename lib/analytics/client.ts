'use client'

import type {AnalyticsEventName, AnalyticsEventParams} from './core'
import {sanitizeEventParams} from './core'

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

type Attribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  landing_page?: string
}

function safeStorage(storage: Storage | undefined, key: string): Attribution {
  if (!storage) return {}
  try {
    return JSON.parse(storage.getItem(key) || '{}') as Attribution
  } catch {
    return {}
  }
}

function currentAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  const first = safeStorage(window.localStorage, firstTouchKey)
  const session = safeStorage(window.sessionStorage, sessionTouchKey)
  return {...first, ...session}
}

export function captureAttribution() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const attribution: Attribution = {
    utm_source: url.searchParams.get('utm_source') || undefined,
    utm_medium: url.searchParams.get('utm_medium') || undefined,
    utm_campaign: url.searchParams.get('utm_campaign') || undefined,
    utm_content: url.searchParams.get('utm_content') || undefined,
    landing_page: `${url.pathname}${url.search}`,
  }
  const safe = sanitizeEventParams(attribution)
  if (!Object.keys(safe).length) return
  try {
    if (!window.localStorage.getItem(firstTouchKey)) {
      window.localStorage.setItem(firstTouchKey, JSON.stringify(safe))
    }
    window.sessionStorage.setItem(sessionTouchKey, JSON.stringify(safe))
  } catch {
    // Storage denial must never block navigation or forms.
  }
}

export function trackEvent(event: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === 'undefined' || !window.__poxiolAnalyticsEnabled || !window.gtag) return
  window.gtag('event', event, sanitizeEventParams({...currentAttribution(), ...params}))
}

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {page_path: pagePath, page_title: pageTitle})
}

export function trackFormStart(formType: string) {
  const key = `${formType}:${typeof window === 'undefined' ? '' : window.location.pathname}`
  if (startedForms.has(key)) return
  startedForms.add(key)
  trackEvent('form_start', {form_type: formType, page_path: typeof window === 'undefined' ? '' : window.location.pathname})
}

export function trackFormSubmit(formType: string, submissionId: string) {
  if (recordedSubmissions.has(`submit:${submissionId}`)) return
  recordedSubmissions.add(`submit:${submissionId}`)
  trackEvent('form_submit', {form_type: formType, page_path: typeof window === 'undefined' ? '' : window.location.pathname})
}

export function trackLead(formType: string, submissionId: string) {
  if (recordedSubmissions.has(`lead:${submissionId}`)) return
  recordedSubmissions.add(`lead:${submissionId}`)
  trackEvent('generate_lead', {form_type: formType, page_path: typeof window === 'undefined' ? '' : window.location.pathname})
}

export function trackOutboundClick(event: AnalyticsEventName, href: string, location: string) {
  let domain = ''
  try {
    domain = href.startsWith('mailto:') ? 'email' : new URL(href, window.location.origin).hostname
  } catch {
    domain = ''
  }
  trackEvent(event, {link_domain: domain, cta_location: location, page_path: window.location.pathname})
}

export function trackFileUpload(formType: string) {
  trackEvent('file_upload', {form_type: formType, page_path: typeof window === 'undefined' ? '' : window.location.pathname})
}

export function trackContentView(event: AnalyticsEventName, params: AnalyticsEventParams) {
  trackEvent(event, params)
}
