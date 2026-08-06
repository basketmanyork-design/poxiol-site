import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton } from "@/components/ui";
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/GEOStructuredData";

export const metadata: Metadata = {
  title: "Certificates & Testing | POXIOL Custom Teamwear Quality Documents",
  description: "Review POXIOL custom teamwear quality documents, fabric testing options, inspection records and verified production evidence for B2B sportswear buyers.",
  alternates: { canonical: "/certificates-testing/" },
};

const documentCategories = [
  {
    title: "Currently verified evidence",
    items: [
      { name: "Production inspection workflow", status: "Described and reviewable" },
      { name: "Size measurement and packing checklists", status: "Available per project record" },
      { name: "Artwork and sample approval record", status: "Created for the approved scope" },
    ],
  },
  {
    title: "Project or order confirmation",
    items: [
      { name: "Fabric reference and available specification", status: "Confirm for this order" },
      { name: "Color, print and decoration checks", status: "Confirm for this order" },
      { name: "Pre-shipment quality inspection record", status: "Request for this order" },
      { name: "Packaging and labeling checklist", status: "Confirm for this order" },
    ],
  },
  {
    title: "Buyer requirements before confirmation",
    items: [
      { name: "Target-market testing standard", status: "Buyer must specify" },
      { name: "Product-specific fabric or finished-garment test", status: "Buyer must specify" },
      { name: "Destination packaging and labeling rules", status: "Buyer must specify" },
    ],
  },
]
const certificatesFaqs = [
  { question: "Can POXIOL provide testing reports?", answer: "Testing reports depend on the product, target market and buyer requirements. Share the required standard before production so POXIOL can confirm the appropriate evidence path; availability is not a claim that a report is already held." },
  { question: "Can I request a QC report before shipment?", answer: "Yes. POXIOL can provide project-based QC records including size measurement, print clarity, stitching inspection and packing quantity review." },
  { question: "Are all documents on this page verified?", answer: "A document is shown in one of three evidence tiers: currently verified evidence, project or order confirmation, or buyer requirements that must be supplied before confirmation. Availability is never presented as proof that a certificate or test has already been issued." }
];

export default function CertificatesTestingPage() {
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/certificates-testing/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ServiceSchema 
        name="Teamwear Quality Verification & Testing"
        description="Verification of fabric quality, color fastness, and production standards for B2B teamwear."
        url={fullUrl}
      />
      <FAQSchema faqs={certificatesFaqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Certificates", url: fullUrl }
      ]} />

      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(182,255,0,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <SectionHeading level="h1"
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
              <div key={cat.title} className="rounded-[2.5rem] border border-neutral-200 bg-neutral-50 p-8 md:p-12 shadow-sm">
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

            <div className="rounded-[2.5rem] border border-neutral-200 bg-neutral-50 p-8 md:p-12 shadow-sm">
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

      {/* AEO FAQ Section */}
      <section className="bg-neutral-900 px-5 py-24 md:px-10 text-neutral-950 border-y border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Expert Answers" title="Certificates FAQ" dark center/>
          <div className="mt-16 space-y-4 text-left">
            {certificatesFaqs.map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 group">
                <summary className="cursor-pointer text-lg font-black text-white list-none flex justify-between items-center group-open:text-[#B6FF00] transition">
                  {faq.question}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-neutral-400 border-t border-white/5 pt-4 max-w-3xl">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
