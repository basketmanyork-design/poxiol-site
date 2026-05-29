import Link from "next/link";

const cards = [
  {
    title: "Manufacturing Hub",
    description: "Learn how OEM and ODM teamwear manufacturing works at POXIOL.",
    button: "LEARN MANUFACTURING",
    href: "/manufacturing/",
  },
  {
    title: "Projects Library",
    description: "Explore real-world teamwear projects and client success stories.",
    button: "VIEW PROJECTS",
    href: "/projects/",
  },
  {
    title: "Resources Center",
    description: "Everything you need to know about custom teamwear manufacturing.",
    button: "EXPLORE RESOURCES",
    href: "/resources/",
  },
  {
    title: "FAQ Center",
    description: "Answers to common questions about production, MOQ, and shipping.",
    button: "VIEW FAQ",
    href: "/faq/",
  },
  {
    title: "Fabric Guide",
    description: "Compare performance fabrics and choose the right material.",
    button: "EXPLORE FABRICS",
    href: "/fabric-guide/",
  },
  {
    title: "Printing Guide",
    description: "Learn sublimation, embroidery, and other decoration techniques.",
    button: "LEARN PRINTING",
    href: "/printing-guide/",
  },
];

export default function TeamwearKnowledgeCenter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
          POXIOL Resources
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl">
          Teamwear Knowledge Center
        </h2>
        <p className="mt-5 text-base leading-7 text-neutral-600 md:text-lg">
          Explore expert buying guides, manufacturing insights, fabric knowledge,
          printing resources and real-world teamwear projects.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold text-neutral-950">{card.title}</h3>
            <p className="mt-3 min-h-16 text-sm leading-6 text-neutral-600">
              {card.description}
            </p>
            <span className="mt-6 inline-flex text-sm font-bold tracking-wide text-neutral-950 group-hover:underline">
              {card.button} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
