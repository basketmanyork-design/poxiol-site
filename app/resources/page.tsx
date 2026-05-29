import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/StructuredData";


export const metadata: Metadata = {
  title: "Teamwear Knowledge Center | Sportswear Buying Guides | POXIOL",
  description: "Explore POXIOL Teamwear Knowledge Center including sportswear buying guides, fabric guides, sublimation printing tutorials, manufacturing knowledge and custom teamwear resources.",
};

const resourceCategories = [
  {
    title: "Custom Teamwear Buying Guides",
    links: [
      { name: "Basketball Uniform Guide", href: "/how-to-order-custom-basketball-uniforms/" },
      { name: "Soccer Jersey Guide", href: "/soccer-jersey-buying-guide/" },
      { name: "Teamwear Manufacturer Guide", href: "/how-to-choose-a-teamwear-manufacturer/" },
      { name: "Choosing Manufacturing Models", href: "/oem-vs-odm-sportswear/" },
    ],
  },
  {
    title: "Sportswear Fabric Knowledge",
    links: [
      { name: "Fabric Guide Overview", href: "/fabric-guide/" },
      { name: "Best Sportswear Fabrics", href: "/best-sportswear-fabrics/" },
      { name: "Moisture-Wicking Technology", href: "/fabric-guide/" },
      { name: "Polyester Sports Fabrics", href: "/fabric-guide/" },
    ],
  },
  {
    title: "Sportswear Printing Guides",
    links: [
      { name: "Printing Guide Overview", href: "/printing-guide/" },
      { name: "Sublimation Printing Guide", href: "/sublimation-printing-guide/" },
      { name: "Embroidery for Teamwear", href: "/printing-guide/" },
      { name: "Heat Transfer Printing", href: "/printing-guide/" },
    ],
  },
  {
    title: "Sportswear Manufacturing Knowledge",
    links: [
      { name: "Manufacturing Hub", href: "/manufacturing/" },
      { name: "OEM vs ODM Manufacturing", href: "/oem-vs-odm-sportswear/" },
      { name: "Production Process Guide", href: "/manufacturing/" },
      { name: "Quality Control Standards", href: "/manufacturing/" },
      { name: "Private Label Solutions", href: "/manufacturing/" },
    ],
  },
  {
    title: "Regional & B2B Solutions",
    links: [
      { name: "School Teamwear Solutions", href: "/custom-basketball-uniforms-for-schools/" },
      { name: "Youth Academy Uniforms", href: "/custom-soccer-uniforms-for-academies/" },
      { name: "Australia Teamwear Partner", href: "/soccer-jersey-supplier-australia/" },
      { name: "USA Soccer Teamwear", href: "/soccer-teamwear-supplier-usa/" },
      { name: "OEM Basketball Specialist", href: "/oem-basketball-apparel-manufacturer/" },
    ],
  },
  {
    title: "Success Stories",
    links: [
      { name: "All Projects & Case Studies", href: "/projects/" },
      { name: "USA Basketball Academy", href: "/projects/usa-basketball-academy-uniform-program/" },
      { name: "Australia Soccer Club", href: "/projects/australia-soccer-club-kit-project/" },
      { name: "European Volleyball Team", href: "/projects/europe-volleyball-team-apparel-project/" },
    ],
  },
  {
    title: "FAQ Center",
    links: [
      { name: "General FAQ", href: "/faq/" },
      { name: "Basketball FAQ", href: "/faq/" },
      { name: "Soccer FAQ", href: "/faq/" },
      { name: "Manufacturing FAQ", href: "/faq/" },
      { name: "Shipping & Payments FAQ", href: "/faq/" },
    ],
  },
  {
    title: "Custom Sports Categories",
    links: [
      { name: "Custom Basketball Uniforms", href: "/custom-basketball-uniforms/" },
      { name: "Custom Soccer Kits", href: "/custom-soccer-kits/" },
      { name: "Custom Baseball & Softball", href: "/custom-baseball-softball-uniforms/" },
      { name: "Custom Volleyball Uniforms", href: "/custom-volleyball-uniforms/" },
      { name: "Custom American Football", href: "/custom-american-football-uniforms/" },
      { name: "Custom Esports Jerseys", href: "/custom-esports-jerseys/" },
    ],
  },
];



export default function ResourcesPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema]} />
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

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { title: "Manufacturing Hub", href: "/manufacturing/", desc: "OEM & ODM production processes." },
              { title: "Projects Gallery", href: "/projects/", desc: "Explore our recent success stories." },
              { title: "FAQ Center", href: "/faq/", desc: "Get answers to common questions." },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group flex flex-col items-center rounded-3xl border border-lime-400/20 bg-lime-400/5 p-8 text-center transition hover:bg-lime-400/10">
                <h3 className="text-xl font-black uppercase text-lime-400">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
                <span className="mt-4 text-xs font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-lime-400/50">Explore Hub →</span>
              </Link>
            ))}
          </div>
          
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
