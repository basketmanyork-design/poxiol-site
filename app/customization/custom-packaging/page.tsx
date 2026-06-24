import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Professional Custom Teamwear Packaging | POXIOL B2B",
  description: "Retail-ready custom packaging solutions for teamwear. Branded polybags, size labeling, and specialized export cartons for global delivery.",
};

export default function CustomPackagingPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Logistics" title="Custom Packaging Solutions" subtitle="We ensure your custom uniforms arrive in perfect condition and ready for distribution." dark center />
          
          <div className="mt-20 grid gap-12 text-left md:grid-cols-2">
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Eco-Friendly Polybags</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Each uniform set is individually folded and packed in a clean, resealable polybag with clear size labeling.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Size Sorting</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Large orders are sorted and grouped by size before being placed in cartons, saving you hours of distribution time.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Export-Grade Cartons</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Double-wall corrugated cardboard cartons to protect against international freight handling and moisture.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Branded Packaging</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">For sportswear brands, we can provide fully custom-printed polybags and branded outer-tape for a premium unboxing experience.</p>
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
