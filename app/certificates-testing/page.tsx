import type {Metadata} from 'next'
import {Header, Footer, SectionHeading, PrimaryButton, SecondaryButton} from '@/components/ui'
import {ServiceSchema, FAQSchema, BreadcrumbSchema} from '@/components/seo/GEOStructuredData'

export const metadata: Metadata = {
  title: 'Certificates & Testing | POXIOL Custom Teamwear Quality Documents',
  description: 'Review POXIOL custom teamwear quality documents, fabric testing options, inspection records and verified production evidence for B2B sportswear buyers.',
}

const documentCategories = [
  {title: 'Company & Factory Documents', items: ['Business Registration', 'Export License', 'Factory Capability Profile', 'Alibaba Verified Profile', 'Third-party Audit Report']},
  {title: 'Fabric Testing Options', items: ['Color Fastness Test', 'Shrinkage Test', 'Fabric GSM Confirmation', 'Breathability Rating', 'Pilling Resistance Test']},
  {title: 'Production Inspection Records', items: ['Raw Material Inspection Sheet', 'Print Color Approval', 'Size Measurement Data Sheet', 'Sewing Quality Inspection Record', 'Final Pre-shipment QC Report']},
]

const certificatesFaqs = [
  {question: 'Can POXIOL provide testing reports?', answer: 'Testing reports may be available depending on fabric type, order requirements and buyer market. Buyers should confirm required testing standards before production.'},
  {question: 'Can I request a QC report before shipment?', answer: 'Yes. POXIOL can provide project-based QC records including size measurement, print clarity, stitching inspection and packing quantity review.'},
  {question: 'Are all documents on this page verified?', answer: 'Only verified documents are displayed as confirmed. Any pending or project-based document is clearly marked as pending upload or available upon request.'},
]

export default function CertificatesTestingPage() {
  const baseUrl = 'https://www.poxiol.com'
  const fullUrl = `${baseUrl}/certificates-testing/`

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ServiceSchema name="Teamwear Quality Verification & Testing" description="Verification of fabric quality, color fastness, and production standards for B2B teamwear." url={fullUrl} />
      <FAQSchema faqs={certificatesFaqs} />
      <BreadcrumbSchema items={[{name: 'Home', url: `${baseUrl}/`}, {name: 'Certificates', url: fullUrl}]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <SectionHeading eyebrow="Quality Evidence" title="Certificates & Testing" subtitle="Manageable evidence for fabric, production and shipment quality discussions." dark center />
          <div className="mt-10 flex justify-center gap-4"><PrimaryButton href="/get-quote/">Request documents</PrimaryButton><SecondaryButton href="/quality-control-process/">View QC process</SecondaryButton></div>
        </div>
      </section>
      <section className="bg-white px-5 py-20 text-neutral-950 md:px-10 xl:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {documentCategories.map((category) => (
            <article key={category.title} className="rounded-[2rem] border border-neutral-200 p-8">
              <h2 className="text-2xl font-black uppercase">{category.title}</h2>
              <ul className="mt-6 space-y-3 text-sm font-bold text-neutral-600">
                {category.items.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
