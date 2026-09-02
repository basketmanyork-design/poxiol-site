import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, freeMockupHref } from "@/components/ui";
import { getApprovedClaimWording } from "@/lib/governance/claims";

export const metadata: Metadata = {
  title: "Custom Logos, Names & Numbers | POXIOL Teamwear",
  description: "Review artwork, color references, player names, numbers, placement requirements, and applicable decoration methods for custom teamwear.",
};

export default function LogoNameNumberPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Branding" title="Logo, Name & Number Customization" subtitle={getApprovedClaimWording("decoration-placement-review")} dark center />
          
          <div className="mt-20 grid gap-12 text-left md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Artwork Review</h3>
              <p className="text-neutral-400 leading-relaxed">Share available crest, sponsor, and brand artwork. Vector files and color references help the team review reproduction requirements before the mockup is confirmed.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Player Identification</h3>
              <p className="text-neutral-400 leading-relaxed">Custom fonts for names and numbers. We support traditional athletic blocks, modern geometric styles, and original team typography.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Sublimation Comparison</h3>
              <p className="text-neutral-400 leading-relaxed">{getApprovedClaimWording("sublimation-comparison")}</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Multi-Placement</h3>
              <p className="text-neutral-400 leading-relaxed">Share the required chest, back, sleeve, shoulder, or leg positions so placement and decoration compatibility can be reviewed before approval.</p>
            </div>
          </div>

          <div className="mt-20">
            <PrimaryButton href={freeMockupHref}>Start Your Design</PrimaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
