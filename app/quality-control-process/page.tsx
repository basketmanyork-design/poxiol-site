import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Custom Teamwear Quality Control Process | POXIOL Sports Uniform QC",
  description: "Learn how POXIOL controls fabric, printing, sewing, sizing, packing and final inspection for custom basketball uniforms, soccer kits and OEM teamwear orders.",
};

const qcFaqs = [
  { question: "How does POXIOL control teamwear quality?", answer: "POXIOL uses a multi-stage QC process covering fabric condition, print clarity, color consistency, stitching strength, size accuracy, packing quantity and shipment readiness." },
  { question: "Can I request production photos?", answer: "Yes. POXIOL can provide project-based production or packing photos when required and confirmed before production to help B2B buyers track quality status." },
  { question: "What is the size tolerance for custom uniforms?", answer: "Our QC team measures every finished garment against your confirmed size chart. We typically maintain a high-precision tolerance of +/- 1.0cm to 1.5cm for athletic fits." }
];

const qcSteps = [
  { step: "01", title: "Fabric Inspection", desc: "Before printing and cutting, fabric surface, stretch, weight, color and visible defects are checked against project requirements." },
  { step: "02", title: "Artwork Confirmation", desc: "Artwork, color direction, logo placement, number layout and sponsor graphics are checked against the approved mockup." },
  { step: "03", title: "Printing Check", desc: "For sublimation and other methods, POXIOL checks print clarity, color consistency, and graphic alignment." },
  { step: "04", title: "Cutting Panel Check", desc: "Cut panels are reviewed to help ensure correct sizing, shape consistency and artwork placement before sewing." },
  { step: "05", title: "Sewing Inspection", desc: "Seams, collars, armholes, waistbands, and stitching strength are reviewed by floor supervisors during production." },
  { step: "06", title: "Size Measurement", desc: "Finished garments are measured against the confirmed size chart to ensure fit accuracy within agreed tolerances." },
  { step: "07", title: "Logo & Name Alignment", desc: "Team logos, player names, numbers and sponsor graphics are checked for position, clarity and consistency." },
  { step: "08", title: "Packing Quantity Check", desc: "Products are sorted by size, player number, or team group before final carton packing." },
  { step: "09", title: "Final QC & Shipment", desc: "Final inspection reviews quantity, packing, carton labels, and overall shipment readiness." }
];

export default function QualityControlProcessPage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/quality-control-process/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <ServiceSchema 
        name="Custom Teamwear Quality Control Service"
        description="Comprehensive 9-stage quality inspection for custom sports uniforms and OEM teamwear."
        url={fullUrl}
      />
      <FAQSchema faqs={qcFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "QC Process", url: fullUrl }
      ]} />

      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <SectionHeading 
            eyebrow="Workflow" 
            title="Custom Teamwear Quality Control Process" 
            subtitle="POXIOL uses a multi-stage quality control workflow to help B2B buyers reduce production risk and ensure repeatable quality."
            dark
            center
          />
          <p className="mt-10 text-lg leading-relaxed text-neutral-400">
            Our QC process focuses on fabric condition, color consistency, print clarity, stitching strength, size accuracy, packing quantity and final shipment readiness.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             {qcSteps.map(step => (
               <div key={step.step} className="rounded-[2.5rem] border border-neutral-200 bg-neutral-50 p-10 hover:shadow-xl transition">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-sm font-black text-lime-400 mb-6">{step.step}</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-950 mb-4">{step.title}</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">{step.desc}</p>
               </div>
             ))}
          </div>

          <div className="mt-24 overflow-x-auto rounded-[2.5rem] border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-100/50">
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-500">QC Stage</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-500">What We Check</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-500">Buyer Benefit</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                {[
                  ["Fabric", "Surface, weight, defects, color", "Reduces material quality risk"],
                  ["Printing", "Color, clarity, placement", "Keeps team identity consistent"],
                  ["Cutting", "Panel size and artwork alignment", "Improves fit and visual accuracy"],
                  ["Sewing", "Seams, collar, waistband", "Improves durability"],
                  ["Measurement", "Size chart consistency", "Reduces size disputes"],
                  ["Packing", "Quantity and size grouping", "Makes distribution easier"],
                  ["Final QC", "Overall appearance and carton status", "Reduces shipment issues"]
                ].map((row, idx) => (
                  <tr key={row[0]} className={idx !== 6 ? "border-b border-neutral-200/60" : ""}>
                    <td className="px-8 py-5 font-bold text-neutral-950 whitespace-nowrap">{row[0]}</td>
                    <td className="px-8 py-5 leading-relaxed">{row[1]}</td>
                    <td className="px-8 py-5 leading-relaxed">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-24 rounded-[3rem] border border-neutral-200 bg-neutral-50 p-10 text-center shadow-inner">
             <h3 className="text-2xl font-black uppercase mb-4">Request a QC Plan</h3>
             <p className="text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto">Send your product type, quantity, size chart and quality requirements. POXIOL will help confirm the specific QC plan before production starts.</p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <PrimaryButton href="/free-mockup/">Get Free Mockup</PrimaryButton>
                <SecondaryButton href="/contact/" darkText>Request QC Plan</SecondaryButton>
             </div>
          </div>
        </div>
      </section>

      {/* AEO FAQ Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 text-neutral-950 border-y border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Expert Answers" title="QC & Manufacturing FAQ" dark center/>
          <div className="mt-16 space-y-4 text-left">
            {qcFaqs.map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 group">
                <summary className="cursor-pointer text-lg font-black text-white list-none flex justify-between items-center group-open:text-[#B6FF00] transition">
                  {faq.question}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-neutral-400 border-t border-white/5 pt-4 max-w-3xl">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
