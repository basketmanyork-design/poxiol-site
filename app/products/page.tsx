import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { CollectionPageSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";
import { FAQSection } from "@/components/v8/FAQSection";
import { productCategoryHref, productsFaqs } from "@/lib/products-page";
import { getProductCategories, getProducts } from "@/lib/sanity/content";
import { isSitemapDeniedPath, PUBLIC_PRODUCT_DETAIL_CATEGORY_SLUGS } from "@/lib/sitemap-policy";

export const metadata: Metadata = {
  title: "Performance Teamwear Products | Custom Sports Uniforms | POXIOL",
  description: "Explore POXIOL's custom teamwear products, including basketball uniforms, soccer kits and training wear, with project-specific sampling and production planning.",
  alternates: { canonical: "/products/" },
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getProductCategories(), getProducts()]);
  const publicProductCategories = new Set<string>(PUBLIC_PRODUCT_DETAIL_CATEGORY_SLUGS);
  const publicProducts = products.filter((product) => product.categorySlug && publicProductCategories.has(product.categorySlug) && !product.seo.noIndex && !isSitemapDeniedPath(`/products/${product.slug}/`));
  const baseUrl = "https://www.poxiol.com";

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <CollectionPageSchema
        name="POXIOL Custom Teamwear Products"
        description="Performance teamwear matrix engineered for clubs, schools and sportswear brands."
        url={`${baseUrl}/products/`}
        items={categories.map((category) => ({ name: category.title, url: `${baseUrl}${productCategoryHref(category.slug)}` }))}
      />
      <FAQSchema faqs={productsFaqs.map(({question, answer}) => ({question, answer}))} />
      <BreadcrumbSchema items={[{ name: "Home", url: `${baseUrl}/` }, { name: "Products", url: `${baseUrl}/products/` }]} />

      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading level="h1" eyebrow="Products Matrix" title="Performance Teamwear Categories" subtitle="Custom teamwear products for multiple sport categories, with order quantity and production planning confirmed according to each project." dark center />
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.slug} href={productCategoryHref(category.slug)} className="group relative aspect-square overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl">
                <img src={category.image.url} alt={category.image.alt} className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B6FF00]">{category.shortName || "Product Category"}</span>
                  <h3 className="mt-2 text-3xl font-black uppercase italic leading-none">{category.title}</h3>
                  <p className="mt-4 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition duration-300">{category.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#B6FF00] opacity-0 group-hover:opacity-100 transition duration-300">View Specifications <span>→</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {publicProducts.length ? (
        <section className="bg-neutral-900 px-5 py-20 text-white md:px-10 xl:px-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Product Specifications" title="Browse Confirmed Product Categories" subtitle="Review product-level specifications within the currently published Basketball, Soccer, Training Wear and Outerwear categories." dark center />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publicProducts.map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}/`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-lime-400/40">
                  <p className="text-[10px] font-black uppercase tracking-widest text-lime-400">{product.categoryTitle || product.categorySlug}</p>
                  <h3 className="mt-3 text-lg font-black uppercase text-white">{product.title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-400">{product.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <div className="bg-white text-neutral-950">
        <FAQSection faqs={productsFaqs} schema={false} title="Custom Teamwear Product Questions" />
      </div>
      <section className="bg-neutral-950 px-5 py-24 md:px-10 text-center">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Wholesale & Team Packages</h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">Custom Teamwear Wholesale for Brands. We provide tiered pricing and dedicated B2B project management for large-scale team uniform programs and private label collections.</p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <SecondaryButton href="/get-quote/">Get Wholesale Quote</SecondaryButton>
          <SecondaryButton href="/free-mockup/">Request Free Mockup</SecondaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
