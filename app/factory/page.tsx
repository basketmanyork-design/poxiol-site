import type { Metadata } from "next";
import { Header, Footer, PrimaryButton, SectionHeading } from "@/components/ui";
import { Factory, Zap, ShieldCheck, Printer, Scissors, Settings, Search, PackageCheck, Send } from "lucide-react";

export const metadata: Metadata = { 
  title: "POXIOL Factory Strength | Custom Teamwear Production and Quality Control", 
  description: "Explore POXIOL factory capability for custom teamwear production, including sublimation printing, fabric inspection, sewing, name and number customization, QC and global delivery support." 
};

const steps = [
  {
    icon: <Settings className="h-6 w-6 text-lime-400" />,
    title: "Mockup & Design",
    desc: "Before production, we help clarify visual direction. Submit your logo, colors, and sport category for a professional concept confirmation."
  },
  {
    icon: <Printer className="h-6 w-6 text-lime-400" />,
    title: "Sublimation Printing",
    desc: "Full-color graphics, names, and numbers integrated into the fabric. No cracking or peeling, ensuring elite durability for repeated sports use."
  },
  {
    icon: <Search className="h-6 w-6 text-lime-400" />,
    title: "Fabric Inspection",
    desc: "We check texture, stretch, breathability, and color consistency. Every material must match your sport's specific performance needs."
  },
  {
    icon: <Scissors className="h-6 w-6 text-lime-400" />,
    title: "Cutting & Sewing",
    desc: "Garment panels are cut and assembled with sport-specific construction. We focus on panel alignment, seam strength, and collar finishing."
  },
  {
    icon: <Zap className="h-6 w-6 text-lime-400" />,
    title: "Customization",
    desc: "High-precision placement for player names, numbers, team logos, and sponsor marks according to your project specifications."
  },
  {
    icon: <PackageCheck className="h-6 w-6 text-lime-400" />,
    title: "Quality Control",
    desc: "Final QC points: print clarity, stitching quality, size labeling, and visual appearance check before the order is cleared for packing."
  }
];

const faqs = [
  {
    q: "Can POXIOL support small custom orders?",
    a: "Yes. POXIOL supports MOQ 1 flexible custom orders for samples, small teams, trials and custom retail projects."
  },
  {
    q: "Does POXIOL support OEM/ODM sportswear production?",
    a: "Yes. POXIOL supports private label and OEM/ODM teamwear development for sportswear brands, distributors and retailers."
  },
  {
    q: "What products can be produced?",
    a: "POXIOL supports custom basketball uniforms, soccer kits, baseball and softball uniforms, running apparel, training wear, volleyball uniforms, hockey jerseys, tennis wear, golf wear and other teamwear categories."
  },
  {
    q: "Can POXIOL help before I have a final design?",
    a: "Yes. Buyers can request a free mockup by sending sport category, logo, colors, quantity and design notes."
  }
];

export default function FactoryPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative px-5 py-24 md:px-10 md:py-32 xl:px-20 overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-lime-400">Advanced Manufacturing</p>
            <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
              FACTORY <span className="text-lime-400">STRENGTH</span> FOR ELITE TEAMS
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-neutral-400">
              POXIOL supports global teamwear buyers with design, sampling, sublimation printing, sewing, quality control and packing support for custom sports uniforms.
            </p>
            <div className="mt-10">
              <PrimaryButton href="/free-mockup/">Request Factory Support</PrimaryButton>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 rounded-[3rem] bg-lime-400/20 blur-2xl group-hover:bg-lime-400/30 transition duration-500"></div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
              <img 
                src="/images/factory/factory-main.webp" 
                alt="POXIOL factory floor" 
                className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Workflow */}
      <section className="bg-white px-5 py-24 text-neutral-950 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="The Workflow" title="Production Capability Built for B2B" />
          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-lime-400">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase">{step.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-6 top-6 text-neutral-200">
                    <Send className="h-5 w-5 rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sublimation Focus */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
              <img 
                src="/images/factory/factory-qc.webp" 
                alt="Sublimation Printing" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <div className="flex items-center gap-3 bg-lime-400 text-black px-4 py-2 rounded-full font-black text-sm uppercase">
                  <Printer className="h-4 w-4" />
                  Full-Color Precision
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading eyebrow="Core Tech" title="Elite Sublimation Printing Process" />
              <p className="mt-8 text-xl text-neutral-400 leading-relaxed">
                Sublimation printing allows graphics, names, and numbers to be integrated directly into the fabric, preventing surface-print issues like cracking or peeling.
              </p>
              <ul className="mt-10 space-y-6">
                {[
                  "Artwork and size grading confirmation",
                  "Print file preparation for every panel",
                  "High-pressure heat transfer for deep color",
                  "Print clarity and placement check before sewing"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-lime-400 text-black font-black text-xs">{idx + 1}</div>
                    <span className="text-lg font-bold text-neutral-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Control */}
      <section className="bg-neutral-100 px-5 py-24 text-neutral-950 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <SectionHeading eyebrow="Quality Assurance" title="Zero-Defect Inspection Protocol" center />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Print Clarity", "Color Consistency", "Stitching Strength", "Size Labeling", "Quantity Count", "Name/Number Check", "Packing Accuracy", "Visual Appearance"].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-lime-600" />
                <span className="font-bold uppercase tracking-tight text-neutral-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Common Questions" title="Factory FAQ" center />
          <div className="mt-16 space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-white/10 pb-8">
                <h3 className="text-2xl font-black mb-4 text-lime-400 uppercase tracking-tight">Q: {faq.q}</h3>
                <p className="text-xl text-neutral-400 leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-t border-white/5 bg-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Start Production" title="READY TO BUILD YOUR UNIFORMS?" center />
          <p className="mt-8 text-xl text-neutral-400 mb-12">
            Send your sport category, logo, main colors, quantity and design notes. Our team will review your request and help you start the mockup process.
          </p>
          <PrimaryButton href="/free-mockup/" className="px-12 py-5 text-xl">Request Factory Mockup</PrimaryButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
