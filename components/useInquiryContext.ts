'use client'

import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {sanitizeGoogleAdsAttribution} from '@/lib/google-ads-attribution'
import {contextFromPage} from '@/lib/inquiry-context'

export function useInquiryContext() {
  const pathname = usePathname() || '/'
  const [query, setQuery] = useState({pathname:'',search:''})
  useEffect(() => {setQuery({pathname,search:window.location.search})}, [pathname])
  const context = contextFromPage(pathname, query.pathname === pathname ? query.search : '')
  const adsAttribution = typeof window === 'undefined'
    ? {}
    : sanitizeGoogleAdsAttribution(new URL(window.location.href), context.source)
  return {...context, adsAttribution}
}
