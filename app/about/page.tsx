import type { Metadata } from "next";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading } from "@/components/ui";
import Link from "next/link";
import { CheckCircle2, Users, Trophy, Building2, Layers, Zap, ShieldCheck, Microscope } from "lucide-react";

export const metadata: Metadata = { 
  title: "About POXIOL | Custom Teamwear and Sports Uniform Manufacturer", 
  description: "Learn about POXIOL, a custom teamwear manufacturer providing sports uniforms, free mockups, sublimation printing, MOQ 1 and OEM/ODM production for clubs, schools, events, brands and distributors." 
};

const categories = [
  "Basketball Jerseys & Full Sets",
  "Soccer Kits & Goalkeeper Gear",
  "Baseball & Softball Uniforms",
  "Running Singlets & Event Shirts",
  "Tracksuits & Training Jackets",
  "American Football Practice Jerseys",
  "Volleyball & School Team Sets",
  "Ice Hockey & Long-Sleeve Jerseys",
  "Tennis Wear & Golf Polos",
  "OEM/ODM Private Label Collections"
];

const buyerTypes = [
  {
    icon: <Users className="h-6 w-6 text-lime-400" />,
    title: "Clubs & Local Teams",
    desc: "Professional look, flexible reordering, and team identity support for amateur and pro clubs."
  },
  {
    icon: <Building2 className="h-6 w-6 text-lime-400" />,
    title: "Schools & Academies",
    desc: "Consistent colors and sizing across different sports programs and school departments."
  },
  {
    icon: <Trophy className="h-6 w-6 text-lime-400" />,
    title: "Tournaments & Events",
    desc: "Deadline-based production for race organizers, sports leagues, and seasonal events."
  },
  {
    icon: <Layers className="h-6 w-6 text-lime-400" />,
    title: "Brands & Distributors",
    desc: "Reliable manufacturing partner for private label teamwear and catalog expansion."
  }
];

const differentiators = [
  "Free mockup request process",
  "MOQ 1 flexible orders",
  "1-2H design support",
  "2-3 day sampling support",
  "3-5 day production lead time",
  "Sublimation & Performance fabrics",
  "Logo, name & number customization",
  "180-day quality support"
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
            <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
              ABOUT <span className="text-lime-400 text-stroke-thin text-stroke-white">POXIOL</span> TEAMWEAR
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-neutral-400">
              POXIOL is a professional custom teamwear manufacturer helping clubs, schools, events, brands, wholesalers and distributors build professional sports uniforms across multiple categories.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton href="/free-mockup/">Get Free Mockup</PrimaryButton>
              <SecondaryButton href="/factory/">Explore Factory</SecondaryButton>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
            <img 
              src="/images/hero/hero-multisport-teamwear.webp" 
              alt="POXIOL manufacturing" 
              className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
            />
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Our Identity" title="Professional Custom Teamwear Manufacturer" center />
          <div className="mt-12 space-y-8 text-lg leading-relaxed text-neutral-400">
            <p>
              POXIOL is focused on multi-sport uniforms, flexible customization and B2B sportswear production support. We help global buyers create team identity through custom basketball uniforms, soccer kits, baseball and softball uniforms, running apparel, training wear, volleyball uniforms, ice hockey jerseys, tennis wear, golf wear and corporate sportswear.
            </p>
            <p>
              Our work is built around a simple goal: make custom teamwear easier, faster and more reliable. Whether a buyer needs one sample, a small team order, a seasonal program or an OEM/ODM sportswear collection, POXIOL supports the process from design mockup to sampling, production and delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-white px-5 py-24 text-neutral-950 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid gap-12 lg:grid-cols-2 lg:items-end">
            <SectionHeading eyebrow="Product Range" title="What POXIOL Makes" />
            <p className="text-lg text-neutral-600">
              We provide professional sports uniforms and teamwear across 10+ major categories, all built with performance fabrics and elite durability.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 transition hover:bg-lime-50">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-lime-600" />
                <span className="font-bold">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Client Groups" title="Who We Serve" center />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {buyerTypes.map((type, idx) => (
              <div key={idx} className="group rounded-3xl border border-white/5 bg-white/5 p-8 transition hover:bg-lime-400 hover:text-black">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 transition group-hover:bg-black/10">
                  {type.icon}
                </div>
                <h3 className="mb-4 text-2xl font-black">{type.title}</h3>
                <p className="text-neutral-400 group-hover:text-black/80">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-lime-400 px-5 py-24 text-black md:px-10 md:py-32 xl:px-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Our Mission" title="Make Custom Teamwear More Accessible" center />
          <p className="mt-12 text-2xl font-bold leading-relaxed">
            POXIOL exists to help teams and sportswear buyers move faster from idea to uniform. A team should not need a full design department to create a professional custom kit. Our mission is to make custom teamwear more accessible, flexible and production-ready for global buyers.
          </p>
        </div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-[100px]"></div>
      </section>

      {/* Differentiators */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading eyebrow="The Advantage" title="What Makes POXIOL Different" />
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {differentiators.map((diff, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-lime-400" />
                    <span className="font-bold text-neutral-300">{diff}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <PrimaryButton href="/free-mockup/">Request Mockup</PrimaryButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-3xl bg-neutral-800 p-8 flex flex-col justify-end">
                  <Zap className="h-10 w-10 text-lime-400 mb-4" />
                  <h4 className="text-2xl font-black">Fast Sampling</h4>
                  <p className="text-neutral-400 mt-2">2-3 day turnaround for custom samples.</p>
                </div>
                <div className="aspect-square rounded-3xl bg-neutral-900 overflow-hidden">
                  <img src="/images/factory/factory-qc.webp" alt="QC" className="h-full w-full object-cover grayscale" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl bg-neutral-900 overflow-hidden">
                  <img src="/images/sports/basketball.webp" alt="Basketball" className="h-full w-full object-cover grayscale" />
                </div>
                <div className="aspect-[4/5] rounded-3xl border border-lime-400/30 p-8 flex flex-col justify-end">
                  <Microscope className="h-10 w-10 text-lime-400 mb-4" />
                  <h4 className="text-2xl font-black">Quality First</h4>
                  <p className="text-neutral-400 mt-2">Inspection before packing & 180D support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-black md:text-7xl mb-8">READY TO START YOUR PROJECT?</h2>
          <p className="text-xl text-neutral-400 mb-12">
            The fastest way to start is to request a free mockup. Our team will review your sport, logo, and colors to create a professional concept.
          </p>
          <PrimaryButton href="/free-mockup/" className="px-12 py-5 text-xl">Get Your Free Mockup Now</PrimaryButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
