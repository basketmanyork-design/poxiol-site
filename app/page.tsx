import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";
import { sportsCategories, uspCards, solutionCards, processSteps, featuredDesigns, techItems, galleryItems, factoryStats } from "@/lib/home-data";
import { caseStudies } from "@/lib/case-studies";
import StructuredData, { organizationSchema, websiteSchema, homepageFaqSchema } from "@/components/seo/StructuredData";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Custom Teamwear Manufacturer | OEM Sports Uniform Supplier | POXIOL",
  description: "POXIOL manufactures custom teamwear for clubs, schools, distributors and sports brands. Get free mockup, sample support, OEM/ODM production, QC inspection and global delivery.",
};

const trustBarStats = [
  ["15+", "Years Experience"],
  ["3,000+", "Team Projects"],
  ["50+", "Countries Shipped"],
  ["500,000+", "Pieces Produced"],
  ["24H", "Free Mockup Option"]
];

const whyChooseCards = [
  { title: "Fast Design Support", desc: "Free teamwear mockup based on your logo, colors and sport category." },
  { title: "Flexible Sample First", desc: "Sample order support for design confirmation before bulk production." },
  { title: "OEM / ODM Manufacturing", desc: "Private label, custom sizing, pattern adjustment, packaging and collection development." },
  { title: "Multi-Sport Production", desc: "Basketball, soccer, baseball, volleyball, hockey, running, training wear and more." },
  { title: "Quality Control", desc: "Strict fabric, print, stitching, size and packing checks before delivery." },
  { title: "Global Delivery Support", desc: "Export-ready packing and shipping options for clubs, schools, distributors and brands." }
];

const workflowSteps = [
  { step: "01", title: "Send Logo & Design Idea", desc: "Share logo, colors, sport category, quantity and reference style." },
  { step: "02", title: "Get Free Mockup", desc: "Receive a clear front/back design preview for confirmation." },
  { step: "03", title: "Confirm Sample", desc: "Check fabric, size, print effect, stitching and fit before bulk order." },
  { step: "04", title: "Bulk Production & QC", desc: "Production starts after approval, with print, cutting, sewing and inspection control." },
  { step: "05", title: "Packing & Delivery", desc: "Export packing, size grouping and delivery support for your destination market." }
];

const evidenceBlocks = [
  { title: "Digital Mockup & Pattern Setup", image: "/images/poxiol-v6/home_oem_odm_solutions.png" },
  { title: "Sublimation Printing", image: "/images/poxiol-v6/manufacturing_sublimation_printing.png" },
  { title: "Fabric Cutting & Sewing", image: "/images/poxiol-v6/manufacturing_cutting_sewing.png" },
  { title: "Size Measurement & QC", image: "/images/poxiol-v6/manufacturing_quality_control.png" }
];

const oemSolutions = [
  "Private Label Uniforms",
  "Custom Teamwear Collection",
  "Fabric & Fit Adjustment",
  "Label and Packaging Options",
  "Repeat Order Support",
  "Multi-Sport Category Expansion"
];

