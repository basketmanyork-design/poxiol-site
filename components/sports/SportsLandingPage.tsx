import Link from "next/link";
import type { SportsPageData } from "@/lib/sports-pages";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading, freeMockupHref } from "@/components/ui";
import { ProductSchema, FAQSchema } from "@/components/seo/GEOStructuredData";

function titleCaseKeyword(keyword: string) {
  return keyword.replace(/^custom\s+/i, "").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SportsLandingPage({ data }: { data: SportsPageData }) {
  const productLabel = titleCaseKeyword(data.primaryKeyword);
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/${data.slug}/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ProductSchema 
        name={data.h1} 
        description={data.metaDescription} 
        url={fullUrl} 
      />
      <FAQSchema faqs={data.faqs} />
      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.16),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-[#B6FF00]">{data.eyebrow}</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-white md:text-7xl uppercase">{data.h1}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">{data.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Sample Support", "Free Mockup", "Sample Production", "OEM/ODM Ready", "Quality Support"].map((item)=>(
                <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white">{item}</span>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href={freeMockupHref}>Get Free Mockup</PrimaryButton>
              <SecondaryButton href="#procurement-specs">View Specifications</SecondaryButton>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 md:min-h-[560px]">
            <img src={data.heroImage} alt={data.h1} className="absolute inset-0 h-full w-full object-cover grayscale-[0.2]" />
          </div>
        </div>
      </section>

      {/* 1. Product Procurement Specifications */}
      <section id="procurement-specs" className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Specifications" 
            title={`${productLabel} Procurement Summary`} 
            subtitle="Standard B2B manufacturing parameters for professional teamwear orders and OEM sportswear programs."
          />
          <div className="mt-12 overflow-x-auto rounded-[2.5rem] border border-neutral-200 bg-neutral-50 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-100/50">
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-500">Item</th>
                  <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-500">POXIOL Specification</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                {data.procurementTable.map((row, idx) => (
                  <tr key={row.item} className={idx !== data.procurementTable.length - 1 ? "border-b border-neutral-200/60" : ""}>
                    <td className="px-8 py-5 font-bold text-neutral-950 whitespace-nowrap">{row.item}</td>
                    <td className="px-8 py-5 leading-relaxed">{row.specification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Buyer Fit Section */}
      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Buyer Solutions" title="Built for Professional B2B Partners" subtitle={`We understand the specific requirements for different ${productLabel} buyers.`}/>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-16">
            {data.buyerTypes.map((item)=>(
              <div key={item.title} className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-black text-neutral-950 uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-sm leading-6 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Types & Fabric Options */}
      <section id="product-types" className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl text-center">
          <SectionHeading eyebrow="Product Options" title={`Custom ${productLabel} Product Matrix`} subtitle="Select the right configuration for your team, academy or brand program."/>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mt-16">
            {data.productTypes.map((item)=>(
              <div key={item.title} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8 text-left">
                <h3 className="text-xl font-black text-neutral-950 uppercase tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Fabric & Printing Evidence */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
             <div>
                <SectionHeading eyebrow="Evidence" title="Premium Fabric & Printing Support" subtitle="Vibrant, durable and breathable teamwear engineered for performance." dark/>
                <div className="mt-12 grid gap-6">
                   {data.features.map(feat => (
                     <div key={feat.title} className="flex gap-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B6FF00] text-sm font-black text-neutral-950">✓</div>
                        <div>
                           <h4 className="text-lg font-black text-white uppercase tracking-tight">{feat.title}</h4>
                           <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{feat.description}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10"><img src="/images/poxiol-v6/manufacturing_sublimation_printing.png" className="h-full w-full object-cover" /></div>
                <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 mt-12"><img src="/images/poxiol-v6/manufacturing_quality_control.png" className="h-full w-full object-cover" /></div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Designs */}
      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Inspiration" title="Original Design Concepts" subtitle="Select a design style and customize it with your own team colors and logos."/>
          <div className="grid gap-6 md:grid-cols-3 mt-16">
            {data.designs.map((item)=>(
              <div key={item.title} className="group overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-neutral-50 shadow-sm">
                <div className="relative h-72 overflow-hidden bg-neutral-200">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-neutral-950 uppercase italic tracking-tighter">{item.title}</h3>
                  <p className="mt-3 leading-7 text-neutral-600 text-sm">{item.description}</p>
                  <Link 
                    href={item.href || `/free-mockup/?style=${item.title.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="mt-6 inline-flex text-sm font-black uppercase tracking-widest text-neutral-950 hover:text-[#B6FF00] hover:underline"
                  >
                    Request This Design →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. QC Checklist Section */}
      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950 border-y border-neutral-200">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
           <div>
              <SectionHeading eyebrow="QC Checklist" title="Strict Production Inspection" subtitle={`Our team checks every detail of your ${productLabel} order before shipment.`}/>
              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                 {[
                   "Fabric surface check",
                   "Color matching accuracy",
                   "Print clarity & alignment",
                   "Stitching strength check",
                   "Size measurement audit",
                   "Logo & name position",
                   "Packing list validation",
                   "Final carton inspection"
                 ].map(item => (
                   <div key={item} className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-bold text-neutral-700 flex items-center gap-3 shadow-sm">
                      <span className="text-lime-600">✓</span> {item}
                   </div>
                 ))}
              </div>
              <div className="mt-10">
                 <Link href="/quality-control-process/" className="text-neutral-950 font-black uppercase text-xs tracking-widest hover:underline hover:text-[#B6FF00]">View Full QC Process →</Link>
              </div>
           </div>
           <div className="aspect-[16/10] rounded-[3rem] overflow-hidden border border-neutral-200 bg-neutral-300 shadow-xl">
              <img src="/images/poxiol-v6/manufacturing_packing_global_delivery.png" className="h-full w-full object-cover" alt="POXIOL QC and Packing" />
           </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Custom Process" title="From Idea to Team Uniform" subtitle="Submit your idea, get a free mockup, confirm sample, start production and receive your custom teamwear worldwide." dark center/>
          <div className="grid gap-5 lg:grid-cols-5 mt-16">
            {["Submit Idea","Free Mockup","Confirm Sample","Production","Delivery"].map((step,index)=>(
              <div key={step} className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-white text-center hover:bg-white/[0.08] transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B6FF00] text-sm font-black text-neutral-950 mx-auto mb-6 shadow-lg shadow-[#B6FF00]/10">{String(index+1).padStart(2,"0")}</div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Center */}
      <section className="bg-white px-5 py-20 md:px-10 md:py-32 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle={`Common questions about POXIOL ${productLabel} orders and B2B support.`} center/>
          <div className="mt-16 space-y-4 text-left">
            {data.faqs.map((faq)=>(
              <details key={faq.question} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm group">
                <summary className="cursor-pointer text-lg font-black text-neutral-950 list-none flex justify-between items-center group-open:text-[#B6FF00]">
                  {faq.question}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-neutral-600 border-t border-neutral-200 pt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl rounded-[3rem] border border-white/10 bg-[radial-gradient(circle_at_80%_50%,rgba(182,255,0,0.16),transparent_28%),linear-gradient(135deg,#111,#050505)] p-8 text-center md:p-14">
          <h2 className="text-4xl font-black leading-[1.05] text-white md:text-6xl uppercase tracking-tighter">Ready to Build Your Custom {productLabel} Project?</h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-neutral-300">Send your sport, logo, colors and quantity. Get a free POXIOL mockup and move faster with custom teamwear production support.</p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <PrimaryButton href={freeMockupHref} className="h-16 px-10">Get Free Mockup</PrimaryButton>
            <SecondaryButton href="/get-quote/" className="h-16 px-10">Request Factory Quote</SecondaryButton>
          </div>
          <div className="mt-10 flex justify-center gap-8">
             <Link href="/certificates-testing/" className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest hover:text-white underline">Quality Documents</Link>
             <Link href="/quality-control-process/" className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest hover:text-white underline">QC Workflow</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
