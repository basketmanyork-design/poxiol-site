import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import { buyingGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Teamwear Buying Guides | Expert Custom Sportswear Advice | POXIOL",
  description: "Access our comprehensive library of teamwear buying guides. From sizing and fabrics to ordering processes and printing tech, get expert advice for your club.",
};

export default function GuidesPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Knowledge Base" 
            title="Professional Buying Guides" 
            subtitle="Everything you need to know about designing, ordering, and manufacturing custom teamwear for your organization."
            dark
            center
          />
          
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {buyingGuides.map((guide) => (
              <Link 
                key={guide.slug}
                href={`/guides/${guide.slug}/`}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30"
              >
                <div className="text-[10px] font-black uppercase tracking-widest text-lime-400">
                  {guide.eyebrow}
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white transition group-hover:text-lime-400">
                  {guide.h1}
                </h2>
                <p className="mt-4 line-clamp-2 text-sm text-neutral-400 leading-relaxed">
                  {guide.intro}
                </p>
                <div className="mt-8 flex items-center text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white">
                  Read Guide <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Can't Find What You're Looking For?</h2>
          <p className="mt-6 text-xl text-neutral-400">
            Our manufacturing experts are available 24/7 to help you with custom specs, bulk pricing, or technical questions.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link 
              href="/contact/"
              className="flex h-[60px] items-center justify-center rounded-full bg-lime-400 px-10 text-base font-black uppercase text-black transition hover:bg-white"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
