import type { Metadata } from "next";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading } from "@/components/ui";
import { Layers, Rocket, Users, ShieldCheck, CheckCircle2, Package, Layout, Palette, PenTool, ClipboardCheck, Globe } from "lucide-react";

export const metadata: Metadata = { 
  title: "OEM/ODM Sportswear Manufacturer for Custom Teamwear Brands | POXIOL", 
  description: "POXIOL supports OEM/ODM sportswear production for brands, wholesalers and distributors, including private label teamwear, custom design development, sampling and multi-sport uniform manufacturing." 
};

const userGroups = [
  {
    icon: <Rocket className="h-6 w-6 text-lime-400" />,
    title: "Sportswear Brands",
    desc: "Develop private label collections across basketball, soccer, baseball, running, and training wear."
  },
  {
    icon: <Layers className="h-6 w-6 text-lime-400" />,
    title: "Wholesalers",
    desc: "Expand your catalog with custom team uniforms and multi-sport apparel from one production partner."
  },
  {
    icon: <Users className="h-6 w-6 text-lime-400" />,
    title: "Custom Retailers",
    desc: "Test new designs, launch sport-specific products, and support customer customization with flexible MOQ."
  },
  {
    icon: <Globe className="h-6 w-6 text-lime-400" />,
    title: "Event Suppliers",
    desc: "Develop race apparel, staff uniforms, tournament shirts, and seasonal teamwear products."
  }
];

const categories = [
  "Basketball Uniforms", "Soccer Kits", "Baseball & Softball", "Running & Marathon", "Training & Tracksuits",
  "American Football", "Volleyball Sets", "Ice Hockey Jerseys", "Tennis & Golf Wear", "Corporate Sportswear"
];

const workflow = [
  { title: "Direction", desc: "Submit brand, target sport, quantity, and market type." },
  { title: "Design", desc: "Confirm category and receive a professional mockup." },
  { title: "Sampling", desc: "Review fabric, fit, print, and construction via a physical sample." },
  { title: "Production", desc: "Start bulk production with rigorous QC and collection planning." },
  { title: "Delivery", desc: "Pack and ship according to specific brand requirements." }
];

