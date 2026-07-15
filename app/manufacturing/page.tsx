import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";
import StructuredData from "@/components/seo/StructuredData";
import { manufacturingHubSchema } from "@/lib/seo-data";
import Link from "next/link";
import { Factory, Zap, ShieldCheck, Printer, Scissors, Package, Truck, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "OEM Sportswear Manufacturing | Custom Teamwear Factory | POXIOL",
  description: "POXIOL is a professional OEM and ODM sportswear manufacturer specializing in custom basketball uniforms, soccer kits, baseball jerseys, volleyball apparel and private label teamwear.",
};

export default function ManufacturingPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[manufacturingHubSchema]} />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Manufacturing Excellence" 
            title="Professional OEM & ODM Teamwear Manufacturing" 
            subtitle="POXIOL is a custom teamwear manufacturing platform specializing in OEM and ODM sports uniforms for clubs, schools, academies, distributors and sports brands worldwide."
            dark
            center
          />
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-black">
                <Factory size={24} />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase tracking-tight text-white">Full-Scale Factory</h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                End-to-end production from fabric sourcing to final quality control and international logistics.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-black">
                <Zap size={24} />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase tracking-tight text-white">OEM & ODM Solutions</h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                Custom specs for established brands or proven templates for startups and local teams.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-black">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase tracking-tight text-white">Strict Quality Control</h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                Multi-stage inspection process ensuring sizing accuracy, print quality, and seam durability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OEM vs ODM Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-lime-400 md:text-4xl">What Is OEM Sportswear Manufacturing?</h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-400">
                OEM (Original Equipment Manufacturing) allows customers to create sportswear products using their own branding, logos, designs and specifications.
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-4">
                {["Brand Identity", "Team Logos", "Sponsor Graphics", "Colors", "Fabric Selection", "Product Specs", "Packaging Design"].map(item => (
                  <li key={item} className="flex items-center text-sm font-bold text-white">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-lime-400"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Ideal For:</h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Brands", "Distributors", "Schools", "Academies", "Clubs"].map(tag => (
                    <span key={tag} className="rounded-full border border-white/10 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-500">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-lime-400 md:text-4xl">What Is ODM Teamwear Manufacturing?</h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-400">
                ODM (Original Design Manufacturing) allows customers to customize existing product structures and proven manufacturing models for faster development.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="mr-4 mt-1 text-lime-400"><Info size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white">Faster Launch</h4>
                    <p className="text-xs text-neutral-500">Proven product structures reduce design costs and prototyping time.</p>
                  </div>
                </div>
                <div className="flex items-start rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="mr-4 mt-1 text-lime-400"><Zap size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white">Full Customization</h4>
                    <p className="text-xs text-neutral-500">Still customize colors, logos, player names, numbers, and private labeling.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="The Workflow" 
            title="Sportswear Manufacturing Process" 
            subtitle="From initial concept to global delivery, our structured production workflow ensures consistency and transparency."
            dark
            center
          />
          
          <div className="mt-20 space-y-8">
            {[
              { step: "01", title: "Project Consultation", desc: "Understanding sport type, quantity, fabric preference, and timeline to recommend the best solution.", icon: <Info /> },
              { step: "02", title: "Design & Mockup", desc: "Creating professional 3D mockups (front, back, side) for design approval before production.", icon: <Zap /> },
              { step: "03", title: "Fabric Selection", desc: "Choosing between Mesh, Interlock, or Stretch Performance fabrics based on sport requirements.", icon: <Factory /> },
              { step: "04", title: "Sublimation Printing", desc: "Permanently transferring graphics into polyester fibers for zero-fade, breathable results.", icon: <Printer /> },
              { step: "05", title: "Cutting & Sewing", desc: "Precision panel cutting and expert assembly by experienced production staff.", icon: <Scissors /> },
              { step: "06", title: "Quality Control", desc: "Multi-stage inspection covering fabric, printing, sewing, and final sizing.", icon: <ShieldCheck /> },
              { step: "07", title: "Packaging & Shipping", desc: "Custom branding, polybags, and global delivery via Express, Air, or Sea freight.", icon: <Package /> },
            ].map((item, index) => (
              <div key={item.step} className="group flex flex-col items-center gap-8 rounded-3xl border border-white/5 bg-white/5 p-8 md:flex-row md:p-10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-2xl font-black text-lime-400 group-hover:bg-lime-400 group-hover:text-black transition-colors">
                  {item.step}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">{item.title}</h3>
                  <p className="mt-2 text-neutral-400">{item.desc}</p>
                  {item.step === "03" && (
                    <Link href="/guides/custom-basketball-uniform-fabric-gsm/" className="mt-3 inline-block text-xs font-bold text-lime-400 hover:underline">Read Fabric GSM Guide →</Link>
                  )}
                </div>
                <div className="hidden text-white/10 lg:block">{item.icon}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Explore Product Specifics</h3>
            <p className="mt-4 text-neutral-400">Discover our specialized manufacturing for different sports categories.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { name: "Basketball", href: "/custom-basketball-uniforms/" },
                { name: "Soccer", href: "/custom-soccer-kits/" },
                { name: "Baseball", href: "/custom-baseball-softball-uniforms/" },
                { name: "Fabric Tech", href: "/fabric-guide/" },
                { name: "Printing Tech", href: "/printing-guide/" },
                { name: "Case Studies", href: "/projects/" },
              ].map(link => (
                <Link key={link.name} href={link.href} className="text-xs font-black uppercase tracking-widest text-lime-400 hover:text-white underline underline-offset-4 decoration-lime-400/30 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Production Timeline Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black uppercase tracking-tight text-white">Estimated Production Timeline</h2>
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-lime-400">Production Stage</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-lime-400">Estimated Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ["Design & Mockup", "1-3 Days"],
                  ["Sample Production", "5-7 Days"],
                  ["Sample Approval", "1-3 Days"],
                  ["Bulk Production", "10-20 Days"],
                  ["Global Shipping", "3-7 Days (Express)"],
                ].map(([stage, time]) => (
                  <tr key={stage as string}>
                    <td className="px-8 py-6 font-bold text-white">{stage}</td>
                    <td className="px-8 py-6 text-neutral-400">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-sm text-neutral-500 italic">Actual timelines may vary depending on order complexity and seasonality.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black uppercase tracking-tight text-lime-400">Manufacturing FAQ</h2>
          <div className="mt-12 space-y-8">
            {[
              { q: "What is your MOQ?", a: "POXIOL supports flexible MOQ options starting from sample quantities." },
              { q: "Can you produce samples before bulk production?", a: "Yes. Sample production is available for design and quality confirmation." },
              { q: "Do you support OEM manufacturing?", a: "Yes. We provide complete OEM sportswear manufacturing services including private labeling." },
              { q: "Which printing method is best?", a: "Sublimation printing is recommended for most teamwear due to its zero-fade durability and design flexibility." },
              { q: "Do you ship worldwide?", a: "Yes. POXIOL ships globally to clubs, schools, distributors and sports brands using DHL/FedEx/UPS." },
            ].map(faq => (
              <div key={faq.q} className="group">
                <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors">{faq.q}</h3>
                <p className="mt-4 text-neutral-400">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 rounded-3xl bg-lime-400 p-10 text-center text-black md:p-16">
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Start Your Project</h2>
            <p className="mt-6 text-lg font-bold">Work with POXIOL to create professional custom teamwear for your brand or organization.</p>
            <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <PrimaryButton className="bg-black text-white hover:bg-neutral-800">Get Free Mockup</PrimaryButton>
              <Link href="/contact/" className="flex h-[60px] items-center justify-center rounded-full border-2 border-black px-10 text-base font-black uppercase hover:bg-black hover:text-white transition-colors">Request OEM Quote</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
