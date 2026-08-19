import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, freeMockupHref } from "@/components/ui";

export const metadata: Metadata = {
  title: "Custom Logos, Names & Numbers | POXIOL Teamwear",
  description: "Review sublimation and other approved methods for team logos, player names and numbers. Results depend on artwork, fabric, print method and care requirements.",
  alternates: {canonical: "/customization/logo-name-number/"},
};

export default function LogoNameNumberPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Branding" title="Logo, Name & Number Customization" subtitle="Logo, name and number options are confirmed against the approved artwork, fabric and print method." dark center level="h1" />
          
          <div className="mt-20 grid gap-12 text-left md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Artwork Review</h3>
              <p className="text-neutral-400 leading-relaxed">Submit authorized team or sponsor artwork in an available vector format. Color targets and printable detail are reviewed before approval.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Player Identification</h3>
              <p className="text-neutral-400 leading-relaxed">Name, number and font options are confirmed from the approved roster, artwork and placement requirements.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Print Durability</h3>
              <p className="text-neutral-400 leading-relaxed">Sublimated names and numbers are designed for a durable finish. Performance depends on the approved fabric, print process and care instructions.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Multi-Placement</h3>
              <p className="text-neutral-400 leading-relaxed">Chest, back, sleeve, shoulder and leg placements are reviewed against garment construction, artwork and buyer authorization.</p>
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
