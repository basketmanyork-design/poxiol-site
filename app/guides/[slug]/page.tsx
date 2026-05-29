import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { buyingGuides, getGuideBySlug } from "@/lib/guides";
import StructuredData from "@/components/seo/StructuredData";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return buyingGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) return { title: "Guide Not Found" };

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": guide.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.h1,
    "description": guide.metaDescription,
    "author": {
      "@type": "Organization",
      "name": "POXIOL"
    },
    "publisher": {
      "@type": "Organization",
      "name": "POXIOL"
    }
  };

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[articleSchema, faqSchema]} />
      <Header />
      
      <article className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <Link 
            href="/guides/"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-lime-400"
          >
            <span className="mr-2">←</span> Back to Guides
          </Link>
          
          <header className="mt-10">
            <div className="text-xs font-black uppercase tracking-widest text-lime-400">
              {guide.eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              {guide.h1}
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-neutral-400">
              {guide.intro}
            </p>
          </header>

          <div className="mt-20 space-y-16">
            {guide.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  {section.title}
                </h2>
                <div className="mt-6 prose prose-invert prose-lime max-w-none text-lg leading-relaxed text-neutral-400">
                  <p>{section.content}</p>
                </div>
              </section>
            ))}

            <section className="rounded-3xl border border-white/10 bg-white/5 p-10">
              <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400">Frequently Asked Questions</h2>
              <div className="mt-10 space-y-8">
                {guide.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                    <p className="mt-4 text-neutral-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <footer className="mt-20 border-t border-white/10 pt-20 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Need a Custom Team Quote?</h2>
            <p className="mt-6 text-neutral-400">Our team is ready to help you with sizes, designs, and production timelines.</p>
            <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <PrimaryButton>Start Your Project</PrimaryButton>
              <Link 
                href="/free-mockup/"
                className="flex h-[60px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-base font-black uppercase transition hover:bg-white/10"
              >
                Request Free Mockup
              </Link>
            </div>
          </footer>
        </div>
      </article>

      <Footer />
    </main>
  );
}
