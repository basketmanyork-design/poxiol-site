import { BreadcrumbSchema } from './GEOStructuredData'

const BASE = 'https://www.poxiol.com'

/**
 * Emits a BreadcrumbList for hand-built pages that do not use PageTemplate.
 * Home is always prepended, so a page only declares its own trail.
 */
export default function RouteBreadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  const items = [{ name: 'Home', url: `${BASE}/` }].concat(
    trail.map((entry) => ({ name: entry.name, url: `${BASE}${entry.path}` })),
  )
  return <BreadcrumbSchema items={items} />
}
