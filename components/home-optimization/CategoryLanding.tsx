import Link from 'next/link'
import {Footer,Header,PrimaryButton,SecondaryButton} from '@/components/ui'
import {contextualInquiryHref} from '@/lib/inquiry-context'

export type CategoryLandingData={title:string;description:string;product:string;image:string;alt:string;path:string;use:string;notes:string[]}

export function CategoryLanding({data}:{data:CategoryLandingData}) {
  const quote=contextualInquiryHref('/get-quote/',{product:data.product,source:data.path})
  const mockup=contextualInquiryHref('/free-mockup/',{product:data.product,source:data.path})
  return <main className="bg-neutral-950 text-white"><Header />
    <section className="px-5 py-16 md:px-10 md:py-24"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
      <div><nav className="mb-8 text-sm"><Link className="underline" href="/products/">All Products</Link> / {data.title}</nav><p className="text-sm font-bold uppercase tracking-widest text-lime-400">Custom teamwear · {data.use}</p><h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{data.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">{data.description}</p><div className="mt-8 flex flex-wrap gap-3"><PrimaryButton href={quote}>Discuss This Product</PrimaryButton><SecondaryButton href={mockup}>Request a Free Mockup</SecondaryButton></div></div>
      <figure className="overflow-hidden rounded-3xl border border-white/15 bg-[#151915]"><img src={data.image} alt={data.alt} width="800" height="999" className="mx-auto max-h-[38rem] w-full object-contain" /><figcaption className="p-4 text-sm text-neutral-300">POXIOL product design illustration — construction and materials are confirmed for each project.</figcaption></figure>
    </div></section>
    <section className="bg-white px-5 py-16 text-neutral-950 md:px-10"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-black">Plan the product for your order</h2><p className="mt-3 max-w-3xl">Share quantity, size needs and the date you need your order in hand. Our team will review construction, customization and delivery feasibility for this product.</p><div className="mt-7 grid gap-4 md:grid-cols-3">{data.notes.map(note=><p key={note} className="rounded-xl border border-neutral-200 p-5">{note}</p>)}</div><div className="mt-8 flex flex-wrap gap-5"><Link href="/customization/fabric-options/" className="font-bold underline">View fabric references</Link><Link href={quote} className="font-bold underline">Discuss sizing for this product</Link></div></div></section>
    <section className="px-5 py-16 text-center md:px-10"><h2 className="text-3xl font-black">Ready to discuss {data.product}?</h2><p className="mx-auto mt-3 max-w-2xl text-neutral-300">A design file is optional. Your product selection stays visible and can be edited in the inquiry form.</p><div className="mt-7"><PrimaryButton href={quote}>Discuss This Product</PrimaryButton></div></section><Footer />
  </main>
}
