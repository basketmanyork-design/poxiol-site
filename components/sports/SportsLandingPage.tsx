import Link from "next/link";
import type { SportsPageData } from "@/lib/sports-pages";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading, freeMockupHref, getQuoteHref } from "@/components/ui";
import { ProductSchema, FAQSchema, BreadcrumbSchema, ServiceSchema } from "@/components/seo/GEOStructuredData";

function titleCaseKeyword(keyword: string) {
  return keyword.replace(/^custom\s+/i, "").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SportsLandingPage({ data }: { data: SportsPageData }) {
  const productLabel = titleCaseKeyword(data.primaryKeyword);
  const baseUrl = "https://www.poxiol.com";
  const fullUrl = `${baseUrl}/${data.slug}/`;

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black text-left">
      {/* --- AEO / GEO Infrastructure --- */}
      <ProductSchema
        name={data.h1}
        description={data.metaDescription}
        url={fullUrl}
      />
      <ServiceSchema
        name={`Custom ${productLabel} Manufacturing`}
        description={`POXIOL provides factory-direct custom ${productLabel.toLowerCase()} production with free mockup and sampling.`}
        url={fullUrl}
      />
      <FAQSchema faqs={data.faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: `${baseUrl}/` },
        { name: "Products", url: `${baseUrl}/products/` },
        { name: productLabel, url: fullUrl }
      ]} />

      <Header />
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(182,255,0,0.16),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-[#B6FF00]">{data.eyebrow}</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-white md:text-7xl uppercase">{data.h1}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-300">
               {data.heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Sample Support", "Free Mockup", "Sample Production: 2–3 Days", "OEM/ODM Ready", "Quality Support"].map((item)=>(
                <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white">{item}</span>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href={freeMockupHref}>Get Free Mockup</PrimaryButton>
              <SecondaryButton href="#procurement-specs">View Specifications</SecondaryButton>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 md:min-h-[560px]">
            <img src={data.heroImage} alt={`POXIOL ${data.h1} Custom Uniforms`} className="absolute inset-0 h-full w-full object-cover grayscale-[0.2]" />
          </div>
        </div>
      </section>

      {/* 1. Product Procurement Specifications - Data Conclusion Section */}
      <section id="procurement-specs" className="bg-white px-5 py-20 md:px-10 md:py-32 xl:px-20 text-neutral-950 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="AEO Summary"
            title={`${productLabel} Procurement Summary`}
            subtitle={`Custom ${productLabel} Manufacturing Summary. Standard B2B parameters for professional teamwear orders and OEM sportswear programs.`}
          />
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-start mt-16">
            <div className="overflow-x-auto rounded-[2.5rem] border border-neutral-200 bg-neutral-50 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-100/50">
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-500">Procurement Item</th>
                    <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-neutral-500">POXIOL Specification</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-neutral-700">
                  {data.procurementTable.map((row, idx) => (
                    <tr key={row.item} className={idx !== data.procurementTable.length - 1 ? "border-b border-neutral-200/60" : ""}>
                      <td className="px-8 py-5 font-bold text-neutral-950 whitespace-nowrap">{row.item}</td>
                      <td className="px-8 py-5 leading-relaxed">
                        {row.item === "Alibaba Link" ? (
                          <a href="https://basketman.en.alibaba.com/" target="_blank" rel="noreferrer" className="text-lime-600 font-bold hover:underline">Visit Verified Alibaba Store ↗</a>
                        ) : (
                          row.specification
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.checklist && (
              <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-10 shadow-xl border-t-8 border-t-[#B6FF00]">
                <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-950">{data.checklist.title}</h3>
                <p className="mt-4 text-sm text-neutral-500 leading-relaxed">{data.checklist.intro}</p>
                <ul className="mt-8 space-y-4">
                  {data.checklist.items.map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-neutral-700">
                      <span className="h-2 w-2 rounded-full bg-lime-500" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col gap-4">
                  <PrimaryButton href={freeMockupHref} className="w-full">Start My Request</PrimaryButton>
                  <SecondaryButton href={getQuoteHref} darkText className="w-full">Request Quote</SecondaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Buyer Solutions - Targeted B2B Use Cases */}
      <section className="bg-neutral-50 px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Buyer Solutions" title={`Custom ${productLabel} for Every Organization`} subtitle={`POXIOL supports clubs, schools, academies and brands with high-performance teamwear solutions.`}/>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
            {data.buyerTypes.map((item)=>(
              <div key={item.title} className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-black text-neutral-950 uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-sm leading-6 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Customization Evidence - Conclusion + Data Structure */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
             <div>
                <SectionHeading eyebrow="B2B Evidence" title="Professional Customization Support" subtitle={`Vibrant team identity through high-color sublimation and durable construction.`} dark/>
                <div className="mt-12 grid gap-6">
                   {data.features.map(feat => (
                     <div key={feat.title} className="flex gap-5 text-left">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B6FF00] text-sm font-black text-neutral-950">✓</div>
                        <div>
                           <h4 className="text-lg font-black text-white uppercase tracking-tight">{feat.title}</h4>
                           <p className="mt-2 text-sm text-neutral-400 leading-relaxed max-w-sm">{feat.description}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"><img src="/images/poxiol-v6/manufacturing_sublimation_printing.png" className="h-full w-full object-cover" alt="POXIOL Sublimation Factory" /></div>
                <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 mt-12 shadow-2xl shadow-[#B6FF00]/10"><img src="/images/poxiol-v6/manufacturing_quality_control.png" className="h-full w-full object-cover" alt="POXIOL QC Protocol" /></div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Designs - Inspiration Matrix */}
      <section className="bg-white px-5 py-20 md:px-10 md:py-32 xl:px-20 text-neutral-950 border-y border-neutral-100">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Inspiration" title="Original Teamwear Design Concepts" subtitle="Select a design style and customize it with your own team colors and logos."/>
          <div className="grid gap-8 md:grid-cols-3 mt-16">
            {data.designs.map((item)=>(
              <div key={item.title} className="group overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-neutral-50 shadow-sm">
                <div className="relative h-72 overflow-hidden bg-neutral-200 text-left">
                  <img src={item.image} alt={`POXIOL ${item.title} Design`} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8 text-left">
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

      {/* 5. AEO Targeted FAQ Center */}
      <section className="bg-neutral-100 px-5 py-24 md:px-10 md:py-32 xl:px-20 text-neutral-950 border-t border-neutral-200">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Expert Answers" title="Custom Teamwear Buying Guide" subtitle={`Answers to professional sourcing questions about POXIOL ${productLabel.toLowerCase()} orders.`} center/>
          <div className="mt-16 space-y-4 text-left">
            {data.faqs.map((faq)=>(
              <details key={faq.question} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm group">
                <summary className="cursor-pointer text-lg font-black text-neutral-950 list-none flex justify-between items-center group-open:text-lime-600 transition">
                  {faq.question}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-neutral-600 border-t border-neutral-100 pt-4 max-w-3xl">{faq.answer}</p>
              </details>
            ))}
          </div>

          {data.relatedGuides && data.relatedGuides.length > 0 && (
            <div className="mt-20 border-t border-neutral-200 pt-16">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-8">Related Expert Guides</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {data.relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}/`}
                    className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:border-lime-500 hover:text-lime-600"
                  >
                    {guide.title} <span className="ml-2">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-24 xl:px-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl rounded-[3rem] border border-white/10 bg-[radial-gradient(circle_at_80%_50%,rgba(182,255,0,0.16),transparent_28%),linear-gradient(135deg,#111,#050505)] p-8 text-center md:p-20">
          <h2 className="text-4xl font-black leading-[1.05] text-white md:text-7xl uppercase tracking-tighter">Ready to Build Your Team Uniforms?</h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-neutral-300">Send your sport, logo, colors and quantity. Get a free POXIOL mockup and move faster with custom teamwear production support.</p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <PrimaryButton href={freeMockupHref} className="h-16 px-10">Get Free Mockup</PrimaryButton>
            <SecondaryButton href="/get-quote/" className="h-16 px-10">Request Factory Quote</SecondaryButton>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4 opacity-50">
             <Link href="/quality-control-process/" className="text-xs font-black uppercase tracking-[0.2em] hover:text-white underline">QC Workflow</Link>
             <Link href="/certificates-testing/" className="text-xs font-black uppercase tracking-[0.2em] hover:text-white underline">Certificates</Link>
             <Link href="/faq/" className="text-xs font-black uppercase tracking-[0.2em] hover:text-white underline">Full FAQ</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}