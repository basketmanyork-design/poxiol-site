import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import StructuredData from "@/components/seo/StructuredData";
import { fabricGuideSchema } from "@/lib/seo-data";
import { fabricDatabase } from "@/lib/fabrics";

export const metadata: Metadata = {
  title: "Sportswear Fabric Guide | Teamwear Fabric Database | POXIOL",
  description: "Explore POXIOL sportswear fabric guide for custom teamwear, including mesh fabric, interlock fabric, bird eye fabric, quick-dry polyester, spandex sports fabric and moisture-wicking materials for basketball, soccer, baseball, volleyball and team sports.",
};

const faqs = [
  { question: "What fabric is best for basketball uniforms?", answer: "Mesh fabric, quick-dry polyester and interlock fabric are commonly used for basketball uniforms because they provide breathability, comfort and good printing results." },
  { question: "What fabric is best for soccer jerseys?", answer: "Interlock fabric, bird eye fabric and quick-dry polyester are popular choices for soccer jerseys." },
  { question: "What fabric works best with sublimation printing?", answer: "Polyester-based fabrics are best for sublimation printing because the dye bonds well with polyester fibers." },
  { question: "Is mesh fabric good for sports uniforms?", answer: "Yes. Mesh fabric is breathable and lightweight, making it suitable for basketball, training wear and warm-weather sportswear." },
  { question: "What is moisture-wicking fabric?", answer: "Moisture-wicking fabric helps move sweat away from the body to improve comfort during sports activity." },
  { question: "Can I choose fabric before production?", answer: "Yes. POXIOL can recommend fabric options before sample or bulk production." },
  { question: "Is spandex good for teamwear?", answer: "Spandex blends are useful for sportswear that requires flexibility and movement, such as volleyball and training apparel." },
  { question: "Do you provide fabric recommendations?", answer: "Yes. POXIOL recommends fabric based on sport type, printing method, design requirements and target use." },
];

export default function FabricGuidePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[fabricGuideSchema]} />
      <Header />

      {/* Hero Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20 border-b border-white/5">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Technical Database"
            title="Sportswear Fabric Guide For Custom Teamwear"
            subtitle="Performance starts with the right material. Our comprehensive guide helps you select the perfect fabric for your custom sports project based on breathability, durability, and printing needs."
            dark
            center
          />

          <div className="mt-20 prose prose-invert prose-lime max-w-none text-lg leading-relaxed text-neutral-400">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Why Fabric Selection Matters</h2>
            <p>
              Different sports require different levels of breathability, stretch, durability, moisture management and printing compatibility. POXIOL helps clubs, schools, distributors and sports brands select suitable fabrics for basketball uniforms, soccer kits, baseball jerseys, volleyball uniforms, rugby teamwear, running apparel and esports jerseys.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-4">
              {["Player comfort", "Breathability", "Sweat management", "Durability", "Stretch and mobility", "Printing quality", "Teamwear appearance", "Long-term performance"].map(item => (
                <li key={item} className="flex items-center text-sm font-bold text-white m-0">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-lime-400"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fabric Database Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase tracking-tight text-lime-400 text-center">Core Performance Fabrics</h2>
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {fabricDatabase.map((fabric) => (
              <div key={fabric.name} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{fabric.name}</h3>

                <div className="mt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Technical Specs</h4>
                  <div className="mt-4 grid grid-cols-2 gap-y-4 text-xs font-bold">
                    <div><span className="text-neutral-500 block uppercase tracking-widest text-[9px]">Breathability</span> {fabric.breathability}</div>
                    <div><span className="text-neutral-500 block uppercase tracking-widest text-[9px]">Stretch</span> {fabric.stretch}</div>
                    <div><span className="text-neutral-500 block uppercase tracking-widest text-[9px]">Durability</span> {fabric.durability}</div>
                    <div><span className="text-neutral-500 block uppercase tracking-widest text-[9px]">Sublimation</span> {fabric.sublimation}</div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Key Features</h4>
                  <ul className="mt-4 space-y-2">
                    {fabric.features.map(feature => (
                      <li key={feature} className="flex items-center text-sm font-bold text-neutral-300">
                        <span className="mr-2 h-1 w-1 rounded-full bg-lime-400"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Recommended For</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {fabric.bestFor.map(item => (
                      <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-500">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20 border-y border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black uppercase tracking-tight text-white">Fabric Comparison Matrix</h2>
          <div className="mt-12 overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400">Fabric Type</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400 text-center">Airflow</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400 text-center">Flex</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400 text-center">Life</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400">Printing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {fabricDatabase.map((fabric) => (
                  <tr key={fabric.name}>
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{fabric.name}</td>
                    <td className="px-6 py-4 text-center text-neutral-400">{fabric.breathability}</td>
                    <td className="px-6 py-4 text-center text-neutral-400">{fabric.stretch}</td>
                    <td className="px-6 py-4 text-center text-neutral-400">{fabric.durability}</td>
                    <td className="px-6 py-4 text-xs text-neutral-500">{fabric.sublimation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black uppercase tracking-tight text-lime-400">Fabric Selection FAQ</h2>
          <div className="mt-12 space-y-12">
            {faqs.map(faq => (
              <div key={faq.question} className="group">
                <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors">{faq.question}</h3>
                <p className="mt-4 text-lg leading-relaxed text-neutral-400">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 rounded-3xl bg-lime-400 p-10 text-center text-black md:p-20">
            <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Select Your Performance Fabric</h2>
            <p className="mt-6 text-xl font-bold">Need help choosing? Our experts can recommend the right material based on your sport and climate.</p>
            <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <PrimaryButton className="bg-black text-white hover:bg-neutral-800">Start Custom Order</PrimaryButton>
              <Link href="/free-mockup/" className="flex h-[60px] items-center justify-center rounded-full border-2 border-black px-10 text-base font-black uppercase hover:bg-black hover:text-white transition-colors">Request Fabric Samples</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
