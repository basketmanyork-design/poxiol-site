import type {Metadata} from 'next'
import Link from 'next/link'
import {Header, Footer, SectionHeading, PrimaryButton} from '@/components/ui'
import {getArticles} from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'POXIOL Blog | Teamwear SEO Articles',
  description: 'Teamwear sourcing articles, manufacturing notes and buyer education from POXIOL.',
  alternates: { canonical: "/blog/" },
}

export default async function BlogPage() {
  const posts = await getArticles('blog')
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading level="h1" eyebrow="Blog" title="Teamwear SEO Articles" subtitle="Sourcing notes, manufacturing insights and buyer education for custom teamwear programs." dark center />
          {posts.length ? (
            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}/`} className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30">
                  <div className="text-[10px] font-black uppercase tracking-widest text-lime-400">{post.eyebrow}</div>
                  <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white transition group-hover:text-lime-400">{post.title}</h2>
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-neutral-400">{post.intro}</p>
                  <div className="mt-8 flex items-center text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white">Read article <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">-&gt;</span></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-16 max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Blog articles are being prepared</h2>
              <p className="mt-4 text-neutral-400">For current sourcing guidance, explore POXIOL buying guides and resource pages.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <PrimaryButton href="/guides/">View Guides</PrimaryButton>
                <PrimaryButton href="/resources/">View Resources</PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}