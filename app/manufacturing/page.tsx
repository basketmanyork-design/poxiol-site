import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";
import { Factory, Zap, ShieldCheck, Printer, Layers, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Teamwear Manufacturing Process | OEM Sportswear Manufacturer | POXIOL",
  description: "Explore the POXIOL manufacturing hub. We provide professional OEM & ODM teamwear production, sublimation printing, and quality control for global sports brands.",
};

const capabilities = [
  {
    icon: Layers,
    title: "OEM Manufacturing",
    description: "Private label sportswear manufacturing for clubs, distributors and sports brands based on custom specs.",
  },
  {
    icon: Zap,
    title: "ODM Manufacturing",
    description: "Customizable teamwear models and templates for faster development and rapid production cycles.",
  },
  {
    icon: Printer,
    title: "Sublimation Printing",
    description: "High-quality Italian ink sublimation for vibrant, durable, and breathable sportswear graphics.",
  },
  {
    icon: Factory,
    title: "Fabric Technology",
    description: "Breathable, moisture-wicking and lightweight performance materials engineered for team sports.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Control",
    description: "Rigorous 6-step inspection process covering fabric, printing, sewing, sizing, and final packaging.",
  },
  {
    icon: Globe,
    title: "Global Workflow",
    description: "End-to-end management from 24h mockup to global shipping for samples and bulk orders.",
  },
];

const timeline = [
  { label: "Design Mockup", time: "24 Hours", description: "Professional digital mockup for design approval." },
  { label: "Sample Production", time: "5-7 Days", description: "Physical sample for fabric and fit verification." },
  { label: "Bulk Production", time: "10-20 Days", description: "Scalable manufacturing for team and brand orders." },
];

export default function ManufacturingHubPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Manufacturing Platform" 
            title="Professional Teamwear Manufacturing" 
            subtitle="POXIOL is the elite manufacturing partner for sports brands and organizations, delivering scalable performance apparel with zero-defect quality control."
            dark
            center
          />
          
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10">
                <item.icon className="h-12 w-12 text-lime-400" />
                <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-white">{item.title}</h3>
                <p className="mt-4 text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Production Timeline</h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {timeline.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="text-5xl font-black text-lime-600">{item.time}</div>
                <h3 className="mt-4 text-xl font-black uppercase">{item.label}</h3>
                <p className="mt-2 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <PrimaryButton>Get Free Mockup</PrimaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
