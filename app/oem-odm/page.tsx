import type { Metadata } from "next";
import {getSitePage} from "@/lib/sanity/content";
import {metadataFromCmsPage} from "@/components/cms/PageTemplate";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading } from "@/components/ui";
import { Layers, Rocket, Users, ShieldCheck, CheckCircle2, Package, Layout, Palette, PenTool, ClipboardCheck, Globe, Trophy, Store, ClipboardList, Ruler, Zap } from "lucide-react";

const userGroups = [
  {
    icon: <Rocket className="h-6 w-6 text-lime-400" />,
    title: "Teamwear Distributors",
    desc: "Plan product ranges for downstream team clients, with separate specifications, sample approvals and reorder requirements."
  },
  {
    icon: <Globe className="h-6 w-6 text-lime-400" />,
    title: "Dealers",
    desc: "Translate club and school briefs into clear products, artwork, quantities, sizes and target dates for review."
  },
  {
    icon: <Store className="h-6 w-6 text-lime-400" />,
    title: "Sportswear Brands",
    desc: "Plan brand-owned collections with confirmed product specifications, authorized artwork, labels, packaging and sample requirements."
  },
  {
    icon: <Trophy className="h-6 w-6 text-lime-400" />,
    title: "Custom Resellers",
    desc: "Coordinate client approvals, personalized team rosters and repeat requests through a clear project brief."
  }
];

const workflow = [
  { step: "01", title: "Brand & Product Brief", desc: "Understanding your target market, sport category, design style, and order plan." },
  { step: "02", title: "Collection Planning", desc: "Organizing your product plan into a clear collection structure (e.g., jersey + shorts + accessories)." },
  { step: "03", title: "Mockup & Design", desc: "Creating a visual mockup based on your logo, colors, and sport category for confirmation." },
  { step: "04", title: "Sample Development", desc: "Verifying fabric, fit, construction, printing effect, and product details with a physical sample." },
  { step: "05", title: "Production & QC", desc: "Scaling to bulk production with rigorous quality control, size verification, and alignment checks." },
  { step: "06", title: "Packing & Delivery", desc: "Customized packing requirements (size grouping, labeling) and shipment preparation for global delivery." }
];

const categories = [
  "Basketball Uniforms", "Soccer Kits", "Baseball & Softball", "Running & Marathon", "Training & Tracksuits",
  "American Football", "Volleyball Sets", "Ice Hockey Jerseys", "Tennis & Golf Wear", "Corporate Sportswear"
];

const customizationOptions = [
  { group: "Visual", items: ["Team/Brand Logo", "Player Name & Number", "Original Patterns", "Custom Colors", "Collection Series"] },
  { group: "Product", items: ["Fabric Weight & Type", "Fit & Sizing", "Jersey & Shorts Sets", "Tracksuit Combination", "Event Apparel"] },
  { group: "Brand", items: ["Private Label Planning", "Label Placement", "Custom Packaging", "Catalog Support", "Repeat Order Plan"] }
];

const advantages = [
  { title: "Multi-Sport Range", desc: "Support across many teamwear categories to help you expand beyond a single sport." },
  { title: "Project-Based Quantity", desc: "Order quantity is confirmed according to the product format and project requirements so brands can plan testing before larger commitments." },
  { title: "Mockup Review", desc: "Confirm artwork, placement and product requirements before the sample plan is agreed." },
  { title: "Sampling Support", desc: "Verifying product quality, fit, and print effect before scaling to bulk orders." },
  { title: "Teamwear Specialization", desc: "Built around the specific use cases of clubs, schools, teams, and sports events." }
];

const pageKey = "oem-odm";
// Local editorial override; preserve CMS canonical, robots and media data.
const oemPositioning = {
  title: "OEM/ODM Teamwear for Distributors and Brands | POXIOL",
  heading: "OEM/ODM Teamwear for Channel Partners",
  description: "OEM/ODM teamwear for teamwear distributors, dealers, sportswear brands and custom resellers worldwide. Plan client collections, samples and repeat orders.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage(pageKey);
  return metadataFromCmsPage(page, oemPositioning);
}

