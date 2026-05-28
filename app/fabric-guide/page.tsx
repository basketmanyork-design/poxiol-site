import type { Metadata } from "next";
import { Header, Footer, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sportswear Fabric Guide | Teamwear Fabric Selection | POXIOL",
  description: "Learn about different sportswear fabrics including Mesh, Interlock, and Quick-Dry Polyester. Choose the best performance fabric for your custom teamwear project.",
};

const fabrics = [
  {
    name: "Performance Mesh Fabric",
    description: "A lightweight and highly breathable fabric with small holes for maximum airflow. Perfect for high-intensity sports.",
    features: ["Superior breathability", "Lightweight", "Excellent moisture management", "Sublimation compatible"],
    bestFor: "Basketball uniforms, Soccer kits, Training wear, Running singlets",
  },
  {
    name: "Elite Interlock Fabric",
    description: "A double-knit fabric with a smooth, firm surface. It provides a premium look and feel with high durability.",
    features: ["Smooth texture", "High durability", "Professional aesthetic", "Sublimation compatible"],
    bestFor: "Soccer jerseys, Basketball uniforms, Baseball jerseys, Club apparel",
  },
  {
    name: "Quick-Dry Polyester",
    description: "Our core performance fabric designed to pull sweat away from the body and dry rapidly for player comfort.",
    features: ["Advanced moisture-wicking", "Ultra-fast drying", "Soft against skin", "Anti-odor treatment available"],
    bestFor: "Multi-sport uniforms, Volleyball sets, Marathon wear, Event apparel",
  },
];

export default function FabricGuidePage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Material Knowledge" 
            title="Sportswear Fabric Guide" 
            subtitle="Performance starts with the right fabric. Explore our curated selection of high-performance materials for your custom sports project."
            dark
            center
          />
          
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {fabrics.map((fabric) => (
              <div key={fabric.name} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-lime-400/30">
                <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400">{fabric.name}</h2>
                <p className="mt-4 text-neutral-400 leading-relaxed">
                  {fabric.description}
                </p>
                
                <div className="mt-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">Key Features</h3>
                  <ul className="mt-4 space-y-2">
                    {fabric.features.map(feature => (
                      <li key={feature} className="flex items-center text-sm font-bold text-white">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-lime-400"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto pt-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">Best For</h3>
                  <p className="mt-2 text-sm font-bold text-neutral-300">{fabric.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Fabric Innovation at POXIOL</h2>
          <div className="mt-10 space-y-8 text-lg leading-relaxed text-neutral-600">
            <p>
              At POXIOL, we source fabrics from the world's leading high-performance textile suppliers. Every batch of fabric undergoes rigorous testing for color fastness, shrinkage, and moisture-wicking capability.
            </p>
            <p>
              Whether you are an elite club needing aerodynamic kits or a brand developing a new collection, our fabric experts can help you select the material that meets your technical and budget requirements.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
