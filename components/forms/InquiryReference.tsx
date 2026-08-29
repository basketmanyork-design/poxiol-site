'use client'

import type {InquiryContext} from '@/lib/inquiry-context'

export function InquiryReference({context,product,style,onProduct,onStyle}: {context:InquiryContext;product:string;style:string;onProduct:(value:string)=>void;onStyle:(value:string)=>void}) {
  if (!context.product && !context.style && !context.source) return null
  const inputClass = 'mt-2 min-h-[50px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500'
  return <div className="my-6 rounded-2xl border border-lime-400/40 bg-lime-50 p-4 text-neutral-950">
    <label className="block text-sm font-semibold" htmlFor="inquiry-product">Product / program reference (optional)</label>
    <input id="inquiry-product" name="requested_product" value={product} maxLength={120} onChange={event=>onProduct(event.target.value)} className={inputClass} />
    <p className="mt-2 text-xs leading-5 text-neutral-600">Brought from the page you viewed. Change or clear it if needed; this is not an approved specification.</p>
    {context.style ? <><label className="mt-4 block text-sm font-semibold" htmlFor="inquiry-style">Style reference (optional)</label><input id="inquiry-style" name="selected_style" value={style} maxLength={120} onChange={event=>onStyle(event.target.value)} className={inputClass} /></> : null}
    {context.source ? <p className="mt-3 break-all text-xs leading-5 text-neutral-600">Source page: {context.source}</p> : null}
  </div>
}
