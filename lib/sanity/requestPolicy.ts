export type SanityRequestPolicy = {
  perspective: 'published' | 'drafts'
  useCdn: boolean
  cache: RequestCache
  token?: string
  requestTag?: string
}

type ContentSource = 'legacy' | 'sanity-preview' | 'sanity'

type PolicyEnvironment = {
  token?: string
  previewBuildId?: string
}

function normalizeRequestTag(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 75)
}

export function resolveSanityRequestPolicy(
  contentSource: ContentSource,
  environment: PolicyEnvironment,
): SanityRequestPolicy | null {
  if (contentSource === 'legacy') return null

  if (contentSource === 'sanity-preview') {
    if (!environment.token) return null
    return {
      perspective: 'drafts',
      useCdn: false,
      cache: 'force-cache',
      token: environment.token,
      requestTag: normalizeRequestTag(environment.previewBuildId || 'local-preview-build'),
    }
  }

  return {
    perspective: 'published',
    useCdn: true,
    cache: 'force-cache',
  }
}
