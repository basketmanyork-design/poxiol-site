import type { Metadata } from "next";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading } from "@/components/ui";
import { Factory, Zap, ShieldCheck, Printer, Scissors, Settings, Search, PackageCheck, Send, ClipboardList, Palette, Ruler, Package, Users, Building2, Trophy, Store } from "lucide-react";

export const metadata: Metadata = { 
  title: "POXIOL Factory & Quality Control | Custom Teamwear Production", 
  description: "Learn how POXIOL supports custom teamwear production with sublimation printing, fabric inspection, sewing, name and number customization, QC checking, packing and global delivery support." 
};

const steps = [
  {
    icon: <ClipboardList className="h-6 w-6 text-lime-400" />,
    title: "Project Review",
    desc: "Every custom teamwear project starts with understanding the buyer's sport category, product type, quantity, color requirements, logo placement, player names, numbers and target delivery timeline."
  },
  {
    icon: <Palette className="h-6 w-6 text-lime-400" />,
    title: "Design & Mockup",
    desc: "Before sampling or production, POXIOL helps buyers confirm the visual direction including team colors, logo placement, name/number layout, and front/back visual mockups."
  },
  {
    icon: <Search className="h-6 w-6 text-lime-400" />,
    title: "Fabric Preparation",
    desc: "Fabric selection depends on sport category and use case. We check texture, stretch, breathability, and color consistency for materials ranging from 160 GSM to 230 GSM."
  },
  {
    icon: <Printer className="h-6 w-6 text-lime-400" />,
    title: "Sublimation Printing",
    desc: "Full-color graphics are integrated into the fabric. Suitable for basketball, soccer, running, and baseball jerseys, ensuring graphics never crack or peel."
  },
  {
    icon: <Scissors className="h-6 w-6 text-lime-400" />,
    title: "Cutting & Sewing",
    desc: "Fabric panels are cut and assembled focusing on panel alignment, size consistency, seam construction, neckline structure, and product-specific fit requirements."
  },
  {
    icon: <Zap className="h-6 w-6 text-lime-400" />,
    title: "Customization",
    desc: "High-precision placement for player names, numbers, and team identity details according to sport category and buyer requirements."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-lime-400" />,
    title: "Quality Control",
    desc: "QC review includes print color check, logo placement, name/number accuracy, stitching strength, sizing verification, and fabric surface inspection."
  },
  {
    icon: <Package className="h-6 w-6 text-lime-400" />,
    title: "Packing & Delivery",
    desc: "Orders are packed by size, player number, or product set. We handle shipment preparation for global delivery to ensure items arrive ready for use."
  }
];

const focusAreas = [
  { icon: <Printer />, title: "Print Quality", desc: "Graphics and colors aligned with approved designs." },
  { icon: <Scissors />, title: "Stitching", desc: "Suitable for team use, movement and repeated wear." },
  { icon: <Ruler />, title: "Sizing Accuracy", desc: "Crucial for clubs, schools and bulk team orders." },
  { icon: <Search />, title: "Fabric Handling", desc: "Material suitability based on sport performance." },
  { icon: <PackageCheck />, title: "Packing Check", desc: "Verification of quantity, sets, and instructions." }
];

const buyerSupport = [
  {
    icon: <Users className="h-8 w-8 text-lime-400" />,
    title: "Clubs & Schools",
    desc: "Manage custom team orders with team logo, player name, number and size range requirements."
  },
  {
    icon: <Trophy className="h-8 w-8 text-lime-400" />,
    title: "Events & Tournaments",
    desc: "Deadline-based event apparel such as running vests, staff shirts, and tournament uniforms."
  },
  {
    icon: <Building2 className="h-8 w-8 text-lime-400" />,
    title: "Brands & Distributors",
    desc: "OEM/ODM support with sample development, category planning, and scalable production."
  },
  {
    icon: <Store className="h-8 w-8 text-lime-400" />,
    title: "Custom Retailers",
    desc: "Small custom orders, test products and repeated custom uniform requests for online stores."
  }
];

const faqs = [
  {
    q: "What sports can POXIOL produce uniforms for?",
    a: "POXIOL supports basketball, soccer, baseball, running, training wear, volleyball, American football, ice hockey, tennis, golf and related teamwear products."
  },
  {
    q: "Does POXIOL support samples before bulk production?",
    a: "Yes. POXIOL supports sample development after design confirmation so buyers can review fabric, size, print effect and construction."
  },
  {
    q: "Can POXIOL handle name and number customization?",
    a: "Yes. POXIOL supports player names, player numbers, team logos, colors and original pattern customization."
  },
  {
    q: "Does POXIOL support OEM/ODM production?",
    a: "Yes. POXIOL supports OEM/ODM sportswear development for brands, distributors and custom teamwear businesses."
  },
  {
    q: "What does POXIOL check before shipment?",
    a: "POXIOL checks key details such as print quality, stitching, sizing, quantity, packing and product consistency before shipment preparation."
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
            <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-8xl uppercase">
              Factory <span className="text-lime-400">Strength</span> & QC
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-neutral-400">
              POXIOL supports custom sports uniform buyers with practical production workflows, performance fabric handling, sublimation printing, quality inspection and shipment preparation.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton href="/free-mockup/">Request Free Mockup</PrimaryButton>
              <SecondaryButton href="/contact/">Contact Factory Support</SecondaryButton>
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

      {/* Overview */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Capability Overview" title="Reliable Production for B2B Buyers" center />
          <p className="mt-8 text-xl text-neutral-400 leading-relaxed">
            POXIOL is built to support custom teamwear buyers who need reliable production, fast sampling, flexible order quantities and multi-sport customization. We handle everything from design mockup to final delivery support.
          </p>
        </div>
      </section>

      {/* Production Workflow */}
      <section className="bg-white px-5 py-24 text-neutral-950 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="The Workflow" title="8-Step Production Process" />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={idx} className="group rounded-3xl border border-neutral-100 bg-neutral-50 p-8 transition hover:bg-neutral-900 hover:text-white">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-lime-400 transition group-hover:bg-lime-400 group-hover:text-black">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{idx + 1}. {step.title}</h3>
                <p className="text-neutral-600 group-hover:text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QC Focus Areas */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Quality Control" title="Zero-Defect Focus Areas" center />
          <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {focusAreas.map((area, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-white/5 bg-white/5">
                <div className="mb-4 text-lime-400 h-8 w-8">{area.icon}</div>
                <h4 className="text-lg font-black uppercase mb-2">{area.title}</h4>
                <p className="text-neutral-400 text-sm">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Support */}
      <section className="bg-neutral-100 px-5 py-24 text-neutral-950 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Service Scope" title="Support for Different Buyers" center />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {buyerSupport.map((support, idx) => (
              <div key={idx} className="flex gap-6 rounded-3xl bg-white p-10 shadow-sm transition hover:shadow-xl">
                <div className="shrink-0">{support.icon}</div>
                <div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{support.title}</h3>
                  <p className="text-neutral-600 text-lg leading-relaxed">{support.desc}</p>
                </div>
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
          <h2 className="text-5xl font-black md:text-7xl mb-8 uppercase">Ready to Evaluate Our Factory?</h2>
          <p className="text-xl text-neutral-400 mb-12">
            The easiest way to start is to request a free mockup. Our team will review your project requirements and provide a professional concept.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <PrimaryButton href="/free-mockup/" className="px-12 py-5 text-xl">Request Free Mockup</PrimaryButton>
            <SecondaryButton href="/contact/" className="px-12 py-5 text-xl border-white/20 text-white hover:bg-white hover:text-black">Contact Support</SecondaryButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
