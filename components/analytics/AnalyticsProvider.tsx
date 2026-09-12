'use client'

import {useCallback, useEffect, useState} from 'react'
import Script from 'next/script'
import {usePathname, useSearchParams} from 'next/navigation'
import {AnalyticsPreferences} from '@/components/privacy/AnalyticsPreferences'
import type {AnalyticsRuntimeConfig} from '@/lib/analytics/server'
import {
  analyticsTrafficTypeFromUrl,
  buildAnalyticsTagConfig,
  classifyOutboundLink,
  normalizeCtaLocation,
} from '@/lib/analytics/core'
import {captureAttribution, clearAttributionStorage, trackEvent, trackOutboundClick, trackPageView} from '@/lib/analytics/client'
import {
  clearAnalyticsPermission,
  persistAnalyticsPermissionSafely,
  readAnalyticsPermissionSafely,
  type AnalyticsPermission,
} from '@/lib/privacy/analytics-permission'

let lastPageView = ''

function AnalyticsRuntime() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    captureAttribution()
  }, [])

  useEffect(() => {
    const query = searchParams.toString()
    const pagePath = `${pathname}${query ? `?${query}` : ''}`
    if (lastPageView === pagePath) return
    lastPageView = pagePath
    trackPageView(pagePath, document.title)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.href || anchor.getAttribute('href') || ''
      const outboundEvent = classifyOutboundLink(href)
      const location = normalizeCtaLocation(anchor.dataset.analyticsLocation)
      if (outboundEvent) trackOutboundClick(outboundEvent, href, location)
      if (anchor.pathname === '/free-mockup/' || anchor.pathname === '/get-quote/') {
        trackEvent(anchor.pathname === '/free-mockup/' ? 'free_mockup_click' : 'get_quote_click', {
          cta_location: location,
          page_path: pathname,
        })
      }
    }
    document.addEventListener('click', handleClick, {capture: true})
    return () => document.removeEventListener('click', handleClick, {capture: true})
  }, [pathname])

  return null
}

export function AnalyticsProvider({
  config,
  initialPermission = 'unknown',
}: {
  config: AnalyticsRuntimeConfig
  initialPermission?: AnalyticsPermission
}) {
  const [permission, setPermission] = useState<AnalyticsPermission>(initialPermission)
  const [trafficType, setTrafficType] = useState<'internal' | undefined>(undefined)
  const [runtimeReady, setRuntimeReady] = useState(false)

  useEffect(() => {
    setTrafficType(analyticsTrafficTypeFromUrl(window.location.href))
    setPermission(readAnalyticsPermissionSafely(window.localStorage))
    setRuntimeReady(true)
  }, [])

  useEffect(() => {
    if (permission === 'accepted') return
    lastPageView = ''
    clearAttributionStorage()
  }, [permission])

  const accept = useCallback(() => {
    setPermission(persistAnalyticsPermissionSafely(window.localStorage, 'accepted'))
  }, [])

  const reject = useCallback(() => {
    setPermission(persistAnalyticsPermissionSafely(window.localStorage, 'rejected'))
    clearAttributionStorage()
  }, [])

  const change = useCallback(() => {
    try {
      clearAnalyticsPermission(window.localStorage)
      setPermission('unknown')
    } catch {
      setPermission('rejected')
    }
    clearAttributionStorage()
  }, [])

  const enabled = runtimeReady && permission === 'accepted' && config.enabled && Boolean(config.measurementId)
  const tagConfig = buildAnalyticsTagConfig(config.debugMode, trafficType)

  return (
    <>
      <AnalyticsPreferences permission={permission} onAccept={accept} onReject={reject} onChange={change} />
      {enabled ? (
        <>
          <Script
            id="poxiol-ga4"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`}
            strategy="afterInteractive"
          />
          <Script id="poxiol-ga4-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = function(){window.dataLayer.push(arguments);};
              window.__poxiolAnalyticsEnabled = true;
              window.gtag('js', new Date());
              window.gtag('config', ${JSON.stringify(config.measurementId)}, ${JSON.stringify(tagConfig)});
            `}
          </Script>
          <AnalyticsRuntime />
        </>
      ) : null}
    </>
  )
}
