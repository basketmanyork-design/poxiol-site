import Link from "next/link";

const guides = [
  {
    title: "How To Order Custom Basketball Uniforms",
    description: "A complete guide for schools, academies and clubs ordering basketball jerseys and shorts.",
    href: "/how-to-order-custom-basketball-uniforms",
  },
  {
    title: "Soccer Jersey Buying Guide",
    description: "Learn how to source custom soccer kits, goalkeeper jerseys and training wear.",
    href: "/soccer-jersey-buying-guide",
  },
  {
    title: "OEM vs ODM Sportswear Manufacturing",
    description: "Understand the right production model for your sportswear brand or teamwear business.",
    href: "/oem-vs-odm-sportswear",
  },
  {
    title: "Sublimation Printing Guide",
    description: "Learn why sublimation printing is widely used for modern custom teamwear.",
    href: "/sublimation-printing-guide",
  },
];

export default function FeaturedTeamwearGuides() {
  return (
    <section className="bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
              Buying Guides
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Featured Teamwear Guides
            </h2>
            <p className="mt-5 max-w-2xl text-neutral-300">
              Start with practical buying guides created for clubs, schools,
              distributors and sportswear brands.
            </p>
          </div>
          <Link
            href="/resources"
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-950"
          >
            VIEW ALL RESOURCES
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold">{guide.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {guide.description}
              </p>
              <span className="mt-6 inline-flex text-sm font-bold">READ GUIDE →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
