import {SectionHeading} from '@/components/ui'
import {FAQSchema} from '@/components/seo/GEOStructuredData'
import type {V8FaqItem} from '@/lib/v8/types.ts'

export function FAQSection({title = 'Frequently Asked Questions', faqs, schema = true, eyebrow = 'FAQ'}: {title?: string; faqs: readonly V8FaqItem[]; schema?: boolean; eyebrow?: string}) {
  const schemaFaqs = faqs.map(({question, answer}) => ({question, answer}))
  return <section className="px-5 py-16 md:px-10 md:py-24 xl:px-20" aria-labelledby="v8-faq-title"><div className="mx-auto max-w-4xl"><div id="v8-faq-title"><SectionHeading eyebrow={eyebrow} title={title} /></div><div className="space-y-4">{faqs.map((faq) => <details key={faq.id} className="group rounded-2xl border border-neutral-200 bg-white p-6"><summary className="cursor-pointer pr-6 text-lg font-black text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600">{faq.question}</summary><p className="mt-4 leading-7 text-neutral-600">{faq.answer}</p></details>)}</div></div>{schema ? <FAQSchema faqs={schemaFaqs} /> : null}</section>
}
