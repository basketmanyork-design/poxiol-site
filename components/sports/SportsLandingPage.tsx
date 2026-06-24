import Link from "next/link";
import type { SportsPageData } from "@/lib/sports-pages";
import { Header, Footer, PrimaryButton, SecondaryButton, SectionHeading, freeMockupHref } from "@/components/ui";

function titleCaseKeyword(keyword: string) {
  return keyword.replace(/^custom\s+/i, "").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SportsLandingPage({ data }: { data: SportsPageData }) {
  const productLabel = titleCaseKeyword(data.primaryKeyword);
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
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
              <SecondaryButton href="#product-types">Explore Products</SecondaryButton>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 md:min-h-[560px]">
            <img src={data.heroImage} alt={data.h1} className="absolute inset-0 h-full w-full object-cover grayscale-[0.2]" />
          </div>
        </div>
      </section>

      <section id="product-types" className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Product Types" title={`Custom ${productLabel} Options`} subtitle="Build the right teamwear set with flexible product options for your sport, buyer type and order plan."/>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {data.productTypes.map((item)=>(
              <div key={item.title} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
                <h3 className="text-xl font-black text-neutral-950 uppercase">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Why Choose POXIOL" title={`Built for ${productLabel}`} subtitle="Fast mockups, flexible customization and reliable production support for global teamwear buyers." dark center/>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.features.map((item)=>(
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-7 transition hover:border-[#B6FF00]/50">
                <h3 className="text-xl font-black text-white uppercase italic">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Featured Designs" title="Original Designs Ready for Customization" subtitle="Choose a style, change colors, add your logo and build your own team identity with POXIOL."/>
          <div className="grid gap-6 md:grid-cols-3">
            {data.designs.map((item)=>(
              <div key={item.title} className="group overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white">
                <div className="relative h-72 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-neutral-950 uppercase italic">{item.title}</h3>
                  <p className="mt-3 leading-7 text-neutral-600 text-sm">{item.description}</p>
                  <Link 
                    href={`/free-mockup/?style=${item.title.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="mt-6 inline-flex text-sm font-black uppercase tracking-widest text-neutral-950 hover:text-lime-600 hover:underline"
                  >
                    Request This Design →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Buyer Types" title="Who This Page Is Built For" subtitle="POXIOL supports different buyers with flexible product development, sampling and production options."/>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {data.buyerTypes.map((item)=>(
              <div key={item.title} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="text-xl font-black text-neutral-950 uppercase">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Custom Process" title="From Idea to Team Uniform" subtitle="Submit your idea, get a free mockup, confirm sample, start production and receive your custom teamwear worldwide." dark center/>
          <div className="grid gap-5 lg:grid-cols-5">
            {["Submit Idea","Free Mockup","Confirm Sample","Production","Delivery"].map((step,index)=>(
              <div key={step} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B6FF00] text-sm font-black text-neutral-950 mx-auto">{String(index+1).padStart(2,"0")}</div>
                <h3 className="mt-5 text-xl font-black uppercase italic">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Common questions about POXIOL custom teamwear orders, mockups, sampling and production." center/>
          <div className="mt-16 space-y-4 text-left">
            {data.faqs.map((faq)=>(
              <details key={faq.question} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <summary className="cursor-pointer text-lg font-black text-neutral-950">{faq.question}</summary>
                <p className="mt-4 leading-7 text-neutral-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-24 xl:px-20">
        <div className="mx-auto max-w-7xl rounded-[3rem] border border-white/10 bg-[radial-gradient(circle_at_80%_50%,rgba(182,255,0,0.16),transparent_28%),linear-gradient(135deg,#111,#050505)] p-8 text-center md:p-14">
          <h2 className="text-4xl font-black leading-[1.05] text-white md:text-6xl uppercase tracking-tighter">Ready to Start Your Custom {productLabel} Project?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-300">Send your sport, logo, colors and quantity. Get a free POXIOL mockup and move faster with custom teamwear production support.</p>
          <div className="mt-8">
            <PrimaryButton href={freeMockupHref}>Get Free Mockup</PrimaryButton>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
