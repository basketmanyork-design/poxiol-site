import 'server-only'

import type {CmsMode} from '@/lib/cms/types'

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oqpv1xbc'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const VERSION = '2024-01-01'

export const contentSource: CmsMode =
  process.env.NEXT_PUBLIC_CONTENT_SOURCE === 'legacy'
    ? 'legacy'
    : process.env.NEXT_PUBLIC_CONTENT_SOURCE === 'sanity-preview'
      ? 'sanity-preview'
      : 'sanity'

type QueryParams = Record<string, unknown>

type ClientConfig = {
  perspective: 'published' | 'drafts'
  useCdn: boolean
  token?: string
}

function createClientConfig(): ClientConfig | null {
  if (contentSource === 'legacy') return null

  if (contentSource === 'sanity-preview') {
    const token = process.env.SANITY_READ_TOKEN
    if (!token) return null

    return {
      perspective: 'drafts',
      useCdn: false,
      token,
    }
  }

  return {
    perspective: 'published',
    useCdn: true,
  }
}

export function isSanityMode() {
  return contentSource !== 'legacy'
}

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  const config = createClientConfig()
  if (!config) return null

  const host = config.useCdn ? `${PROJECT}.apicdn.sanity.io` : `${PROJECT}.api.sanity.io`
  const apiBase = process.env.SANITY_API_BASE_URL || `https://${host}`
  const url = new URL(`/v${VERSION}/data/query/${DATASET}`, apiBase)
  url.searchParams.set('query', query)
  url.searchParams.set('perspective', config.perspective)
  url.searchParams.set('returnQuery', 'false')

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }

  const headers: HeadersInit = {Accept: 'application/json'}
  if (config.token) headers.Authorization = `Bearer ${config.token}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'force-cache',
    })

    if (!response.ok) return null

    const payload = await response.json() as {result?: T}
    return payload.result ?? null
  } catch {
    return null
  }
}
