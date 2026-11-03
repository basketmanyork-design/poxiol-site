'use client'

import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {sanitizeGoogleAdsAttribution} from '@/lib/google-ads-attribution'
import {contextFromPage} from '@/lib/inquiry-context'

export function useInquiryContext() {
  const pathname = usePathname() || '/'
  const [query, setQuery] = useState({pathname:'',search:'',href:''})
  useEffect(() => {setQuery({pathname,search:window.location.search,href:window.location.href})}, [pathname])
  const context = contextFromPage(pathname, query.pathname === pathname ? query.search : '')
  const adsAttribution = query.pathname === pathname && query.href
    ? sanitizeGoogleAdsAttribution(new URL(query.href), context.source)
    : {}
  return {...context, adsAttribution}
}
