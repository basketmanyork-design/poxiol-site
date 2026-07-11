import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { sportsPages } from "@/lib/sports-pages";
import { CollectionPageSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Performance Teamwear Products | Custom Sports Uniforms | POXIOL",
  description: "Explore POXIOL's full range of custom teamwear products. Factory-direct basketball uniforms, soccer kits and training wear with high-color sublimation and 2–3 Days Sample Production.",
};

const productsFaqs = [
  { question: "What teamwear products does POXIOL manufacture?", answer: "POXIOL manufactures custom basketball uniforms, soccer kits, baseball jerseys, volleyball uniforms, training wear, hoodies and team accessories. All products are factory-direct with 100% manual quality inspection." },
  { question: "Can I customize every part of the sports uniform?", answer: "Yes. POXIOL supports unlimited customization including team logos, player names, numbers, colors, patterns, private labels and custom packaging for clubs and brands." },
  { question: "Do you provide samples for all product categories?", answer: "Yes. POXIOL provides 1-set sample support for all categories. Sample production typically takes 2–3 days after your mockup is confirmed by our design team." }
];

export default function ProductsPage() {
  const baseUrl = "https://www.poxiol.com";

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <CollectionPageSchema 
        name="POXIOL Custom Teamwear Products"
        description="Performance teamwear matrix engineered for clubs, schools and sportswear brands."
        url={`${baseUrl}/products/`}
        items={sportsPages.map(s => ({ name: s.h1, url: `${baseUrl}/${s.slug}/` }))}
      />
      <FAQSchema faqs={productsFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Products", url: `${baseUrl}/products/` }
      ]} />

      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Products Matrix" 
            title="Performance Teamwear Categories" 
            subtitle="Custom Teamwear Products Factory Direct. We provide high-color sublimated uniforms for 12 sport categories with MOQ 1 set and global B2B logistics support."
            dark center
          />
          
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sportsPages.map((sport) => (
              <Link 
                key={sport.slug} 
                href={`/${sport.slug}/`}
                className="group relative aspect-square overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl"
              >
                <img 
                  src={sport.heroImage} 
                  alt={`POXIOL Custom ${sport.h1}`} 
                  className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B6FF00]">{sport.eyebrow}</span>
                  <h3 className="mt-2 text-3xl font-black uppercase italic leading-none">{sport.h1.replace("Manufacturer", "").trim()}</h3>
                  <p className="mt-4 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition duration-300">
                    OEM/ODM Manufacturing with 2–3 Day Sample Production and Strict QC before shipment.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#B6FF00] opacity-0 group-hover:opacity-100 transition duration-300">
                    View Specifications <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AEO Module: Category Sourcing FAQ */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 border-y border-white/5">
         <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="Buying Guide" title="Teamwear Category FAQ" dark center />
            <div className="mt-16 space-y-4 text-left text-neutral-300">
               {productsFaqs.map((faq)=>(
                  <div key={faq.question} className="rounded-3xl border border-white/5 bg-white/[0.02] p-8">
                     <h3 className="text-xl font-bold text-white mb-4 italic uppercase tracking-tight">{faq.question}</h3>
                     <p className="leading-relaxed text-sm">{faq.answer}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 text-center">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Wholesale & Team Packages</h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Custom Teamwear Wholesale for Brands. We provide tiered pricing and dedicated B2B project management for large-scale team uniform programs and private label collections.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <SecondaryButton href="/get-quote/">Get Wholesale Quote</SecondaryButton>
          <SecondaryButton href="/free-mockup/">Request Free Mockup</SecondaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
