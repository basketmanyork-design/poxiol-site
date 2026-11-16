import Link from "next/link";
import { Header, Footer, SectionHeading } from "@/components/ui";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/StructuredData";
import {FAQSchema} from "@/components/seo/GEOStructuredData";
import { getArticles } from "@/lib/sanity/content";
import { createPageMetadata, PRESERVED_ROOT_TWITTER_METADATA } from "@/lib/seo/page-metadata";
import RouteBreadcrumbs from "@/components/seo/RouteBreadcrumbs";

export const metadata = createPageMetadata({
  title: "Teamwear Knowledge Center | Buying Guides & Specs",
  description: "Buying guides, fabric and sizing specs, and manufacturing know-how for custom teamwear buyers, written for clubs, schools, brands and distributors.",
  canonical: "/resources/",
  metadata: { twitter: PRESERVED_ROOT_TWITTER_METADATA },
});

export default async function ResourcesPage() {
  const resourceArticles = await getArticles("resource");
  const resources = Array.from(new Map(resourceArticles.map((article) => [article.slug, article])).values());
  const guides = await getArticles("guide");
  return (
    <main className="bg-[#0A0A0A] text-white selection:bg-[#B6FF00] selection:text-black">
      <StructuredData data={[organizationSchema, websiteSchema]} />
      <RouteBreadcrumbs trail={[{name: 'Resources', path: '/resources/'}]} />
      <Header />
      <section className="bg-neutral-950 px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading level="h1" eyebrow="Knowledge Center" title="Teamwear Knowledge & Buying Guides" subtitle="Our resources and guides are regularly updated with practical manufacturing insights." dark center />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[{ title: "Manufacturing Hub", href: "/manufacturing/", desc: "OEM & ODM production processes." }, { title: "Projects Gallery", href: "/projects/", desc: "Review project evidence and manufacturing scenarios." }, { title: "FAQ Center", href: "/faq/", desc: "Get answers to common questions." }].map((item) => (
              <Link key={item.title} href={item.href} className="group flex flex-col items-center rounded-3xl border border-lime-400/20 bg-lime-400/5 p-8 text-center transition hover:bg-lime-400/10">
                <h3 className="text-xl font-black uppercase text-lime-400">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
                <span className="mt-4 text-xs font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-lime-400/50">Explore Hub &rarr;</span>
              </Link>
            ))}
          </div>
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...resources, ...guides].map((article) => (
              <Link key={`${article.articleType}-${article.slug}`} href={`/${article.articleType === "resource" ? "resources" : "guides"}/${article.slug}/`} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10">
                <h2 className="text-2xl font-black uppercase tracking-tight text-lime-400">{article.title}</h2>
                <p className="mt-4 text-sm text-neutral-400 line-clamp-3">{article.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-neutral-950 border-t border-white/5 px-5 py-20 text-white md:px-10 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">Sourcing references</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-400">These pages explain the mechanics behind a teamwear order rather than promoting one, so they are the right starting point before a brief is written.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link key="/how-to-choose-a-teamwear-manufacturer/" href="/how-to-choose-a-teamwear-manufacturer/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Choosing a Manufacturer</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">What to check before placing a teamwear order.</p>
            </Link>
            <Link key="/how-sublimation-printing-works-for-teamwear/" href="/how-sublimation-printing-works-for-teamwear/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">How Sublimation Works</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">The process behind full-colour teamwear decoration.</p>
            </Link>
            <Link key="/best-sportswear-fabrics/" href="/best-sportswear-fabrics/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Sportswear Fabrics</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">How the common teamwear fabrics behave.</p>
            </Link>
            <Link key="/printing-guide/" href="/printing-guide/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Printing Guide</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Sublimation, screen printing and embroidery compared.</p>
            </Link>
            <Link key="/fabric-guide/" href="/fabric-guide/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Fabric Guide</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Mesh, interlock and quick-dry polyester in practice.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 border-t border-white/5 px-5 py-20 text-white md:px-10 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">Rules and terminology</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-400">Most kit questions start as a rules question: which position wears which number, who wears a different colour, what the letters on a shirt mean. These pages answer that part, then close on the garment decision it creates.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link key="/basketball-positions-explained/" href="/basketball-positions-explained/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Basketball Positions</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">The five roles, and what each one asks of a jersey.</p>
            </Link>
            <Link key="/soccer-offside-rule-explained/" href="/soccer-offside-rule-explained/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">The Offside Rule</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Why it is called, and what it means for a kit order.</p>
            </Link>
            <Link key="/baseball-positions-and-numbers-explained/" href="/baseball-positions-and-numbers-explained/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Baseball Positions and Numbers</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Position numbering, and how it drives jersey numbers.</p>
            </Link>
            <Link key="/volleyball-positions-explained/" href="/volleyball-positions-explained/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Volleyball Positions</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Six roles, and the one that forces a second jersey colour.</p>
            </Link>
            <Link key="/football-positions-explained/" href="/football-positions-explained/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">American Football Positions</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Units, the safety, and why numbering is decided first.</p>
            </Link>
            <Link key="/what-the-a-and-c-mean-on-a-jersey/" href="/what-the-a-and-c-mean-on-a-jersey/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">The A and C on a Jersey</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">What the letters mean, and who gets them.</p>
            </Link>
            <Link key="/team-name-ideas-for-sports-clubs/" href="/team-name-ideas-for-sports-clubs/" className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-lime-400">Team Name Ideas</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">How clubs name themselves, and what to check before printing.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 border-t border-white/5 px-5 py-20 text-white md:px-10 xl:px-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">Buyer questions</h2>
          <div className="mt-10 space-y-8">
          <div key="Where should a buyer start"><h3 className="text-lg font-black">Where should a buyer start before requesting a teamwear quote?</h3><p className="mt-2 leading-7 text-neutral-400">Start from the four inputs a quotation is built on: the garment set, a size breakdown, the artwork or reference design and the required in-hand date. A brief that names all four can be reviewed in one pass instead of several.</p></div>
          <div key="Can a manufacturer review "><h3 className="text-lg font-black">Can a manufacturer review a design without a technical pack?</h3><p className="mt-2 leading-7 text-neutral-400">Yes. A reference image, a sketch or an existing garment is enough to start a mockup review. A technical pack becomes useful later, when the construction and measurements have to be fixed.</p></div>
          <div key="What does a sample review "><h3 className="text-lg font-black">What does a sample review actually prove?</h3><p className="mt-2 leading-7 text-neutral-400">It proves how the chosen fabric, decoration and construction behave together on the wearer. It does not prove that a later bulk run will match it exactly, which is why the approved sample is kept as the reference for the order.</p></div>
          <div key="How is artwork ownership h"><h3 className="text-lg font-black">How is artwork ownership handled?</h3><p className="mt-2 leading-7 text-neutral-400">The buyer keeps ownership of the artwork they supply. Any league, club or third-party mark has to be authorised by the buyer before it is used in production.</p></div>
          <div key="Why do pages on this site "><h3 className="text-lg font-black">Why do pages on this site avoid fixed MOQ and lead-time numbers?</h3><p className="mt-2 leading-7 text-neutral-400">Because both are decided by the garment, the quantity and the schedule for that order. Publishing one figure would be accurate for almost nobody, so the specific answer is confirmed against the brief.</p></div>
          </div>
        </div>
      </section>
      <FAQSchema faqs={[
    {question: "Where should a buyer start before requesting a teamwear quote?", answer: "Start from the four inputs a quotation is built on: the garment set, a size breakdown, the artwork or reference design and the required in-hand date. A brief that names all four can be reviewed in one pass instead of several."},
    {question: "Can a manufacturer review a design without a technical pack?", answer: "Yes. A reference image, a sketch or an existing garment is enough to start a mockup review. A technical pack becomes useful later, when the construction and measurements have to be fixed."},
    {question: "What does a sample review actually prove?", answer: "It proves how the chosen fabric, decoration and construction behave together on the wearer. It does not prove that a later bulk run will match it exactly, which is why the approved sample is kept as the reference for the order."},
    {question: "How is artwork ownership handled?", answer: "The buyer keeps ownership of the artwork they supply. Any league, club or third-party mark has to be authorised by the buyer before it is used in production."},
    {question: "Why do pages on this site avoid fixed MOQ and lead-time numbers?", answer: "Because both are decided by the garment, the quantity and the schedule for that order. Publishing one figure would be accurate for almost nobody, so the specific answer is confirmed against the brief."},
  ]} />
            <section className="bg-neutral-950 px-5 pb-20 md:px-10 xl:px-20">
        <div className="mx-auto max-w-4xl border-t border-white/10 pt-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/50">Related guides</h2>
          <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/how-to-choose-a-teamwear-manufacturer/">How to Choose a Teamwear Manufacturer</a></li>
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/how-sublimation-printing-works-for-teamwear/">How Sublimation Printing Works</a></li>
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/best-sportswear-fabrics/">Best Fabrics for Teamwear</a></li>
            <li><a className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-lime-400" href="/oem-vs-odm-sportswear/">OEM vs ODM Sportswear</a></li>
          </ul>
        </div>
      </section>
<Footer />
    </main>
  );
}
