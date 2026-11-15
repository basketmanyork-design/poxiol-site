import { Header, Footer, SectionHeading, SecondaryButton, freeMockupHref } from "@/components/ui";
import {QualifiedExplanationNotice} from '@/components/evidence/QualifiedExplanationNotice';
import { featuredDesigns } from "@/lib/home-data";
import {publicSectionDecision} from '@/lib/release/publication-policy';
import { createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA } from "@/lib/seo/page-metadata";
import RouteBreadcrumbs from "@/components/seo/RouteBreadcrumbs";
import {FAQSchema} from "@/components/seo/GEOStructuredData";

export const metadata = createPageMetadata({
  title: "Custom Teamwear Design Gallery | POXIOL Inspiration",
  description: "Explore our collection of custom basketball uniforms, soccer kits, and training wear designs. Get inspiration for your team's next look with POXIOL.",
  canonical: "/design-gallery/",
  metadata: { twitter: PRESERVED_ROOT_TWITTER_METADATA },
});

export default function DesignGalleryPage() {
  const planningDecision = publicSectionDecision('design-planning');

  return (
    <main className="bg-[#0A0A0A] text-white">
      <RouteBreadcrumbs trail={[{name: 'Design Gallery', path: '/design-gallery/'}]} />
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
      <section className="bg-white px-5 py-20 text-neutral-950 md:px-10 xl:px-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">Design questions</h2>
          <div className="mt-10 space-y-8">
          <div key="Can a gallery design be ch"><h3 className="text-lg font-black">Can a gallery design be changed before production?</h3><p className="mt-2 leading-7 text-neutral-600">Yes. The gallery is a set of directions, not a fixed catalogue. Colour, panel layout, trim and lettering are all reviewed against your own brief before a mockup is produced.</p></div>
          <div key="Can colours be matched to "><h3 className="text-lg font-black">Can colours be matched to an existing club kit?</h3><p className="mt-2 leading-7 text-neutral-600">Colour references are taken from what you supply, such as a garment, a Pantone reference or a previous order. Digital mockups are a planning view; the physical result is reviewed on the sample.</p></div>
          <div key="Is every design in the gal"><h3 className="text-lg font-black">Is every design in the gallery an original POXIOL concept?</h3><p className="mt-2 leading-7 text-neutral-600">The gallery shows original concepts and colour treatments. Existing club identities are only used where the buyer supplies and authorises the marks.</p></div>
          <div key="What happens if the design"><h3 className="text-lg font-black">What happens if the design needs a different construction?</h3><p className="mt-2 leading-7 text-neutral-600">Construction is reviewed with the design. If a look depends on a seam, panel or fabric that the chosen garment cannot support, that is raised before sampling rather than after.</p></div>
          </div>
        </div>
      </section>
      <FAQSchema faqs={[
    {question: "Can a gallery design be changed before production?", answer: "Yes. The gallery is a set of directions, not a fixed catalogue. Colour, panel layout, trim and lettering are all reviewed against your own brief before a mockup is produced."},
    {question: "Can colours be matched to an existing club kit?", answer: "Colour references are taken from what you supply, such as a garment, a Pantone reference or a previous order. Digital mockups are a planning view; the physical result is reviewed on the sample."},
    {question: "Is every design in the gallery an original POXIOL concept?", answer: "The gallery shows original concepts and colour treatments. Existing club identities are only used where the buyer supplies and authorises the marks."},
    {question: "What happens if the design needs a different construction?", answer: "Construction is reviewed with the design. If a look depends on a seam, panel or fabric that the chosen garment cannot support, that is raised before sampling rather than after."},
  ]} />
      <Footer />
    </main>
  );
}
