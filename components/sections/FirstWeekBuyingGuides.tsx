import Link from 'next/link'
import {firstWeekGuideLinks} from '@/lib/high-intent-guides.js'

export function FirstWeekBuyingGuides({heading = 'Buyer Guides'}: {heading?: string}) {
  return (
    <section aria-label="Buyer guides" className="bg-neutral-950 px-5 py-16 text-white md:px-10 md:py-20 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B6FF00]">Procurement Resources</p>
        <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">{heading}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {firstWeekGuideLinks.map((guide) => (
            <Link key={guide.href} href={guide.href} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm font-black leading-6 transition hover:border-[#B6FF00] hover:text-[#B6FF00]">
              {guide.label} <span aria-hidden="true">-&gt;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}