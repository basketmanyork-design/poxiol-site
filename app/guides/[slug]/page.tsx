import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer, SectionHeading } from "@/components/ui";
import StructuredData, { generateFaqSchema } from "@/components/seo/StructuredData";
import { getGuideBySlug, guidePages } from "@/lib/guides-data";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return guidePages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getGuideBySlug(params.slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://www.poxiol.com/guides/${page.slug}/`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://www.poxiol.com/guides/${page.slug}/`,
      type: "article",
      publishedTime: page.publishedDate,
      modifiedTime: page.lastUpdated,
      authors: [page.author.name],
    },
  };
}

export default function GuideDetailPage({ params }: Props) {
  const page = getGuideBySlug(params.slug);
  if (!page) notFound();

  const faqSchema = generateFaqSchema(page.faqs);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.poxiol.com/" },
      { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://www.poxiol.com/guides/" },
      { "@type": "ListItem", "position": 3, "name": page.h1, "item": `https://www.poxiol.com/guides/${page.slug}/` }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.h1,
    "description": page.metaDescription,
    "author": {
      "@type": "Person",
      "name": page.author.name,
      "jobTitle": page.author.role,
      "affiliation": { "@type": "Organization", "name": page.author.brand }
    },
    "datePublished": page.publishedDate,
    "dateModified": page.lastUpdated,
    "publisher": {
      "@type": "Organization",
      "name": "POXIOL",
      "logo": { "@type": "ImageObject", "url": "https://www.poxiol.com/logo.png" }
    }
  };

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[articleSchema, faqSchema, breadcrumbSchema]} />
      <Header />
      
      <article className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-32">
        {/* Breadcrumbs */}
        <nav className="mb-10 text-xs font-bold uppercase tracking-widest text-neutral-500">
          <Link href="/" className="hover:text-lime-400">Home</Link>
          <span className="mx-3">/</span>
          <Link href="/guides/" className="hover:text-lime-400">Guides</Link>
          <span className="mx-3">/</span>
          <span className="text-white">{page.slug}</span>
        </nav>

        <SectionHeading 
          eyebrow="Expert Sourcing Guide" 
          title={page.h1} 
          subtitle={page.intro}
          dark
        />

        {/* E-E-A-T Meta */}
        <div className="mt-12 flex flex-wrap items-center gap-6 border-y border-white/10 py-6 text-sm text-neutral-400">
          <div>Written By: <span className="font-bold text-white">{page.author.name}</span></div>
          <div className="h-1 w-1 rounded-full bg-neutral-700" />
          <div>Published: <span className="text-neutral-300">{page.publishedDate}</span></div>
          <div className="h-1 w-1 rounded-full bg-neutral-700" />
          <div>Last Updated: <span className="text-neutral-300">{page.lastUpdated}</span></div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="space-y-16">
            {/* Key Takeaways */}
            <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 p-8">
              <h2 className="text-lg font-black uppercase tracking-tight text-lime-400">Key Takeaways</h2>
              <ul className="mt-6 space-y-4">
                {page.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex gap-4 text-neutral-300">
                    <span className="text-lime-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {page.sections.map((section) => (
              <section key={section.title} id={section.title.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-32">
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">{section.title}</h2>
                <div className="mt-6 text-lg leading-relaxed text-neutral-400">
                  {section.content}
                </div>

                {section.table && (
                  <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          {section.table.headers.map(h => (
                            <th key={h} className="px-6 py-4 font-black uppercase tracking-widest text-lime-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-neutral-300">
                        {section.table.rows.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-0">
                            {row.map((cell, j) => (
                              <td key={j} className="px-6 py-4">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.checklist && (
                  <div className="mt-8 space-y-4">
                    {section.checklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-400 text-[10px] font-black text-black">✓</div>
                        <span className="text-sm font-bold text-neutral-300">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Methodology */}
            <div className="border-t border-white/10 pt-12 text-sm italic text-neutral-500">
              <span className="font-bold text-neutral-400 uppercase tracking-widest block mb-2">Methodology</span>
              {page.methodology}
            </div>

            {/* FAQ Section */}
            <section className="border-t border-white/10 pt-16">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Frequently Asked Questions</h2>
              <div className="mt-8 space-y-6">
                {page.faqs.map(faq => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-bold text-lime-400">{faq.question}</h3>
                    <p className="mt-3 text-neutral-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <div className="sticky top-32 space-y-12">
              {/* Table of Contents */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">On this page</h3>
                <nav className="mt-6 flex flex-col gap-4">
                  {page.sections.map(s => (
                    <a 
                      key={s.title} 
                      href={`#${s.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm font-bold text-neutral-400 hover:text-lime-400"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Author Bio */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">About the Author</h3>
                <div className="mt-6">
                  <p className="text-sm font-black text-white">{page.author.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-lime-400">{page.author.role}</p>
                  <p className="mt-4 text-xs leading-relaxed text-neutral-400">{page.author.bio}</p>
                </div>
              </div>

              {/* Related Guides */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Related Guides</h3>
                <div className="mt-6 flex flex-col gap-4">
                  {page.relatedGuides.map(g => (
                    <Link 
                      key={g.slug} 
                      href={`/guides/${g.slug}/`}
                      className="text-sm font-bold text-white hover:text-lime-400 hover:underline"
                    >
                      {g.title} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-neutral-900 px-5 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">Ready to Start?</h2>
          <p className="mt-6 text-xl text-neutral-400">Get technical support and factory pricing for your team project.</p>
          <div className="mt-10">
            <Link 
              href={page.cta.href}
              className="inline-flex h-[70px] items-center justify-center rounded-full bg-lime-400 px-12 text-lg font-black uppercase text-black transition hover:bg-white"
            >
              {page.cta.text}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
