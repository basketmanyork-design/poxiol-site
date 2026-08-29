'use client'

import type {ComponentProps, MouseEvent} from 'react'
import InquiryLink from '@/components/InquiryLink'

type DesktopMenuLinkProps = ComponentProps<typeof InquiryLink>

export default function DesktopMenuLink({onClick, ...props}: DesktopMenuLinkProps) {
  function closeDisclosure(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return

    const details = event.currentTarget.closest('details')
    const summary = details?.querySelector<HTMLElement>('summary')
    details?.removeAttribute('open')
    summary?.focus({preventScroll: true})
  }

  return <InquiryLink {...props} onClick={closeDisclosure} />
}
