'use client'

import {useEffect} from 'react'
import Script from 'next/script'
import {usePathname, useSearchParams} from 'next/navigation'
import type {AnalyticsRuntimeConfig} from '@/lib/analytics/server'
import {classifyOutboundLink} from '@/lib/analytics/core'
import {captureAttribution, trackEvent, trackOutboundClick, trackPageView} from '@/lib/analytics/client'

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
      const location = anchor.dataset.analyticsLocation || pathname
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

export function AnalyticsProvider({config}: {config: AnalyticsRuntimeConfig}) {
  if (!config.enabled || !config.measurementId) return null

  return (
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
          window.gtag('config', ${JSON.stringify(config.measurementId)}, {
            send_page_view: false,
            debug_mode: ${config.debugMode ? 'true' : 'false'},
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
      <AnalyticsRuntime />
    </>
  )
}
