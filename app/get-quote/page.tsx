import type { Metadata } from "next";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import ContactForm from "@/components/forms/ContactForm";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Get a Factory Quote | POXIOL Custom Teamwear Wholesale",
  description: "Request a wholesale factory quote for custom basketball uniforms, soccer kits, or OEM sportswear. Receive direct B2B pricing and production plans within 24 hours.",
};

const quoteFaqs = [
  { question: "How long does it take to get a teamwear quote?", answer: "POXIOL provides professional B2B quotes within 24 hours of receiving your sport category, logo, quantity and deadline details." },
  { question: "Does the quote include international shipping?", answer: "Yes. POXIOL provides door-to-door express shipping estimates to the USA, Canada, Europe, and Australia as part of your formal quotation." },
  { question: "Are there volume discounts for club orders?", answer: "Yes. POXIOL offers tiered wholesale pricing based on quantity. Serious B2B buyers can receive OEM-level rates for 300+ uniform sets." },
  { question: "Can I get a quote for multiple sports together?", answer: "Yes. POXIOL supports multi-sport uniform programs for school athletic departments and event organizers, with unified pricing for team packages." }
];

export default function GetQuotePage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/get-quote/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <ServiceSchema 
        name="B2B Custom Teamwear Quotation Service"
        description="Get factory-direct wholesale pricing for custom sports uniforms, including sublimation, labels and logistics."
        url={fullUrl}
      />
      <FAQSchema faqs={quoteFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Get Quote", url: fullUrl }
      ]} />

      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(182,255,0,0.12),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="pt-4 lg:sticky lg:top-28">
            <span className="mb-6 inline-block text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">
               B2B Pricing
            </span>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tighter text-white md:text-8xl uppercase">
               Factory <br />Direct <br /><span className="text-[#B6FF00]">Quote.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-300">
               Request a POXIOL Factory Direct Quote. Receive competitive wholesale pricing and production plans for basketball, soccer and multi-sport teamwear within 24 hours.
            </p>
            
            <div className="mt-12 space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl font-bold text-[#B6FF00] border border-white/10 shadow-lg shadow-[#B6FF00]/5">01</div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Volume-Based OEM Pricing</h3>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed max-w-sm">Locked pricing tiers based on your specific team quantity, product mix and customization level.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl font-bold text-[#B6FF00] border border-white/10 shadow-lg shadow-[#B6FF00]/5">02</div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Technical Specification Review</h3>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed max-w-sm">Quotes include fabric mesh options, sublimation print confirmation and custom label details.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl font-bold text-[#B6FF00] border border-white/10 shadow-lg shadow-[#B6FF00]/5">03</div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Global Logistics Estimates</h3>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed max-w-sm">Estimated door-to-door express shipping rates to USA, Europe, Australia and global hubs.</p>
                </div>
              </div>
            </div>
          </div>
          
          <ContactForm 
            title="Request Wholesale Pricing"
            subtitle="Please provide your sport type, quantity, and logo files. Our sales team will calculate a formal B2B quote and production plan for your review."
            formType="Get Quote AEO V90"
            ctaText="Request Factory Quote"
            successUrl="/quote-received/"
          />
        </div>
      </section>

      {/* AEO FAQ Module */}
      <section className="bg-white px-5 py-24 md:px-10 md:py-32 text-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
           <SectionHeading eyebrow="Buying Guide" title="Quote Sourcing FAQ" center />
           <div className="mt-20 space-y-4 text-left">
              {quoteFaqs.map((faq) => (
                <details key={faq.question} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 group">
                   <summary className="cursor-pointer text-lg font-black text-neutral-950 list-none flex justify-between items-center group-open:text-lime-600 transition">
                      {faq.question}
                      <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                   </summary>
                   <p className="mt-4 leading-7 text-neutral-600 border-t border-neutral-200 pt-4 max-w-3xl">{faq.answer}</p>
                </details>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
