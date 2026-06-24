import type { Metadata } from "next";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Factory Direct Teamwear Manufacturing | POXIOL Facility",
  description: "Take a tour of the POXIOL teamwear factory. We operate high-speed sublimation printers, precision laser cutters and dedicated sewing lines for B2B sports uniforms.",
};

const facilityBlocks = [
  { 
    title: "High-Speed Sublimation", 
    desc: "Industrial digital printers using eco-friendly Italian inks for deep, vibrant and anti-fade team colors.",
    image: "/images/poxiol-v6/manufacturing_sublimation_printing.png"
  },
  { 
    title: "Precision Laser Cutting", 
    desc: "Automated fabric cutting based on CAD patterns to ensure absolute fit consistency across all sizes.",
    image: "/images/poxiol-v6/manufacturing_cutting_sewing.png"
  },
  { 
    title: "Quality Control Lab", 
    desc: "100% manual check for print alignment, stitching integrity and size conformity before export.",
    image: "/images/poxiol-v6/manufacturing_quality_control.png"
  },
  { 
    title: "Export Logistics", 
    desc: "Efficient packing, labeling and global shipping preparation for US, EU, and Australian markets.",
    image: "/images/poxiol-v6/manufacturing_packing_global_delivery.png"
  }
];

export default function FactoryPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Facility" title="Real Manufacturing Power" subtitle="POXIOL operates a dedicated teamwear facility, eliminating the middleman and controlling every detail of your order." dark center />
          
          <div className="mt-24 grid gap-16 md:grid-cols-2">
            {facilityBlocks.map(block => (
              <div key={block.title} className="group overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02]">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={block.image} alt={block.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight">{block.title}</h3>
                  <p className="mt-4 text-neutral-400 leading-relaxed">{block.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-5 py-24 md:px-10 text-center border-y border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black uppercase md:text-5xl">B2B Manufacturing Partner</h2>
          <p className="mt-8 text-xl text-neutral-300 leading-relaxed">
            Our facility is designed for high-volume repeat business. We support sportswear brands and large distributors with reliable monthly capacity and strict QC standards.
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <SecondaryButton href="/oem-odm/">Explore OEM Capacity</SecondaryButton>
            <SecondaryButton href="/contact/">Visit Our Factory</SecondaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
