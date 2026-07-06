import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { caseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import Link from "next/link";
import { CaseStudySchema } from "@/components/seo/GEOStructuredData";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return caseStudies.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudyBySlug(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | POXIOL B2B Case Study`,
    description: project.overview,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getCaseStudyBySlug(slug);

  if (!project) notFound();

  const baseUrl = "https://www.poxiol.com";

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <CaseStudySchema 
        title={project.title} 
        url={`${baseUrl}/projects/${project.slug}/`} 
        description={project.overview} 
        keywords={project.snapshot.map(s => s.details).filter(d => d.length < 50)}
      />
      <Header />
      
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <Link 
            href="/projects/"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-[#B6FF00]"
          >
            <span className="mr-2">←</span> Back to Projects
          </Link>
          
          <div className="mt-10 grid gap-16 lg:grid-cols-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#B6FF00]">
                <span>{project.clientType}</span>
                <span className="h-1 w-1 rounded-full bg-white/20"></span>
                <span>{project.country}</span>
              </div>
              <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
                {project.title}
              </h1>
              
              {/* Project Snapshot Table */}
              <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.04]">
                       <th colSpan={2} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-lime-400">Project Snapshot</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {project.snapshot.map((row, idx) => (
                      <tr key={row.item} className={idx !== project.snapshot.length - 1 ? "border-b border-white/5" : ""}>
                        <td className="px-6 py-4 font-bold text-white w-1/3">{row.item}</td>
                        <td className="px-6 py-4 text-neutral-400">{row.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-12 space-y-10">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">Project Overview</h2>
                  <p className="mt-4 text-base leading-relaxed text-neutral-300">{project.overview}</p>
                </div>

                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">Buyer Background</h2>
                  <p className="mt-4 text-base leading-relaxed text-neutral-300">{project.buyerBackground}</p>
                </div>

                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">Main Challenge</h2>
                  <p className="mt-4 text-base leading-relaxed text-neutral-300">{project.challenge}</p>
                </div>

                {project.orderRequirements && project.orderRequirements.length > 0 && (
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">Order Requirements</h2>
                    <ul className="mt-4 space-y-3">
                      {project.orderRequirements.map((req, i) => (
                        <li key={i} className="flex items-start text-base text-neutral-300">
                          <span className="mr-3 text-[#B6FF00] font-bold">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">POXIOL Solution</h2>
                  <p className="mt-4 text-base leading-relaxed text-neutral-300">{project.solution}</p>
                </div>

                {project.productionTimeline && project.productionTimeline.length > 0 && (
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">Production Timeline</h2>
                    <div className="mt-4 space-y-4 border-l-2 border-lime-400/20 pl-6">
                      {project.productionTimeline.map((step, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-neutral-950 bg-lime-400"></div>
                          <p className="text-base text-neutral-300 font-bold">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">QC Process</h2>
                  <p className="mt-4 text-base leading-relaxed text-neutral-300">{project.qualityControl}</p>
                </div>

                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">Result</h2>
                  <p className="mt-4 text-lg font-bold leading-relaxed text-[#B6FF00]">{project.result}</p>
                </div>
              </div>
              
              <div className="mt-16">
                <PrimaryButton href="/free-mockup/">Start Similar Project</PrimaryButton>
              </div>
            </div>
            
            <div className="flex flex-col space-y-8 lg:sticky lg:top-24 h-fit">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 shadow-xl">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 relative group">
                  <img src="/images/poxiol-v6/manufacturing_sublimation_printing.png" alt="Sublimation printing process" className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition" />
                  <p className="absolute bottom-4 left-4 text-[10px] font-black uppercase text-white tracking-widest">Sublimation</p>
                </div>
                <div className="aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 relative group">
                  <img src="/images/poxiol-v6/manufacturing_quality_control.png" alt="Quality control process" className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition" />
                  <p className="absolute bottom-4 left-4 text-[10px] font-black uppercase text-white tracking-widest">Quality Control</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
