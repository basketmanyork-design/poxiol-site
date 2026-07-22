import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, freeMockupHref } from "@/components/ui";

export const metadata: Metadata = {
  title: "Premium Performance Fabric Options | POXIOL Sportswear",
  description: "Explore our range of high-performance moisture-wicking fabrics for custom basketball, soccer, and training uniforms. Engineered for elite athletes.",
};

const fabrics = [
  { name: "Pro Mesh", desc: "Highly breathable, open-hole mesh designed for maximum airflow during basketball and training." },
  { name: "Dura-Interlock", desc: "Smooth, high-tensile polyester with excellent color absorption and durability for soccer and rugby." },
  { name: "Ultra-Dry Tricot", desc: "Lightweight, moisture-wicking material that moves sweat away from the body for marathon and running wear." },
  { name: "Flex-Compression", desc: "Four-way stretch fabric for ergonomic fit and muscle support in specialized athletic gear." }
];

export default function FabricOptionsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Materials" title="Engineered Performance Fabrics" subtitle="We select only the highest grade polyester fibers to ensure your team stays cool, dry, and comfortable." dark center />

          <div className="mt-20 grid gap-6 md:grid-cols-2 text-left">
            {fabrics.map(f => (
              <div key={f.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <h3 className="text-xl font-black uppercase text-[#B6FF00]">{f.name}</h3>
                <p className="mt-4 text-neutral-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[3rem] border border-white/10 bg-white/[0.02] p-10 text-left">
            <h3 className="text-2xl font-black uppercase">Sample Fabric Pack</h3>
            <p className="mt-6 text-neutral-300">Unsure about the feel or stretch? You can request a physical sample pack containing our core fabric options before starting your bulk team order.</p>
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
