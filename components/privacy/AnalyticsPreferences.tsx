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
  const panelClass = 'fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] left-3 right-3 z-[80] rounded-2xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white shadow-2xl md:bottom-4 md:right-auto md:max-w-lg md:p-4'
  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 sm:px-4 sm:text-xs sm:tracking-wide'

  if (permission === 'unknown') {
    return (
      <aside className={panelClass} aria-label="Analytics preference">
        <p className="leading-5 text-neutral-300"><strong className="text-white">Optional analytics.</strong> Your choice never blocks forms, email, WhatsApp or site access.</p>
        <div className="mt-1 flex flex-nowrap gap-2">
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
