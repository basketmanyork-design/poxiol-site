import InquiryLink from "@/components/InquiryLink"
import {V8_CONVERSION_ENTRIES, type V8ConversionIntent} from '@/lib/v8/leads'

export function ConversionEntryGuide({currentIntent}: {currentIntent: V8ConversionIntent}) {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50 px-5 py-12 text-neutral-950 md:px-10 md:py-16 xl:px-20" aria-labelledby="conversion-entry-guide-title">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">Choose the Right Inquiry Path</p>
          <h2 id="conversion-entry-guide-title" className="mt-3 text-3xl font-black uppercase tracking-tight">One project, one clear next step</h2>
          <p className="mt-4 leading-7 text-neutral-600">{currentIntent === 'contact' ? 'Just have a question? Use the short form above. If you are ready to discuss a design, quote or sample, choose the matching project path below.' : 'Use the entry that matches your current purchasing stage. All routes use the same secure project review workflow.'}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {V8_CONVERSION_ENTRIES.map((entry) => {
            const active = entry.intent === currentIntent
            return (
              <article key={entry.intent} className={`rounded-2xl border p-5 ${active ? 'border-lime-400 bg-lime-400/10' : 'border-neutral-200 bg-white'}`}>
                <h3 className="font-black uppercase">{entry.formTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{entry.purpose}</p>
                {active ? <p className="mt-4 text-xs font-black uppercase tracking-widest text-lime-700">Current Path</p> : <InquiryLink href={entry.path} className="mt-4 inline-flex min-h-11 items-center text-xs font-black uppercase tracking-widest text-neutral-950 underline decoration-lime-400 decoration-2 underline-offset-4">Use This Path</InquiryLink>}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
