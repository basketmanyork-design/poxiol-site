import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton, freeMockupHref, getQuoteHref, sampleOrderHref, whatsAppHref } from "@/components/ui";
import { sportsCategories } from "@/lib/home-data";
import { caseStudies } from "@/lib/case-studies";
import { OrganizationSchema } from "@/components/seo/GEOStructuredData";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Custom Teamwear Manufacturer | OEM Sports Uniform Supplier | POXIOL",
  description: "Elite B2B custom teamwear manufacturer offering basketball uniforms, soccer kits and OEM sportswear with free mockup, MOQ 1 set and sample production in 2-3 days.",
};

const trustMetrics = [
  { value: "15+", label: "Years Experience" },
  { value: "3,000+", label: "Team Projects" },
  { value: "50+", label: "Countries Shipped" },
  { value: "2-3 Days", label: "Sample Production" }
];

const conversionChips = ["Free Mockup", "MOQ 1 Set", "Sample in 2–3 Days", "Factory Direct", "OEM/ODM"];

const targetBuyers = [
  { title: "Clubs & Academies", desc: "Custom seasonal uniforms, training kits and reorder programs for local clubs and academies." },
  { title: "Schools & Teams", desc: "Youth and adult size support, team name and number customization, size-grouped packing for easy distribution." },
  { title: "Sportswear Brands", desc: "OEM/ODM collection development, private labels, packaging, sampling and bulk production support." },
  { title: "Distributors & Custom Retailers", desc: "Flexible product options, repeatable designs, multi-sport catalog expansion and factory-direct production." },
  { title: "Event Organizers", desc: "Custom event shirts, race wear, tournament uniforms and fast production planning for deadline-driven projects." }
];

const trustEvidence = [
  { title: "15+ Years Experience", desc: "Long-term experience in custom sports uniforms and B2B teamwear production." },
  { title: "3,000+ Team Projects", desc: "Custom teamwear programs for clubs, schools, academies, brands and event buyers." },
  { title: "50+ Countries Shipped", desc: "Global delivery support for sample orders and bulk teamwear programs." },
  { title: "Multi-Stage QC", desc: "Fabric surface check, print clarity check, stitching inspection, size measurement and final packing review." },
  { title: "Private Label Support", desc: "Neck labels, hangtags, packaging, barcode labels and distributor-ready packing available." },
  { title: "Free Mockup Workflow", desc: "Submit logo, colors and quantity before production to confirm visual direction." }
];

