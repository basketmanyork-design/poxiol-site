import Link from "next/link";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { ProductDiscovery } from "@/components/products/ProductDiscovery";
import { CollectionPageSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";
import { FAQSection } from "@/components/v8/FAQSection";
import { productsFaqs } from "@/lib/products-page";
import { SPORT_CATEGORIES } from "@/lib/product-taxonomy";
import { createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Custom Teamwear by Sport & Wearing Scenario | POXIOL",
  description: "Explore POXIOL custom teamwear by sport or wearing scenario. Product construction, material, quantity and timing are confirmed after project review.",
  canonical: "/products/",
  metadata: { twitter: PRESERVED_ROOT_TWITTER_METADATA },
});

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
      <section className="bg-neutral-950 border-t border-white/5 px-5 py-20 text-white md:px-10 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">Product categories</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-400">Every category below is reviewed against the same brief: garment set, fit, artwork, quantity and required in-hand date.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link key="/products/basketball-uniforms/" href="/products/basketball-uniforms/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Basketball Uniforms</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Uniform configuration, fabrics and programme questions.</p>
            </Link>
            <Link key="/products/soccer-jerseys/" href="/products/soccer-jerseys/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Soccer Jerseys</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Kit configuration, sponsor marks and club marks.</p>
            </Link>
            <Link key="/products/training-wear/" href="/products/training-wear/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Training Wear</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Training garments and warm-up suits for squads.</p>
            </Link>
            <Link key="/products/hoodies-jackets/" href="/products/hoodies-jackets/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Hoodies & Jackets</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Team hoodies and jackets.</p>
            </Link>
            <Link key="/products/team-accessories/" href="/products/team-accessories/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Team Accessories</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Team socks, bags and supporting items.</p>
            </Link>
            <Link key="/products/running-track-uniforms/" href="/products/running-track-uniforms/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Running & Track</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Singlets and shorts for track teams.</p>
            </Link>
            <Link key="/products/rugby-uniforms/" href="/products/rugby-uniforms/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Rugby Uniforms</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Jerseys and shorts built for contact.</p>
            </Link>
            <Link key="/products/cricket-uniforms/" href="/products/cricket-uniforms/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Cricket Uniforms</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">White or club-colour shirts and trousers.</p>
            </Link>
          </div>
        </div>
      </section>

            <section className="bg-neutral-950 px-5 pb-20 md:px-10 xl:px-20">
        <div className="mx-auto max-w-4xl border-t border-white/10 pt-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/50">More product programs</h2>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/products/hoodies-jackets/">Team Hoodies & Jackets</a></li>
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/youth-team-uniforms/">Youth Team Uniforms</a></li>
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/products/team-accessories/">Team Accessories</a></li>
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/products/training-wear/">Training Wear & Warm-Ups</a></li>
          </ul>
        </div>
      </section>
<Footer />
    </main>
  );
}
