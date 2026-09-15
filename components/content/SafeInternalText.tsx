import Link from 'next/link'
import type {ReactNode} from 'react'

const internalMarkdownLink = /\[([^\]\n]+)\]\((\/[^\s)]*)\)/g

function isSafeInternalHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//') && !/[<>"'`\\]/.test(href)
}

export function SafeInternalText({text}: {text: string}) {
  const output: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  internalMarkdownLink.lastIndex = 0
  while ((match = internalMarkdownLink.exec(text)) !== null) {
    const [syntax, label, href] = match
    if (!isSafeInternalHref(href)) continue
    if (match.index > cursor) output.push(text.slice(cursor, match.index))
    output.push(
      <Link key={`${match.index}-${href}`} href={href} className="font-bold text-[#B6FF00] underline decoration-[#B6FF00]/60 underline-offset-4 hover:text-white">
        {label}
      </Link>,
    )
    cursor = match.index + syntax.length
  }

  if (!output.length) return <>{text}</>
  if (cursor < text.length) output.push(text.slice(cursor))
  return <>{output}</>
}
