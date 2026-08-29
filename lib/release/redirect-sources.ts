import 'server-only'

import {readFileSync} from 'node:fs'
import {join} from 'node:path'

function normalizePath(pathname: string): string {
  if (pathname === '/') return pathname
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function getPermanentRedirectSources(): Set<string> {
  const redirects = readFileSync(join(process.cwd(), 'public', '_redirects'), 'utf8')
  const sources = redirects
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter(([, , status]) => /^30[1278]$/.test(status || ''))
    .map(([source]) => normalizePath(source))

  return new Set(sources)
}
