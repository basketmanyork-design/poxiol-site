import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, freeMockupHref } from "@/components/ui";

export const metadata: Metadata = {
  title: "Unlimited Teamwear Customization Options | POXIOL",
  description: "From custom logos and player names to private labels and specialized fabrics. POXIOL offers full-range teamwear customization for pro teams and brands.",
};

const customOptions = [
  { title: "Team Branding", desc: "High-definition sublimation for club crests, sponsor logos, and original graphics." },
  { title: "Player Identity", desc: "Custom names and numbers in various font styles and placements." },
  { title: "Performance Fabrics", desc: "Select from moisture-wicking meshes, interlock polyester, or compression materials." },
  { title: "Trim & Detail", desc: "Custom collars, ribbed cuffs, reinforced stitching, and ergonomic paneling." },
  { title: "Private Labeling", desc: "Woven neck labels, printed heat-transfer tags, and custom hangtags for your brand." },
  { title: "Custom Packaging", desc: "Individual polybags, size-labeled cartons, and retail-ready presentation." }
];

export default function CustomizationPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Customization" title="Total Creative Control" subtitle="At POXIOL, customization goes far beyond a logo. We help you engineer every detail of your uniform." dark center />
          
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {customOptions.map(opt => (
              <div key={opt.title} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 hover:border-[#B6FF00] transition">
                <h3 className="text-2xl font-black uppercase text-[#B6FF00]">{opt.title}</h3>
                <p className="mt-6 text-neutral-400 leading-relaxed text-sm">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-5 py-32 border-y border-white/5">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img src="/images/poxiol-v6/home_club_partnership_program.png" alt="Customization discussion" className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="OEM Support" title="Private Label for Brands" dark />
            <p className="mt-8 text-xl text-neutral-300 leading-relaxed">
              If you are launching a sportswear brand, POXIOL provides the technical expertise to create consistent fits and premium finishes that set your label apart.
            </p>
            <div className="mt-10 space-y-6">
              <div className="flex gap-4 items-start">
                <span className="text-[#B6FF00] font-black">✓</span>
                <p className="text-neutral-400"><strong className="text-white">Pattern Development:</strong> Original sizing templates built for your target demographic.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-[#B6FF00] font-black">✓</span>
                <p className="text-neutral-400"><strong className="text-white">Color Matching:</strong> Strict Pantone matching to ensure your brand colors are always accurate.</p>
              </div>
            </div>
            <div className="mt-12">
              <PrimaryButton href={freeMockupHref}>Start Designing</PrimaryButton>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
