import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Certificates & Testing | POXIOL Custom Teamwear Quality Documents",
  description: "Review POXIOL custom teamwear quality documents, fabric testing options, inspection records and verified production evidence for B2B sportswear buyers.",
};

const documentCategories = [
  {
    title: "1. Company & Factory Documents",
    items: [
      { name: "Business Registration", status: "Confirmed" },
      { name: "Export License", status: "Confirmed" },
      { name: "Factory Capability Profile", status: "Confirmed" },
      { name: "Alibaba Verified Profile", status: "Available upon request" },
      { name: "Third-party Audit Report", status: "Pending upload" }
    ]
  },
  {
    title: "2. Fabric Testing Options",
    items: [
      { name: "Color Fastness Test", status: "Available upon request" },
      { name: "Shrinkage Test", status: "Available upon request" },
      { name: "Fabric GSM Confirmation", status: "Confirmed" },
      { name: "Breathability Rating", status: "Confirmed" },
      { name: "Moisture-Wicking Performance", status: "Confirmed" },
      { name: "Pilling Resistance Test", status: "Project-based" }
    ]
  },
  {
    title: "3. Production Inspection Records",
    items: [
      { name: "Raw Material Inspection Sheet", status: "Standard" },
      { name: "Print Color Strike-off Approval", status: "Standard" },
      { name: "Size Measurement Data Sheet", status: "Standard" },
      { name: "Sewing Quality Inspection Record", status: "Standard" },
      { name: "Packing Quantity Checklist", status: "Standard" },
      { name: "Final Pre-shipment QC Report", status: "Standard" }
    ]
  }
];

export default function CertificatesTestingPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <SectionHeading 
            eyebrow="Verification" 
            title="Certificates & Testing for Custom Teamwear Buyers" 
            subtitle="POXIOL supports B2B teamwear buyers with transparent quality control, production documentation and available testing records."
            dark
            center
          />
          <p className="mt-10 text-lg leading-relaxed text-neutral-400">
            This page is designed to help clubs, schools, brands, distributors and event organizers understand what quality documents can be provided before, during and after production. Only real testing reports and authentic factory records are referenced here.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2">
            {documentCategories.map((cat) => (
              <div key={cat.title} className="rounded-[2.5rem] border border-neutral-200 bg-neutral-50 p-8 md:p-12">
                <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950 mb-8">{cat.title}</h2>
                <ul className="space-y-4">
                  {cat.items.map((item) => (
                    <li key={item.name} className="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-0">
                      <span className="text-base font-bold text-neutral-800">{item.name}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        item.status === 'Confirmed' || item.status === 'Standard' 
                          ? 'border-lime-400 bg-lime-100 text-lime-700' 
                          : 'border-neutral-300 bg-neutral-100 text-neutral-500'
                      }`}>
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-[2.5rem] border border-neutral-200 bg-neutral-50 p-8 md:p-12">
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950 mb-8">4. Private Label & Packaging Proof</h2>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   "Neck Label Sample",
                   "Hangtag Sample",
                   "Polybag Sample",
                   "Barcode Sticker",
                   "Carton Mark",
                   "Shipping Label"
                 ].map(item => (
                   <div key={item} className="rounded-2xl bg-white border border-neutral-200 p-4 text-sm font-bold text-neutral-600 flex items-center gap-2">
                     <span className="text-lime-600">✓</span> {item}
                   </div>
                 ))}
              </div>
              <p className="mt-8 text-sm text-neutral-500 italic">Photos of these items can be provided during your specific project production cycle.</p>
            </div>
          </div>

          <div className="mt-20 rounded-[3rem] border border-neutral-200 bg-neutral-50 p-10 text-center">
             <h3 className="text-2xl font-black uppercase mb-4">Need Quality Documents?</h3>
             <p className="text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto">Send your product type, quantity, target market and testing requirements. POXIOL will confirm which documents can be provided for your specific project.</p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <PrimaryButton href="/contact/">Request Quality Documents</PrimaryButton>
                <SecondaryButton href="/get-quote/" darkText>Get Factory Quote</SecondaryButton>
             </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-5 py-20 md:px-10 text-neutral-950 border-y border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="FAQ" title="Certificates FAQ" dark center/>
          <div className="mt-16 space-y-4 text-left">
            {[
              { q: "Can POXIOL provide testing reports?", a: "Testing reports may be available depending on fabric type, order requirements and buyer market. Buyers should confirm required testing standards before production." },
              { q: "Can I request a QC report before shipment?", a: "Yes. POXIOL can provide project-based QC records including size measurement, print clarity, stitching inspection and packing quantity review." },
              { q: "Are all documents on this page verified?", a: "Only verified documents are displayed as confirmed. Any pending or project-based document is clearly marked as pending upload or available upon request." }
            ].map((faq) => (
              <details key={faq.q} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 group">
                <summary className="cursor-pointer text-lg font-black text-white list-none flex justify-between items-center group-open:text-[#B6FF00]">
                  {faq.q}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-neutral-400 border-t border-white/5 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
