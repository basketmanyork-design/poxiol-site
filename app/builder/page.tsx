import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "3D Teamwear Builder | Design Your Custom Uniform Online | POXIOL",
  description: "Experience the POXIOL 3D Teamwear Builder. Design your custom basketball, soccer, and baseball uniforms in real-time. Choose colors, add logos, and customize rosters.",
};

export default function BuilderPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-neutral-950 px-5 text-center">
        {/* Animated Background Placeholder */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 blur-[120px]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Phase 3 Evolution"
            title="Interactive 3D Teamwear Builder"
            subtitle="The future of custom sportswear design is almost here. Our high-fidelity 3D customization engine is currently in final testing."
            dark
            center
          />

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-xl">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Upcoming Features</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-3xl">馃帹</div>
                <h3 className="mt-4 font-black uppercase tracking-widest text-lime-400">Real-time Color</h3>
                <p className="mt-2 text-sm text-neutral-400">Instant color changes on high-poly models.</p>
              </div>
              <div>
                <div className="text-3xl">馃搻</div>
                <h3 className="mt-4 font-black uppercase tracking-widest text-lime-400">Logo Placement</h3>
                <p className="mt-2 text-sm text-neutral-400">Drag and drop your sponsor and team logos.</p>
              </div>
              <div>
                <div className="text-3xl">鈽侊笍</div>
                <h3 className="mt-4 font-black uppercase tracking-widest text-lime-400">Cloud Roster</h3>
                <p className="mt-2 text-sm text-neutral-400">Manage names and sizes directly in the builder.</p>
              </div>
            </div>

            <div className="mt-16 border-t border-white/10 pt-10">
              <p className="text-lg font-bold text-white">Want to be the first to test it?</p>
              <div className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <PrimaryButton>Join Beta Waitlist</PrimaryButton>
                <div className="text-sm font-bold uppercase tracking-widest text-neutral-500">Launching Summer 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
