import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Teamwear Projects & Case Studies | Custom Sportswear Portfolio | POXIOL",
  description: "Explore our portfolio of custom teamwear projects. See how POXIOL helps basketball academies, soccer clubs, and professional teams with high-performance manufacturing.",
};

export default function ProjectsPage() {
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading 
            eyebrow="Success Stories" 
            title="Featured Projects & Case Studies" 
            subtitle="From elite academies to professional clubs, explore how we deliver performance-driven teamwear solutions across the globe."
            dark
            center
          />
          
          <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((project) => (
              <div key={project.slug} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-lime-400/30">
                <div className="aspect-[4/3] w-full bg-neutral-900">
                  {/* Placeholder for project image */}
                  <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase tracking-widest text-white/20">
                    [ Project Image ]
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-lime-400">
                    <span>{project.clientType}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20"></span>
                    <span>{project.country}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white transition group-hover:text-lime-400">
                    {project.title}
                  </h2>
                  <p className="mt-4 line-clamp-2 text-sm text-neutral-400 leading-relaxed">
                    {project.challenge}
                  </p>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Qty: {project.quantity}
                    </div>
                    <Link 
                      href={`/projects/${project.slug}/`}
                      className="text-xs font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-lime-400/50 hover:text-lime-400 hover:decoration-lime-400"
                    >
                      View Case Study
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Launch Your Team Project</h2>
          <p className="mt-6 text-xl text-neutral-600">
            Join the elite teams and academies already partnering with POXIOL for their custom manufacturing needs.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <PrimaryButton>Start Custom Order</PrimaryButton>
            <Link 
              href="/free-mockup/"
              className="flex h-[60px] items-center justify-center rounded-full border-2 border-neutral-950 px-10 text-base font-black uppercase transition hover:bg-neutral-950 hover:text-white"
            >
              Get Free Mockup
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
