import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { ProductDiscovery } from "@/components/products/ProductDiscovery";
import { CollectionPageSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";
import { FAQSection } from "@/components/v8/FAQSection";
import { productsFaqs } from "@/lib/products-page";
import { SPORT_CATEGORIES } from "@/lib/product-taxonomy";

export const metadata: Metadata = {
  title: "Custom Teamwear by Sport & Wearing Scenario | POXIOL",
  description: "Explore POXIOL custom teamwear by sport or wearing scenario. Product construction, material, quantity and timing are confirmed after project review.",
  alternates: { canonical: "/products/" },
};

export default function ProductsPage() {
  const baseUrl = "https://www.poxiol.com";
  const matureCategories = SPORT_CATEGORIES.filter((category) => category.contentStage === "deep-page");

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <CollectionPageSchema
        name="POXIOL Custom Teamwear Products"
        description="Custom teamwear discovery by sport and wearing scenario, with project-specific review."
        url={`${baseUrl}/products/`}
        items={matureCategories.map((category) => ({ name: category.label, url: `${baseUrl}${category.href}` }))}
      />
      <FAQSchema faqs={productsFaqs.map(({question, answer}) => ({question, answer}))} />
      <BreadcrumbSchema items={[{ name: "Home", url: `${baseUrl}/` }, { name: "Products", url: `${baseUrl}/products/` }]} />

      <Header />
      <section className="bg-neutral-950 px-5 py-20 text-center md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading level="h1" eyebrow="Product System" title="Custom Teamwear by Sport and Wearing Scenario" subtitle="Start with the sport you serve or the way the team will wear the range. Final specifications and planning are confirmed after project review." dark center />
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#sports" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#B6FF00] px-6 font-black uppercase text-black outline-none focus-visible:ring-2 focus-visible:ring-white">Browse by Sport</Link>
            <Link href="#scenarios" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white px-6 font-black uppercase text-white outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF00]">Browse by Wearing Scenario</Link>
          </div>
        </div>
      </section>
      <ProductDiscovery />
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
