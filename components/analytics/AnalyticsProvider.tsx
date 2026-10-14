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
    const clarity = (window as Window & {clarity?: (...args: unknown[]) => void}).clarity
    if (config.clarityProjectId && clarity) {
      clarity('consentv2', {ad_Storage: 'denied', analytics_Storage: 'denied'})
    }
    try {
      clearAnalyticsPermission(window.localStorage)
      setPermission('unknown')
    } catch {
      setPermission('rejected')
    }
    clearAttributionStorage()
    // A loaded recorder keeps running after React removes its script tag.
    if (config.clarityProjectId) window.location.reload()
  }, [config.clarityProjectId])

  const enabled = runtimeReady && permission === 'accepted' && config.enabled && Boolean(config.measurementId)
  const clarityEnabled = runtimeReady && permission === 'accepted' && Boolean(config.clarityProjectId)
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
      {clarityEnabled ? (
        <Script id="poxiol-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              c[a]('consentv2', {ad_Storage:'denied', analytics_Storage:'granted'});
              t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, 'clarity', 'script', ${JSON.stringify(config.clarityProjectId)});
          `}
        </Script>
      ) : null}
    </>
  )
}
