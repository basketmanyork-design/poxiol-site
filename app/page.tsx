import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";
import { sportsCategories, uspCards, solutionCards, processSteps, featuredDesigns, techItems, galleryItems, factoryStats } from "@/lib/home-data";
import StructuredData, { organizationSchema, websiteSchema, homepageFaqSchema } from "@/components/seo/StructuredData";

const trustProof = [["15+", "Years Experience"], ["30,000+", "Monthly Capacity"], ["MOQ 1", "Sample Orders"], ["2-3D", "Fast Sampling"], ["OEM/ODM", "Brand Support"], ["180D", "Quality Support"]];

const comparisonData = [
  { feature: "Minimum Order Quantity", poxiol: "MOQ 1 (Ultra-Flexible)", others: "50-100+ Pieces" },
  { feature: "Design Support", poxiol: "1-2H Free Mockups", others: "3-5 Days (Often Paid)" },
  { feature: "Sampling Speed", poxiol: "2-3 Days (Prototyping)", others: "10-15 Days" },
  { feature: "Production Cycle", poxiol: "7-12 Days (Fast Track)", others: "3-5 Weeks" },
  { feature: "Quality Assurance", poxiol: "180-Day Guarantee", others: "Limited to Arrival" },
  { feature: "B2B Customization", poxiol: "Full OEM/ODM Support", others: "Basic Logo Printing" }
];

const capability = [["Team Orders", "Uniforms for clubs, schools, leagues and training groups."], ["OEM/ODM Collections", "Private label teamwear for brands, wholesalers and distributors."], ["Event Apparel", "Running, tournament, staff and race apparel for deadline-driven projects."], ["Repeat Programs", "Roster updates, reorder support and multi-season uniform systems."]];

const qcSteps = ["Fabric inspection", "Print color check", "Stitching inspection", "Size check", "Packing check", "Final QC before shipment"];

export const metadata: Metadata = {
  title: "Custom Teamwear Manufacturer | OEM Sports Uniform Supplier | POXIOL",
  description: "POXIOL is a professional custom teamwear manufacturer specializing in basketball uniforms, soccer kits, baseball jerseys and OEM sportswear manufacturing for clubs, schools and sports brands worldwide.",
};

