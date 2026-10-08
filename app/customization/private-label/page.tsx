import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { getApprovedClaimWording } from "@/lib/governance/claims";
import { contextualInquiryHref } from "@/lib/inquiry-context";

export const metadata: Metadata = {
  title: "Private Label Teamwear Manufacturing | POXIOL OEM",
  description: "Review label, hangtag, care-information, and packaging requirements for private-label custom teamwear projects.",
  alternates: { canonical: "https://www.poxiol.com/customization/private-label/" },
};

export default function PrivateLabelPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="OEM Support" title="Private Label Requirements" subtitle={getApprovedClaimWording("private-label-review")} dark center level="h1" />
          
          <div className="mt-20 grid gap-8 text-left md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-xl font-black uppercase text-[#B6FF00]">Label Requirements</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Share the brand artwork, size information, label position, and preferred label format for project review.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-xl font-black uppercase text-[#B6FF00]">Care Information</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Provide the required care, composition, country, and language information so the applicable presentation can be checked.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-xl font-black uppercase text-[#B6FF00]">Hangtag and Packaging Inputs</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">Share hangtag, barcode, brand-story, and packaging specifications for confirmation before production.</p>
            </div>
          </div>

          <div className="mt-24">
            <PrimaryButton
              href={contextualInquiryHref('/get-quote/', {
                product: 'Private Label Teamwear',
                source: '/customization/private-label/',
              })}
              analyticsLocation="hero"
            >Request a Private Label Quote</PrimaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
