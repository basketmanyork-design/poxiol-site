export type InquiryIntersection<T> = {
  target: T
  isIntersecting: boolean
}

export function updateVisibleInquiryForms<T>(
  current: ReadonlySet<T>,
  entries: readonly InquiryIntersection<T>[],
) {
  const next = new Set(current)

  for (const entry of entries) {
    if (entry.isIntersecting) next.add(entry.target)
    else next.delete(entry.target)
  }

  return next
}
