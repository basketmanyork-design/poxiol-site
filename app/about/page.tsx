import type { Metadata } from "next";
import { Header, Footer, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "About POXIOL | Professional Custom Teamwear Manufacturer",
  description: "Learn about POXIOL's journey in the custom teamwear industry. 15+ years of apparel experience, serving 3,000+ teams with high-performance sportswear.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Our Story" title="Engineered for Performance" subtitle="POXIOL was founded with a single goal: to provide pro-grade custom teamwear directly from the factory floor." dark center />
          
          <div className="mt-24 grid gap-16 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xl text-neutral-300 leading-relaxed font-medium">
                With over 15 years of industry experience, the POXIOL team has supported more than 3,000 sports organizations across 50+ countries. We specialize in full-sublimation manufacturing, ensuring your team identity never fades, cracks, or peels.
              </p>
              <p className="mt-8 text-neutral-400 leading-relaxed">
                By operating our own production facility, we maintain absolute control over the supply chain. This allows us to offer flexible MOQ starting from 1 piece for samples and small teams, while scaling to thousands of units for large-scale tournament events and international brands.
              </p>
              
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
                <div>
                  <p className="text-4xl font-black text-[#B6FF00]">3,000+</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Teams Served</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-[#B6FF00]">500K+</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Units Produced</p>
                </div>
              </div>
            </div>
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src="/images/poxiol-v6/home_hero_custom_teamwear_manufacturer.png" alt="POXIOL Team" className="h-full w-full object-cover grayscale-[0.3]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 py-32 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h2 className="text-3xl font-black uppercase md:text-6xl tracking-tight">Factory Direct <br /><span className="text-[#B6FF00]">B2B Excellence.</span></h2>
          <p className="mt-8 text-neutral-400 max-w-2xl mx-auto text-lg">We are committed to delivering reliable quality, transparent communication, and fast-track shipping for every custom teamwear project.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
