import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import StructuredData from "@/components/seo/StructuredData";
import { printingGuideSchema } from "@/lib/seo-data";
import { Printer, Zap, Scissors, ShieldCheck, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Sportswear Printing Guide | Sublimation, Screen Printing & Embroidery | POXIOL",
  description: "Learn about sublimation printing, screen printing, embroidery and heat transfer methods for custom teamwear, basketball uniforms, soccer kits and sportswear manufacturing.",
};

const printingMethods = [
  {
    name: "Sublimation Printing",
    description: "Sublimation printing uses heat and pressure to transfer dye directly into polyester fabric. The design becomes part of the fabric rather than sitting on top of it.",
    advantages: ["Full-color graphics", "No cracking", "No peeling", "Lightweight feel", "Excellent durability", "Unlimited design freedom"],
    bestFor: ["Basketball uniforms", "Soccer kits", "Baseball jerseys", "Volleyball uniforms", "Esports jerseys"],
    durability: "Excellent",
    designFreedom: "Excellent",
  },
  {
    name: "Screen Printing",
    description: "Screen printing applies ink onto fabric through a stencil-based process. It's a classic method for high-volume solid color designs.",
    advantages: ["Cost-effective for simple designs", "Good color consistency", "Suitable for large quantities"],
    bestFor: ["Training shirts", "Promotional apparel", "Team merchandise"],
    durability: "Good",
    designFreedom: "Medium",
  },
  {
    name: "Embroidery",
    description: "Embroidery uses thread stitching to create logos and branding elements for a premium, textured professional appearance.",
    advantages: ["Premium appearance", "Professional branding", "Long-lasting decoration"],
    bestFor: ["Polo shirts", "Jackets", "Team staff apparel", "Corporate sportswear"],
    durability: "Excellent",
    designFreedom: "Low",
  },
  {
    name: "Heat Transfer Printing",
    description: "Heat transfer printing applies graphics using heat and pressure. It's the ideal method for personalizing jerseys with individual names and numbers.",
    advantages: ["Fast production", "Suitable for names and numbers", "Good customization flexibility"],
    bestFor: ["Player names", "Player numbers", "Small-batch customization"],
    durability: "Good",
    designFreedom: "Medium",
  },
];

const faqs = [
  { question: "What is the best printing method for teamwear?", answer: "Sublimation is usually the best option for fully customized sports uniforms." },
  { question: "Does sublimation crack or peel?", answer: "No. The dye becomes part of the fabric." },
  { question: "Can embroidery be combined with sublimation?", answer: "Yes, depending on product type and design requirements." },
  { question: "Is screen printing cheaper?", answer: "It can be economical for simple graphics and larger quantities." },
  { question: "Can player names and numbers be customized?", answer: "Yes. Heat transfer and sublimation are commonly used." },
];

export default function PrintingGuidePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[printingGuideSchema]} />
      <Header />

      {/* Hero Section */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20 border-b border-white/5">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Decoration Technology"
            title="Sportswear Printing Guide For Custom Teamwear"
            subtitle="Choosing the right printing method is essential for performance, durability, branding and appearance. Explore how we bring your custom designs to life."
            dark
            center
          />

          <div className="mt-20 prose prose-invert prose-lime max-w-none text-lg leading-relaxed text-neutral-400">
            <p>
              This guide explains the most common printing methods used in custom teamwear manufacturing and helps buyers select the best option for their project. Whether you need full-color sublimation for basketball jerseys or premium embroidery for club polos, POXIOL provides high-fidelity results that last.
            </p>
          </div>
        </div>
      </section>

      {/* Printing Methods Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase tracking-tight text-lime-400 text-center">Decoration Technologies</h2>
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {printingMethods.map((method) => (
              <div key={method.name} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{method.name}</h3>
                <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                  {method.description}
                </p>

                <div className="mt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Advantages</h4>
                  <ul className="mt-4 space-y-2">
                    {method.advantages.map(adv => (
                      <li key={adv} className="flex items-center text-xs font-bold text-neutral-300">
                        <span className="mr-2 h-1 w-1 rounded-full bg-lime-400"></span>
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Best For</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {method.bestFor.map(item => (
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
          <h2 className="text-center text-3xl font-black uppercase tracking-tight text-white">Printing Comparison Matrix</h2>
          <div className="mt-12 overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400">Method</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400">Durability</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400">Design Freedom</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-lime-400">Best Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {printingMethods.map((method) => (
                  <tr key={method.name}>
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{method.name}</td>
                    <td className="px-6 py-4 text-neutral-400">{method.durability}</td>
                    <td className="px-6 py-4 text-neutral-400">{method.designFreedom}</td>
                    <td className="px-6 py-4 text-xs text-neutral-500">{method.bestFor[0]} & more</td>
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
          <h2 className="text-3xl font-black uppercase tracking-tight text-lime-400">Printing Selection FAQ</h2>
          <div className="mt-12 space-y-12">
            {faqs.map(faq => (
              <div key={faq.question} className="group">
                <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors">{faq.question}</h3>
                <p className="mt-4 text-lg leading-relaxed text-neutral-400">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 rounded-3xl bg-lime-400 p-10 text-center text-black md:p-20">
            <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Bring Your Design to Life</h2>
            <p className="mt-6 text-xl font-bold">Not sure which method is right for your team? Our production experts can guide you based on your design and budget.</p>
            <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <PrimaryButton className="bg-black text-white hover:bg-neutral-800">Start Custom Order</PrimaryButton>
              <Link href="/free-mockup/" className="flex h-[60px] items-center justify-center rounded-full border-2 border-black px-10 text-base font-black uppercase hover:bg-black hover:text-white transition-colors">Request Free Mockup</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
