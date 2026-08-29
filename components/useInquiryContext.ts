'use client'

import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {contextFromPage} from '@/lib/inquiry-context'

export function useInquiryContext() {
  const pathname = usePathname() || '/'
  const [query, setQuery] = useState({pathname:'',search:''})
  useEffect(() => {setQuery({pathname,search:window.location.search})}, [pathname])
  return contextFromPage(pathname, query.pathname === pathname ? query.search : '')
}
