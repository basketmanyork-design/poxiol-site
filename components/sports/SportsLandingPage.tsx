import Link from 'next/link'
import type {SportsPageData} from '@/lib/sports-pages'
import {Header, Footer, PrimaryButton, SecondaryButton, SectionHeading, freeMockupHref} from '@/components/ui'
import {ProductSchema, FAQSchema, BreadcrumbSchema, ServiceSchema} from '@/components/seo/GEOStructuredData'

function titleCaseKeyword(keyword: string) {
  return keyword.replace(/^custom\s+/i, '').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function SportsLandingPage({data}: {data: SportsPageData}) {
  const productLabel = titleCaseKeyword(data.primaryKeyword)
  const baseUrl = 'https://www.poxiol.com'
  const fullUrl = `${baseUrl}/${data.slug}/`

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black text-left">
      <ProductSchema name={data.h1} description={data.metaDescription} url={fullUrl} />
      <ServiceSchema name={`Custom ${productLabel} Manufacturing`} description={`POXIOL provides factory-direct custom ${productLabel.toLowerCase()} production with free mockup and sampling.`} url={fullUrl} />
      <FAQSchema faqs={data.faqs} />
      <BreadcrumbSchema items={[{name: 'Home', url: `${baseUrl}/`}, {name: 'Products', url: `${baseUrl}/products/`}, {name: productLabel, url: fullUrl}]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-[#B6FF00]">{data.eyebrow}</p>
            <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.98] tracking-tight text-white md:text-7xl">{data.h1}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-300">{data.heroText}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><PrimaryButton href={freeMockupHref}>Get Free Mockup</PrimaryButton><SecondaryButton href="#procurement-specs">View Specifications</SecondaryButton></div>
          </div>
          <img src={data.heroImage} alt={`POXIOL ${data.h1} Custom Uniforms`} className="aspect-[4/3] w-full rounded-[3rem] object-cover" />
        </div>
      </section>
      <section id="procurement-specs" className="bg-white px-5 py-20 text-neutral-950 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Procurement Summary" title={`${productLabel} Manufacturing Parameters`} subtitle="Legacy product-page data remains available while CMS product/category pages are introduced." center />
          <div className="grid gap-8 md:grid-cols-3">
            {data.procurementTable.slice(0, 6).map((spec) => <div key={spec.item} className="rounded-3xl border border-neutral-200 p-8"><p className="text-xs font-black uppercase tracking-widest text-lime-600">{spec.item}</p><p className="mt-3 text-lg font-black">{spec.specification}</p></div>)}
          </div>
        </div>
      </section>
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Product Types" title={`Custom ${productLabel} Options`} dark center />
          <div className="grid gap-8 md:grid-cols-3">
            {data.productTypes.map((item) => <article key={item.title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"><h2 className="text-2xl font-black uppercase">{item.title}</h2><p className="mt-4 text-neutral-400">{item.description}</p></article>)}
          </div>
          <div className="mt-16 text-center"><Link href="/guides/" className="text-sm font-black uppercase tracking-widest text-[#B6FF00] hover:underline">View buying guides →</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
