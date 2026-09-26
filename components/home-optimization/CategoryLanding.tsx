import Link from 'next/link'
import {Footer,Header,PrimaryButton,SecondaryButton} from '@/components/ui'
import {contextualInquiryHref} from '@/lib/inquiry-context'

type DecisionCard={title:string;body:string}

export type CategoryLandingData={
  title:string
  description:string
  product:string
  image:string
  alt:string
  path:string
  use:string
  planningHeading:string
  planningAnswer:string
  decisionCards:DecisionCard[]
  briefItems:string[]
}

export function CategoryLanding({data}:{data:CategoryLandingData}) {
  const quote=contextualInquiryHref('/get-quote/',{product:data.product,source:data.path})
  const mockup=contextualInquiryHref('/free-mockup/',{product:data.product,source:data.path})
  const canonical=`https://www.poxiol.com${data.path}`
  const schema={
    '@context':'https://schema.org',
    '@graph':[
      {
        '@type':'BreadcrumbList',
        '@id':`${canonical}#breadcrumb`,
        itemListElement:[
          {'@type':'ListItem',position:1,name:'Home',item:'https://www.poxiol.com/'},
          {'@type':'ListItem',position:2,name:'Products',item:'https://www.poxiol.com/products/'},
          {'@type':'ListItem',position:3,name:data.title,item:canonical},
        ],
      },
      {
        '@type': 'Service',
        '@id':`${canonical}#service`,
        name:data.title,
        description:data.planningAnswer,
        url:canonical,
        provider:{'@type':'Organization',name:'POXIOL',url:'https://www.poxiol.com/'},
      },
    ],
  }

  return <main className="bg-neutral-950 text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <Header />
    <section className="px-5 py-16 md:px-10 md:py-24"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
      <div><nav className="mb-8 text-sm"><Link className="underline" href="/products/">All Products</Link> / {data.title}</nav><p className="text-sm font-bold uppercase tracking-widest text-lime-400">Custom teamwear · {data.use}</p><h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{data.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">{data.description}</p><div className="mt-8 flex flex-wrap gap-3"><PrimaryButton href={quote}>Discuss This Product</PrimaryButton><SecondaryButton href={mockup}>Request a Free Mockup</SecondaryButton></div></div>
      <figure className="overflow-hidden rounded-3xl border border-white/15 bg-[#151915]"><img src={data.image} alt={data.alt} width="800" height="999" className="mx-auto max-h-[38rem] w-full object-contain" /><figcaption className="p-4 text-sm text-neutral-300 lg:pr-48">POXIOL product design illustration — construction and materials are confirmed for each project.</figcaption></figure>
    </div></section>
    <section className="bg-white px-5 py-16 text-neutral-950 md:px-10"><div className="mx-auto max-w-7xl">
      <h2 className="text-3xl font-black">{data.planningHeading}</h2>
      <p className="mt-3 max-w-3xl leading-7">{data.planningAnswer}</p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">{data.decisionCards.map(card=><article key={card.title} className="rounded-xl border border-neutral-200 p-5"><h3 className="text-lg font-black">{card.title}</h3><p className="mt-2 leading-7 text-neutral-700">{card.body}</p></article>)}</div>
      <div className="mt-8 flex flex-wrap gap-5"><Link href="/customization/fabric-options/" className="font-bold underline">View fabric references</Link><Link href={quote} className="font-bold underline">Discuss sizing for this product</Link></div>
    </div></section>
    <section className="bg-neutral-100 px-5 py-16 text-neutral-950 md:px-10"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <div><h2 className="text-3xl font-black">What to include in your inquiry</h2><p className="mt-3 leading-7 text-neutral-700">A useful project brief helps POXIOL review the request without filling gaps with assumptions.</p></div>
      <ul className="grid gap-3 sm:grid-cols-2">{data.briefItems.map(item=><li key={item} className="rounded-xl border border-neutral-300 bg-white p-4 font-semibold">{item}</li>)}</ul>
    </div></section>
    <section className="bg-white px-5 py-16 text-neutral-950 md:px-10"><div className="mx-auto max-w-7xl">
      <h2 className="text-3xl font-black">How the project review works</h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-neutral-200 p-5"><h3 className="text-lg font-black">1. Brief review</h3><p className="mt-2 leading-7 text-neutral-700">We review the product type, intended use, quantity, size information, artwork status, destination and required in-hand date.</p></article>
        <article className="rounded-xl border border-neutral-200 p-5"><h3 className="text-lg font-black">2. Planning confirmation</h3><p className="mt-2 leading-7 text-neutral-700">Product configuration, material direction, decoration, sizing and timing are discussed for the specific project.</p></article>
        <article className="rounded-xl border border-neutral-200 p-5"><h3 className="text-lg font-black">3. Next-step decision</h3><p className="mt-2 leading-7 text-neutral-700">After the open points are identified, you can decide whether to continue with a mockup, sample discussion or quote.</p></article>
      </div>
    </div></section>
    <section className="px-5 py-16 text-center md:px-10"><h2 className="text-3xl font-black">Ready to discuss {data.product}?</h2><p className="mx-auto mt-3 max-w-2xl text-neutral-300">A design file is optional. Your product selection stays visible and can be edited in the inquiry form.</p><div className="mt-7"><PrimaryButton href={quote}>Discuss This Product</PrimaryButton></div></section><Footer />
  </main>
}
