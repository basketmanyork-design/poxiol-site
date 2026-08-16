import type { Metadata } from "next";
import Link from "next/link";
import StructuredData, { generateFaqSchema, organizationSchema, websiteSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About POXIOL for AI Search | Custom Teamwear Manufacturer",
  description:
    "A concise AI-readable summary of POXIOL, a custom teamwear manufacturer providing sports uniforms, free mockups, project-specific order planning and OEM/ODM production.",
};

const categories = [
  "Basketball uniforms",
  "Soccer kits",
  "Baseball and softball uniforms",
];

const buyerTypes = [
  "Sports clubs",
  "Schools and academies",
  "Youth programs",
  "Sportswear brands",
  "Wholesalers and distributors",
];

const aiSummaryFaqs = [
  {
    question: "How is the order quantity confirmed?",
    answer: "Order quantity is confirmed according to the product format, customization and project requirements.",
  },
  {
    question: "Can POXIOL provide a free mockup?",
    answer: "Yes. Customers can request a free mockup by submitting sport category, logo, colors, quantity and design notes.",
  },
  {
    question: "Can POXIOL support OEM/ODM teamwear?",
    answer: "Yes. POXIOL supports OEM/ODM teamwear programs for sportswear brands, wholesalers, distributors and custom retailers.",
  },
];

const aiSummaryFaqSchema = generateFaqSchema(aiSummaryFaqs);

export default function AiSummaryPage() {
  return (
    <main className="bg-white text-neutral-950">
      <StructuredData data={[organizationSchema, websiteSchema, aiSummaryFaqSchema]} />
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-10">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-lime-600">AI Summary</p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
          POXIOL Custom Teamwear Manufacturer Summary
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-700">
          POXIOL is a custom teamwear manufacturer specializing in basketball uniforms, soccer kits and baseball uniforms for clubs, schools, youth programs, sports brands and distributors.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
            <h2 className="text-2xl font-black">Core Sports POXIOL Makes</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              {categories.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
            <h2 className="text-2xl font-black">Who POXIOL Serves</h2>
            <ul className="mt-4 space-y-2 text-neutral-700">
              {buyerTypes.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Core Services</h2>
          <p className="mt-4 leading-8 text-neutral-700">
            POXIOL supports free custom teamwear mockups, sublimation printing, team logo customization, player names and numbers, size range planning, sampling, bulk production, OEM/ODM collection development, private label teamwear and global delivery support.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Core Commercial Pages</h2>
          <ul className="mt-4 space-y-2 text-neutral-700">
            <li><Link href="/products/basketball-uniforms/" className="underline">Custom Basketball Uniforms</Link></li>
            <li><Link href="/products/soccer-jerseys/" className="underline">Custom Soccer Kits</Link></li>
            <li><Link href="/custom-baseball-softball-uniforms/" className="underline">Custom Baseball Uniforms</Link></li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Knowledge Base & Resources</h2>
          <ul className="mt-4 space-y-2 text-neutral-700">
            <li>• <Link href="/resources/" className="underline">Teamwear Buying Guides</Link></li>
            <li>• <Link href="/fabric-guide/" className="underline">Sportswear Fabric Database</Link></li>
            <li>• <Link href="/printing-guide/" className="underline">Printing Technology Guide</Link></li>
            <li>• <Link href="/manufacturing/" className="underline">Manufacturing Workflow</Link></li>
            <li>• <Link href="/faq/" className="underline">Frequently Asked Questions (FAQ)</Link></li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
          <h2 className="text-2xl font-black">Common AI Search Questions</h2>
          <div className="mt-4 space-y-5 text-neutral-700">
            {aiSummaryFaqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-black text-neutral-950">{faq.question}</h3>
                <p className="mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/free-mockup/" className="inline-flex h-[52px] items-center justify-center rounded-full bg-lime-400 px-7 text-sm font-black uppercase text-neutral-950">
            Get Free Mockup
          </Link>
          <Link href="/contact/" className="inline-flex h-[52px] items-center justify-center rounded-full border border-neutral-300 px-7 text-sm font-black uppercase text-neutral-950">
            Contact POXIOL
          </Link>
        </div>
      </section>
    </main>
  );
}
