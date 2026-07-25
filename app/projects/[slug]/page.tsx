import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer, PrimaryButton } from "@/components/ui";
import { getProject, getProjects } from "@/lib/sanity/content";
import { CaseStudySchema } from "@/components/seo/GEOStructuredData";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };
  return { title: project.seo.title, description: project.seo.description, alternates: { canonical: project.seo.canonicalUrl || `https://www.poxiol.com/projects/${project.slug}/` }, openGraph: { title: project.seo.title, description: project.seo.description, images: [{ url: project.image.url, alt: project.image.alt }] }, robots: project.seo.noIndex ? { index: false, follow: false } : undefined };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = params;
  const project = await getProject(slug);
  if (!project) notFound();
  const baseUrl = "https://www.poxiol.com";

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <CaseStudySchema title={project.title} url={`${baseUrl}/projects/${project.slug}/`} description={project.overview} keywords={[project.country, project.product].filter(Boolean)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${baseUrl}/`},{"@type":"ListItem",position:2,name:"Projects",item:`${baseUrl}/projects/`},{"@type":"ListItem",position:3,name:project.title,item:`${baseUrl}/projects/${project.slug}/`}]})}} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/projects/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-[#B6FF00]">← Back to Projects</Link>
          <div className="mt-10 grid gap-16 lg:grid-cols-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#B6FF00]"><span>{project.product}</span><span className="h-1 w-1 rounded-full bg-white/20" /><span>{project.country}</span></div>
              <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">{project.title}</h1>
              <div className="mt-12 space-y-10">
                {[['Project Overview', project.overview], ['POXIOL Solution', project.solution], ['QC Process', project.qualityControl], ['Packaging & Delivery', project.packaging]].map(([title, body]) => (
                  <div key={title}>
                    <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">{title}</h2>
                    <p className="mt-4 text-base leading-relaxed text-neutral-300">{body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-16"><PrimaryButton href="/free-mockup/">Start Similar Project</PrimaryButton></div>
            </div>
            <div className="h-fit lg:sticky lg:top-24">
              <img src={project.image.url} alt={project.image.alt} className="aspect-[4/3] w-full rounded-[2rem] border border-white/10 object-cover" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
