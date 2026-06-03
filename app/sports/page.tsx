"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import { sportsPages } from "@/lib/sports-pages";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/StructuredData";

export default function SportsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema]} />
      <Header />
      
      <section className="px-5 py-24 md:px-10 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Sport Categories" 
            title="Professional Custom Teamwear for Every Sport" 
            subtitle="We manufacture high-performance uniforms for professional clubs, academies, schools, and sportswear brands worldwide."
            dark
            center
          />

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sportsPages.map((sport) => (
              <Link 
                key={sport.slug} 
                href={`/${sport.slug}/`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-lime-400/30"
              >
                <div className="aspect-video w-full overflow-hidden bg-neutral-900">
                  <img 
                    src={sport.heroImage} 
                    alt={sport.h1} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x450/0a0a0a/ffffff?text=${sport.slug.replace(/-/g, '+').toUpperCase()}`;
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <h3 className="text-2xl font-black text-white group-hover:text-lime-400">{sport.h1.replace(" Manufacturer", "")}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-400">
                    {sport.metaDescription}
                  </p>
                  <div className="mt-8 flex items-center text-xs font-black uppercase tracking-widest text-lime-400">
                    View Custom Options <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lime-400 px-5 py-20 text-black md:px-10 xl:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-black uppercase md:text-5xl">Can't find your sport?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-bold">
            We support OEM/ODM production for all team sports, including Hockey, Tennis, Golf, and custom training gear.
          </p>
          <div className="mt-10">
            <Link 
              href="/contact/" 
              className="inline-block rounded-full bg-black px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:scale-105"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
