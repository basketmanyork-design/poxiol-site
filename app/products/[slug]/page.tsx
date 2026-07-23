import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {Header, Footer, PrimaryButton, SecondaryButton, SectionHeading} from '@/components/ui'
import {getProduct, getProducts} from '@/lib/sanity/content'
import type {CmsImage, CmsProduct} from '@/lib/cms/types'

type Props = {params: {slug: string}}

export const dynamicParams = false

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((item) => ({slug: item.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {title: 'Product Not Found'}
  const canonical = product.seo.canonicalUrl || `https://www.poxiol.com/products/${product.slug}/`
  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: {canonical},
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      url: canonical,
      images: product.image ? [{url: product.image.url, alt: product.image.alt}] : undefined,
    },
    robots: product.seo.noIndex ? {index: false, follow: false} : undefined,
  }
}

function ProductJsonLd({product}: {product: CmsProduct}) {
  const canonical = product.seo.canonicalUrl || `https://www.poxiol.com/products/${product.slug}/`
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.image?.url,
      url: canonical,
      brand: {'@type': 'Brand', name: 'POXIOL'},
      category: product.categoryTitle || product.categorySlug,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
        {'@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.poxiol.com/products/'},
        product.categorySlug ? {'@type': 'ListItem', position: 3, name: product.categoryTitle || product.categorySlug, item: `https://www.poxiol.com/products/${product.categorySlug}/`} : null,
        {'@type': 'ListItem', position: product.categorySlug ? 4 : 3, name: product.title, item: canonical},
      ].filter(Boolean),
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
}

function ImageGrid({title, images}: {title: string; images: CmsImage[]}) {
  if (!images.length) return null
  return (
    <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Product media" title={title} center />
        <div className="grid gap-5 md:grid-cols-3">
          {images.map((image) => <img key={`${image.url}-${image.alt}`} src={image.url} alt={image.alt} className="aspect-[4/3] w-full rounded-[2rem] object-cover" />)}
        </div>
      </div>
    </section>
  )
}

function OptionList({title, items}: {title: string; items: string[]}) {
  if (!items.length) return null
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-8">
      <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950">{title}</h2>
      <ul className="mt-6 grid gap-3 text-sm font-bold text-neutral-700">
        {items.map((item) => <li key={item} className="rounded-2xl bg-neutral-50 px-4 py-3">{item}</li>)}
      </ul>
    </section>
  )
}

export default async function ProductDetailPage({params}: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ProductJsonLd product={product} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <nav className="text-xs font-black uppercase tracking-widest text-neutral-500">
              <Link href="/" className="hover:text-[#B6FF00]">Home</Link><span className="mx-3">/</span><Link href="/products/" className="hover:text-[#B6FF00]">Products</Link>
              {product.categorySlug ? <><span className="mx-3">/</span><Link href={`/products/${product.categorySlug}/`} className="hover:text-[#B6FF00]">{product.categoryTitle || product.categorySlug}</Link></> : null}
            </nav>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.18em] text-[#B6FF00]">CMS Product Detail</p>
            <h1 className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">{product.title}</h1>
            <p className="mt-8 text-lg leading-8 text-neutral-300">{product.description}</p>
            <div className="mt-10 flex flex-wrap gap-4"><PrimaryButton href="/free-mockup/">Request Free Mockup</PrimaryButton><SecondaryButton href="/get-quote/">Get Factory Quote</SecondaryButton></div>
          </div>
          {product.image ? <img src={product.image.url} alt={product.image.alt} className="aspect-[4/3] w-full rounded-[2rem] object-cover" /> : null}
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Product Overview" title="Full product description" />
            <p className="whitespace-pre-line text-lg leading-8 text-neutral-600">{product.fullDescription || product.description}</p>
            {product.procurementOverride ? <div className="mt-8 rounded-2xl bg-neutral-100 p-6 text-sm text-neutral-700">{product.procurementOverride.moq ? <p><strong>MOQ:</strong> {product.procurementOverride.moq}</p> : null}{product.procurementOverride.sampleTime ? <p className="mt-2"><strong>Sample time:</strong> {product.procurementOverride.sampleTime}</p> : null}{product.procurementOverride.reason ? <p className="mt-2">{product.procurementOverride.reason}</p> : null}</div> : null}
          </div>
          <div className="grid gap-6">
            <OptionList title="Fabric Options" items={product.fabricOptions} />
            <OptionList title="Customization Options" items={product.customizationOptions} />
          </div>
        </div>
      </section>

      <ImageGrid title="Product detail gallery" images={product.detailImages} />
      <ImageGrid title="Production images" images={product.productionImages} />
      <ImageGrid title="Quality control images" images={product.qcImages} />
      <ImageGrid title="Packaging images" images={product.packagingImages} />

      {product.relatedFaqs.length ? (
        <section className="bg-neutral-950 px-5 py-16 text-white md:px-10 md:py-24 xl:px-20">
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="FAQ" title="Product questions" dark center />
            <div className="space-y-4">
              {product.relatedFaqs.map((faq) => <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><summary className="cursor-pointer text-lg font-black">{faq.question}</summary><p className="mt-4 text-neutral-400">{faq.answer}</p></details>)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-neutral-900 px-5 py-16 text-center text-white md:px-10 md:py-24 xl:px-20">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Need this product customized?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-neutral-300">Send logo files, quantity, sizes and deadline. POXIOL will help confirm mockup and production details.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4"><PrimaryButton href="/free-mockup/">Start Free Mockup</PrimaryButton><SecondaryButton href="/contact/">Talk to POXIOL</SecondaryButton></div>
      </section>
      <Footer />
    </main>
  )
}