import {
  buildAnalyticsDataPoint,
  isSupportedCspReportContentType,
  parseCspReportPayload,
  sanitizeCspReport,
} from '../lib/security/csp-reporting.mjs'

export const MAX_BODY_BYTES = 16 * 1024

const SAFE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

class PayloadTooLargeError extends Error {}

function emptyResponse(status, extraHeaders = {}) {
  return new Response(null, {status, headers: {...SAFE_HEADERS, ...extraHeaders}})
}

async function readLimitedText(request) {
  const declaredLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new PayloadTooLargeError()
  }
  if (!request.body) return ''

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let size = 0
  let text = ''

  while (true) {
    const {done, value} = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      try {
        await reader.cancel()
      } catch {}
      throw new PayloadTooLargeError()
    }
    text += decoder.decode(value, {stream: true})
  }
  return text + decoder.decode()
}

export async function onRequest(context) {
  const {request, env} = context
  if (request.method !== 'POST') return emptyResponse(405, {Allow: 'POST'})

  const contentType = request.headers.get('content-type') || ''
  if (!isSupportedCspReportContentType(contentType)) return emptyResponse(415)

  const binding = env?.POXIOL_CSP_REPORTS
  if (!binding || typeof binding.writeDataPoint !== 'function') return emptyResponse(503)

  let reports
  try {
    const text = await readLimitedText(request)
    reports = parseCspReportPayload({contentType, text})
  } catch (error) {
    if (error instanceof PayloadTooLargeError) return emptyResponse(413)
    if (error instanceof SyntaxError) return emptyResponse(400)
    return emptyResponse(400)
  }

  try {
    for (const report of reports) {
      const sanitizedReport = sanitizeCspReport({report, requestUrl: request.url})
      if (!sanitizedReport) continue
      binding.writeDataPoint(buildAnalyticsDataPoint({sanitizedReport, requestUrl: request.url}))
    }
  } catch {
    return emptyResponse(503)
  }

  return emptyResponse(204)
}
