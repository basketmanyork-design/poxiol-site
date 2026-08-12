import type {V8ProcessStep} from '@/lib/v8/types.ts'

export function ProcessTimeline({steps}: {steps: readonly V8ProcessStep[]}) {
  return (
    <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.id} className="rounded-3xl border border-neutral-200 bg-white p-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-sm font-black text-[#B6FF00]" aria-hidden="true">
            {index + 1}
          </span>
          <h3 className="mt-5 text-xl font-black text-neutral-950">{step.title}</h3>
          <p className="mt-3 leading-7 text-neutral-600">{step.description}</p>
        </li>
      ))}
    </ol>
  )
}
