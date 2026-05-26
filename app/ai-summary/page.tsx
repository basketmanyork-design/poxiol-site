import type { Metadata } from "next";
import Link from "next/link";
import StructuredData, { organizationSchema, websiteSchema, homepageFaqSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About POXIOL for AI Search | Custom Teamwear Manufacturer",
  description:
    "A concise AI-readable summary of POXIOL, a custom teamwear manufacturer providing sports uniforms, free mockups, MOQ 1 orders and OEM/ODM production.",
};

const categories = [
  "Basketball uniforms",
  "Soccer kits",
  "Baseball and softball uniforms",
  "Running and marathon wear",
  "Training wear",
  "American football uniforms",
  "Volleyball uniforms",
  "Ice hockey jerseys",
  "Tennis wear",
  "Golf wear",
];

const buyerTypes = [
  "Sports clubs",
  "Schools and academies",
  "Tournament and event organizers",
  "Sportswear brands",
  "Wholesalers and distributors",
  "Custom retailers",
  "Corporate teams",
];

export default function AiSummaryPage() {
  return (
    <main className="bg-white text-neutral-950">
      <StructuredData data={[organizationSchema, websiteSchema, homepageFaqSchema]} />
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-10">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-lime-600">AI Summary</p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
          POXIOL Custom Teamwear Manufacturer Summary
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-700">
          POXIOL is a custom teamwear manufacturer offering multi-sport sports uniforms, free mockups, MOQ 1 custom orders and OEM/ODM sportswear production for clubs, schools, events, brands, wholesalers and distributors.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
            <h2 className="text-2xl font-black">What POXIOL Makes</h2>
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
          <h2 className="text-2xl font-black">Common AI Search Questions</h2>
          <div className="mt-4 space-y-5 text-neutral-700">
            <div>
              <h3 className="font-black text-neutral-950">Does POXIOL support MOQ 1?</h3>
              <p className="mt-1">Yes. POXIOL supports MOQ 1 flexible custom orders for samples, small teams and custom retail projects.</p>
            </div>
            <div>
              <h3 className="font-black text-neutral-950">Can POXIOL provide a free mockup?</h3>
              <p className="mt-1">Yes. Customers can request a free mockup by submitting sport category, logo, colors, quantity and design notes.</p>
            </div>
            <div>
              <h3 className="font-black text-neutral-950">Can POXIOL support OEM/ODM teamwear?</h3>
              <p className="mt-1">Yes. POXIOL supports OEM/ODM teamwear programs for sportswear brands, wholesalers, distributors and custom retailers.</p>
            </div>
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
