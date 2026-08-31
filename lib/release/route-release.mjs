function normalizeRoute(value) {
  const raw = String(value || '').trim()
  if (!raw) throw new Error('INVALID_ROUTE:empty')
  let path = raw
  if (/^https?:\/\//i.test(raw)) path = new URL(raw).pathname
  path = `/${path}`.replace(/\/{2,}/g, '/')
  if (path !== '/' && !path.endsWith('/')) path += '/'
  return path
}

function normalizedUnique(values, label) {
  const normalized = (values || []).map(normalizeRoute)
  const seen = new Set()
  for (const route of normalized) {
    if (seen.has(route)) throw new Error(`DUPLICATE_ROUTE:${label}:${route}`)
    seen.add(route)
  }
  return normalized.sort()
}

function normalizeRedirects(redirects) {
  const normalized = (redirects || []).map((redirect) => {
    if (typeof redirect === 'string') {
      const [source, destination] = redirect.trim().split(/\s+/)
      return {source: normalizeRoute(source), destination: normalizeRoute(destination)}
    }
    return {
      source: normalizeRoute(redirect.source || redirect.sourcePath),
      destination: normalizeRoute(redirect.destination || redirect.destinationPath),
      status: redirect.status || redirect.redirectType,
    }
  })
  const sources = normalizedUnique(normalized.map((item) => item.source), 'redirect-source')
  const bySource = new Map(normalized.map((item) => [item.source, item]))
  return sources.map((source) => bySource.get(source))
}

export function shouldRequireExactManifest(environment = process.env) {
  if (environment.NEXT_PUBLIC_CONTENT_SOURCE === 'legacy' && environment.CF_PAGES !== '1') {
    return false
  }
  return !(
    environment.CF_PAGES === '1' &&
    environment.CF_PAGES_BRANCH &&
    environment.CF_PAGES_BRANCH !== 'main'
  )
}

export function manifestsEquivalent(current, expected) {
  return JSON.stringify(JSON.parse(current)) === JSON.stringify(JSON.parse(expected))
}

export function withheldLegalRoutes(approval, legalRoutes = []) {
  const approved = approval?.status === 'APPROVED'
    && Boolean(approval.approvedAt?.trim())
    && Boolean(approval.approvedBy?.trim())
  return approved ? [] : [...legalRoutes]
}

export function compareRoutes({
  publicUrls = [],
  candidateUrls = [],
  renderedUrls = candidateUrls,
  withheldLegal = [],
  redirects = [],
  gone = [],
}) {
  const published = normalizedUnique(publicUrls, 'public')
  const candidate = normalizedUnique(candidateUrls, 'candidate')
  const rendered = normalizedUnique(renderedUrls, 'rendered')
  const withheld = normalizedUnique(withheldLegal, 'withheld-legal')
  const approvedGone = normalizedUnique(gone, 'gone')
  const redirectRules = normalizeRedirects(redirects)

  const candidateSet = new Set(candidate)
  const renderedSet = new Set(rendered)
  const redirectSources = new Set(redirectRules.map((rule) => rule.source))
  const goneSet = new Set(approvedGone)
  const withheldSet = new Set(withheld)

  for (const rule of redirectRules) {
    if (!renderedSet.has(rule.destination)) {
      throw new Error(`REDIRECT_DESTINATION_NOT_RENDERED:${rule.source}->${rule.destination}`)
    }
  }

  for (const route of withheld) {
    if (!renderedSet.has(route)) throw new Error(`WITHHELD_LEGAL_NOT_RENDERED:${route}`)
    if (candidateSet.has(route)) throw new Error(`WITHHELD_LEGAL_DISCOVERABLE:${route}`)
  }

  const preserved = published.filter((route) => candidateSet.has(route))
  const added = candidate.filter((route) => !published.includes(route))
  const redirected = published.filter((route) => !candidateSet.has(route) && redirectSources.has(route))
  const owner410Required = published.filter((route) => !candidateSet.has(route) && goneSet.has(route))
  const unexplained = published.filter((route) =>
    !candidateSet.has(route) && !redirectSources.has(route) && !goneSet.has(route) && !withheldSet.has(route),
  )

  if (unexplained.length) throw new Error(`UNEXPLAINED_ROUTE_REMOVAL:${unexplained.join(',')}`)

  return {
    preserved,
    added,
    redirected,
    withheldLegal: withheld,
    owner410Required,
    redirects: redirectRules,
  }
}

export {normalizeRoute}
