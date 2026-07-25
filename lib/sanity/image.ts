const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oqpv1xbc'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

type SanityImageSource = {
  asset?: {
    _ref?: string
  }
}

function buildImageUrl(
  ref: string,
  options: Record<string, number | string> = {},
): string | null {
  const match = /^image-([^-]+)-(\d+x\d+)-([a-z0-9]+)$/i.exec(ref)
  if (!match) return null

  const [, id, dimensions, format] = match
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(options)) {
    params.set(key, String(value))
  }
  params.set('auto', 'format')

  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${format}?${params.toString()}`
}

function getRef(source: SanityImageSource | null | undefined): string | null {
  return source?.asset?._ref || null
}

export function heroImageUrl(
  source: SanityImageSource | null | undefined,
  mobile = false,
): string | null {
  const ref = getRef(source)
  if (!ref) return null
  return buildImageUrl(ref, {
    w: mobile ? 720 : 900,
    q: mobile ? 78 : 82,
    fit: 'crop',
  })
}

export function cardImageUrl(source: SanityImageSource | null | undefined): string | null {
  const ref = getRef(source)
  if (!ref) return null
  return buildImageUrl(ref, {w: 400, h: 400, q: 75, fit: 'crop'})
}

export function thumbnailUrl(source: SanityImageSource | null | undefined): string | null {
  const ref = getRef(source)
  if (!ref) return null
  return buildImageUrl(ref, {w: 200, h: 200, q: 70})
}
