import type {ReactNode} from 'react'

export function QualifiedExplanationNotice({children}: {children?: ReactNode}) {
  return (
    <aside className="border-l-4 border-[#B6FF00] bg-neutral-100 px-5 py-4 text-left text-sm leading-6 text-neutral-700">
      <p>
        This is a planning explanation, not a customer project, factory record,
        quality result, delivery result or production guarantee.
      </p>
      {children ? <div className="mt-2 text-neutral-600">{children}</div> : null}
    </aside>
  )
}
