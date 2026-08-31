const SUPPORTED_CONTENT_TYPES = new Set(['application/reports+json', 'application/csp-report'])

function mediaType(contentType) {
  return String(contentType || '').split(';', 1)[0].trim().toLowerCase()
}

function bounded(value, maxLength) {
  return String(value || '').slice(0, maxLength)
}

function normalizedDirective(value) {
  const directive = String(value || '').trim().toLowerCase()
  return /^[a-z-]{1,64}$/.test(directive) ? directive : 'unknown'
}

function normalizedDisposition(value) {
  const disposition = String(value || '').trim().toLowerCase()
  return disposition === 'report' || disposition === 'enforce' ? disposition : 'unknown'
}

function statusBucket(value) {
  const status = Number(value)
  if (status === 0) return '0'
  if (Number.isInteger(status) && status >= 200 && status <= 599) return `${Math.floor(status / 100)}xx`
  return 'unknown'
}

function isCanonicalIpv4Hostname(hostname) {
  const octets = hostname.split('.')
  return octets.length === 4 && octets.every((octet) => /^(?:0|[1-9]\d{0,2})$/.test(octet) && Number(octet) <= 255)
}

function isBracketedIpv6Hostname(hostname) {
  return /^\[[0-9a-f:.]+\]$/i.test(hostname)
}

function classifyBlockedResource(value, receiverUrl) {
  const raw = String(value || '').trim()
  const lower = raw.toLowerCase()
  if (lower === 'self') return {blockedResourceClass: 'self', blockedHost: ''}
  if (lower === 'inline') return {blockedResourceClass: 'inline', blockedHost: ''}
  if (lower === 'eval') return {blockedResourceClass: 'eval', blockedHost: ''}
  if (lower.startsWith('data:')) return {blockedResourceClass: 'data', blockedHost: ''}
  if (lower.startsWith('blob:')) return {blockedResourceClass: 'blob', blockedHost: ''}
  try {
    const blockedUrl = new URL(raw)
    if (!['http:', 'https:'].includes(blockedUrl.protocol)) return {blockedResourceClass: 'other', blockedHost: ''}
    if (isCanonicalIpv4Hostname(blockedUrl.hostname) || isBracketedIpv6Hostname(blockedUrl.hostname)) return {blockedResourceClass: 'other', blockedHost: ''}
    if (blockedUrl.hostname.toLowerCase() === receiverUrl.hostname.toLowerCase()) return {blockedResourceClass: 'self', blockedHost: ''}
    return {blockedResourceClass: 'external', blockedHost: bounded(blockedUrl.hostname.toLowerCase(), 128)}
  } catch {
    return {blockedResourceClass: 'other', blockedHost: ''}
  }
}

export function isSupportedCspReportContentType(contentType) {
  return SUPPORTED_CONTENT_TYPES.has(mediaType(contentType))
}

export function parseCspReportPayload({contentType, text}) {
  const type = mediaType(contentType)
  const payload = JSON.parse(text)
  if (type === 'application/reports+json') {
    if (!Array.isArray(payload)) return []
    return payload.slice(0, 10)
      .filter((entry) => entry?.type === 'csp-violation' && entry.body && typeof entry.body === 'object')
      .map((entry) => entry.body)
  }
  if (type === 'application/csp-report') {
    const report = payload?.['csp-report']
    return report && typeof report === 'object' && !Array.isArray(report) ? [report] : []
  }
  return []
}

export function sanitizeCspReport({report, requestUrl}) {
  let receiverUrl
  let documentUrl
  const documentValue = report?.documentURL ?? report?.['document-uri']
  if (typeof documentValue !== 'string' || documentValue.length === 0) return null
  try {
    receiverUrl = new URL(requestUrl)
    documentUrl = new URL(documentValue, receiverUrl)
  } catch {
    return null
  }
  const receiverHost = bounded(receiverUrl.hostname.toLowerCase(), 128)
  if (documentUrl.hostname.toLowerCase() !== receiverHost) return null
  const blocked = classifyBlockedResource(report?.blockedURL ?? report?.['blocked-uri'], receiverUrl)
  return {
    schemaVersion: 'v1',
    disposition: normalizedDisposition(report?.disposition),
    effectiveDirective: normalizedDirective(report?.effectiveDirective ?? report?.['effective-directive'] ?? report?.['violated-directive']),
    documentPath: bounded(documentUrl.pathname || '/', 256),
    blockedResourceClass: blocked.blockedResourceClass,
    blockedHost: blocked.blockedHost,
    statusBucket: statusBucket(report?.statusCode ?? report?.['status-code']),
    receiverHost,
    count: 1,
  }
}

export function buildAnalyticsDataPoint({sanitizedReport, requestUrl}) {
  const receiverHost = new URL(requestUrl).hostname.toLowerCase()
  if (!sanitizedReport || sanitizedReport.receiverHost !== receiverHost) throw new TypeError('Sanitized report receiver host mismatch')
  return {
    indexes: [`${receiverHost}|${sanitizedReport.effectiveDirective}`],
    blobs: [sanitizedReport.schemaVersion, sanitizedReport.disposition, sanitizedReport.effectiveDirective, sanitizedReport.documentPath, sanitizedReport.blockedResourceClass, sanitizedReport.blockedHost, sanitizedReport.statusBucket, sanitizedReport.receiverHost],
    doubles: [sanitizedReport.count],
  }
}
