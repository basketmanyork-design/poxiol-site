import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Professional Custom Teamwear Packaging | POXIOL B2B",
  description: "Review teamwear packaging options including polybags, size labeling, branded materials and export-carton specifications. Final packaging is confirmed per project.",
  alternates: {canonical: "/customization/custom-packaging/"},
};

export default function CustomPackagingPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Logistics" title="Custom Packaging Solutions" subtitle="Packaging materials, labeling, sorting and carton specifications are confirmed for each project." dark center level="h1" />
          
          <div className="mt-20 grid gap-12 text-left md:grid-cols-2">
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Polybag Options</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Polybags, folding method and size labeling are confirmed against the product and distribution requirements.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Size Sorting</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Size-grouped packing can be specified when the approved order breakdown and labeling requirements are available.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Export-Grade Cartons</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Carton material and packing method are selected according to the product, shipment method and confirmed handling requirements.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Branded Packaging</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Branded polybags, labels and outer-tape options are reviewed against artwork, quantity, material and production requirements.</p>
            </div>
          </div>

          <div className="mt-20">
            <PrimaryButton href="/contact/">Connect With Logistics Team</PrimaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