export default async function OEMPage() {
  const page = await getSitePage(pageKey);
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative px-5 py-24 md:px-10 md:py-32 xl:px-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-lime-500/10 blur-[160px] rounded-full"></div>
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center relative z-10">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-lime-400">{page.eyebrow || "Strategic Manufacturing"}</p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl uppercase">
              {oemPositioning.heading}
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-neutral-400">
              {oemPositioning.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton href="/get-quote/">Discuss Your OEM Project</PrimaryButton>
              <SecondaryButton href="/contact/">Ask a Project Question</SecondaryButton>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 rounded-[3rem] bg-lime-400/10 blur-2xl group-hover:bg-lime-400/20 transition"></div>
            <figure className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-900 shadow-2xl">
              <img
                src="/images/poxiol-teamwear-hero-poxiol-only-v2.png"
                alt="Illustrative basketball, soccer and training range with POXIOL wordmarks"
                width={1254}
                height={1254}
                className="h-auto w-full object-contain"
              />
              <figcaption className="px-6 py-4 text-sm leading-relaxed text-neutral-300">
                Illustrative teamwear configuration — not a factory or completed-order photograph.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white text-neutral-950 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Service Overview" title="Teamwear Development Support" center />
          <p className="mt-8 text-xl text-neutral-600 leading-relaxed">
            POXIOL supports buyers who want more than a one-time team order. Whether you are building a new teamwear brand, expanding an online uniform catalog or preparing a multi-sport collection for regional buyers, we provide the manufacturing foundation for your growth.
          </p>
        </div>
      </section>

      {/* Partner Groups */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 bg-white text-black">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="B2B Solutions" title="Who Our OEM/ODM Service Is For" center />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {userGroups.map((group, idx) => (
              <div key={idx} className="group rounded-3xl border border-neutral-100 bg-neutral-50 p-8 transition hover:bg-neutral-900 hover:text-white">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-200 text-neutral-900 group-hover:bg-white/10 group-hover:text-lime-400">
                  {group.icon}
                </div>
                <h3 className="mb-4 text-2xl font-black uppercase tracking-tight leading-none">{group.title}</h3>
                <p className="text-neutral-600 group-hover:text-neutral-400 text-sm leading-relaxed">{group.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OEM vs ODM */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Service Models" title="OEM vs ODM Support" dark center />
          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <div className="rounded-[3rem] bg-neutral-900 p-12 border border-white/5">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black">
                <Layout className="h-7 w-7" />
              </div>
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">OEM Support</h2>
              <p className="text-xl text-neutral-400 leading-relaxed mb-8">
                Suitable when the buyer already has a product concept, reference style, logo, design file or brand direction. We turn that direction into a custom teamwear product.
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {["Private Label Uniforms", "Design Adaptation", "Logo/Label Placement", "Color Direction", "Bulk Production", "Product Sets"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-bold text-neutral-200 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-lime-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[3rem] bg-lime-400 p-12 text-black">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lime-400">
                <PenTool className="h-7 w-7" />
              </div>
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">ODM Support</h2>
              <p className="text-xl text-black/80 leading-relaxed mb-8">
                Suitable when the buyer wants POXIOL to help develop product concepts, design direction or teamwear collection structure.
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {["Original Concepts", "Range Planning", "Category Expansion", "Fabric Suggestions", "Collection Mockups", "Sample Development"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-bold text-black text-sm">
                    <CheckCircle2 className="h-4 w-4 text-black" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 bg-neutral-100 text-black overflow-hidden relative">
        <div className="mx-auto max-w-7xl relative z-10">
          <SectionHeading eyebrow="The Development Journey" title="OEM/ODM Workflow" center />
          <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {workflow.map((step, idx) => (
              <div key={idx} className="relative group p-10 rounded-[2.5rem] bg-white transition hover:bg-neutral-900 hover:text-white">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-5xl font-black text-neutral-200 group-hover:text-white/10">{step.step}</span>
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-lime-400 text-black">
                     <Zap className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{step.title}</h3>
                <p className="text-neutral-600 group-hover:text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-end mb-16">
            <SectionHeading eyebrow="Product Scope" title="OEM/ODM Product Categories" dark />
            <p className="text-xl text-neutral-400">
               Multi-sport development across all major uniform categories including basketball, soccer, baseball, running, training, and corporate sportswear.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((cat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center font-bold uppercase tracking-tight text-neutral-300 transition hover:bg-lime-400 hover:text-black">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Options */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Capabilities" title="Deep Customization Options" dark center />
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {customizationOptions.map((group, idx) => (
              <div key={idx} className="rounded-3xl border border-white/5 bg-white/5 p-10">
                <h3 className="text-2xl font-black mb-8 uppercase text-lime-400 tracking-tight">{group.group}</h3>
                <ul className="space-y-6">
                  {group.items.map((item, subIdx) => (
                    <li key={subIdx} className="flex items-center gap-4">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-white/10">
                         <CheckCircle2 className="h-3 w-3 text-lime-400" />
                      </div>
                      <span className="font-bold text-neutral-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="The Advantage" title="Why Partners Choose POXIOL" dark center />
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {advantages.map((adv, idx) => (
              <div key={idx} className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 transition hover:border-lime-400/50">
                <div className="h-12 w-12 rounded-2xl bg-lime-400 text-black flex items-center justify-center">
                   <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tight leading-none">{adv.title}</h4>
                <p className="text-neutral-400 leading-relaxed text-sm">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-black md:text-7xl mb-8 uppercase">Ready to scale?</h2>
          <p className="text-xl text-neutral-400 mb-12">
            The easiest way to begin is by sharing your brand direction, target sport, and reference styles. We will help you understand the next steps for sampling and production.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <PrimaryButton href="/free-mockup/" className="px-12 py-5 text-xl">Start OEM/ODM Project</PrimaryButton>
            <SecondaryButton href="/contact/" className="px-12 py-5 text-xl">Ask a Project Question</SecondaryButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
