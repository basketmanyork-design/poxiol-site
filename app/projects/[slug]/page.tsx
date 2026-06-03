import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer, SectionHeading, PrimaryButton } from "@/components/ui";
import { caseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import Link from "next/link";

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
    title: `${project.title} | POXIOL Case Study`,
    description: project.challenge,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getCaseStudyBySlug(slug);

  if (!project) notFound();

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <Header />
      
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <Link 
            href="/projects/"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-lime-400"
          >
            <span className="mr-2">←</span> Back to Projects
          </Link>
          
          <div className="mt-10 grid gap-16 lg:grid-cols-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-lime-400">
                <span>{project.clientType}</span>
                <span className="h-1 w-1 rounded-full bg-white/20"></span>
                <span>{project.country}</span>
              </div>
              <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
                {project.title}
              </h1>
              
              <div className="mt-12 grid grid-cols-2 gap-8 border-y border-white/10 py-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Quantity</h3>
                  <p className="mt-2 text-xl font-bold">{project.quantity}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Product</h3>
                  <p className="mt-2 text-xl font-bold">{project.product}</p>
                </div>
              </div>

              <div className="mt-12 space-y-10">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-lime-400">The Challenge</h2>
                  <p className="mt-4 text-lg leading-relaxed text-neutral-400">{project.challenge}</p>
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-lime-400">The Solution</h2>
                  <p className="mt-4 text-lg leading-relaxed text-neutral-400">{project.solution}</p>
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-lime-400">The Result</h2>
                  <p className="mt-4 text-lg leading-relaxed text-neutral-400">{project.result}</p>
                </div>
              </div>
              
              <div className="mt-16">
                <PrimaryButton>Start Similar Project</PrimaryButton>
              </div>
            </div>
            
            <div className="flex flex-col space-y-8">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-3xl bg-neutral-900">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="aspect-square overflow-hidden rounded-3xl bg-neutral-900">
                  <img src="https://placehold.co/600x600/0a0a0a/ffffff?text=Detail+1" alt="Project Detail 1" className="h-full w-full object-cover opacity-50" />
                </div>
                <div className="aspect-square overflow-hidden rounded-3xl bg-neutral-900">
                  <img src="https://placehold.co/600x600/0a0a0a/ffffff?text=Detail+2" alt="Project Detail 2" className="h-full w-full object-cover opacity-50" />
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
