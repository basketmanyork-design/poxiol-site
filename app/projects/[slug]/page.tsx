import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {QualifiedExplanationNotice} from '@/components/evidence/QualifiedExplanationNotice';
import { Header, Footer, PrimaryButton } from "@/components/ui";
import { getProject, getProjects } from "@/lib/sanity/content";
import { ContentViewTracker } from "@/components/analytics/ContentViewTracker";
import {publicSectionDecision} from '@/lib/release/publication-policy';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };
  return { title: project.seo.title, description: project.seo.description, alternates: { canonical: project.seo.canonicalUrl || `https://www.poxiol.com/projects/${project.slug}/` }, openGraph: { title: project.seo.title, description: project.seo.description }, robots: project.seo.noIndex ? { index: false, follow: false } : undefined };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = params;
  const project = await getProject(slug);
  if (!project) notFound();
  const baseUrl = "https://www.poxiol.com";
  const planningDecision = publicSectionDecision('project-planning');

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <ContentViewTracker event="case_study_view" params={{content_type: "case-study", content_slug: project.slug}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${baseUrl}/`},{"@type":"ListItem",position:2,name:"Projects",item:`${baseUrl}/projects/`},{"@type":"ListItem",position:3,name:project.title,item:`${baseUrl}/projects/${project.slug}/`}]})}} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/projects/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-[#B6FF00]">← Back to Projects</Link>
          <div className="mt-10 mx-auto max-w-4xl">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest text-[#B6FF00]"><span>{project.product}</span><span className="h-1 w-1 rounded-full bg-white/20" /><span>{project.country}</span><span className="border-l border-white/20 pl-2 text-neutral-400">Planning Scenario</span></div>
              <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">{project.title}</h1>
              {planningDecision === 'QUALIFIED_EXPLANATION' ? (
                <div className="mt-10 text-neutral-950"><QualifiedExplanationNotice /></div>
              ) : null}
              {planningDecision !== 'WITHHELD' ? <div className="mt-12 space-y-10">
                {[
                  ['Planning Overview', project.overview],
                  ['Buyer Situation', project.challenge],
                  ['Planned POXIOL Approach', project.solution],
                  ['Materials & Customization', [project.materials, project.customization].filter(Boolean).join(' ')],
                  ['Sample & Production Planning', [project.sampleProcess, project.production].filter(Boolean).join(' ')],
                  ['Planned QC Checkpoints', project.qualityControl],
                  ['Packaging & Delivery Planning', [project.packaging, project.delivery].filter(Boolean).join(' ')],
                  ['Intended Outcome', project.result],
                ].filter(([, body]) => body).map(([title, body]) => (
                  <div key={title}>
                    <h2 className="text-xl font-black uppercase tracking-tight text-[#B6FF00]">{title}</h2>
                    <p className="mt-4 text-base leading-relaxed text-neutral-300">{body}</p>
                  </div>
                ))}
              </div> : null}
              <div className="mt-16"><PrimaryButton href="/free-mockup/">Get a Free Mockup</PrimaryButton></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
