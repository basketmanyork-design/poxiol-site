import {legalDraftNotice} from '@/lib/legal-release'

export function LegalDraftNotice() {
  const notice = legalDraftNotice()
  if (!notice) return null
  return (
    <aside className="mb-10 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold leading-6 text-amber-950" role="status">
      {notice} This page is available for local review only and must not be treated as final legal advice or an approved POXIOL policy.
    </aside>
  )
}
