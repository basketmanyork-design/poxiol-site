import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import ContactForm from "@/components/forms/ContactForm";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Start a Sample Order | POXIOL Custom Teamwear Testing",
  description: "Test the fabric, fit, and print quality before bulk production. Start a 1-piece custom jersey sample order with Sample Production: 2–3 Days After Mockup Confirmation.",
};

const sampleFaqs = [
  { question: "How long does a custom sample take?", answer: "POXIOL arranges sample production within 2–3 days after your design mockup is confirmed. Express international delivery typically takes 3–7 business days." },
  { question: "Can I order just one custom sample?", answer: "Yes. POXIOL supports 1-set sample orders for serious B2B buyers to verify fabric condition, fit accuracy and print vibrancy before bulk team orders." },
  { question: "Is the sample fee refundable?", answer: "Yes. Sample fees for standard custom uniforms are often credited toward bulk orders over 100 sets. Confirm with your specialist during the quote phase." },
  { question: "What does the physical sample include?", answer: "A physical sample includes your custom logo, colors, player name and number on the selected fabric mesh, allowing for a complete quality review." }
];

export default function SampleOrderPage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/sample-order/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <ServiceSchema 
        name="Physical Custom Teamwear Sampling"
        description="Verify fabric, fit and print quality with a professional 1-set custom sports uniform sample."
        url={fullUrl}
      />
      <FAQSchema faqs={sampleFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Sample Order", url: fullUrl }
      ]} />

      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(182,255,0,0.12),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="pt-4 lg:sticky lg:top-28">
            <span className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">
               B2B Verification
            </span>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tighter text-white md:text-8xl uppercase">
               Sample <br />Order <br /><span className="text-[#B6FF00]">Support.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-300">
               Verify POXIOL Manufacturing Quality. Start a 1-piece custom jersey sample order with Sample Production: 2–3 Days After Mockup Confirmation to test fabric moisture-wicking, sublimation vibrancy and sizing fit before bulk production.
            </p>
            
             <div className="mt-12 p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.03] shadow-2xl">
              <h3 className="text-xl font-black uppercase italic mb-8">4-Step Sampling Process</h3>
              <ul className="space-y-6">
                {[
                  ["Submit Design", "Provide logo, colors and sport category to receive a design mockup."],
                  ["Confirm Specs", "Confirm the fabric weight, print alignment and size chart details."],
                  ["Production", "Sample Production: 2–3 Days After Mockup Confirmation."],
                  ["Delivery", "Express international delivery usually takes 3–7 business days depending on country."]
                ].map(([step, desc], i) => (
                  <li key={step} className="flex gap-5">
                    <span className="text-sm font-black text-[#B6FF00] tracking-widest">{String(i+1).padStart(2,"0")}</span>
                    <div>
                      <p className="font-bold text-white uppercase text-sm">{step}</p>
                      <p className="mt-1 text-sm text-neutral-400 leading-relaxed">{desc}</p>
                      {step === "Confirm Specs" && (
                        <Link href="/guides/teamwear-sample-approval-checklist/" className="mt-2 inline-block text-[10px] font-black uppercase tracking-widest text-[#B6FF00] hover:underline">View Approval Checklist →</Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          
          <ContactForm 
            title="Request Physical Sample"
            subtitle="Tell us which sport category and product you want to sample. Include logo, colors and sizes so we can prepare your sample tech-pack."
            formType="Sample Order AEO V90"
            ctaText="Start Sample Order"
            successUrl="/sample-request-received/"
          />
        </div>
      </section>

      {/* AEO FAQ Module */}
      <section className="bg-neutral-100 px-5 py-24 md:px-10 md:py-32 text-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
           <SectionHeading eyebrow="Buying Guide" title="Teamwear Sampling FAQ" center />
           <div className="mt-20 space-y-4 text-left">
              {sampleFaqs.map((faq) => (
                <details key={faq.question} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm group">
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
