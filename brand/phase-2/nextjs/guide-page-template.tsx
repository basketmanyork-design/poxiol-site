import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Guide Page Title | POXIOL",
  description: "Guide page meta description.",
};

export default function GuidePage() {
  return (
    <main>
      <Header />
      <article className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-lime-600">
            POXIOL Guide
          </p>
          <h1 className="text-5xl font-black leading-[1.02] text-neutral-950 md:text-6xl">
            Guide Page Title
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Intro paragraph goes here.
          </p>

          <section className="prose prose-neutral mt-12 max-w-none">
            {/* Convert markdown sections into semantic HTML here. */}
          </section>

          <div className="mt-14 rounded-[2rem] bg-neutral-950 p-8 text-white md:p-10">
            <h2 className="text-3xl font-black">Ready to Start Your Custom Teamwear Project?</h2>
            <p className="mt-4 text-neutral-300">
              Send your sport, logo, colors and quantity. POXIOL will review your request and help you start with a free mockup.
            </p>
            <Link href="/free-mockup/" className="mt-6 inline-flex h-[52px] items-center justify-center rounded-full bg-lime-400 px-7 text-sm font-black uppercase text-neutral-950 transition hover:bg-white">
              Get Free Mockup
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
