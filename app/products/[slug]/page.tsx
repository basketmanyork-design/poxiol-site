import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {Header, Footer, PrimaryButton, SectionHeading} from '@/components/ui'
import {getProductCategories, getProductCategory, getProducts} from '@/lib/sanity/content'

type Props = {params: {slug: string}}

export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getProductCategories()
  const products = await getProducts()
  return [...categories.map((item) => ({slug: item.slug})), ...products.map((item) => ({slug: item.slug}))]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = params
  const category = await getProductCategory(slug)
  if (category) {
    return {
      title: category.seo.title,
      description: category.seo.description,
      alternates: {canonical: category.seo.canonicalUrl || `https://www.poxiol.com/products/${category.slug}/`},
      openGraph: {title: category.seo.title, description: category.seo.description, images: [{url: category.image.url, alt: category.image.alt}]},
      robots: category.seo.noIndex ? {index: false, follow: false} : undefined,
    }
  }
  const product = (await getProducts()).find((item) => item.slug === slug)
  if (!product) return {title: 'Product Not Found'}
  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: {canonical: product.seo.canonicalUrl || `https://www.poxiol.com/products/${product.slug}/`},
    openGraph: {title: product.seo.title, description: product.seo.description, images: product.image ? [{url: product.image.url, alt: product.image.alt}] : undefined},
    robots: product.seo.noIndex ? {index: false, follow: false} : undefined,
  }
}

function ProductJsonLd({title, description, image, slug, isCategory}: {title: string; description: string; image?: {url: string; alt: string}; slug: string; isCategory: boolean}) {
  const canonical = `https://www.poxiol.com/products/${slug}/`
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': isCategory ? 'CollectionPage' : 'Product',
      name: title,
      description,
      image: image?.url,
      url: canonical,
      brand: {'@type': 'Brand', name: 'POXIOL'},
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
        {'@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.poxiol.com/products/'},
        {'@type': 'ListItem', position: 3, name: title, item: canonical},
      ],
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
}

export default async function ProductOrCategoryPage({params}: Props) {
  const {slug} = params
  const category = await getProductCategory(slug)
  const products = category ? await getProducts(slug) : await getProducts()
  const product = category ? null : products.find((item) => item.slug === slug)

  if (!category && !product) notFound()

  const title = category?.title || product?.title || 'POXIOL Product'
  const description = category?.description || product?.description || 'Custom teamwear product managed by POXIOL CMS.'
  const image = category?.image || product?.image

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ProductJsonLd title={title} description={description} image={image} slug={slug} isCategory={Boolean(category)} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Link href="/products/" className="text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-[#B6FF00]">← Back to Products</Link>
            <h1 className="mt-8 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">{title}</h1>
            <p className="mt-8 text-lg leading-8 text-neutral-300">{description}</p>
            <div className="mt-10"><PrimaryButton href="/free-mockup/">Request Free Mockup</PrimaryButton></div>
          </div>
          {image ? <img src={image.url} alt={image.alt} className="aspect-[4/3] w-full rounded-[2rem] object-cover" /> : null}
        </div>
      </section>
      {category ? (
        <section className="bg-white px-5 py-20 text-neutral-950 md:px-10 xl:px-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="CMS Products" title={`${category.title} Products`} center />
            <div className="grid gap-6 md:grid-cols-3">
              {products.map((item) => (
                <Link key={item.slug} href={`/products/${item.slug}/`} className="rounded-3xl border border-neutral-200 p-8 transition hover:border-neutral-950">
                  <h2 className="text-2xl font-black uppercase">{item.title}</h2>
                  <p className="mt-4 text-neutral-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </main>
  )
}
