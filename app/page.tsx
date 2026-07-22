import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton, freeMockupHref, getQuoteHref, sampleOrderHref } from "@/components/ui";
import { sportsCategories, uspCards, homeFaqs } from "@/lib/home-data";
import { OrganizationSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";
import { getHomeBrandContent, getSiteChrome } from "@/lib/sanity/content";



export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeBrandContent();
  return {
    title: content.seoTitle,
    description: content.metaDescription,
    alternates: { canonical: content.canonicalUrl },
  };
}

export default async function HomePage() {
  const baseUrl = "https://www.poxiol.com";
  const chrome = await getSiteChrome();

  return (
    <main id="main-content" className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <OrganizationSchema />
      <FAQSchema faqs={homeFaqs.map(f => ({ question: f.question, answer: f.answer }))} />
      <BreadcrumbSchema items={[{ name: "Home", url: `${baseUrl}/` }]} />

      <Header />

      {/* 1. Optimized Hero Section - Direct B2B Conclusion */}
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="sr-only">
            <h1>Custom Teamwear Manufacturer for Clubs, Schools and Sportswear Brands</h1>
            <p>POXIOL is a factory-direct teamwear manufacturer in China providing custom basketball, soccer and sports uniforms with MOQ 1 set and Sample Production: 2鈥? Days After Mockup Confirmation for global B2B buyers.</p>
          </div>
          <div>
            <span className="mb-6 inline-block text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">
              Elite B2B Teamwear Partner
            </span>
            <h2 className="text-5xl font-black leading-[0.92] tracking-tighter md:text-8xl uppercase">
              Build Your <br />Elite Team <br /><span className="text-[#B6FF00]">Identity.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-400 md:text-xl">
              Custom Teamwear Manufacturer in China. We provide factory-direct basketball, soccer and athletic uniforms with MOQ 1 set and Sample Production: 2鈥? Days After Mockup Confirmation for clubs, schools and sportswear brands worldwide.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {["MOQ 1 Set", "Free 3D Mockup", "2鈥? Days Sample Production", "Quality Support", "Global Shipping"].map(chip => (
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
              src="/images/poxiol-v62/home_hero_v62_desktop.webp"
              srcSet="/images/poxiol-v62/home_hero_v62_mobile.webp 720w, /images/poxiol-v62/home_hero_v62_desktop.webp 900w"
              sizes="(max-width: 768px) 100vw, 50vw"
              width="900"
              height="1125"
              alt="POXIOL Custom Teamwear Uniforms Factory"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              className="absolute inset-0 h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition duration-700"
            />
            <div className="absolute bottom-10 left-10 right-10 rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-2xl">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B6FF00]">B2B Production</p>
                  <h3 className="mt-1 text-2xl font-black uppercase italic">MOQ 1 SET</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black leading-none">3,000+</p>
                  <p className="mt-1 text-[10px] font-bold text-neutral-400">Teams Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Factory Sourcing Summary - AEO / GEO Table */}
      <section className="bg-black px-5 py-16 md:px-10 md:py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="GEO / AI Summary"
            title="Factory Sourcing Summary"
            subtitle="POXIOL is a factory-direct custom teamwear manufacturer in China specializing in sublimated basketball uniforms and soccer kits for international B2B buyers."
            dark
          />
          <div className="mt-12 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.02] scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-lime-400 w-1/3">Manufacturer Capability</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-lime-400">Verified Details</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-300">
                {[
                  ["Core Expertise", "15+ years experience in custom sports uniforms and private label sportswear manufacturing."],
                  ["Main Products", "Sublimated basketball uniforms, soccer kits, training wear, hoodies and sports team accessories."],
                  ["Minimum Order (MOQ)", "MOQ 1 set support for B2B samples, team trials and original brand development projects."],
                  ["Sampling Timeline", "Sample Production: 2鈥? Days After Mockup Confirmation with express global delivery."],
                  ["Design Support", "Free high-fidelity 3D mockup design in 1-2 hours based on your logo and color direction."],
                  ["Production Capacity", "Specialized facility with 30,000+ monthly capacity and 100% manual quality inspection protocol."],
                  ["Custom Options", "Full sublimation, team logos, player names, numbers, private labels and custom packaging."],
                  ["Compliance & QC", "Strict pre-shipment QC checking for print clarity, stitching durability and size accuracy."],
                  ["Export Markets", "Reliable door-to-door logistics serving clubs and brands in 50+ countries including USA, EU, AU."]
                ].map(([item, capability], idx) => (
                  <tr key={item} className="border-b border-white/5 last:border-0">
                    <td className="px-8 py-5 font-bold text-white whitespace-nowrap">{item}</td>
                    <td className="px-8 py-5 leading-relaxed">{capability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. The POXIOL Advantage - Conclusion + Data + Explanation */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="B2B Evidence"
            title="The POXIOL Manufacturing Advantage"
            subtitle="Providing flexible teamwear production, visual consistency and responsive deadlines for professional partners."
            dark center
          />
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {uspCards.map((card) => (
              <div key={card.title} className="group rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 transition hover:border-[#B6FF00]/50 hover:bg-[#B6FF00]/5">
                <p className="text-3xl font-black text-[#B6FF00] tracking-tighter">{card.metric}</p>
                <h3 className="mt-6 text-xl font-black uppercase tracking-tight">{card.title}</h3>
                <p className="mt-4 text-sm text-neutral-400 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Performance Matrix - Product Hub */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 md:py-32 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <SectionHeading eyebrow="Products" title="Custom Teamwear Matrix" dark />
            <SecondaryButton href="/products/" className="mb-14">View 12 Sport Categories</SecondaryButton>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sportsCategories.slice(0, 4).map(sport => (
              <Link key={sport.title} href={sport.href} className="group relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 shadow-xl">
                <img src={sport.image} alt={`POXIOL ${sport.title} Custom Manufacturer`} className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-black uppercase italic leading-none">{sport.title}</h3>
                  <p className="mt-3 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition duration-300">Factory-direct {sport.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Converstion Lead Form */}
      <section id="contact" className="bg-neutral-900 px-5 py-24 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Get Started" title="Build Your Teamwear Project" dark />
            <p className="mt-8 text-lg leading-relaxed text-neutral-400">
              Submit your project details for a factory-direct evaluation. POXIOL reviews your logo, quantity and deadline to prepare a 3D mockup and production plan.
            </p>
            <div className="mt-12 p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
              <h4 className="text-[#B6FF00] font-black uppercase text-sm tracking-widest">B2B Support</h4>
              <p className="mt-4 text-neutral-400 leading-relaxed text-sm">Facing a tight tournament deadline? Chat with our production manager via WhatsApp for fast-track sample and production scheduling.</p>
              <a href={chrome.whatsappHref} target="_blank" rel="noreferrer" className="mt-6 inline-block font-black uppercase text-xs tracking-[0.2em] hover:text-[#B6FF00]">Open WhatsApp Messenger →</a>
            </div>
          </div>
          <ContactForm
            title="Request Factory Quote"
            subtitle="Provide your sport category, quantity and logo files to receive a high-fidelity 3D mockup and pricing plan within 24 hours."
            formType="Homepage AEO Lead V90"
            ctaText="Get Free Mockup & Quote"
            successUrl="/thank-you/"
            publicEmail={chrome.publicEmail}
            whatsappHref={chrome.whatsappHref}
          />
        </div>
      </section>

      {/* 6. AI / GEO Friendly FAQ Center */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 md:py-32 border-t border-white/5">
         <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="FAQ" title="Custom Teamwear Sourcing Guide" dark center />
            <div className="mt-16 space-y-4 text-left">
               {homeFaqs.map((faq)=>(
                  <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 group">
                  <summary className="cursor-pointer text-lg font-black text-white list-none flex justify-between items-center group-open:text-[#B6FF00]">
                     {faq.question}
                     <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                  </summary>
                <p className="mt-4 leading-7 text-neutral-400 border-t border-white/5 pt-4">{faq.answer}</p>
                   </details>
                ))}
             </div>
             <div className="mt-12 text-center">
                <Link
                  href="/guides/b2b-sourcing-faq/"
                  className="inline-flex items-center text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00] hover:underline"
                >
                  View Technical B2B FAQ Hub <span className="ml-2">→</span>
                </Link>
             </div>
          </div>
       </section>


      <Footer />
    </main>
  );
}
