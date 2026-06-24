import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton, freeMockupHref, getQuoteHref, sampleOrderHref, whatsAppHref } from "@/components/ui";
import { sportsCategories } from "@/lib/home-data";
import { caseStudies } from "@/lib/case-studies";
import StructuredData, { organizationSchema, websiteSchema, homepageFaqSchema } from "@/components/seo/StructuredData";
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

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema, homepageFaqSchema]} />
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

      {/* 2. Solutions Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Solutions" 
            title="Custom Teamwear Solutions" 
            subtitle="Providing flexible manufacturing for clubs, academies, schools and sportswear brands."
            dark center
          />
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              { title: "Basketball Uniforms", desc: "Full sublimation reversible sets and team packages.", href: "/sports/" },
              { title: "Soccer Club Kits", desc: "Home/Away kits with sponsor integration and pro fit.", href: "/sports/" },
              { title: "OEM/ODM Production", desc: "Private label manufacturing for established sports brands.", href: "/oem-odm/" }
            ].map(item => (
              <div key={item.title} className="group rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 transition hover:border-[#B6FF00]/50 hover:bg-[#B6FF00]/5">
                <h3 className="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                <p className="mt-4 text-neutral-400 leading-relaxed">{item.desc}</p>
                <Link href={item.href} className="mt-8 inline-block text-xs font-black uppercase tracking-widest text-[#B6FF00] hover:underline">Explore Solution →</Link>
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
            <SecondaryButton href="/sports/" className="mb-14">View All Categories</SecondaryButton>
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

      {/* 4. Factory & Customization Evidence */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl grid gap-20 lg:grid-cols-2 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10"><img src="/images/poxiol-v6/manufacturing_sublimation_printing.png" className="h-full w-full object-cover" /></div>
            <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 mt-12"><img src="/images/poxiol-v6/manufacturing_cutting_sewing.png" className="h-full w-full object-cover" /></div>
          </div>
          <div>
            <SectionHeading eyebrow="Factory Direct" title="Real Manufacturing Power" dark />
            <p className="text-lg text-neutral-400 leading-relaxed">
              POXIOL is not a middleman. We operate our own specialized sublimation and sewing facility, giving us absolute control over print vibrancy, stitch durability, and delivery timelines.
            </p>
            <ul className="mt-10 space-y-5">
              {["Industrial Sublimation Printing", "Precision Laser Fabric Cutting", "100% Manual QC Inspection", "Private Label & Custom Packaging"].map(item => (
                <li key={item} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                  <span className="h-2 w-2 rounded-full bg-[#B6FF00]" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-12">
              <PrimaryButton href={sampleOrderHref}>Start Sample Order</PrimaryButton>
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
            formType="Homepage Lead V8"
            ctaText="Request Mockup & Quote"
            successUrl="/thank-you/"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
