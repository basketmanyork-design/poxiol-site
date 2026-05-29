import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Teamwear Knowledge Center | Sportswear Buying Guides | POXIOL",
  description: "Explore POXIOL Teamwear Knowledge Center including sportswear buying guides, fabric guides, sublimation printing tutorials, manufacturing knowledge and custom teamwear resources.",
};

const resourceCategories = [
  {
    title: "Custom Teamwear Buying Guides",
    links: [
      { name: "Basketball Uniform Guide", href: "/guides/how-to-order-custom-basketball-uniforms-for-your-team/" },
      { name: "Soccer Jersey Guide", href: "/guides/how-to-choose-a-custom-soccer-kit-manufacturer/" },
      { name: "Baseball Uniform Guide", href: "/guides/how-to-order-custom-basketball-uniforms-for-your-team/" }, // Placeholder for now
      { name: "Teamwear MOQ Guide", href: "/guides/moq-1-custom-teamwear-how-it-works/" },
    ],
  },
  {
    title: "Sportswear Fabric Knowledge",
    links: [
      { name: "Fabric Guide Overview", href: "/fabric-guide/" },
      { name: "Moisture-Wicking Fabric Guide", href: "/fabric-guide/" },
      { name: "Mesh Fabric Guide", href: "/fabric-guide/" },
      { name: "Polyester Sports Fabric Guide", href: "/fabric-guide/" },
    ],
  },
  {
    title: "Sportswear Printing Guides",
    links: [
      { name: "Printing Guide Overview", href: "/printing-guide/" },
      { name: "Sublimation vs Screen Printing", href: "/guides/sublimation-vs-screen-printing-for-custom-teamwear/" },
      { name: "Embroidery for Teamwear", href: "/printing-guide/" },
      { name: "Heat Transfer Printing", href: "/printing-guide/" },
    ],
  },
  {
    title: "Sportswear Manufacturing Knowledge",
    links: [
      { name: "Manufacturing Hub", href: "/manufacturing/" },
      { name: "OEM Sportswear Guide", href: "/guides/oem-odm-sportswear-manufacturing-guide-for-brands/" },
      { name: "ODM Teamwear Guide", href: "/guides/oem-odm-sportswear-manufacturing-guide-for-brands/" },
      { name: "Sportswear Production Process", href: "/manufacturing/" },
      { name: "Quality Control Guide", href: "/manufacturing/" },
    ],
  },
  {
    title: "Regional & B2B Solutions",
    links: [
      { name: "School Teamwear Solutions", href: "/custom-basketball-uniforms-for-schools/" },
      { name: "Australia Teamwear Partner", href: "/soccer-jersey-supplier-australia/" },
      { name: "OEM Basketball Manufacturing", href: "/oem-basketball-apparel-manufacturer/" },
      { name: "Distributor & Wholesaler Support", href: "/manufacturing/" },
    ],
  },
  {
    title: "Success Stories",
    links: [
      { name: "All Projects & Case Studies", href: "/projects/" },
      { name: "USA Basketball Academy Case Study", href: "/projects/usa-basketball-academy-project/" },
      { name: "Australia Soccer Club Case Study", href: "/projects/australia-soccer-club-project/" },
      { name: "Europe Volleyball Case Study", href: "/projects/europe-volleyball-team-project/" },
    ],
  },
  {
    title: "FAQ Center",

    links: [
      { name: "General FAQ", href: "/faq/" },
      { name: "Manufacturing FAQ", href: "/faq/" },
      { name: "Printing FAQ", href: "/faq/" },
    ],
  },
  {
    title: "Custom Sports Categories",
    links: [
      { name: "Custom Basketball Uniforms", href: "/custom-basketball-uniforms/" },
      { name: "Custom Soccer Kits", href: "/custom-soccer-kits/" },
      { name: "Custom Baseball & Softball", href: "/custom-baseball-softball-uniforms/" },
      { name: "Running & Marathon Wear", href: "/custom-running-marathon-wear/" },
      { name: "Training & Warmup Apparel", href: "/custom-training-wear/" },
      { name: "American Football Uniforms", href: "/custom-american-football-uniforms/" },
      { name: "Custom Volleyball Uniforms", href: "/custom-volleyball-uniforms/" },
      { name: "Custom Rugby Uniforms", href: "/custom-rugby-uniforms/" },
      { name: "Custom Esports Jerseys", href: "/custom-esports-jerseys/" },
      { name: "Custom Ice Hockey Jerseys", href: "/custom-ice-hockey-jerseys/" },
    ],
  },
];


export default function ResourcesPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Knowledge Center" 
            title="Teamwear Knowledge & Buying Guides" 
            subtitle="Explore professional teamwear buying guides, sportswear fabric knowledge, sublimation printing tutorials and manufacturing resources for clubs, schools and sports brands."
            dark
            center
          />
          
          <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {resourceCategories.map((category) => (
              <div key={category.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10">
                <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400">{category.title}</h2>
                <ul className="mt-6 space-y-4">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center text-neutral-400 transition hover:text-white"
                      >
                        <span className="mr-2 text-lime-400 group-hover:translate-x-1 transition-transform">→</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-950 md:text-5xl">Can't find what you are looking for?</h2>
          <p className="mt-6 text-xl text-neutral-600">
            Our team of teamwear experts is here to help you with any technical questions regarding your custom sports project.
          </p>
          <div className="mt-10">
            <Link href="/contact/" className="inline-flex h-[60px] items-center justify-center rounded-full bg-neutral-950 px-10 text-base font-black uppercase text-white transition hover:bg-neutral-800">
              Contact an Expert
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
