import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton, freeMockupHref } from "@/components/ui";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Unlimited Teamwear Customization Options | POXIOL",
  description: "From custom logos and player names to private labels and specialized fabrics. POXIOL offers full-range teamwear customization for pro teams and brands.",
};

const customOptions = [
  { title: "Logo / Name / Number", desc: "Professional high-color sublimation for team crests, player names, and numbers with zero peeling or fading.", href: "/customization/logo-name-number/" },
  { title: "Fabric Options", desc: "Select from moisture-wicking meshes, interlock polyester, or compression materials for elite performance.", href: "/customization/fabric-options/" },
  { title: "Private Label", desc: "Woven neck labels, heat-transfer tags, and custom hangtags for your own sportswear brand.", href: "/customization/private-label/" },
  { title: "Custom Packaging", desc: "Branded individual polybags, size labels, and professional export cardboard cartons.", href: "/customization/custom-packaging/" },
  { title: "Mockup Before Production", desc: "High-fidelity 3D mockup of your design for confirmation before any physical sampling or production.", href: "/free-mockup/" }
];

const customizationFaqs = [
  { question: "What customization areas are available on the jersey?", answer: "Sublimation printing allows for 100% surface customization. You can add team logos, sponsor graphics, player names, numbers, and original pattern designs on the front, back, sleeves, and side panels." },
  { question: "Can I use my own brand labels?", answer: "Yes. POXIOL supports private labeling for sportswear brands, including woven neck labels, heat-transfer tags, and custom hangtags for a retail-ready presentation." },
  { question: "Do you offer different fabric options?", answer: "Yes. We offer a variety of high-performance polyester fabrics including 140gsm interlock for soccer, 160-180gsm mesh for basketball, and specialized moisture-wicking materials for training." }
];

export default function CustomizationPage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/customization/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <ServiceSchema 
        name="Teamwear Customization Services"
        description="Comprehensive customization options for sports uniforms, including sublimation, private label, and technical fabric selection."
        url={fullUrl}
      />
      <FAQSchema faqs={customizationFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Customization", url: fullUrl }
      ]} />

      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Customization" title="Total Creative Control" subtitle="At POXIOL, customization goes far beyond a logo. We help you engineer every detail of your uniform." dark center />
          
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {customOptions.map(opt => (
              <Link key={opt.title} href={opt.href} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 hover:border-[#B6FF00] transition group">
                <h3 className="text-2xl font-black uppercase text-[#B6FF00]">{opt.title}</h3>
                <p className="mt-6 text-neutral-400 leading-relaxed text-sm">{opt.desc}</p>
                <span className="mt-8 inline-block text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white group-hover:underline">Explore Details →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-5 py-32 border-y border-white/5">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center text-left">
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
                <p className="text-neutral-400"><strong className="text-white">Color Matching:</strong> High-color sublimation printing and color calibration to ensure your brand colors are accurate.</p>
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
