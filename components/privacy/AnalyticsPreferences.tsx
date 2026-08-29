'use client'

import type {AnalyticsPermission} from '@/lib/privacy/analytics-permission'

export function AnalyticsPreferences({
  permission,
  onAccept,
  onReject,
  onChange,
}: {
  permission: AnalyticsPermission
  onAccept(): void
  onReject(): void
  onChange(): void
}) {
  const panelClass = 'fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] left-3 right-3 z-[80] rounded-2xl border border-neutral-700 bg-neutral-950 p-4 text-sm text-white shadow-2xl md:bottom-4 md:right-auto md:max-w-lg'
  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400'

  if (permission === 'unknown') {
    return (
      <aside className={panelClass} aria-label="Analytics preference">
        <p className="font-bold">Optional analytics</p>
        <p className="mt-1 leading-5 text-neutral-300">Choose whether POXIOL may use privacy-limited analytics. Your choice does not affect forms, email, WhatsApp or site access.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onAccept} className={`${buttonClass} bg-lime-400 text-neutral-950`}>Accept analytics</button>
          <button type="button" onClick={onReject} className={`${buttonClass} border border-neutral-500 bg-neutral-900 text-white`}>Reject analytics</button>
        </div>
      </aside>
    )
  }

  return (
    <aside className={panelClass} aria-label="Analytics preference">
      <p aria-live="polite">Analytics preference {permission}.</p>
      <button type="button" onClick={onChange} className={`${buttonClass} mt-3 border border-neutral-500 bg-neutral-900 text-white`}>Change analytics preference</button>
    </aside>
  )
}
