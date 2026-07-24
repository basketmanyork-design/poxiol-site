import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import { getArticles } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Teamwear Buying Guides | Expert Custom Sportswear Advice | POXIOL",
  description: "Explore our library of professional teamwear buying guides and manufacturing advice.",
};

export default async function GuidesPage() {
  const guides = await getArticles("guide");
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Knowledge Base" title="Professional Buying Guides" subtitle="Explore our comprehensive teamwear manufacturing and buying guides to help you make informed decisions." dark center />
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}/`} className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-lime-400">{guide.eyebrow}</div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white transition group-hover:text-lime-400">{guide.title}</h2>
                <p className="mt-4 line-clamp-2 text-sm text-neutral-400 leading-relaxed">{guide.intro}</p>
                <div className="mt-8 flex items-center text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white">Read Guide <span className="ml-2 transition-transform group-hover:translate-x-1">â†?/span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
