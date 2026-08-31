// Keep the generated OpenNext worker reusable while applying document-level
// security headers at the Worker response boundary.
import handler from './.open-next/worker.js'

const REPORT_ONLY_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://formspree.io",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://formspree.io https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://cloudflareinsights.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ')

export default {
  async fetch(request, env, ctx) {
    const response = await handler.fetch(request, env, ctx)
    const contentType = response.headers.get('content-type')?.toLowerCase() || ''
    if (!contentType.includes('text/html')) return response

    const headers = new Headers(response.headers)
    headers.set('Content-Security-Policy-Report-Only', REPORT_ONLY_CSP)
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
}

export {BucketCachePurge, DOQueueHandler, DOShardedTagCache} from './.open-next/worker.js'
