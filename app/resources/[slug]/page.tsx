import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { resourcePages, getResourceBySlug } from "@/lib/resources-data";
import { ArticleSchema } from "@/components/seo/GEOStructuredData";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return resourcePages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getResourceBySlug(slug);

  if (!page) return { title: "Resource Not Found" };

  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const page = getResourceBySlug(slug);

  if (!page) notFound();

  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/resources/${page.slug}/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ArticleSchema 
        headline={page.h1} 
        description={page.metaDescription} 
        url={fullUrl} 
      />
      <Header />
      
      {/* Article Header */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="mx-auto max-w-4xl text-center">
           <p className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00]">B2B Resource Guide</p>
           <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl">{page.h1}</h1>
           <p className="mt-10 text-xl text-neutral-300 leading-relaxed font-medium">{page.intro}</p>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-16">
            {page.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-950 mb-6">{section.title}</h2>
                {Array.isArray(section.content) ? (
                  <ul className="space-y-4">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-lg text-neutral-600 leading-relaxed">
                        <span className="text-lime-600 font-bold mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg text-neutral-600 leading-relaxed">{section.content}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-24 rounded-[3rem] border border-neutral-200 bg-neutral-50 p-10 text-center">
             <h3 className="text-2xl font-black uppercase mb-4">Need Expert Sourcing Advice?</h3>
             <p className="text-neutral-600 mb-10 leading-relaxed">Our production team can help you select the right fabric, sizes, and customization methods for your specific teamwear project.</p>
             <PrimaryButton href="/free-mockup/">Connect with POXIOL Experts</PrimaryButton>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-neutral-950 px-5 py-24 md:px-10 text-center">
        <div className="mx-auto max-w-7xl">
           <h2 className="text-3xl font-black uppercase md:text-5xl mb-6">Ready to Start?</h2>
           <p className="text-neutral-400 text-lg mb-10">{page.ctaText}</p>
           <PrimaryButton href="/free-mockup/">Request Free Mockup</PrimaryButton>
        </div>
      </section>

      <Footer />
    </main>
  );
}