const buyerTypes = [
  { title: "Clubs & Academies", desc: "Professional and amateur clubs needing robust performance, repeatable quality, and customizable names/numbers." },
  { title: "Schools & Universities", desc: "Athletic departments requiring unified school colors, reliable size groupings, and durable tournament wear." },
  { title: "Sportswear Brands", desc: "Startups or established labels looking for OEM private-label sportswear manufacturing with custom packaging." },
  { title: "Distributors & Wholesalers", desc: "Bulk distributors looking for a stable supply chain, custom pattern support, and multi-sport bulk pricing." },
  { title: "Event Organizers", desc: "Race organizers, tournaments, or local leagues requiring large-volume custom uniforms with strict delivery deadlines." }
];

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema, homepageFaqSchema]} />
      <Header />

      {/* 1. Hero & Trust Numbers Section */}
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.06),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-400">Elite B2B Teamwear Partner</p>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-white md:text-6xl uppercase">
              Custom Teamwear Manufacturer for Clubs, Schools & Sports Brands
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">
              From free design mockup to sampling, bulk production, quality inspection and global delivery — POXIOL helps teams and brands build professional custom sports uniforms with one reliable manufacturing partner.
            </p>
            
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/free-mockup/">Get Free Mockup</PrimaryButton>
              <SecondaryButton href="/contact/">Request OEM / Bulk Quote</SecondaryButton>
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl md:min-h-[500px]">
            <img 
              src="/images/poxiol-v62/home_hero_v62.png" 
              alt="POXIOL custom teamwear heroes" 
              className="absolute inset-0 h-full w-full object-cover" 
            />
            <div className="absolute left-6 top-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
              <p className="text-3xl font-black text-lime-400">24H</p>
              <p className="text-sm font-bold text-white">Free Mockup</p>
            </div>
            <div className="absolute bottom-6 right-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
              <p className="text-3xl font-black text-lime-400">MOQ 1</p>
              <p className="text-sm font-bold text-white">Sample Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar Section */}
      <section className="bg-neutral-950 px-5 py-12 border-b border-white/5 md:px-10 xl:px-20">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-3 lg:grid-cols-5">
          {trustBarStats.map(([metric, label]) => (
            <div key={label} className="rounded-2xl bg-white/[0.04] p-4 text-center">
              <p className="text-2xl font-black text-lime-400 md:text-3xl">{metric}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-neutral-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Why Teams Choose POXIOL */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="The POXIOL Advantage" 
            title="Why Teams & Brands Choose POXIOL" 
            subtitle="Sample MOQ 1 Piece Available / Bulk Team Orders Supported / OEM Pricing for Volume Orders"
            dark
            center
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseCards.map((card) => (
              <div key={card.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 transition hover:border-lime-400 hover:bg-lime-400/5">
                <h3 className="text-xl font-black text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Team Projects Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <SectionHeading 
              eyebrow="Featured Projects" 
              title="Featured Teamwear Projects" 
              subtitle="Examples of custom uniform programs we support for academies, schools, events, distributors and sportswear brands."
              dark
            />
            <div className="mt-6 md:mt-0">
              <SecondaryButton href="/projects/">View More Projects</SecondaryButton>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {caseStudies.map((project) => (
              <Link 
                href={`/projects/${project.slug}/`} 
                key={project.slug} 
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-lime-400/30"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[10px] font-black uppercase tracking-wider text-lime-400">{project.clientType}</span>
                  <h3 className="mt-3 text-lg font-black leading-tight text-white group-hover:text-lime-400">{project.title}</h3>
                  <p className="mt-3 flex-1 text-xs text-neutral-400 leading-relaxed line-clamp-3">{project.challenge}</p>
                  <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    <span>Qty: {project.quantity}</span>
                    <span>Time: {project.timeline}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 5-Step Custom Teamwear Workflow */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Onboarding Process" 
            title="How to Start Your Custom Teamwear Project" 
            subtitle="A simple process to turn your idea into a professional teamwear preview."
            center
            dark
          />
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-5 relative">
            <div className="absolute top-10 left-0 w-full h-0.5 bg-white/10 hidden lg:block -z-0"></div>
            {workflowSteps.map((step) => (
              <div key={step.step} className="relative z-10 text-left lg:text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 text-xl font-black text-lime-400 lg:mx-auto border-4 border-white/5 shadow-xl">
                  {step.step}
                </div>
                <h3 className="mt-6 text-lg font-black text-white">{step.title}</h3>
                <p className="mt-3 text-xs leading-5 text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <PrimaryButton href="/free-mockup/">Get Free Mockup Now</PrimaryButton>
          </div>
        </div>
      </section>

      {/* 5. Manufacturing Trust */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-400">Factory Proof</p>
              <h2 className="text-3xl font-black leading-[1.05] text-white md:text-5xl uppercase">Real Teamwear Manufacturing Support</h2>
              <p className="mt-5 text-base leading-7 text-neutral-300">
                POXIOL supports custom teamwear production from design file preparation to sublimation printing, cutting, sewing, QC inspection, packing and global shipping. Our workflow is built for B2B buyers who need clear communication, repeatable quality and reliable delivery.
              </p>
              <p className="mt-4 text-sm text-neutral-400 italic">
                Our production process follows export buyer requirements for quality control, documentation, packaging and shipment preparation.
              </p>
              <div className="mt-8">
                <SecondaryButton href="/manufacturing/">Explore Factory Tour</SecondaryButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {evidenceBlocks.map((block) => (
                <div key={block.title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 aspect-[16/10]">
                  <img 
                    src={block.image} 
                    alt={block.title} 
                    className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                  <p className="absolute bottom-4 left-4 text-sm font-black text-white">{block.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. OEM / ODM Solutions */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 md:min-h-[500px]">
            <img 
              src="/images/poxiol-v6/home_oem_odm_solutions.png" 
              alt="POXIOL OEM/ODM sportswear solutions meeting" 
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-400">OEM / ODM Capability</p>
            <h2 className="text-3xl font-black leading-[1.05] text-white md:text-5xl uppercase">OEM / ODM Teamwear Solutions for Brands & Distributors</h2>
            <p className="mt-5 text-base leading-7 text-neutral-300">
              For sportswear brands, high-volume distributors, and custom retailers, POXIOL provides a structured private-label program to build repeatable catalogs and consistent fits.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {oemSolutions.map((item) => (
                <div key={item} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 flex items-center gap-3">
                  <span className="text-lime-400 font-bold">✓</span>
                  <span className="text-sm font-bold text-white">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/free-mockup/">Start OEM / ODM Project</PrimaryButton>
              <SecondaryButton href="/oem-odm/">Explore OEM Solutions</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Built for Different B2B Buyers */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Target Buyers" 
            title="Built for Different B2B Buyers" 
            subtitle="Providing flexible manufacturing, exact visual consistency, and responsive deadlines."
            dark
            center
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {buyerTypes.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <h3 className="text-xl font-black text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Club Partnership Program Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-400">Club Partnership</p>
            <h2 className="text-3xl font-black leading-[1.05] text-white md:text-5xl uppercase">POXIOL Club Partnership Program</h2>
            <p className="mt-5 text-base leading-7 text-neutral-300">
              Set up a long-term supply plan for your league, sports academy, school department, or brand. Partners receive locked contract pricing, expedited sample priority, and multi-season roster support.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-neutral-300"><span className="text-lime-400 font-bold">✓</span> Special Pricing Models</div>
              <div className="flex items-center gap-3 text-sm text-neutral-300"><span className="text-lime-400 font-bold">✓</span> Fast-track Production Slots</div>
              <div className="flex items-center gap-3 text-sm text-neutral-300"><span className="text-lime-400 font-bold">✓</span> Dedicated Support Reps</div>
            </div>
            <div className="mt-8">
              <PrimaryButton href="/contact/?type=partnership">Apply For Partnership</PrimaryButton>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 md:min-h-[500px]">
            <img 
              src="/images/poxiol-v6/home_club_partnership_program.png" 
              alt="POXIOL club partnership handshake" 
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 9. Resources Center Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 md:min-h-[500px]">
            <img 
              src="/images/poxiol-v6/manufacturing_packing_global_delivery.png" 
              alt="POXIOL design resources and mockup screens" 
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-400">Knowledge Hub</p>
            <h2 className="text-3xl font-black leading-[1.05] text-white md:text-5xl uppercase">Explore Custom Teamwear Resources Center</h2>
            <p className="mt-5 text-base leading-7 text-neutral-300">
              Get detailed B2B guides on selecting high-performance polyester fibers, picking sublimation over surface prints, and mapping correct size charts.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link href="/fabric-guide/" className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:border-lime-400">
                <h4 className="font-black text-white">Fabric Guide</h4>
                <p className="mt-2 text-xs text-neutral-400">Detailed overview of breathable moisture-wicking meshes.</p>
              </Link>
              <Link href="/printing-guide/" className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:border-lime-400">
                <h4 className="font-black text-white">Printing Guide</h4>
                <p className="mt-2 text-xs text-neutral-400">Learn why dye-sublimation prevents fading and peeling.</p>
              </Link>
              <Link href="/resources/" className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:border-lime-400">
                <h4 className="font-black text-white">Size Charts</h4>
                <p className="mt-2 text-xs text-neutral-400">Unified fit charts from youth, women to adult athletes.</p>
              </Link>
              <Link href="/faq/" className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:border-lime-400">
                <h4 className="font-black text-white">FAQ Page</h4>
                <p className="mt-2 text-xs text-neutral-400">Common questions on shipping, samples, and custom tags.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Explore By Sport Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <SectionHeading 
              eyebrow="Product Categories" 
              title="Explore Custom Uniforms By Sport" 
              subtitle="POXIOL manufactures custom teamwear across major sport categories. Choose your sport and start building your custom mockup."
              dark
            />
            <div className="mt-6 md:mt-0">
              <SecondaryButton href="/sports/">Explore More Sports</SecondaryButton>
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sportsCategories.slice(0, 8).map((sport) => (
              <Link 
                href={sport.href} 
                key={sport.title} 
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-lime-400/30"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img 
                    src={sport.image} 
                    alt={sport.title} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-1 flex-col">
                  <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition">{sport.title}</h3>
                  <p className="mt-3 flex-1 text-xs text-neutral-400 leading-relaxed">{sport.description}</p>
                  <span className="mt-4 text-xs font-black uppercase text-lime-400">View Options →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Footer Contact Section */}
      <section id="contact" className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-lime-400">Get In Touch</p>
            <h2 className="text-4xl font-black leading-[0.98] tracking-tight text-white md:text-6xl uppercase">
              Ready to Start Your Teamwear Project?
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-300 md:text-lg">
              Submit your project details or mockup requests. The POXIOL design and manufacturing team will prepare a visual mockup and production plan based on your sport category, colors, and deadline.
            </p>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h4 className="text-sm font-black uppercase tracking-wider text-lime-400">Urgent Project Support</h4>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Facing tight tournament deadlines or sponsor launch events? Let us know your target date, and we will activate our fast-track production line.
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
