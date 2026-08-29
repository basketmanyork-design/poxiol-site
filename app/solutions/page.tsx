import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton, freeMockupHref, getQuoteHref } from "@/components/ui";
import {contextualInquiryHref} from '@/lib/inquiry-context';

const solutionSeo = {
  title: "B2B Custom Teamwear Solutions | POXIOL",
  description: "Teamwear solutions for teamwear distributors, dealers, sportswear brands and custom resellers worldwide. Plan client collections, samples and repeat orders.",
};

export const metadata: Metadata = {
  ...solutionSeo,
  alternates: { canonical: "/solutions/" },
  openGraph: {...solutionSeo, url: "/solutions/", type: "website"},
};

type Solution = {
  title: string;
  sport?: string;
  subtitle: string;
  desc: string;
  items: string[];
  image?: string;
};

const solutions: Solution[] = [
  {
    title: "Basketball Uniform Solution",
    sport: 'Basketball',
    subtitle: "Basketball Programs for Your Clients",
    desc: "Plan reversible sets, game jerseys and team travel apparel for your basketball clients. Confirm colors, artwork, size breakdowns and sample requirements before production.",
    items: ["Custom Reversible Sets", "Shooting Shirts", "Individual Personalization", "Pro-Grade Mesh Fabrics"]
  },
  {
    title: "Soccer Uniform Solution",
    sport: 'Soccer',
    subtitle: "Client Club Kit Planning",
    desc: "Plan home and away kits for your club and school clients. Confirm authorized sponsor artwork, sizing, approvals and the target match date before agreeing a production and shipping plan.",
    items: ["Home & Away Kit Programs", "Goalkeeper Sets", "Sponsor Logo Alignment", "140gsm Breathable Interlock"]
  },
  {
    title: "Training Wear Solution",
    sport: 'Running / Training Wear',
    subtitle: "Off-Court Excellence",
    desc: "Extend a client's matchwear order into tracksuits, warm-up jackets and training tops. Confirm the coordinated range, sizing and artwork before sampling.",
    items: ["Warm-up Jackets", "Training Pants", "Lightweight Performance Tops", "Team Travel Suits"]
  },
  {
    title: "Hoodie & Jacket Solution",
    subtitle: "Team Outerwear",
    desc: "Plan custom hoodies, zip-ups and jackets alongside your client's teamwear range. Confirm fabric, fit, branding and packaging requirements during project review.",
    items: ["Pullover Hoodies", "Zip-up Jackets", "Fleece Outerwear", "Vibrant Team Accents"]
  },
  {
    title: "Teamwear Package Solution",
    sport: 'Multi-Sport Teamwear',
    subtitle: "Full Teamwear for Ongoing Client Accounts",
    desc: "Plan a wider client range across matchwear, training wear and team apparel. Review shared artwork, product-specific specifications and future reorder requirements together.",
    items: ["Unified Color Systems", "Size-Grouped Packing", "PE & Staff Apparel", "Multi-Sport Logistics"]
  },
  {
    title: "Private Label Teamwear Solution",
    subtitle: "OEM / ODM Brand Support",
    desc: "Plan brand-owned or reseller collections around your downstream clients. Confirm product specifications, labels, hangtags, packaging and the sample approval process.",
    items: ["Custom Tech-Packs", "Private Labeling", "Eco-Friendly Polybags", "Volume-Based OEM Pricing"]
  }
];

export default function SolutionsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="B2B Solutions" title="Custom Teamwear Programs Built for Your Needs" subtitle="For teamwear distributors, dealers, sportswear brands and custom resellers worldwide managing ongoing client orders. Plan the first team kit, repeat orders and a broader Full Teamwear range around your client brief." dark center level="h1" />
          
          <div className="mt-24 space-y-32 text-left">
            {solutions.map((sol, i) => (
              <div key={sol.title} className={`grid gap-16 lg:grid-cols-2 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B6FF00] mb-4">{sol.subtitle}</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">{sol.title}</h2>
                  <p className="mt-6 text-lg text-neutral-400 leading-relaxed">{sol.desc}</p>
                  <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                    {sol.items.map(item => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-neutral-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B6FF00]" /> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-12 flex gap-4">
                    <PrimaryButton href={contextualInquiryHref(freeMockupHref, {product:sol.title,sport:sol.sport,source:'/solutions/'})}>Start Mockup</PrimaryButton>
                    <SecondaryButton href={contextualInquiryHref(getQuoteHref, {product:sol.title,sport:sol.sport,source:'/solutions/'})}>Get Quote</SecondaryButton>
                  </div>
                </div>
                <div className={`aspect-[16/10] overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {sol.image ? (
                    <img src={sol.image} alt={sol.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center text-sm font-bold uppercase tracking-widest text-neutral-400">
                      Project imagery pending verification
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 text-center border-y border-white/5">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Ready to Start Your Program?</h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto text-lg">Share your client program, product range, estimated quantities and target dates. Start with a project discussion; sample, price and production details are confirmed separately.</p>
        <div className="mt-10">
          <PrimaryButton href="/contact/">Connect With A Specialist</PrimaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
