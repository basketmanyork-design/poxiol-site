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
  // Native navigation to contextual forms gives a fresh draft with its own query.
  // Fragment-only anchors stay native and never reset the current draft.
  if (target.startsWith('#') || target !== href || /^https?:/.test(target)) return <a href={target} {...props}>{children}</a>
  return <Link href={target} {...props}>{children}</Link>
}
