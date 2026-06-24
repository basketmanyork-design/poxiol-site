import type { Metadata } from "next";
import { Header, Footer } from "@/components/ui";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Get a Factory Quote | POXIOL Custom Teamwear",
  description: "Request a wholesale factory quote for your custom basketball uniforms, soccer kits, or OEM sportswear project. Factory direct pricing for teams and brands.",
};

export default function GetQuotePage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(182,255,0,0.12),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-lime-400">Quote Request</p>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              Request a Factory Quote
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-neutral-300">
              Get detailed factory-direct pricing for your custom teamwear project. Whether you need 10 sets for a local club or 1,000+ pieces for a brand collection, POXIOL provides competitive B2B rates.
            </p>
            
            <div className="mt-12 space-y-8">
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl font-bold text-lime-400 border border-white/10">1</div>
                <div>
                  <h3 className="text-xl font-bold">Volume-Based Pricing</h3>
                  <p className="mt-2 text-neutral-400">Locked pricing tiers based on your specific quantity and product mix.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl font-bold text-lime-400 border border-white/10">2</div>
                <div>
                  <h3 className="text-xl font-bold">Customization Support</h3>
                  <p className="mt-2 text-neutral-400">Quote includes full sublimation, logos, names, and custom label options.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl font-bold text-lime-400 border border-white/10">3</div>
                <div>
                  <h3 className="text-xl font-bold">Global Shipping</h3>
                  <p className="mt-2 text-neutral-400">Estimated door-to-door shipping rates to USA, Europe, Australia and worldwide.</p>
                </div>
              </div>
            </div>
          </div>
          
          <ContactForm 
            title="Request Factory Direct Pricing"
            subtitle="Fill in your project details below. Our B2B sales team will calculate a formal quote and production plan for your review."
            formType="Quote Request V8"
            ctaText="Get Factory Quote Now"
            successUrl="/quote-received/"
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
