import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, freeMockupHref } from "@/components/ui";

export const metadata: Metadata = {
  title: "Custom Logos, Names & Numbers | POXIOL Teamwear",
  description: "Elite sublimation printing for custom team logos, player names, and numbers. High-definition graphics with zero fading or peeling for your sports uniforms.",
};

export default function LogoNameNumberPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Branding" title="Logo, Name & Number Customization" subtitle="We use high-color sublimation technology to integrate your branding directly into the fabric fibers." dark center />
          
          <div className="mt-20 grid gap-12 text-left md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">High-Def Logos</h3>
              <p className="text-neutral-400 leading-relaxed">Submit your team crest or sponsor logos in vector format (AI, EPS, SVG). We ensure perfect color matching and crisp details on every jersey.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Player Identification</h3>
              <p className="text-neutral-400 leading-relaxed">Custom fonts for names and numbers. We support traditional athletic blocks, modern geometric styles, and original team typography.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Zero Fading</h3>
              <p className="text-neutral-400 leading-relaxed">Unlike screen prints or stickers, sublimated names and numbers will never crack, peel, or fade, even after hundreds of washes.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Multi-Placement</h3>
              <p className="text-neutral-400 leading-relaxed">Chest, back, sleeves, shoulders, or legs. We can place your branding exactly where your league or sponsor requirements dictate.</p>
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
