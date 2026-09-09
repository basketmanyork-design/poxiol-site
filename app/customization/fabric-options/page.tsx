import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { getApprovedClaimWording } from "@/lib/governance/claims";
import { FabricReferenceLibrary } from "@/components/fabrics/FabricReferenceLibrary";

export const metadata: Metadata = {
  title: "Custom Teamwear Fabric Options | POXIOL",
  description: "Review 29 fabric references for your teamwear project, with final material selection confirmed against the product, intended use, availability, and sample.",
};

export default function FabricOptionsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Materials" title="Fabric References for Your Teamwear Project" subtitle={getApprovedClaimWording("fabric-review")} dark center level="h1" />

          <FabricReferenceLibrary />

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
