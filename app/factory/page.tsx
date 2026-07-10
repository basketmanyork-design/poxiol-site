import type { Metadata } from "next";
import { Header, Footer, SectionHeading, SecondaryButton } from "@/components/ui";
import { factoryStats } from "@/lib/home-data";
import { LocalBusinessSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Custom Teamwear Factory in China | POXIOL Sportswear Manufacturing",
  description: "Visit the POXIOL teamwear factory. 15+ years experience, 30,000+ monthly capacity, high-color sublimation printing and precision sewing for B2B sports uniforms.",
};

const facilityFaqs = [
  { question: "Where is the POXIOL teamwear factory located?", answer: "The POXIOL specialized teamwear manufacturing facility is located in China, optimized for global B2B exports with efficient express and freight logistics access." },
  { question: "What is your monthly production capacity?", answer: "Our facility currently supports a monthly production capacity of over 30,000 custom teamwear pieces across basketball, soccer and multi-sport categories." },
  { question: "How many years of experience does POXIOL have?", answer: "POXIOL has over 15 years of industry experience in custom sportswear manufacturing, supporting 3,000+ teams and brands globally." },
  { question: "Can I request a factory audit or visit?", answer: "Yes. POXIOL welcomes B2B partners, brand owners and distributors to visit our facility. Documentation and video-based audits are also available upon request." }
];

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

export default function FactoryPage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/factory/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <LocalBusinessSchema />
      <FAQSchema faqs={facilityFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Factory", url: fullUrl }
      ]} />

      <Header />
      
      {/* Hero Section - Direct B2B Conclusion */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Direct Manufacturer" 
            title="Real Custom Teamwear Manufacturing Power" 
            subtitle="Custom Teamwear Factory Direct. POXIOL operates a dedicated 30,000+ capacity facility in China, controlling every detail from digital mockup to 100% manual QC checking and global export shipping." 
            dark center 
          />
          
          {/* Trust Numbers - Data Conclusion Structure */}
          <div className="mt-20 grid grid-cols-2 gap-6 rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 md:grid-cols-3 lg:grid-cols-6">
            {factoryStats.map(stat => (
              <div key={stat.label} className="text-center group">
                <p className="text-4xl font-black text-[#B6FF00] group-hover:scale-110 transition">{stat.value}</p>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 grid gap-16 md:grid-cols-2 text-left">
            {facilityBlocks.map(block => (
              <div key={block.title} className="group overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={block.image} alt={`POXIOL ${block.title} Visual`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-10 md:p-14">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{block.title}</h3>
                  <p className="text-base text-neutral-400 leading-relaxed">{block.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AEO FAQ Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Expert Answers" title="Sportswear Factory FAQ" dark center />
          <div className="mt-20 space-y-4 text-left">
            {facilityFaqs.map(faq => (
              <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 group">
                <summary className="cursor-pointer text-lg font-black text-white list-none flex justify-between items-center group-open:text-[#B6FF00] transition">
                  {faq.question}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-neutral-400 border-t border-white/5 pt-4 max-w-3xl">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 text-center border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black uppercase md:text-6xl tracking-tighter">Verified Sourcing Partner</h2>
          <p className="mt-8 text-xl text-neutral-400 leading-relaxed">
            Our facility supports sportswear brands and high-volume distributors with reliable 30,000+ monthly capacity and strict Quality Support protocol.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <SecondaryButton href="/oem-odm/">OEM Capacity Profile</SecondaryButton>
            <SecondaryButton href="/contact/">Schedule Factory Visit</SecondaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
