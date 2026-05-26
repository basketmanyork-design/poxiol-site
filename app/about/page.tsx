import type { Metadata } from "next";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading } from "@/components/ui";
import Link from "next/link";
import { CheckCircle2, Users, Trophy, Building2, Layers, Zap, ShieldCheck, Microscope, Target, Globe, Rocket, Store, ClipboardList } from "lucide-react";

export const metadata: Metadata = { 
  title: "About POXIOL | Custom Teamwear Manufacturer for Clubs, Schools and Brands", 
  description: "POXIOL is a custom teamwear manufacturer providing basketball uniforms, soccer kits, baseball uniforms, running apparel, training wear and OEM/ODM sportswear production for clubs, schools, events, brands and distributors." 
};

const categories = [
  "Custom basketball uniforms",
  "Custom soccer kits",
  "Baseball and softball uniforms",
  "Running and marathon apparel",
  "Training wear and warm-up suits",
  "Volleyball uniforms",
  "American football uniforms",
  "Ice hockey jerseys",
  "Tennis wear",
  "Golf wear and corporate sportswear"
];

const customizationOptions = [
  "Team logos", "Player names", "Player numbers", "Team colors", "Original pattern design", 
  "Sublimation printing", "Custom fit and size range", "OEM/ODM collection development", 
  "Private label and brand support", "Packaging support"
];

const buyerTypes = [
  {
    icon: <Users className="h-6 w-6 text-lime-400" />,
    title: "Clubs & Local Teams",
    desc: "Create a unified team identity with custom uniforms, training apparel and repeat-order support for clubs and local programs."
  },
  {
    icon: <Building2 className="h-6 w-6 text-lime-400" />,
    title: "Schools & Academies",
    desc: "Support multi-sport teamwear programs with consistent colors, team logos, sizing options and seasonal uniform planning."
  },
  {
    icon: <Trophy className="h-6 w-6 text-lime-400" />,
    title: "Tournaments & Events",
    desc: "Deadline-based event apparel such as running singlets, staff shirts, referee tops and tournament uniforms."
  },
  {
    icon: <Rocket className="h-6 w-6 text-lime-400" />,
    title: "Sportswear Brands",
    desc: "OEM/ODM support from concept development to sample production and custom teamwear collection planning."
  },
  {
    icon: <Globe className="h-6 w-6 text-lime-400" />,
    title: "Wholesalers",
    desc: "Multi-sport product options, flexible customization and catalog expansion support for resellers and distributors."
  }
];

const differentiators = [
  { title: "Free Mockup Support", desc: "Submit your sport, logo, and colors. Our team will review your project details and help prepare the next step." },
  { title: "MOQ 1 Flexible Orders", desc: "We support flexible orders from MOQ 1, making it easier to test a sample or serve a small team before scaling." },
  { title: "Fast Sampling", desc: "Sample production can be arranged quickly after design confirmation to review fabric, fit, and print effect." },
  { title: "Multi-Sport Capability", desc: "We support a wide range of teamwear categories, making it easier to manage multiple sports through one supplier." },
  { title: "OEM/ODM Ready", desc: "Support including original design, private label planning, sampling, production and category expansion." },
  { title: "Performance & Sublimation", desc: "Focus on breathable fabrics, quick-dry options, and high-quality sublimation printing that never peels." }
];

const workflow = [
  "Submit sport, logo, colors and quantity.",
  "Request a free mockup or design direction.",
  "Confirm product details and sample requirements.",
  "Review sample, fabric, sizing and print effect.",
  "Move into team or bulk production.",
  "Complete QC inspection and packing.",
  "Arrange delivery and future reorder support."
];

