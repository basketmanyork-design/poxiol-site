#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const PROJECT_ID = 'oqpv1xbc'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const PROTECTED_SOURCES = new Set(['/robots.txt', '/sitemap.xml', '/llms.txt'])

export function parseRedirects(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [sourcePath, destinationPath, code] = line.split(/\s+/)
      return {sourcePath, destinationPath, redirectType: Number(code) || 301, source: 'base'}
    })
}

export function formatRedirect(rule) {
  return [rule.sourcePath, rule.destinationPath, String(rule.redirectType)].join(' ')
}

function isExternal(destinationPath) {
  return /^https?:\/\//i.test(destinationPath)
}

function normalizeRule(rule, source = 'cms') {
  return {
    sourcePath: String(rule.sourcePath || '').trim(),
    destinationPath: String(rule.destinationPath || rule.to || '').trim(),
    redirectType: Number(rule.redirectType || rule.statusCode || 301),
    source,
  }
}

export function validateRedirectRules(baseRules, cmsRules) {
  const errors = []
  const all = [...baseRules.map((rule) => normalizeRule(rule, 'base'))]
  const seen = new Set(all.map((rule) => rule.sourcePath))
  const cms = cmsRules.map((rule) => normalizeRule(rule, 'cms')).sort((a, b) => a.sourcePath.localeCompare(b.sourcePath))

  for (const rule of cms) {
    const label = rule.sourcePath || '<missing source>'
    if (!rule.sourcePath.startsWith('/')) errors.push(label + ': sourcePath must start with /')
    if (!rule.destinationPath) errors.push(label + ': destinationPath is required')
    if (seen.has(rule.sourcePath)) errors.push(label + ': duplicate sourcePath')
    if (rule.sourcePath === rule.destinationPath) errors.push(label + ': source and destination are identical')
    if (![301, 302].includes(rule.redirectType)) errors.push(label + ': redirectType must be 301 or 302')
    if (PROTECTED_SOURCES.has(rule.sourcePath)) errors.push(label + ': protected system path cannot be overridden')
    if (isExternal(rule.destinationPath)) {
      if (!rule.destinationPath.startsWith('https://')) errors.push(label + ': external destinations must use https')
    } else if (!rule.destinationPath.startsWith('/')) {
      errors.push(label + ': internal destinations must start with /')
    }
    if ((rule.sourcePath.match(/\*/g) || []).length > 1 || (rule.sourcePath.includes('*') && !rule.sourcePath.endsWith('*'))) {
      errors.push(label + ': invalid wildcard pattern')
    }
    seen.add(rule.sourcePath)
    all.push(rule)
  }

  const redirectsBySource = new Map(all.map((rule) => [rule.sourcePath, rule.destinationPath]))
  for (const rule of all) {
    const next = redirectsBySource.get(rule.destinationPath)
    if (next === rule.sourcePath) errors.push(rule.sourcePath + ': direct redirect loop detected')
  }

  if (errors.length) {
    const error = new Error('Invalid CMS redirects:\n' + errors.join('\n'))
    error.errors = errors
    throw error
  }

  return cms
}

async function fetchCmsRedirects(fetchImpl = fetch) {
  const query = '*[_type == "redirectRule" && active == true]{sourcePath,destinationPath,redirectType}'
  const url = new URL('https://' + PROJECT_ID + '.apicdn.sanity.io/v' + API_VERSION + '/data/query/' + DATASET)
  url.searchParams.set('query', query)
  url.searchParams.set('perspective', 'published')
  url.searchParams.set('returnQuery', 'false')
  const response = await fetchImpl(url)
  if (!response.ok) throw new Error('Sanity redirect query failed with HTTP ' + response.status)
  const payload = await response.json()
  return Array.isArray(payload.result) ? payload.result : []
}

export async function generateCmsRedirects({rootDir = process.cwd(), fetchImpl = fetch} = {}) {
  const outFile = path.join(rootDir, 'out', '_redirects')
  const publicFile = path.join(rootDir, 'public', '_redirects')
  let baseText = ''
  try {
    baseText = await fs.readFile(outFile, 'utf8')
  } catch {
    try {
      baseText = await fs.readFile(publicFile, 'utf8')
    } catch {
      baseText = ''
    }
  }

  const baseRules = parseRedirects(baseText)
  let cmsRules = []
  try {
    cmsRules = await fetchCmsRedirects(fetchImpl)
  } catch {
    console.warn('[cms-redirects] warning: Sanity redirect query failed; keeping base redirects only.')
    cmsRules = []
  }

  const validCmsRules = validateRedirectRules(baseRules, cmsRules)
  const output = [
    '# Base redirects',
    ...baseText.split(/\r?\n/).filter((line) => line.trim()),
    '',
    '# CMS redirects - generated at build time',
    ...validCmsRules.map(formatRedirect),
    '',
  ].join('\n')
  await fs.mkdir(path.dirname(outFile), {recursive: true})
  await fs.writeFile(outFile, output, 'utf8')
  return {baseCount: baseRules.length, cmsCount: validCmsRules.length, outFile}
}

const thisFile = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  generateCmsRedirects().then((result) => {
    console.log('[cms-redirects] wrote ' + result.outFile + ' with ' + result.cmsCount + ' CMS rules and ' + result.baseCount + ' base rules')
  }).catch((error) => {
    console.error('[cms-redirects] failed:', error.message)
    process.exit(1)
  })
}