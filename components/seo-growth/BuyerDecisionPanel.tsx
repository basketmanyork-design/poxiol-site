import Link from 'next/link'

import type {BuyerDecisionContent} from '@/lib/seo-growth/seo-033-content'

type BuyerDecisionPanelProps = {
  content: BuyerDecisionContent
}

const columns = [
  ['Option', 'option'],
  ['Starting point', 'startingPoint'],
  ['Confirm', 'confirm'],
  ['Next step', 'nextStep'],
] as const

export function BuyerDecisionPanel({content}: BuyerDecisionPanelProps) {
  return (
    <section
      data-seo033-panel={content.id}
      aria-labelledby={`${content.id}-title`}
      className="bg-neutral-100 px-5 py-16 text-neutral-950 md:px-10 md:py-24 xl:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-600">
          {content.eyebrow}
        </p>
        <h2
          id={`${content.id}-title`}
          className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl"
        >
          {content.title}
        </h2>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-neutral-700">
          {content.answer}
        </p>

        <div className="mt-10 hidden overflow-hidden rounded-3xl border border-neutral-300 bg-white md:block">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="bg-neutral-950 text-white">
              <tr>
                {columns.map(([label]) => (
                  <th key={label} scope="col" className="px-5 py-4 text-sm font-black">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row) => (
                <tr key={row.option} className="border-t border-neutral-200 align-top">
                  {columns.map(([label, field], index) => (
                    <td key={field} className="px-5 py-5 text-sm leading-6 text-neutral-700">
                      {index === 0 ? <strong className="text-neutral-950">{row[field]}</strong> : row[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 md:hidden">
          {content.rows.map((row) => (
            <article key={row.option} className="rounded-2xl border border-neutral-300 bg-white p-5">
              <h3 className="text-lg font-black">{row.option}</h3>
              <dl className="mt-4 grid gap-4">
                {columns.slice(1).map(([label, field]) => (
                  <div key={field}>
                    <dt className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">{label}</dt>
                    <dd className="mt-1 text-sm leading-6 text-neutral-700">{row[field]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 rounded-3xl bg-neutral-950 p-6 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <h3 className="text-2xl font-black">Prepare the project brief</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.checklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-200">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B6FF00]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label={`${content.eyebrow} next steps`}>
            <h3 className="text-2xl font-black">Continue planning</h3>
            <ul className="mt-6 grid gap-3">
              {content.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-black text-[#B6FF00] underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF00]"
                  >
                    {link.label} <span aria-hidden="true">&nbsp;→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
