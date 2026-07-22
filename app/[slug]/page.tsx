import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { pseoPages, getPSEOPageBySlug } from "@/lib/pseo";
import StructuredData from "@/components/seo/StructuredData";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return pseoPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPSEOPageBySlug(slug);

  if (!page) return { title: "Page Not Found" };

  return {
    title: page.title,
    description: page.intro,
  };
}

export default async function PSEOPage({ params }: Props) {
  const { slug } = await params;
  const page = getPSEOPageBySlug(slug);

  if (!page) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const articleSchema = page.author ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.title,
    "description": page.intro,
    "author": {
      "@type": "Person",
      "name": page.author.name,
      "jobTitle": page.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "POXIOL",
      "logo": "https://www.poxiol.com/logo.png"
    }
  } : null;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={articleSchema ? [faqSchema, articleSchema] : faqSchema} />
      <Header />


      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Specialized Teamwear Solutions"
            title={page.h1}
            subtitle={page.intro}
            dark
            center
          />

          <div className="mt-20 space-y-12">
            <div className="prose prose-invert prose-lime max-w-none text-lg leading-relaxed text-neutral-400">
              <p>{page.content}</p>
            </div>

            {page.author && (
              <div className="flex flex-col items-start space-y-4 rounded-3xl border border-lime-400/20 bg-lime-400/5 p-8 md:flex-row md:items-center md:space-x-8 md:space-y-0">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-lime-400 text-3xl font-black text-black">
                  {page.author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-lime-400">Written By Expert</p>
                  <h3 className="mt-1 text-2xl font-black text-white">{page.author.name}</h3>
                  <p className="text-sm font-bold text-neutral-400">{page.author.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{page.author.bio}</p>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

              <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400">Frequently Asked Questions</h2>
              <div className="mt-10 space-y-8">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                    <p className="mt-4 text-neutral-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 pt-10">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">Ready to Start Your Project?</h2>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <PrimaryButton>Contact Our Experts</PrimaryButton>
                <Link
                  href="/free-mockup/"
                  className="flex h-[60px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-base font-black uppercase transition hover:bg-white/10"
                >
                  Request Free Mockup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
