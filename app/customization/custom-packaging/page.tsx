import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { getApprovedClaimWording } from "@/lib/governance/claims";

export const metadata: Metadata = {
  title: "Custom Teamwear Packaging Review | POXIOL B2B",
  description: "Review packing, size-grouping, labeling, carton, and branded-packaging requirements for a custom teamwear project.",
};

export default function CustomPackagingPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Logistics" title="Project Packaging Requirements" subtitle={getApprovedClaimWording("packaging-review")} dark center />
          
          <div className="mt-20 grid gap-12 text-left md:grid-cols-2">
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Individual Packing</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Confirm whether individual folding, bagging, and size identification are required for the order.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Size Sorting</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Share the preferred size-grouping and carton-marking structure so it can be reviewed with the order list.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Carton Requirements</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Carton format, marking, destination, and transport requirements are reviewed for the project before packing is confirmed.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Branded Packaging</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Provide artwork and specifications for any branded bag, label, tape, or outer-carton request so current options can be confirmed.</p>
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
