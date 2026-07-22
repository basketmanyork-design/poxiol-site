import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import { getArticles } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "POXIOL Blog | Teamwear SEO Articles",
  description: "CMS-managed blog and SEO article hub for POXIOL custom teamwear.",
};

export default async function BlogPage() {
  const posts = await getArticles("blog");
  const fallbackGuides = posts.length ? posts : await getArticles("guide");
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Blog" title="Teamwear SEO Articles" subtitle="Blog articles are managed in Sanity. Until blog posts are published, relevant guide content is used as fallback." dark center />
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {fallbackGuides.map((post) => (
              <Link key={post.slug} href={`/${post.articleType === "blog" ? "blog" : "guides"}/${post.slug}/`} className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-lime-400">{post.eyebrow}</div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white transition group-hover:text-lime-400">{post.title}</h2>
                <p className="mt-4 line-clamp-2 text-sm text-neutral-400 leading-relaxed">{post.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
