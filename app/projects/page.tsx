import type { Metadata } from "next";
import Link from "next/link";
import {QualifiedExplanationNotice} from '@/components/evidence/QualifiedExplanationNotice';
import { Header, Footer, PrimaryButton } from "@/components/ui";
import {publicSectionDecision} from '@/lib/release/publication-policy';
import { getProjects } from "@/lib/sanity/content";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const planningDecision = publicSectionDecision('project-planning');

  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B6FF00]">Project Planning</p>
            <h1 className="mt-4 break-words text-4xl font-black uppercase tracking-tight md:text-6xl">Teamwear Planning Scenarios</h1>
            <p className="mt-6 text-lg leading-8 text-neutral-400">Use these scenarios to organize the client brief, sample review, quality checkpoints, packing needs and target delivery window before requesting a project-specific plan.</p>
          </div>
          {planningDecision === 'QUALIFIED_EXPLANATION' ? (
            <div className="mx-auto mt-12 max-w-4xl text-neutral-950">
              <QualifiedExplanationNotice />
            </div>
          ) : null}
          {planningDecision !== 'WITHHELD' ? <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}/`} className="group border-t border-white/15 py-8 transition hover:border-lime-400">
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-400">
                    <span>{project.product}</span><span className="h-1 w-1 rounded-full bg-white/20" /><span>{project.country}</span>
                    <span className="border-l border-white/20 pl-2 text-neutral-400">Planning Scenario</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white transition group-hover:text-lime-400">{project.title}</h2>
                  <p className="mt-4 line-clamp-2 text-sm text-neutral-400 leading-relaxed">{project.overview}</p>
                  <div className="mt-8 text-xs font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-lime-400/50">View Case Study</div>
                </div>
              </Link>
            ))}
          </div> : null}
        </div>
      </section>
      <section className="bg-white px-5 py-20 md:px-10 md:py-28 xl:px-20 text-neutral-950">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">Launch Your Team Project</h2>
          <p className="mt-6 text-xl text-neutral-600">Use the planning structure, then share your real roster, artwork, quantity and target date for a project-specific review.</p>
          <div className="mt-10"><PrimaryButton>Get a Free Mockup</PrimaryButton></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
