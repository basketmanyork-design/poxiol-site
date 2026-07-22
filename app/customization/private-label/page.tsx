import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, freeMockupHref } from "@/components/ui";

export const metadata: Metadata = {
  title: "Private Label Teamwear Manufacturing | POXIOL OEM",
  description: "Start your own sportswear brand with POXIOL's private label services. Custom neck labels, hangtags, and premium branding for OEM apparel.",
};

export default function PrivateLabelPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="OEM Support" title="Private Label Solutions" subtitle="Everything you need to launch and scale your own sportswear collection." dark center />

          <div className="mt-20 space-y-16 text-left">
            <div className="grid gap-12 md:grid-cols-2 items-center">
               <div>
                  <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Woven Neck Labels</h3>
                  <p className="mt-4 text-neutral-400 leading-relaxed">Add high-quality woven labels with your brand logo and size information. Professional finish for retail-ready apparel.</p>
               </div>
               <div className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/20 uppercase tracking-widest italic">Label Visual</div>
            </div>

            <div className="grid gap-12 md:grid-cols-2 items-center">
               <div className="md:order-2">
                  <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Heat-Transfer Tags</h3>
                  <p className="mt-4 text-neutral-400 leading-relaxed">Clean, tag-less experience for athletes. Printed branding and care instructions directly on the inner neck area.</p>
               </div>
               <div className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/20 uppercase tracking-widest italic md:order-1">Tag Visual</div>
            </div>

            <div className="grid gap-12 md:grid-cols-2 items-center">
               <div>
                  <h3 className="text-2xl font-black uppercase text-[#B6FF00]">Custom Hangtags</h3>
                  <p className="mt-4 text-neutral-400 leading-relaxed">Full-color cardboard hangtags with your brand story, barcodes, and website details.</p>
               </div>
               <div className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/20 uppercase tracking-widest italic">Hangtag Visual</div>
            </div>
          </div>

          <div className="mt-24">
            <PrimaryButton href="/contact/">Enquire About Private Label</PrimaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
