import {SectionHeading} from '@/components/ui'
import type {V8Buyer} from '@/lib/v8/types.ts'
import Link from 'next/link'

export function CustomerSegmentation({buyers, eyebrow = 'Who We Help', title = 'Teamwear Support by Buyer Type', description}: {buyers: readonly V8Buyer[]; eyebrow?: string; title?: string; description?: string}) {
  return (
    <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20" aria-labelledby="v8-customer-segmentation-title">
      <div className="mx-auto max-w-7xl">
        <div id="v8-customer-segmentation-title"><SectionHeading eyebrow={eyebrow} title={title} subtitle={description} /></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5" role="list">
          {buyers.map((buyer) => <article key={buyer.id} className="rounded-3xl bg-neutral-100 p-6" role="listitem"><h3 className="text-lg font-black text-neutral-950">{buyer.title}</h3><p className="mt-3 leading-7 text-neutral-600">{buyer.description}</p>{buyer.href ? <Link href={buyer.href} className="mt-5 inline-flex min-h-11 items-center text-sm font-black uppercase tracking-wide text-lime-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600">Explore {buyer.title}</Link> : null}</article>)}
        </div>
      </div>
    </section>
  )
}
