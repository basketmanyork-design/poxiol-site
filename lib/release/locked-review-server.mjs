import {createServer} from 'node:http'
import {readFile, stat} from 'node:fs/promises'
import path from 'node:path'

const TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
])

const REVIEW_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self'",
  "font-src 'self' data:",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
].join('; ')

function headersFor(filePath) {
  return {
    'Cache-Control': 'no-store',
    'Content-Security-Policy': REVIEW_CSP,
    'Content-Type': TYPES.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  }
}

async function resolvePublicFile(root, requestUrl) {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname)
  } catch {
    return null
  }
  if (pathname.includes('\0') || pathname.split('/').includes('..')) return null
  const relative = pathname.replace(/^\/+/, '')
  const candidate = path.resolve(root, relative || 'index.html')
  const normalizedRoot = `${path.resolve(root)}${path.sep}`
  if (candidate !== path.resolve(root) && !candidate.startsWith(normalizedRoot)) return null
  try {
    const info = await stat(candidate)
    if (info.isDirectory()) return path.join(candidate, 'index.html')
    return candidate
  } catch {
    if (!path.extname(candidate)) return `${candidate}.html`
    return candidate
  }
}

export function createLockedReviewServer({root}) {
  const publicRoot = path.resolve(root)
  return createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method || '')) {
      response.writeHead(405, {'Cache-Control': 'no-store', Allow: 'GET, HEAD'})
      response.end('Method not allowed')
      return
    }
    const filePath = await resolvePublicFile(publicRoot, request.url || '/')
    if (!filePath) {
      response.writeHead(404, {'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive'})
      response.end('Not found')
      return
    }
    try {
      const contents = await readFile(filePath)
      response.writeHead(200, headersFor(filePath))
      response.end(request.method === 'HEAD' ? undefined : contents)
    } catch {
      response.writeHead(404, {'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive'})
      response.end('Not found')
    }
  })
}
