import type {V8ContentCard} from '@/lib/v8/types.ts'

export function CardGrid({items}: {items: readonly V8ContentCard[]}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" role="list">
      {items.map((item) => (
        <article key={item.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm" role="listitem">
          <h3 className="text-xl font-black text-neutral-950">{item.title}</h3>
          <p className="mt-3 leading-7 text-neutral-600">{item.description}</p>
        </article>
      ))}
    </div>
  )
}
