const cloudIndicators = ['CF_PAGES', 'CF_PAGES_URL', 'VERCEL', 'VERCEL_ENV']

export function assertLocalHybridReview(environment = process.env) {
  const reject = () => { throw new Error('LOCAL_HYBRID_REVIEW_ONLY') }
  if (environment.CF_PAGES === '1' && environment.CF_PAGES_BRANCH && environment.CF_PAGES_BRANCH !== 'main') return
  if (environment.POXIOL_INTEGRATION_REVIEW !== 'local') reject()
  if (cloudIndicators.some((name) => Boolean(environment[name]))) reject()

  const rawOrigin = environment.POXIOL_INTEGRATION_ORIGIN
  let origin
  try { origin = new URL(rawOrigin) } catch { reject() }
  const hasExplicitPort = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\]):\d+\/?$/i.test(rawOrigin)
  if (origin.protocol !== 'http:' || !hasExplicitPort || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) reject()
  if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) reject()
}
