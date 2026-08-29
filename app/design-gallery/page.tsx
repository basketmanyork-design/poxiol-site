import type { Metadata } from "next";
import { Header, Footer, SectionHeading, SecondaryButton, freeMockupHref } from "@/components/ui";
import {QualifiedExplanationNotice} from '@/components/evidence/QualifiedExplanationNotice';
import { featuredDesigns } from "@/lib/home-data";
import {publicSectionDecision} from '@/lib/release/publication-policy';

export const metadata: Metadata = {
  title: "Custom Teamwear Design Gallery | POXIOL Inspiration",
  description: "Explore our collection of custom basketball uniforms, soccer kits, and training wear designs. Get inspiration for your team's next look with POXIOL.",
  alternates: { canonical: "/design-gallery/" },
};

export default function DesignGalleryPage() {
  const planningDecision = publicSectionDecision('design-planning');

  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading level="h1" eyebrow="Gallery" title="Custom Teamwear Design Inspiration" subtitle="Professional sublimation design concepts developed by the POXIOL creative team." dark center />

          {planningDecision === 'QUALIFIED_EXPLANATION' ? (
            <div className="mx-auto mt-12 max-w-4xl">
              <QualifiedExplanationNotice />
            </div>
          ) : null}

          {planningDecision !== 'WITHHELD' ? <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDesigns.map(design => (
              <article key={design.title} className="border-t border-white/15 py-8">
                <div className="p-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B6FF00]">{design.sport}</span>
                  <h3 className="mt-3 text-2xl font-black uppercase italic leading-none">{design.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-neutral-400">{design.description}</p>
                  <SecondaryButton href={design.href} className="mt-6 h-12 w-full text-xs">Share Your Design Brief</SecondaryButton>
                </div>
              </article>
            ))}
          </div> : null}
        </div>
      </section>

      <section className="bg-neutral-900 px-5 py-24 md:px-10 text-center border-y border-white/5">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Have A Unique Design Idea?</h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto">Upload your sketch or reference image, and our designers will turn it into a high-fidelity 3D mockup for you.</p>
        <div className="mt-10">
          <SecondaryButton href={freeMockupHref}>Customize Your Design</SecondaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
