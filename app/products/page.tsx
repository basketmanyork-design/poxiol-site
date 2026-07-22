import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { CollectionPageSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";
import { getProductCategories } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Performance Teamwear Products | Custom Sports Uniforms | POXIOL",
  description: "Explore POXIOL's full range of custom teamwear products managed through Sanity CMS with legacy fallback.",
};

const productsFaqs = [
  { question: "What teamwear products does POXIOL manufacture?", answer: "POXIOL manufactures custom basketball uniforms, soccer kits, baseball jerseys, volleyball uniforms, training wear, hoodies and team accessories." },
  { question: "Can I customize every part of the sports uniform?", answer: "Yes. POXIOL supports team logos, player names, numbers, colors, patterns, private labels and custom packaging." },
  { question: "Do you provide samples for all product categories?", answer: "Yes. POXIOL provides 1-set sample support for all categories before bulk production." }
];

export default async function ProductsPage() {
  const categories = await getProductCategories();
  const baseUrl = "https://www.poxiol.com";

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <CollectionPageSchema
        name="POXIOL Custom Teamwear Products"
        description="Performance teamwear matrix engineered for clubs, schools and sportswear brands."
        url={`${baseUrl}/products/`}
        items={categories.map((category) => ({ name: category.title, url: `${baseUrl}/products/${category.slug}/` }))}
      />
      <FAQSchema faqs={productsFaqs} />
      <BreadcrumbSchema items={[{ name: "Home", url: `${baseUrl}/` }, { name: "Products", url: `${baseUrl}/products/` }]} />

      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Products Matrix" title="Performance Teamwear Categories" subtitle="Manage product categories, images, SEO, sorting and publish status from Sanity CMS." dark center />
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.slug} href={`/products/${category.slug}/`} className="group relative aspect-square overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl">
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
      <section className="bg-neutral-950 px-5 py-24 md:px-10 text-center">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Wholesale & Team Packages</h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">Product names, category images, SEO and publish status now resolve through CMS with legacy fallback.</p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <SecondaryButton href="/get-quote/">Get Wholesale Quote</SecondaryButton>
          <SecondaryButton href="/free-mockup/">Request Free Mockup</SecondaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
