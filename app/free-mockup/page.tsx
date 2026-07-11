import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { trustItems, requestTypes, prepareChecklist, freeMockupFaqs } from "@/lib/free-mockup-data";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Get a Free Custom Teamwear Mockup | POXIOL",
  description: "Request a free POXIOL custom teamwear mockup. Send your sport, logo, colors and quantity to get a professional uniform design preview within 24 hours.",
};

const receiveItems = [
  ["Uniform Visual Mockup", "Preview the teamwear look before physical sampling or bulk team orders."],
  ["Color & Logo Direction", "Confirm how your colors, logo, name and number layout look on athletic apparel."],
  ["Product Specification", "Get expert guidance on fabric choices, sizing and construction based on your sport."],
  ["Production Plan", "Move from mockup to a clear timeline for sampling, bulk production and delivery."],
];

export default function FreeMockupPage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/free-mockup/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <ServiceSchema 
        name="Free Custom Teamwear Mockup Design"
        description="POXIOL provides professional front/back visual mockups for basketball uniforms, soccer kits and teamwear within 24 hours."
        url={fullUrl}
      />
      <FAQSchema faqs={freeMockupFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Free Mockup", url: fullUrl }
      ]} />

      <Header />
      <section id="top" className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(182,255,0,0.16),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.08),transparent_28%)]"/>
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="pt-4 lg:sticky lg:top-28">
            <span className="mb-6 inline-block text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">
               Design Service
            </span>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tighter text-white md:text-8xl uppercase">
               Free <br />Mockup <br /><span className="text-[#B6FF00]">Design.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-300">
               Get Your Free POXIOL Teamwear Mockup. Submit your logo, colors and sport category to receive a professional 3D design preview within 24 hours for team or brand evaluation.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
               {["MOQ 1 supported", "1-2H mockup speed", "Sample Production: 2–3 Days", "OEM/ODM ready", "Quality Support"].map(item => (
                 <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B6FF00]" /> {item}
                 </div>
               ))}
            </div>
            <div className="mt-10 rounded-[2rem] border border-lime-400/20 bg-lime-400/5 p-8 text-sm leading-7 text-neutral-300">
               No professional design file? Send your ideas, reference styles or smartphone photos. POXIOL will help turn your concept into a production-ready uniform mockup.
            </div>
          </div>
          <div id="mockup-form">
            <ContactForm 
              title="Request Free Mockup"
              subtitle="Upload your team logo, reference design or color direction. Our creative team will prepare a high-fidelity visual preview for your review."
              formType="Free Mockup AEO V90"
              ctaText="Send My Request"
              successUrl="/thank-you/"
            />
            {/* Fallback CTAs for AI crawlers / No JS */}
            <div className="mt-6 flex justify-center gap-6 opacity-60">
              <a href="mailto:york@basketman.cn" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white underline">Email Inquiry</a>
              <a href="https://wa.me/8613055646888" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white underline">WhatsApp Chat</a>
            </div>
          </div>
        </div>
      </section>

      {/* After You Submit Module */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
           <SectionHeading eyebrow="Next Steps" title="After You Submit Your Request" subtitle="What to expect after sending your custom teamwear mockup inquiry." dark center />
           <div className="mt-20 grid gap-8 lg:grid-cols-4">
              {[
                { step: "Step 1", title: "Review", desc: "POXIOL reviews your logo, sport category and quantity to confirm project feasibility." },
                { step: "Step 2", title: "3D Design", desc: "Our creative team prepares a professional front and back mockup based on your requirements." },
                { step: "Step 3", title: "Confirmation", desc: "Our B2B specialists confirm fabric, size charts and the physical sample production plan." },
                { step: "Step 4", title: "Path to Order", desc: "You receive your mockup, quotation and clear next-step suggestions for production." }
              ].map(item => (
                <div key={item.step} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-[#B6FF00]/50 transition group">
                   <p className="text-xs font-black uppercase tracking-widest text-[#B6FF00] mb-4">{item.step}</p>
                   <h3 className="text-xl font-black text-white uppercase italic mb-4">{item.title}</h3>
                   <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* What to Prepare Module */}
      <section className="bg-white px-5 py-24 md:px-10 md:py-32 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center">
           <div>
              <SectionHeading eyebrow="Preparation" title="What to Prepare for a Free Mockup" subtitle="The more detail you provide, the faster our design team can prepare a useful preview." />
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                 {[
                   "Team or brand logo file",
                   "Sport category (Basketball, Soccer, etc.)",
                   "Main team color direction",
                   "Team name or brand name",
                   "Player name/number list if available",
                   "Estimated order quantity",
                   "Target delivery country"
                 ].map(item => (
                   <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm font-bold text-neutral-700 flex items-center gap-3">
                      <span className="text-lime-600">✓</span> {item}
                   </div>
                 ))}
              </div>
           </div>
           <div className="aspect-[4/3] rounded-[3rem] overflow-hidden border border-neutral-200 shadow-2xl">
              <img src="/images/contact/mockup-visual.webp" className="h-full w-full object-cover" alt="POXIOL Mockup Preparation" />
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-neutral-100 px-5 py-24 md:px-10 md:py-32 text-neutral-950 border-y border-neutral-200">
        <div className="mx-auto max-w-4xl text-center">
           <SectionHeading eyebrow="Expert Answers" title="Mockup Sourcing FAQ" center />
           <div className="mt-20 space-y-4 text-left">
              {freeMockupFaqs.map((faq) => (
                <details key={faq.question} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm group">
                   <summary className="cursor-pointer text-lg font-black text-neutral-950 list-none flex justify-between items-center group-open:text-lime-600">
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
