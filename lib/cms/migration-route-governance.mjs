export function collectPermanentRedirectSources(candidates, normalizeRoute) {
  return new Set(candidates
    .filter((candidate) => candidate.type === 'redirectRule'
      && candidate.route
      && [301, 308].includes(Number(candidate.fields?.redirectType)))
    .map((candidate) => normalizeRoute(candidate.route)))
}
