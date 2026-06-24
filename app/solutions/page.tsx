import type { Metadata } from "next";
import { Header, Footer, SectionHeading, PrimaryButton, SecondaryButton, freeMockupHref, getQuoteHref } from "@/components/ui";

export const metadata: Metadata = {
  title: "B2B Custom Teamwear Solutions | POXIOL",
  description: "POXIOL provides specialized teamwear solutions for clubs, schools, brands and distributors. OEM/ODM production with professional design and fast delivery.",
};

const solutions = [
  {
    title: "Basketball Uniform Solution",
    subtitle: "High-Performance Court Gear",
    desc: "Full sublimation reversible sets, game jerseys, and team travel apparel. Consistent colors across youth and adult sizes.",
    items: ["Custom Reversible Sets", "Shooting Shirts", "Individual Personalization", "Pro-Grade Mesh Fabrics"],
    image: "/images/poxiol-v62/projects_basketball_academy_uniform_program.png"
  },
  {
    title: "Soccer Uniform Solution",
    subtitle: "Elite Club Kit Launch",
    desc: "Home and away kit systems with sponsor integration and pro fit. Reliable delivery for tournament seasons and school events.",
    items: ["Home & Away Kit Programs", "Goalkeeper Sets", "Sponsor Logo Alignment", "140gsm Breathable Interlock"],
    image: "/images/poxiol-v62/projects_soccer_club_kit_launch.png"
  },
  {
    title: "Training Wear Solution",
    subtitle: "Off-Court Excellence",
    desc: "Modern tracksuits, warm-up jackets, and training tops for clubs, schools, and professional sportswear brands.",
    items: ["Warm-up Jackets", "Training Pants", "Lightweight Performance Tops", "Team Travel Suits"],
    image: "/images/poxiol-v6/manufacturing_sublimation_printing.png"
  },
  {
    title: "Hoodie & Jacket Solution",
    subtitle: "Premium Team Outerwear",
    desc: "Build your team outerwear with custom hoodies, zip-ups, and jackets. Engineered for comfort and professional appearance.",
    items: ["Pullover Hoodies", "Zip-up Jackets", "Fleece Outerwear", "Vibrant Team Accents"],
    image: "/images/poxiol-v62/home_hero_v62.png"
  },
  {
    title: "Teamwear Package Solution",
    subtitle: "Unified School & Academy Look",
    desc: "Complete multi-sport apparel programs covering basketball, soccer, volleyball and training wear with one shared identity.",
    items: ["Unified Color Systems", "Size-Grouped Packing", "PE & Staff Apparel", "Multi-Sport Logistics"],
    image: "/images/poxiol-v62/project_school_multisport_v62.png"
  },
  {
    title: "Private Label Teamwear Solution",
    subtitle: "OEM / ODM Brand Support",
    desc: "Manufacturing support for sportswear brands. From pattern development to custom labeling, hangtags, and premium packaging.",
    items: ["Custom Tech-Packs", "Private Labeling", "Eco-Friendly Polybags", "Volume-Based OEM Pricing"],
    image: "/images/poxiol-v6/home_oem_odm_solutions.png"
  }
];

export default function SolutionsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-32 xl:px-20 text-center">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="B2B Solutions" title="Custom Teamwear Programs Built for Your Needs" subtitle="POXIOL understands the different requirements for clubs, schools, and professional sportswear brands." dark center />
          
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
                    <PrimaryButton href={freeMockupHref}>Start Mockup</PrimaryButton>
                    <SecondaryButton href={getQuoteHref}>Get Quote</SecondaryButton>
                  </div>
                </div>
                <div className={`aspect-[16/10] overflow-hidden rounded-[3rem] border border-white/10 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <img src={sol.image} alt={sol.title} className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 px-5 py-20 md:px-10 text-center border-y border-white/5">
        <h2 className="text-3xl font-black uppercase md:text-5xl">Ready to Start Your Program?</h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto text-lg">Tell us about your organization and uniform needs. Our B2B specialists will prepare a custom plan for you.</p>
        <div className="mt-10">
          <PrimaryButton href="/contact/">Connect With A Specialist</PrimaryButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
