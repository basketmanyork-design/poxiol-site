import type { Metadata } from "next";
import { Header, Footer, SectionHeading } from "@/components/ui";
import StructuredData, { generateFaqSchema } from "@/components/seo/StructuredData";
import { b2bFaqData } from "@/lib/b2b-faq";

export const metadata: Metadata = {
  title: "B2B Teamwear Sourcing FAQ | Technical Manufacturing Advice | POXIOL",
  description: "Expert answers for sports brands, distributors and team managers. Learn about factory verification, fabric GSM, size tolerances, and private label teamwear manufacturing.",
};

export default function B2BSourcingFAQPage() {
  const allFaqItems = b2bFaqData.flatMap(cat => cat.items);
  const faqSchema = generateFaqSchema(allFaqItems);

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={faqSchema} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading 
            eyebrow="For Professionals" 
            title="B2B Sourcing & Manufacturing FAQ" 
            subtitle="Deep technical insights and procurement advice for sports organizations, brand owners, and sportswear distributors."
            dark
            center
          />
          
          <div className="mt-20 space-y-20">
            {b2bFaqData.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400 border-b border-white/10 pb-4">
                  {category.category}
                </h2>
                <div className="mt-10 space-y-12">
                  {category.items.map((item) => (
                    <div key={item.question} className="group border-l-2 border-white/5 pl-8 transition-colors hover:border-lime-400">
                      <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors leading-tight">
                        {item.question}
                      </h3>
                      <div className="mt-5 text-lg leading-relaxed text-neutral-400 max-w-3xl">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Ready to Discuss Your Bulk Order?</h2>
          <p className="mt-6 text-xl text-neutral-400">
            Get direct factory pricing and technical support for your sports brand or large-scale team project.
          </p>
          <div className="mt-10">
            <a 
              href="/get-quote/"
              className="inline-flex h-[70px] items-center justify-center rounded-full bg-lime-400 px-12 text-lg font-black uppercase text-black transition hover:bg-white"
            >
              Get Professional Quote
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
