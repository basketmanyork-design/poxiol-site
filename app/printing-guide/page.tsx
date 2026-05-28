import type { Metadata } from "next";
import { Header, Footer, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sportswear Printing Guide | Sublimation vs Screen Printing | POXIOL",
  description: "Explore custom teamwear printing methods. Learn the differences between sublimation, screen printing, embroidery, and heat transfer for your sports uniforms.",
};

const printingMethods = [
  {
    name: "Full Sublimation Printing",
    description: "The gold standard for modern teamwear. Ink is gasified into the fabric, creating permanent, vibrant colors that never crack or fade.",
    features: ["Unlimited colors & designs", "Breathable (no 'plastic' feel)", "Permanent & durable", "Moisture-wicking maintained"],
    bestFor: "Basketball, Soccer, Volleyball, Running, Esports",
  },
  {
    name: "Screen Printing",
    description: "Traditional ink layer applied on top of the fabric. Best for simple designs and solid colors.",
    features: ["Vibrant solid colors", "Cost-effective for bulk", "Classic look", "Great for cotton and blends"],
    bestFor: "Event t-shirts, Simple jerseys, School apparel",
  },
  {
    name: "Premium Embroidery",
    description: "Stitched logos and text for a classic, textured, and highly professional appearance.",
    features: ["High-end texture", "Extreme durability", "Classic heritage look", "Professional branding"],
    bestFor: "Club crests, Polo shirts, Jackets, Caps",
  },
  {
    name: "Heat Transfer Printing",
    description: "Vinyl or film pressed onto the garment. Ideal for individual names and numbers on pre-made jerseys.",
    features: ["Perfect for personalization", "Sharp details", "Individual names & numbers", "Fast turnaround"],
    bestFor: "Player names, Player numbers, Sponsor logos",
  },
];

export default function PrintingGuidePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Decoration Technology" 
            title="Sportswear Printing Guide" 
            subtitle="Choosing the right decoration method is critical for performance and branding. Explore how we bring your designs to life."
            dark
            center
          />
          
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {printingMethods.map((method) => (
              <div key={method.name} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30">
                <h2 className="text-xl font-black uppercase tracking-tight text-lime-400">{method.name}</h2>
                <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                  {method.description}
                </p>
                
                <div className="mt-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Key Features</h3>
                  <ul className="mt-4 space-y-2">
                    {method.features.map(feature => (
                      <li key={feature} className="flex items-center text-xs font-bold text-white">
                        <span className="mr-2 h-1 w-1 rounded-full bg-lime-400"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto pt-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Best For</h3>
                  <p className="mt-2 text-xs font-bold text-neutral-300">{method.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Sublimation Specialists</h2>
          <div className="mt-10 space-y-8 text-lg leading-relaxed text-neutral-600">
            <p>
              POXIOL uses industry-leading Italian inks and Japanese printing technology to ensure the highest color accuracy and saturation. Our sublimation process is zero-waste and skin-safe, meeting international environmental standards.
            </p>
            <p>
              By gasifying the ink directly into the polyester fibers, we ensure your uniforms remain breathable and lightweight, with a design that will last as long as the garment itself.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