const homeFaqs = [
  { q: "What does POXIOL manufacture?", a: "POXIOL manufactures custom basketball uniforms, soccer kits, training wear, team hoodies, jackets and sports team accessories for clubs, schools, academies, brands, distributors and event organizers." },
  { q: "Does POXIOL support MOQ 1 set samples?", a: "Yes. POXIOL supports 1 set sample orders for design and quality confirmation before bulk production." },
  { q: "How fast can POXIOL prepare a sample?", a: "For standard custom teamwear projects, sample production can usually be arranged in 2–3 days after mockup confirmation." },
  { q: "Can POXIOL support OEM and ODM teamwear?", a: "Yes. POXIOL supports OEM and ODM development, including custom design, fabric selection, private label, packaging and bulk production." },
  { q: "What information should buyers send for a quote?", a: "Buyers should send sport category, product type, logo, color direction, quantity, size list, reference design and target delivery date." },
  { q: "Does POXIOL ship globally?", a: "Yes. POXIOL supports global shipping for sample orders, team orders and distributor programs." }
];

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <OrganizationSchema />
      <Header />

      {/* 1. Optimized Hero Section */}
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="mb-6 inline-block text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">
              Custom Teamwear Manufacturer
            </span>
            <h1 className="text-5xl font-black leading-[0.92] tracking-tighter md:text-8xl uppercase">
              Build Your <br />Elite Team <br /><span className="text-[#B6FF00]">Identity.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-400 md:text-xl">
              Factory-direct custom basketball, soccer and team uniforms with professional 3D mockups, flexible MOQ and After-Sales Quality Support.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-3">
              {conversionChips.map(chip => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <PrimaryButton href={freeMockupHref} className="h-16 px-10">Get Free Mockup</PrimaryButton>
              <SecondaryButton href={getQuoteHref} className="h-16 px-10">Get Factory Quote</SecondaryButton>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl shadow-[#B6FF00]/5">
            <img 
              src="/images/poxiol-v62/home_hero_v62.png" 
              alt="POXIOL Custom Teamwear Uniforms" 
              className="absolute inset-0 h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition duration-700" 
            />
            <div className="absolute bottom-10 left-10 right-10 rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-2xl">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B6FF00]">Next Generation</p>
                  <h3 className="mt-1 text-2xl font-black uppercase italic">V8 Performance</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black leading-none">MOQ 1</p>
                  <p className="mt-1 text-[10px] font-bold text-neutral-400">Set Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 GEO Module: Factory Sourcing Summary */}
      <section className="bg-black px-5 py-16 md:px-10 md:py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="GEO / AI Summary" 
            title="Factory Sourcing Summary" 
            subtitle="A quick sourcing overview for clubs, schools, brands, distributors and event organizers looking for reliable custom teamwear manufacturing."
            dark
          />
          <div className="mt-12 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-lime-400">POXIOL Capability</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-lime-400">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-300">
                {[
                  ["Main Products", "Basketball uniforms, soccer kits, baseball uniforms, training wear, team hoodies, jackets and accessories"],
                  ["Buyer Types", "Clubs, schools, academies, sportswear brands, distributors, event organizers and custom retailers"],
                  ["MOQ", "1 set sample support, bulk team orders and distributor programs available"],
                  ["Mockup Support", "Free visual mockup based on logo, colors, sport category and quantity"],
                  ["Sample Time", "2–3 days after mockup confirmation for standard custom teamwear samples"],
                  ["Production", "Sublimation printing, cutting, sewing, quality control, private label packing and global shipping"],
                  ["Custom Options", "Team name, player name, number, logo, sponsor graphic, colors, pattern, neck label, hangtag and packaging"],
                  ["OEM / ODM", "Private label teamwear development and custom sportswear production for brands and distributors"],
                  ["Export Markets", "USA, Europe, Australia, Middle East and global teamwear buyers"]
                ].map(([item, capability], idx) => (
                  <tr key={item} className={idx !== 8 ? "border-b border-white/5" : ""}>
                    <td className="px-8 py-5 font-bold text-white whitespace-nowrap">{item}</td>
                    <td className="px-8 py-5 leading-relaxed">{capability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 text-center">
             <Link href={freeMockupHref} className="text-[#B6FF00] font-black uppercase text-sm tracking-widest hover:underline">Send Your Logo & Quantity → Get a Free Mockup</Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-white/5 bg-neutral-950 py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {trustMetrics.map(m => (
              <div key={m.label} className="text-center">
                <p className="text-3xl font-black text-white md:text-5xl tracking-tighter">{m.value}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Who We Help Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Target Buyers" 
            title="Built for Serious Teamwear Buyers" 
            subtitle="Providing flexible manufacturing, exact visual consistency, and responsive deadlines for B2B partners."
            dark center
          />
          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {targetBuyers.map(item => (
              <div key={item.title} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-[#B6FF00]/50 hover:bg-[#B6FF00]/5">
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#B6FF00]">{item.title}</h3>
                <p className="mt-4 text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Products Grid */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <SectionHeading 
              eyebrow="Products" 
              title="Performance Teamwear Matrix" 
              subtitle="Specialized categories engineered for high-intensity athletic performance."
              dark
            />
            <SecondaryButton href="/products/" className="mb-14">View All Categories</SecondaryButton>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sportsCategories.slice(0, 4).map(sport => (
              <Link key={sport.title} href={sport.href} className="group relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10">
                <img src={sport.image} alt={sport.title} className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-black uppercase italic leading-none">{sport.title}</h3>
                  <p className="mt-3 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition duration-300">{sport.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Buyers Trust POXIOL Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
           <SectionHeading 
            eyebrow="Evidence" 
            title="Why Buyers Trust POXIOL" 
            subtitle="POXIOL combines factory-direct production, clear sampling steps, quality inspection and project-based teamwear support."
            dark center
          />
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trustEvidence.map((item, idx) => (
              <div key={item.title} className="flex gap-6">
                 <span className="text-4xl font-black text-white/10">{idx + 1}</span>
                 <div>
                    <h3 className="text-xl font-black uppercase text-white">{item.title}</h3>
                    <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
             <div className="inline-block rounded-3xl border border-white/10 bg-white/[0.02] p-8 max-w-3xl">
                <p className="text-sm text-neutral-500 italic">
                   Note: Only real and verifiable documents, buyer feedback, and factory records are displayed on this site. We maintain 100% original visual assets to ensure copyright safety for our partners.
                </p>
                <div className="mt-8 flex justify-center gap-6">
                   <Link href="/certificates-testing/" className="text-[#B6FF00] font-black uppercase text-xs tracking-widest hover:underline">View Certificates →</Link>
                   <Link href="/quality-control-process/" className="text-[#B6FF00] font-black uppercase text-xs tracking-widest hover:underline">QC Workflow →</Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Converstion Optimized Contact Form */}
      <section id="contact" className="bg-neutral-950 px-5 py-24 md:px-10 md:py-32 xl:px-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Get Started" title="Ready to Build Your Team Uniforms?" dark />
            <p className="mt-8 text-lg leading-relaxed text-neutral-400">
              Submit your project details for a professional B2B evaluation. Our team will review your logo, quantity, and deadline to prepare a tailored mockup and quote.
            </p>
            <div className="mt-12 p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
              <h4 className="text-[#B6FF00] font-black uppercase text-sm tracking-widest">Urgent Support</h4>
              <p className="mt-4 text-neutral-400">Facing a tight tournament deadline? Chat with our production manager directly via WhatsApp for fast-track scheduling.</p>
              <a href={whatsAppHref} target="_blank" rel="noreferrer" className="mt-6 inline-block font-black uppercase text-xs tracking-[0.2em] hover:text-[#B6FF00]">Open WhatsApp Messenger ↗</a>
            </div>
          </div>
          <ContactForm 
            title="Start Your Project"
            subtitle="Provide your sport, quantity and logo files to receive a high-fidelity mockup within 24 hours."
            formType="Homepage Lead V90"
            ctaText="Request Mockup & Quote"
            successUrl="/thank-you/"
          />
        </div>
      </section>

      {/* AI / GEO Friendly FAQ */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 border-y border-white/5">
         <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="FAQ" title="Custom Teamwear Sourcing FAQ" dark center />
            <div className="mt-16 space-y-4 text-left">
               {homeFaqs.map((faq)=>(
                  <details key={faq.q} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 group">
                  <summary className="cursor-pointer text-lg font-black text-white list-none flex justify-between items-center group-open:text-[#B6FF00]">
                     {faq.q}
                     <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 leading-7 text-neutral-400 border-t border-white/5 pt-4">{faq.a}</p>
                  </details>
               ))}
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