export default function AboutPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-lime-500 blur-[120px]"></div>
        </div>
        
        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-6 text-sm font-extrabold uppercase tracking-[0.2em] text-lime-400">Since 2011</p>
            <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-8xl uppercase">
              About <span className="text-lime-400">POXIOL</span> Teamwear
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-neutral-400">
              POXIOL helps teams, schools, events, sportswear brands and distributors build custom teamwear with fast mockups, flexible MOQ, performance fabrics and scalable OEM/ODM production support.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton href="/free-mockup/">Get Free Mockup</PrimaryButton>
              <SecondaryButton href="/contact/">Contact POXIOL</SecondaryButton>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
            <img 
              src="/images/hero/hero-multisport-teamwear.webp" 
              alt="POXIOL Teamwear Production" 
              className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
            />
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Our Identity" title="Who We Are" center />
          <div className="mt-12 space-y-8 text-lg leading-relaxed text-neutral-400">
            <p>
              POXIOL is a custom teamwear manufacturer focused on helping global buyers create professional sports uniforms for teams, clubs, schools, tournaments, events, distributors and sportswear brands.
            </p>
            <p>
              We provide multi-sport custom apparel solutions. Our work is not limited to printing logos on blank apparel. We support the full custom teamwear process, including design direction, visual mockup, fabric selection, sample development, sublimation printing, name and number customization, production, quality checking and delivery support.
            </p>
          </div>
        </div>
      </section>

      {/* What We Make */}
      <section className="bg-white px-5 py-24 text-neutral-950 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid gap-12 lg:grid-cols-2 lg:items-end">
            <SectionHeading eyebrow="Product Range" title="What POXIOL Makes" />
            <p className="text-lg text-neutral-600">
              POXIOL develops and produces custom sports uniforms and teamwear products for multiple sports and buyer types, all built with performance fabrics and elite durability.
            </p>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-[1fr_0.4fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 transition hover:bg-lime-50">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-lime-600" />
                  <span className="font-bold">{cat}</span>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-neutral-900 p-10 text-white">
              <h4 className="text-xl font-black mb-6 uppercase text-lime-400">Customization</h4>
              <ul className="space-y-4">
                {customizationOptions.map((opt, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-bold text-neutral-300">
                    <Zap className="h-4 w-4 text-lime-400" /> {opt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Client Groups" title="Who We Serve" center />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {buyerTypes.map((type, idx) => (
              <div key={idx} className="group rounded-3xl border border-white/5 bg-white/5 p-8 transition hover:bg-lime-400 hover:text-black">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 transition group-hover:bg-black/10">
                  {type.icon}
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase tracking-tight">{type.title}</h3>
                <p className="text-neutral-400 group-hover:text-black/80">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 bg-neutral-950">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="The Advantage" title="What Makes POXIOL Different" center />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((diff, idx) => (
              <div key={idx} className="relative p-8 rounded-[2.5rem] border border-white/5 bg-white/5">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-black font-black text-sm">{idx + 1}</div>
                <h4 className="text-xl font-black uppercase mb-4 text-white">{diff.title}</h4>
                <p className="text-neutral-400 leading-relaxed text-sm">{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-lime-400 px-5 py-24 text-black md:px-10 md:py-32 xl:px-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Our Mission" title="Turn Identity Into Professional Apparel" center />
          <p className="mt-12 text-2xl font-bold leading-relaxed">
            POXIOL exists to help teams and sportswear buyers turn identity into professional apparel. A great uniform is more than a jersey. It represents the team, the school, the event, the brand and the athletes wearing it.
          </p>
        </div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-[100px]"></div>
      </section>

      {/* How We Work */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading eyebrow="Process" title="How We Work" />
              <div className="mt-12 space-y-6">
                {workflow.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-lime-400 font-black text-xs">{idx + 1}</div>
                    <span className="text-lg font-bold text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-3xl bg-neutral-800 overflow-hidden">
                   <img src="/images/factory/factory-main.webp" alt="Factory" className="h-full w-full object-cover grayscale" />
                </div>
                <div className="aspect-square rounded-3xl bg-lime-400 p-8 flex flex-col justify-end">
                   <ShieldCheck className="h-10 w-10 text-black mb-4" />
                   <h4 className="text-2xl font-black text-black uppercase">QC Check</h4>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl bg-neutral-900 flex items-center justify-center p-8">
                   <Target className="h-16 w-16 text-lime-400" />
                </div>
                <div className="aspect-[4/5] rounded-3xl border border-white/10 overflow-hidden">
                   <img src="/images/sports/basketball.webp" alt="Uniform" className="h-full w-full object-cover grayscale" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-black md:text-7xl mb-8 uppercase">Ready to start?</h2>
          <p className="text-xl text-neutral-400 mb-12">
            Whether you are preparing for a new season, launching a teamwear brand, expanding a wholesale catalog or planning an event apparel program, POXIOL can help you start with a clear custom teamwear solution.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <PrimaryButton href="/free-mockup/" className="px-12 py-5 text-xl">Get Free Mockup</PrimaryButton>
            <SecondaryButton href="/contact/" className="px-12 py-5 text-xl">Contact POXIOL</SecondaryButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
