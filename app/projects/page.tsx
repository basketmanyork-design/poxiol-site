import Link from "next/link";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { getProjects } from "@/lib/sanity/content";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/StructuredData";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Success Stories" title="Featured Projects & Case Studies" subtitle="Review POXIOL teamwear programs for clubs, academies, schools, events and distributors, including QC, packing and production solutions." dark center />
          <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}/`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-lime-400/30">
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img src={project.image.url} alt={project.image.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-lime-400">
                    <span>{project.product}</span><span className="h-1 w-1 rounded-full bg-white/20" /><span>{project.country}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white transition group-hover:text-lime-400">{project.title}</h2>
                  <p className="mt-4 line-clamp-2 text-sm text-neutral-400 leading-relaxed">{project.overview}</p>
                  <div className="mt-8 text-xs font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-lime-400/50">View Case Study</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Launch Your Team Project</h2>
          <p className="mt-6 text-xl text-neutral-600">Join the teams and academies already partnering with POXIOL for custom manufacturing.</p>
          <div className="mt-10"><PrimaryButton>Start Custom Order</PrimaryButton></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
