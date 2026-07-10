import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import { BreadcrumbSchema, OrganizationSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "About POXIOL | Professional Custom Teamwear Manufacturer",
  description: "Learn about POXIOL's journey in the custom teamwear industry. 15+ years of apparel experience, serving 3,000+ teams with high-performance sportswear.",
};

export default function AboutPage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/about/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      {/* --- AEO / GEO Infrastructure --- */}
      <OrganizationSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "About", url: fullUrl }
      ]} />

      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center border-b border-white/5">
        <div className="mx-auto max-w-4xl">
          <SectionHeading 
            eyebrow="Our Identity" 
            title="Elite Custom Teamwear Manufacturing" 
            subtitle="POXIOL manufactures pro-grade custom teamwear directly from the factory floor, providing B2B buyers with 15+ years of expertise and 3,000+ team uniform projects." 
            dark center 
          />
          <p className="mt-12 text-xl text-neutral-300 leading-relaxed font-medium">
            POXIOL is an elite B2B manufacturing partner for sports clubs, academies, schools and sportswear brands. We specialize in high-color sublimation printing to ensure your team identity never fades, cracks or peels.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-24 md:px-10 md:py-32 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-black uppercase md:text-5xl tracking-tight mb-8">15+ Years of Export Manufacturing</h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Operating our own specialized production facility allows POXIOL to maintain 100% control over the supply chain. This enables MOQ 1 set sample support for brands and 30,000+ monthly piece capacity for large-scale tournament events.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-neutral-200 pt-10">
              <div>
                <p className="text-5xl font-black text-lime-600 tracking-tighter">3,000+</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Team Projects Served</p>
              </div>
              <div>
                <p className="text-5xl font-black text-lime-600 tracking-tighter">50+</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Countries Shipped</p>
              </div>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-neutral-200 shadow-2xl">
            <img src="/images/poxiol-v6/home_hero_custom_teamwear_manufacturer.png" alt="POXIOL Teamwear Manufacturing Expertise" className="h-full w-full object-cover grayscale-[0.2]" />
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-32 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h2 className="text-4xl font-black uppercase md:text-7xl tracking-tighter text-white">Factory Direct <br /><span className="text-[#B6FF00]">Supply Chain.</span></h2>
          <p className="mt-10 text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
            From digital front/back mockups to professional sublimation, precision cutting, sewing and global express delivery — POXIOL is your reliable partner for custom sportswear.
          </p>
          <div className="mt-12">
             <Link href="/contact/" className="text-[#B6FF00] font-black uppercase text-sm tracking-widest hover:underline hover:text-white">Join Our Club Partnership Program →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