export default function OEMPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative px-5 py-24 md:px-10 md:py-32 xl:px-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-lime-500/10 blur-[160px] rounded-full"></div>
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center relative z-10">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-lime-400">Strategic Manufacturing</p>
            <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
              OEM/ODM <span className="text-stroke-thin text-stroke-white text-transparent">PARTNER</span>
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-neutral-400">
              Develop private label teamwear collections with POXIOL design support, sampling, sublimation printing, multi-sport production and flexible customization.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton href="/free-mockup/">Start OEM Project</PrimaryButton>
              <SecondaryButton href="/contact/">Consult with Experts</SecondaryButton>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
            <img 
              src="/images/free-mockup/free-mockup-hero.webp" 
              alt="POXIOL OEM Design Studio" 
              className="h-full w-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition duration-700"
            />
          </div>
        </div>
      </section>

      {/* Partner Groups */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 bg-white text-black">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="B2B Solutions" title="Who Our OEM/ODM Service Is For" center />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {userGroups.map((group, idx) => (
              <div key={idx} className="rounded-3xl border border-neutral-100 bg-neutral-50 p-8 transition hover:bg-neutral-900 hover:text-white">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-200 text-neutral-900 group-hover:bg-white/10">
                  {group.icon}
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase tracking-tight">{group.title}</h3>
                <p className="text-neutral-600 group-hover:text-neutral-400">{group.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OEM vs ODM */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2">
          <div className="rounded-[3rem] bg-neutral-900 p-12 border border-white/5">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black">
              <Layout className="h-7 w-7" />
            </div>
            <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">OEM SUPPORT</h2>
            <p className="text-xl text-neutral-400 leading-relaxed mb-8">
              Suitable when the buyer already has brand identity, product direction, artwork or specifications. POXIOL helps produce according to the buyer’s exact design and customization requirements.
            </p>
            <ul className="space-y-4">
              {["Brand Identity Integration", "Specification Compliance", "Mass Production Scalability", "Quality Consistency"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 font-bold text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-lime-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[3rem] bg-lime-400 p-12 text-black">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lime-400">
              <PenTool className="h-7 w-7" />
            </div>
            <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">ODM SUPPORT</h2>
            <p className="text-xl text-black/80 leading-relaxed mb-8">
              Suitable when the buyer needs product and design development support. POXIOL helps with original teamwear concepts, color direction, fabric suggestions, and production planning.
            </p>
            <ul className="space-y-4">
              {["Original Concept Development", "Mockup & Visual Support", "Fabric Engineering", "Sampling & Fit Optimization"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 font-bold text-black">
                  <CheckCircle2 className="h-5 w-5 text-black" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 bg-neutral-100 text-black overflow-hidden relative">
        <div className="mx-auto max-w-7xl relative z-10">
          <SectionHeading eyebrow="The Journey" title="Development Workflow" center />
          <div className="mt-20 grid gap-8 md:grid-cols-5 relative">
            {workflow.map((step, idx) => (
              <div key={idx} className="relative z-10 text-center md:text-left">
                <div className="mb-6 flex flex-col items-center md:items-start">
                  <span className="text-6xl font-black text-neutral-200 mb-2">{idx + 1}</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{step.title}</h3>
                </div>
                <p className="text-neutral-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-neutral-200 -z-0"></div>
          </div>
        </div>
      </section>

      {/* Customization & Categories */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <SectionHeading eyebrow="Capabilities" title="OEM/ODM Categories" />
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-6">
                    <CheckCircle2 className="h-5 w-5 text-lime-400" />
                    <span className="font-bold text-neutral-200">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-lime-400/30 p-10 bg-lime-400/5">
              <h3 className="text-2xl font-black mb-8 uppercase text-lime-400">Customization Options</h3>
              <ul className="grid gap-6">
                {[
                  { icon: <Palette />, text: "Original Colorways" },
                  { icon: <PenTool />, text: "Custom Sublimation Patterns" },
                  { icon: <Layers />, text: "Fabric Type & Weight Selection" },
                  { icon: <Layout />, text: "Neckline & Sleeve Customization" },
                  { icon: <ClipboardCheck />, text: "Private Labels & Branding" },
                  { icon: <Package />, text: "Custom Packaging Solutions" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="text-lime-400 h-5 w-5">{item.icon}</div>
                    <span className="font-bold text-neutral-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Brands Work With Us */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-square overflow-hidden rounded-[3rem]">
              <img src="/images/factory/factory-qc.webp" alt="QC" className="h-full w-full object-cover grayscale" />
            </div>
            <div>
              <SectionHeading eyebrow="The Advantage" title="Why Brands Choose POXIOL" />
              <p className="mt-8 text-xl text-neutral-400 leading-relaxed">
                We reduce the difficulty of launching teamwear collections. Start with a mockup, sample a direction, and scale as needed.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {[
                  "Multi-sport Capability", "Free Mockup Support", "MOQ 1 Flexible Orders", "2-3 Day Sampling", 
                  "3-5 Day Production", "Private Label Branding", "B2B Production Planning", "Rigorous QC Process"
                ].map((adv, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-lime-400" />
                    <span className="font-bold text-neutral-300">{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Ready to Scale?" title="START YOUR OEM/ODM PROJECT" center />
          <p className="mt-8 text-xl text-neutral-400 mb-12">
            The easiest way to begin is by sharing your brand direction, target sport, and reference styles. We will help you understand the next steps for sampling and production.
          </p>
          <PrimaryButton href="/free-mockup/" className="px-12 py-5 text-xl">Request Project Consultation</PrimaryButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
