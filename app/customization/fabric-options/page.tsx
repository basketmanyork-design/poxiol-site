import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { getApprovedClaimWording } from "@/lib/governance/claims";

export const metadata: Metadata = {
  title: "Custom Teamwear Fabric Options | POXIOL",
  description: "Review fabric categories for custom teamwear, with final material selection confirmed against the product, intended use, availability, and sample.",
};

const fabrics = [
  { name: "Mesh Structures", desc: "Mesh constructions can be reviewed where airflow and garment structure are priorities." },
  { name: "Interlock Structures", desc: "Interlock constructions can be compared for smoothness, weight, coverage, and decoration compatibility." },
  { name: "Tricot Structures", desc: "Tricot options can be reviewed for lightweight product formats and the intended wearing conditions." },
  { name: "Stretch Structures", desc: "Stretch constructions can be considered where movement, fit, and panel design need additional review." }
];

export default function FabricOptionsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Materials" title="Fabric Options by Project" subtitle={getApprovedClaimWording("fabric-review")} dark center />
          
          <div className="mt-20 grid gap-6 md:grid-cols-2 text-left">
            {fabrics.map(f => (
              <div key={f.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <h3 className="text-xl font-black uppercase text-[#B6FF00]">{f.name}</h3>
                <p className="mt-4 text-neutral-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[3rem] border border-white/10 bg-white/[0.02] p-10 text-left">
            <h3 className="text-2xl font-black uppercase">Material and Sample Review</h3>
            <p className="mt-6 text-neutral-300">Share the product type, intended use, construction preferences, and any material references. The applicable fabric and sample path can then be confirmed for your project.</p>
            <div className="mt-10">
              <PrimaryButton href="/contact/">Request Fabric Sample</PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
