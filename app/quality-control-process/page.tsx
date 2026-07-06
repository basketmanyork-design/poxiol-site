import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Custom Teamwear Quality Control Process | POXIOL Sports Uniform QC",
  description: "Learn how POXIOL controls fabric, printing, sewing, sizing, packing and final inspection for custom basketball uniforms, soccer kits and OEM teamwear orders.",
};

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
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <SectionHeading 
            eyebrow="Workflow" 
            title="Custom Teamwear Quality Control Process" 
            subtitle="POXIOL uses a multi-stage quality control workflow to help B2B buyers reduce production risk."
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

          <div className="mt-24 rounded-[3rem] border border-neutral-200 bg-neutral-50 p-10 text-center">
             <h3 className="text-2xl font-black uppercase mb-4">Request a QC Plan</h3>
             <p className="text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto">Send your product type, quantity, size chart and quality requirements. POXIOL will help confirm the specific QC plan before production starts.</p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <PrimaryButton href="/free-mockup/">Get Free Mockup</PrimaryButton>
                <SecondaryButton href="/contact/" darkText>Request QC Plan</SecondaryButton>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
