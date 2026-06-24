import type { Metadata } from "next";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { factoryStats } from "@/lib/home-data";

export const metadata: Metadata = {
  title: "Factory Direct Teamwear Manufacturing | POXIOL Facility",
  description: "Take a tour of the POXIOL teamwear factory. We operate high-color sublimation printers, precision laser cutters and dedicated sewing lines for B2B sports uniforms.",
};

const facilityBlocks = [
  { 
    title: "Production Line", 
    desc: "Integrated digital workflow from CAD pattern design to high-speed sublimation printing and precision laser cutting.",
    image: "/images/poxiol-v6/manufacturing_sublimation_printing.png"
  },
  { 
    title: "Quality Control System", 
    desc: "Strict protocol covering print alignment, fabric stretch, stitch density and size conformity at every stage of production.",
    image: "/images/poxiol-v6/manufacturing_quality_control.png"
  },
  { 
    title: "OEM / ODM Capability", 
    desc: "Supporting original brand development with custom patterns, private labeling, and tailored collection engineering.",
    image: "/images/poxiol-v6/home_oem_odm_solutions.png"
  },
  { 
    title: "Packing & Shipping", 
    desc: "Standardized export packing with size-grouped labeling and reliable global logistics for door-to-door delivery worldwide.",
    image: "/images/poxiol-v6/manufacturing_packing_global_delivery.png"
  }
];

const factoryFaqs = [
  { question: "Where is your factory located?", answer: "Our specialized teamwear manufacturing facility is located in China, optimized for global export with efficient logistics access." },
  { question: "What is your monthly production capacity?", answer: "We currently have a monthly capacity of over 30,000 custom pieces across various sport categories." },
  { question: "Do you use safe and durable inks?", answer: "Yes. We use professional sublimation inks that are eco-friendly and provide vibrant, high-color sublimation printing that won't fade or peel." },
  { question: "Can I visit your facility?", answer: "Yes. We welcome B2B partners and brand owners to visit our facility. Please contact our specialist to schedule a factory tour." },
];

export default function FactoryPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Facility" title="Real Manufacturing Power" subtitle="POXIOL operates a dedicated teamwear facility, eliminating the middleman and controlling every detail of your order." dark center />
          
          {/* Factory Trust Numbers */}
          <div className="mt-20 grid grid-cols-2 gap-6 rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:grid-cols-3 lg:grid-cols-6">
            {factoryStats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-[#B6FF00]">{stat.value}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 grid gap-16 md:grid-cols-2 text-left">
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

      {/* FAQ Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="FAQ" title="Factory & Production FAQ" dark center />
          <div className="mt-16 space-y-6">
            {factoryFaqs.map(faq => (
              <div key={faq.question} className="rounded-3xl border border-white/5 bg-white/[0.02] p-8">
                <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                <p className="mt-4 text-neutral-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 text-center border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black uppercase md:text-5xl">B2B Manufacturing Partner</h2>
          <p className="mt-8 text-xl text-neutral-300 leading-relaxed">
            Our facility is designed for high-volume repeat business. We support sportswear brands and large distributors with reliable monthly capacity and Strict QC Before Shipment.
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <SecondaryButton href="/oem-odm/">Explore OEM Capacity</SecondaryButton>
            <SecondaryButton href="/contact/">Connect With Factory</SecondaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
