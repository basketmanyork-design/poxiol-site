'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import type {ComponentProps} from 'react'
import {contextualInquiryHref, contextualWhatsAppHref} from '@/lib/inquiry-context'
import {V8_CONVERSION_ENTRIES} from '@/lib/v8/leads'
import {useInquiryContext} from './useInquiryContext'

export default function InquiryLink({href, children, ...props}: ComponentProps<'a'> & {href:string}) {
  const context = useInquiryContext()
  const pathname = usePathname()
  const intent = V8_CONVERSION_ENTRIES.find(entry => entry.path === pathname)?.intent
  const target = href.startsWith('https://wa.me/')
    ? contextualWhatsAppHref(href,context,intent)
    : contextualInquiryHref(href,context)
  // The contextual query is a draft hint for the form, not a crawlable page.
  // Every destination already declares a query-free canonical, so keep the
  // crawler from spending budget on the same route with different prefills.
  const crawlHint = target.includes('?') ? {rel: props.rel ?? 'nofollow'} : {}
  // Native navigation to contextual forms gives a fresh draft with its own query.
  // Fragment-only anchors stay native and never reset the current draft.
  if (target.startsWith('#') || target !== href || /^https?:/.test(target)) return <a href={target} {...props} {...crawlHint}>{children}</a>
  return <Link href={target} {...props} {...crawlHint}>{children}</Link>
}
