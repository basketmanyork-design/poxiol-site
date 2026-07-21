import 'server-only'

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oqpv1xbc'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const VERSION = '2024-01-01'

export type ContentSource = 'legacy' | 'sanity-preview'

export const contentSource: ContentSource =
  process.env.NEXT_PUBLIC_CONTENT_SOURCE === 'sanity-preview'
    ? 'sanity-preview'
    : 'legacy'

type QueryParams = Record<string, unknown>

type PreviewClientConfig = {
  perspective: 'drafts'
  useCdn: false
  token: string
}

function createPreviewClientConfig(): PreviewClientConfig | null {
  if (contentSource !== 'sanity-preview') return null

  const token = process.env.SANITY_READ_TOKEN
  if (!token) return null

  return {
    perspective: 'drafts',
    useCdn: false,
    token,
  }
}

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  const config = createPreviewClientConfig()
  if (!config) return null

  const apiBase = process.env.SANITY_API_BASE_URL || `https://${PROJECT}.api.sanity.io`
  const url = new URL(`/v${VERSION}/data/query/${DATASET}`, apiBase)
  url.searchParams.set('query', query)
  url.searchParams.set('perspective', config.perspective)
  url.searchParams.set('returnQuery', 'false')

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      cache: 'force-cache',
    })

    if (!response.ok) return null

    const payload = await response.json() as {result?: T}
    return payload.result ?? null
  } catch {
    return null
  }
}
