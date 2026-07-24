import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/StructuredData";
import { getArticles } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Teamwear Knowledge Center | Sportswear Buying Guides | POXIOL",
  description: "Explore POXIOL resources including buying guides, fabric knowledge, and manufacturing insights.",
};

export default async function ResourcesPage() {
  const resources = await getArticles("resource");
  const guides = await getArticles("guide");
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Knowledge Center" title="Teamwear Knowledge & Buying Guides" subtitle="Our resources and guides are regularly updated with practical manufacturing insights." dark center />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[{ title: "Manufacturing Hub", href: "/manufacturing/", desc: "OEM & ODM production processes." }, { title: "Projects Gallery", href: "/projects/", desc: "Explore success stories." }, { title: "FAQ Center", href: "/faq/", desc: "Get answers to common questions." }].map((item) => (
              <Link key={item.title} href={item.href} className="group flex flex-col items-center rounded-3xl border border-lime-400/20 bg-lime-400/5 p-8 text-center transition hover:bg-lime-400/10">
                <h3 className="text-xl font-black uppercase text-lime-400">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
                <span className="mt-4 text-xs font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-lime-400/50">Explore Hub â†?/span>
              </Link>
            ))}
          </div>
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...resources, ...guides].map((article) => (
              <Link key={`${article.articleType}-${article.slug}`} href={`/${article.articleType === "resource" ? "resources" : "guides"}/${article.slug}/`} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10">
                <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400">{article.title}</h2>
                <p className="mt-4 text-sm text-neutral-400 line-clamp-3">{article.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
