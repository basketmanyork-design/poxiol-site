import type { Metadata } from "next";
import { Header, Footer, SectionHeading } from "@/components/ui";
import StructuredData, { homepageFaqSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Custom Teamwear FAQ | POXIOL",
  description: "Find answers to common questions about custom teamwear manufacturing, MOQ, production times, printing methods and sportswear fabrics at POXIOL.",
};

const faqs = [
  {
    category: "General Teamwear",
    items: [
      {
        question: "What is your MOQ for custom teamwear?",
        answer: "POXIOL supports flexible MOQ from 1 piece for sample orders. We want to make it easy for teams and brands to test our quality and start their projects.",
      },
      {
        question: "How long does production take?",
        answer: "Sample production usually takes 5-7 days. Bulk production typically takes 10-20 days depending on the project complexity and quantity.",
      },
      {
        question: "Can I get a free mockup before ordering?",
        answer: "Yes, we offer free mockup design support. You can submit your logo, colors and sport type to request a professional design from our team.",
      },
    ],
  },
  {
    category: "Manufacturing & OEM",
    items: [
      {
        question: "Do you support OEM and ODM manufacturing?",
        answer: "Yes. POXIOL provides full OEM and ODM sportswear manufacturing services. We can develop products based on your specific tech packs or help you design from scratch.",
      },
      {
        question: "Where is your factory located?",
        answer: "Our main production hub is located in Shishi, Fujian, China, a global center for high-performance apparel manufacturing.",
      },
      {
        question: "What is your monthly production capacity?",
        answer: "We have a monthly capacity of over 30,000 sets, allowing us to support both small team orders and large-scale brand production.",
      },
    ],
  },
  {
    category: "Printing & Design",
    items: [
      {
        question: "What printing methods do you offer?",
        answer: "POXIOL specializes in full sublimation printing, which offers unlimited design possibilities and permanent color. We also offer screen printing, embroidery, and heat transfer printing.",
      },
      {
        question: "What logo formats do you accept?",
        answer: "We prefer vector files such as .AI, .EPS, or .PDF. We can also work with high-resolution .PNG or .JPG files if vector formats are not available.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[homepageFaqSchema]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading 
            eyebrow="FAQ Center" 
            title="Frequently Asked Questions" 
            subtitle="Find answers to common questions about our custom teamwear manufacturing process, design support, and ordering."
            dark
            center
          />
          
          <div className="mt-20 space-y-16">
            {faqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400 border-b border-white/10 pb-4">{category.category}</h2>
                <div className="mt-8 space-y-8">
                  {category.items.map((item) => (
                    <div key={item.question} className="group">
                      <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors">{item.question}</h3>
                      <p className="mt-4 text-lg leading-relaxed text-neutral-400">
                        {item.answer}
                      </p>
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
