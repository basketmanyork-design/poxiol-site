export type SanityRequestPolicy = {
  perspective: 'published' | 'drafts'
  useCdn: boolean
  cache: RequestCache
  token?: string
  cacheBuster?: string
}

type ContentSource = 'legacy' | 'sanity-preview' | 'sanity'

type PolicyEnvironment = {
  token?: string
  previewBuildId?: string
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
      cacheBuster: environment.previewBuildId || 'local-preview-build',
    }
  }

  return {
    perspective: 'published',
    useCdn: true,
    cache: 'force-cache',
  }
}
