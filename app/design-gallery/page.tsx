import type { Metadata } from "next";
import { Header, Footer, SectionHeading, SecondaryButton, freeMockupHref } from "@/components/ui";
import { featuredDesigns } from "@/lib/home-data";

export const metadata: Metadata = {
  title: "Custom Teamwear Design Gallery | POXIOL Inspiration",
  description: "Explore our collection of custom basketball uniforms, soccer kits, and training wear designs. Get inspiration for your team's next look with POXIOL.",
};

export default function DesignGalleryPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Gallery" title="Custom Teamwear Design Inspiration" subtitle="Professional sublimation design concepts developed by the POXIOL creative team." dark center />
          
          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDesigns.map(design => (
              <div key={design.title} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 aspect-square">
                <img src={design.image} alt={design.title} className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B6FF00]">{design.sport}</span>
                  <h3 className="mt-3 text-2xl font-black uppercase italic leading-none">{design.title}</h3>
                  <p className="mt-4 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition duration-300">{design.description}</p>
                  <SecondaryButton href={`/free-mockup/?style=${design.title.toLowerCase().replace(/\s+/g, '-')}`} className="mt-6 opacity-0 group-hover:opacity-100 transition h-12 text-xs">Request This Look</SecondaryButton>
                </div>
              </div>
            ))}
          </div>
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
