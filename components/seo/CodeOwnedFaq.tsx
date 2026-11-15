import type {ReactNode} from 'react'

export type StaticFaq = {question: string; answer: string}

/**
 * FAQ block for pages whose copy lives in the CMS.
 *
 * /about/ and /contact/ are Sanity documents, so their body cannot be edited in
 * code. CmsPageTemplate exposes `beforeFooterSlot`, which is where this renders:
 * the CMS document stays untouched, while the questions and their FAQPage graph
 * are versioned in the repository.
 */
export function CodeOwnedFaq({title, faqs, canonical}: {title: string; faqs: StaticFaq[]; canonical: string}): ReactNode {
  if (!faqs.length) return null

  return (
    <section className="bg-neutral-950 px-5 py-20 md:px-10 xl:px-20 border-t border-white/5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${canonical}#faq`,
            mainEntity: faqs.map(({question, answer}) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: {'@type': 'Answer', text: answer},
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">{title}</h2>
        <div className="mt-10 space-y-8">
          {faqs.map(faq => (
            <div key={faq.question}>
              <h3 className="text-lg font-black text-white">{faq.question}</h3>
              <p className="mt-2 leading-7 text-neutral-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
