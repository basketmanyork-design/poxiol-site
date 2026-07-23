import type { Metadata } from "next";
import { Header, Footer, SectionHeading } from "@/components/ui";
import StructuredData, { fullFaqPageSchema } from "@/components/seo/StructuredData";
import { getFaqGroups } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Custom Teamwear FAQ | POXIOL",
  description: "Find answers to common questions about custom teamwear manufacturing, MOQ, production times, printing methods and sportswear fabrics at POXIOL.",
};

export default async function FAQPage() {
  const faqGroups = await getFaqGroups();
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[fullFaqPageSchema]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="FAQ Center" title="Frequently Asked Questions" subtitle="FAQ categories and answers are managed in Sanity CMS with legacy fallback." dark center />
          <div className="mt-20 space-y-16">
            {faqGroups.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400 border-b border-white/10 pb-4">{category.category}</h2>
                <div className="mt-8 space-y-8">
                  {category.items.map((item) => (
                    <div key={item.question} className="group">
                      <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors">{item.question}</h3>
                      <p className="mt-4 text-lg leading-relaxed text-neutral-400">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