export default function HomePage() {
  const tabs = ["All", "Basketball", "Soccer", "Baseball", "Running", "Training", "Volleyball"];
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema, homepageFaqSchema]} />
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.09),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-400">Elite B2B Teamwear Partner</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-white md:text-7xl">CUSTOM TEAMWEAR MANUFACTURER FOR CLUBS, SCHOOLS & SPORTS BRANDS</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-300 md:text-xl">The elite B2B partner for clubs, academies, sportswear brands and distributors. We turn your design ideas into performance gear with fast mockups, MOQ 1 flexibility, and scalable OEM/ODM production.</p>
            <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-white/10 py-6">
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Certified Quality</span>
                <div className="mt-2 flex gap-4 grayscale opacity-70">
                   <span className="text-xl font-black text-white">BSCI</span>
                   <span className="text-xl font-black text-white">ISO 9001</span>
                   <span className="text-xl font-black text-white">WRAP</span>
                   <span className="text-xl font-black text-white">SGS</span>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10 hidden md:block"></div>
              <div className="flex flex-wrap gap-2">
                {["MOQ 1", "Free Mockup", "2-3D Sampling", "Global Shipping"].map(item => (
                  <span key={item} className="rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-lime-400">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><PrimaryButton>Get Free Mockup</PrimaryButton><SecondaryButton href="#sports-categories">Explore Sports</SecondaryButton></div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl md:min-h-[620px]"><img src="/images/hero/hero-multisport-teamwear.png" alt="POXIOL custom teamwear hero" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute left-6 top-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"><p className="text-3xl font-black text-lime-400">1-2H</p><p className="text-sm font-bold text-white">Design Support</p></div><div className="absolute bottom-6 right-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"><p className="text-3xl font-black text-lime-400">180D</p><p className="text-sm font-bold text-white">Quality Support</p></div></div>

        </div>
      </section>

      <section className="bg-neutral-950 px-5 pb-16 md:px-10 xl:px-20"><div className="mx-auto grid max-w-7xl gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:grid-cols-3 lg:grid-cols-6">{trustProof.map(([metric,label]) => <div key={label} className="rounded-2xl bg-white/[0.05] p-5 text-center"><p className="text-2xl font-black text-lime-400">{metric}</p><p className="mt-2 text-xs font-bold uppercase tracking-wide text-neutral-300">{label}</p></div>)}</div></section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading 
            eyebrow="The POXIOL Advantage" 
            title="How We Outperform Traditional Suppliers" 
            subtitle="Engineered for the speed of modern B2B teamwear commerce."
            dark
            center
          />
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.05]">
                  <th className="px-6 py-5 text-sm font-black uppercase tracking-wider text-neutral-400">Feature</th>
                  <th className="px-6 py-5 text-sm font-black uppercase tracking-wider text-lime-400">POXIOL Elite</th>
                  <th className="px-6 py-5 text-sm font-black uppercase tracking-wider text-neutral-400">Standard Factory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="transition hover:bg-white/[0.02]">
                    <td className="px-6 py-6 text-sm font-bold text-white">{row.feature}</td>
                    <td className="px-6 py-6 text-sm font-black text-lime-400">{row.poxiol}</td>
                    <td className="px-6 py-6 text-sm text-neutral-500">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 text-center">
            <p className="text-neutral-400">Stop waiting for slow factories. Start your elite project with POXIOL today.</p>
            <div className="mt-6">
              <PrimaryButton>Experience the Advantage</PrimaryButton>
            </div>
          </div>
        </div>
      </section>


      <section id="sports-categories" className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Sports Categories" title="Custom Uniforms for Every Team Sport" subtitle="Choose your sport and start building a professional team look with POXIOL."/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{sportsCategories.map(item => <Link href={item.href} key={item.title} className="poxiol-card group overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 hover:border-lime-400 hover:shadow-xl"><div className="relative h-44 overflow-hidden"><img src={item.image} alt={`POXIOL ${item.title}`} className="h-full w-full object-cover" /></div><div className="p-5"><h3 className="text-lg font-black text-neutral-950">{item.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p><p className="mt-4 text-sm font-black text-neutral-950 group-hover:text-lime-600">{item.cta} →</p></div></Link>)}</div><div className="mt-12 rounded-[2rem] bg-neutral-950 p-8 text-center text-white md:p-10"><h3 className="text-2xl font-black">Not sure which sport category fits your project?</h3><p className="mx-auto mt-3 max-w-2xl text-neutral-300">Send us your logo, colors and sport type. We’ll help you choose the right product, fabric and customization path.</p><div className="mt-6"><PrimaryButton>Get Free Mockup</PrimaryButton></div></div></div></section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Why POXIOL" title="Fast, Flexible and Built for B2B Teamwear Buyers" subtitle="From one-piece samples to team orders and brand OEM collections, POXIOL helps global buyers move faster with confidence." dark/><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{uspCards.map(card => <div key={card.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-8 transition hover:border-lime-400 hover:bg-lime-400/10"><p className="text-4xl font-black text-lime-400">{card.metric}</p><h3 className="mt-6 text-2xl font-black text-white">{card.title}</h3><p className="mt-3 leading-7 text-neutral-300">{card.description}</p><span className="mt-6 inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/80">{card.label}</span></div>)}</div></div></section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-600">OEM / ODM Capability</p><h2 className="text-4xl font-black leading-[1.05] text-neutral-950 md:text-5xl">From Team Orders to Private Label Collections</h2><p className="mt-5 text-lg leading-8 text-neutral-600">POXIOL is built for both direct team uniform orders and scalable sportswear collection development. Start with a mockup, confirm a sample, then move into team, wholesale or brand production.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryButton>Start OEM Project</PrimaryButton><SecondaryButton href="/oem-odm/" darkText>View OEM/ODM</SecondaryButton></div></div><div className="grid gap-5 md:grid-cols-2">{capability.map(([title,desc]) => <div key={title} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6"><h3 className="text-xl font-black text-neutral-950">{title}</h3><p className="mt-3 text-sm leading-6 text-neutral-600">{desc}</p></div>)}</div></div></section>

      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Teamwear Solutions" title="Built for Clubs, Schools, Events and Brands" subtitle="POXIOL supports different teamwear buyers with flexible customization, fast sampling and scalable OEM/ODM production."/><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{solutionCards.map(card => <Link key={card.title} href={card.href} className="poxiol-card group overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-sm hover:border-lime-400 hover:shadow-xl"><div className="relative h-52 overflow-hidden"><img src={card.image} alt={card.title} className="h-full w-full object-cover" /></div><div className="p-7"><h3 className="text-2xl font-black text-neutral-950">{card.title}</h3><p className="mt-2 font-semibold text-neutral-500">{card.subtitle}</p><p className="mt-4 leading-7 text-neutral-700">{card.description}</p><p className="mt-5 font-black text-neutral-950 group-hover:text-lime-600">{card.cta} →</p></div></Link>)}</div></div></section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Onboarding Process" 
            title="Professional Customization in 5 Simple Steps" 
            subtitle="How POXIOL handles your project from initial design to global delivery."
            center
          />
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-5 relative">
            {/* Visual line for desktop */}
            <div className="absolute top-10 left-0 w-full h-0.5 bg-neutral-100 hidden lg:block -z-0"></div>
            
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative z-10 text-left lg:text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 text-xl font-black text-lime-400 lg:mx-auto border-4 border-white shadow-xl">
                  {step.step}
                </div>
                <h3 className="mt-6 text-xl font-black text-neutral-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="mt-4 flex justify-center lg:hidden">
                    <div className="h-8 w-0.5 bg-neutral-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="designs" className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Featured Designs" title="Original Teamwear Designs Ready for Customization" subtitle="Explore POXIOL original designs for basketball, soccer, baseball, running, training and more. Choose a style, change colors, add your logo and build your own team identity." dark/><div className="mb-10 flex gap-3 overflow-x-auto md:justify-center">{tabs.map((tab,index) => <button key={tab} className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm font-black ${index===0?"border-lime-400 bg-lime-400 text-neutral-950":"border-white/15 text-white"}`}>{tab}</button>)}</div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">{featuredDesigns.map(item => <Link key={item.title} href={item.href} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-lime-400"><div className="relative h-56 overflow-hidden md:h-72"><img src={item.image} alt={item.title} className="h-full w-full object-cover" /></div><div className="p-4 md:p-5"><p className="text-xs font-black uppercase tracking-wide text-lime-400">{item.sport}</p><h3 className="mt-2 text-base font-black text-white md:text-lg">{item.title}</h3><p className="mt-2 hidden text-sm leading-6 text-neutral-400 md:block">{item.description}</p><p className="mt-4 text-sm font-black text-white group-hover:text-lime-600">Request This Design →</p></div></Link>)}</div></div></section>

      <section id="technology" className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"><div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-neutral-100 md:min-h-[620px]"><img src="/images/technology/fabric-main.webp" alt="POXIOL performance fabric and sublimation technology" className="absolute inset-0 h-full w-full object-cover" /></div><div><p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-600">Fabric & Technology</p><h2 className="text-4xl font-black leading-[1.05] text-neutral-950 md:text-5xl">Performance Fabric Built for Real Team Sports</h2><p className="mt-5 text-lg leading-8 text-neutral-600">POXIOL combines sublimation printing, breathable fabrics and strict QC inspection to create custom uniforms that stay sharp, comfortable and game-ready.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{techItems.map(item => <div key={item.title} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="font-black text-neutral-950">{item.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p></div>)}</div></div></div></section>

      <section id="gallery" className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Elite Partner Showcase" title="Global Projects for Teams, Events and Brands" subtitle="A professional look built for elite performance. See how POXIOL helps global buyers establish a premium team identity." dark/><div className="grid auto-rows-[180px] gap-4 md:grid-cols-4">{galleryItems.map(item => <div key={item.title} className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] ${item.className}`}><img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-80 transition group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/><div className="absolute bottom-0 p-5"><h3 className="text-xl font-black text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-300">{item.description}</p></div></div>)}</div></div></section>


      <section id="factory" className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"><div><p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-lime-600">Factory & Quality Control</p><h2 className="text-4xl font-black leading-[1.05] text-neutral-950 md:text-5xl">Supplier Strength Buyers Can Verify</h2><p className="mt-5 text-lg leading-8 text-neutral-600">POXIOL combines design, sampling, production, quality control and international delivery support for custom teamwear buyers.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{qcSteps.map(item => <span key={item} className="rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-black text-neutral-950">✓ {item}</span>)}</div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><SecondaryButton href="/factory/" darkText>Verify Capability</SecondaryButton><PrimaryButton>Get Free Mockup</PrimaryButton></div></div><div className="grid h-[440px] grid-cols-3 gap-4"><div className="relative col-span-2 overflow-hidden rounded-[2rem] bg-neutral-300"><img src="/images/factory/factory-main.webp" alt="POXIOL factory" className="h-full w-full object-cover"/></div><div className="grid gap-4"><div className="relative overflow-hidden rounded-[2rem] bg-neutral-300"><img src="/images/factory/qc-closeup.webp" alt="POXIOL QC" className="h-full w-full object-cover"/></div><div className="relative overflow-hidden rounded-[2rem] bg-neutral-300"><img src="/images/factory/sampling-desk.webp" alt="POXIOL sampling" className="h-full w-full object-cover"/></div></div></div></div><div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{factoryStats.map(stat => <div key={stat.label} className="rounded-3xl border border-neutral-200 bg-white p-6 text-center"><p className="text-3xl font-black text-neutral-950 md:text-4xl">{stat.value}</p><p className="mt-2 text-sm font-semibold text-neutral-500">{stat.label}</p></div>)}</div></div></section>

      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Knowledge & Resources" 
            title="Teamwear Knowledge Center" 
            subtitle="Explore our comprehensive guides on fabrics, printing technology, and manufacturing processes to help you make informed decisions."
            dark
            center
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Fabric Guide", desc: "Performance material database.", href: "/fabric-guide/" },
              { title: "Printing Guide", desc: "Decoration technology overview.", href: "/printing-guide/" },
              { title: "Buying Guides", desc: "How to order for your team.", href: "/resources/" },
              { title: "FAQ Center", desc: "Manufacturing and ordering FAQ.", href: "/faq/" }
            ].map(item => (
              <Link key={item.title} href={item.href} className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10">
                <h3 className="text-xl font-black text-lime-400">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
                <div className="mt-6 flex items-center text-xs font-black uppercase tracking-widest text-white">
                  Explore <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_80%_50%,rgba(182,255,0,0.16),transparent_28%),linear-gradient(135deg,#111,#050505)] p-8 md:grid-cols-[1fr_0.8fr] md:items-center md:p-14">
          <div>
            <h2 className="text-4xl font-black leading-[1.05] text-white md:text-6xl">Ready to Build Your Custom Teamwear?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">Send your sport, logo, colors and quantity. Get a free POXIOL mockup and start your team uniform project today.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryButton>Get Free Mockup Now</PrimaryButton><SecondaryButton href="/contact/">Contact Sales</SecondaryButton></div>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-[1.5rem] bg-white/5">
            <img src="/images/cta/final-cta-uniforms.webp" alt="POXIOL custom uniforms" className="h-full w-full object-cover"/>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
