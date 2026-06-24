import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { sportsPages } from "@/lib/sports-pages";

export const metadata: Metadata = {
  title: "Performance Teamwear Products | Custom Sports Uniforms | POXIOL",
  description: "Explore POXIOL's full range of custom teamwear products including basketball uniforms, soccer kits, training wear, hoodies and team accessories. Factory direct manufacturing.",
};

export default function ProductsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <SectionHeading 
            eyebrow="Products" 
            title="Custom Teamwear Matrix" 
            subtitle="Engineered for high-intensity athletic performance. Select a category to explore our customization options."
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
                  alt={sport.h1} 
                  className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B6FF00]">{sport.eyebrow}</span>
                  <h3 className="mt-2 text-3xl font-black uppercase italic leading-none">{sport.h1.replace("Manufacturer", "").trim()}</h3>
                  <p className="mt-4 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition duration-300 line-clamp-2">
                    Professional OEM/ODM manufacturing with high-color sublimation and quality support.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#B6FF00] opacity-0 group-hover:opacity-100 transition duration-300">
                    View Details <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Support Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 text-center border-y border-white/5">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Wholesale & Team Packages</h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto text-lg">Looking for bulk team sets or private label collections? POXIOL provides tiered pricing and dedicated project management for volume orders.</p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <SecondaryButton href="/get-quote/">Get Bulk Quote</SecondaryButton>
          <SecondaryButton href="/free-mockup/">Request Team Mockup</SecondaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
