import {execFileSync} from 'node:child_process'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'

export type V9ClaimKind =
  | 'FACTORY_DIRECT'
  | 'MOQ'
  | 'MOCKUP_TIMING'
  | 'SAMPLE_TIMING'
  | 'PRODUCTION_TIMING'
  | 'SHIPPING_TIMING'
  | 'FIXED_TIMELINE'
  | 'UNLIMITED'
  | 'CAPACITY_OR_SCALE'
  | 'EQUIPMENT_BRAND'
  | 'ABSOLUTE_QUALITY'
  | 'CERTIFICATION'
  | 'TOLERANCE_RETURN_POLICY'
  | 'GUARANTEE'
  | 'PROJECT_AUTHENTICITY'
  | 'COMPANY_HISTORY'

export type V9ClaimMatch = {kind: V9ClaimKind; value: string; index: number}

const dash = String.raw`[-\u2010-\u2015]`

const PATTERNS: ReadonlyArray<{kind: V9ClaimKind; pattern: RegExp}> = [
  {kind: 'FACTORY_DIRECT', pattern: /\bfactory[- ]direct\b|\bdirect\s+(?:manufacturer|factory)\b/i},
  {kind: 'MOQ', pattern: new RegExp(String.raw`\bMOQ\s*(?::|is)?\s*(?:from\s+)?1(?:\s*(?:set|piece))?\b|\b1\s*${dash}?\s*set\s+MOQ\b|\b1\s+set\b|\bstart\s+with\s+1\s+sample\b|\bone[- ]set\s+sample\b`, 'i')},
  {kind: 'MOCKUP_TIMING', pattern: new RegExp(String.raw`\b(?:mockup|design)[^.\n]{0,50}\b(?:1\s*${dash}\s*2|2)\s*(?:hours?|h)\b|\bwithin\s+(?:2|24)\s+hours\b|\b(?:2|24)\s*(?:h|hours?)\b`, 'i')},
  {kind: 'SAMPLE_TIMING', pattern: new RegExp(String.raw`\bsampl(?:e|ing)[^.\n]{0,80}\b(?:2\s*${dash}\s*3|3\s*${dash}\s*5|5\s*${dash}\s*7|7\s*${dash}\s*10)\s*(?:working\s*)?days\b`, 'i')},
  {kind: 'PRODUCTION_TIMING', pattern: new RegExp(String.raw`\b(?:bulk(?:\s+production)?|production)[^.\n]{0,80}\b(?:3\s*${dash}\s*5|7\s*${dash}\s*12|10\s*${dash}\s*20)\s*(?:working\s*)?days\b`, 'i')},
  {kind: 'SHIPPING_TIMING', pattern: new RegExp(String.raw`\b(?:shipping|delivery)[^.\n]{0,80}\b\d+\s*${dash}\s*\d+\s*(?:business\s*)?days\b|\b\d+\s*${dash}\s*\d+\s*(?:business\s*)?days\b[^.\n]{0,80}\b(?:shipping|delivery)\b`, 'i')},
  {kind: 'FIXED_TIMELINE', pattern: new RegExp(String.raw`\b(?:2\s*${dash}\s*3|3\s*${dash}\s*5|7\s*${dash}\s*12)\b|\b(?:fast\s+delivery|rapid\s+production)\b`, 'i')},
  {kind: 'UNLIMITED', pattern: /\bunlimited\b/i},
  {kind: 'CAPACITY_OR_SCALE', pattern: /\b30,?000\+?\s*(?:units|pieces|sets)\b|\b3,?000\+?\s+(?:teams|pieces)\b|\bcapacity\b/i},
  {kind: 'EQUIPMENT_BRAND', pattern: /\b(?:KIAN|EPSON)\b/i},
  {kind: 'ABSOLUTE_QUALITY', pattern: /\b100%(?=\s|$|[.,;:!?])|\bnever\s+(?:fade|crack|peel)\b/i},
  {kind: 'CERTIFICATION', pattern: /(?<![-_])\b(?:ISO(?:\s*\d+)?|BSCI|SGS|CE|OEKO[- ]TEX|WRAP|Sedex)\b(?![-_])/},
  {kind: 'TOLERANCE_RETURN_POLICY', pattern: /(?:±|\+\/-)\s*2\s*cm[^.\n]{0,100}\b(?:return|defect)\b|\bnot\s+a\s+reason\s+for\s+returns?\b/i},
  {kind: 'GUARANTEE', pattern: /\bguaranteed\s+(?:delivery|quality|shipping|production|response)\b/i},
  {kind: 'PROJECT_AUTHENTICITY', pattern: /\b(?:real\s+project|real\s+customer|customer\s+success\s+story)\b/i},
  {kind: 'COMPANY_HISTORY', pattern: /\b(?:since\s+(?:19|20)\d{2}|\d+\+?\s+years?\s+(?:of\s+)?experience)\b/i},
] as const

export function scanV9ClaimText(content: string): V9ClaimMatch[] {
  const matches: V9ClaimMatch[] = []
  for (const {kind, pattern} of PATTERNS) {
    const globalPattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)
    for (const match of content.matchAll(globalPattern)) {
      matches.push({kind, value: match[0], index: match.index ?? 0})
    }
  }
  return matches.sort((left, right) => left.index - right.index || PATTERNS.findIndex((item) => item.kind === left.kind) - PATTERNS.findIndex((item) => item.kind === right.kind))
}

export function claimContextForClassification(content: string, match: V9ClaimMatch): string {
  const matchStart = Math.max(0, match.index)
  const matchEnd = Math.min(content.length, matchStart + match.value.length)
  let start = matchStart
  let end = matchEnd
  while (start > 0 && !/[.!?;\n]/.test(content[start - 1])) start -= 1
  while (end < content.length && !/[.!?;\n]/.test(content[end])) end += 1
  return content.slice(start, end).trim()
}

export type ResidualClassification = 'PUBLIC_REVIEW' | 'LEGAL_RETAIN' | 'SAFE_NEGATION' | 'TEST_FIXTURE' | 'DETECTION_RULE' | 'NON_PUBLIC_TOOLING' | 'GOVERNANCE_RECORD'

export function classifyResidual(path: string, lineText = ''): ResidualClassification {
  const normalized = path.replaceAll('\\', '/')
  if (/\b(?:cannot|does not|not)\b[^.\n]{0,100}\bunlimited\b/i.test(lineText)) return 'SAFE_NEGATION'
  if (/className\s*=/.test(lineText) || /\bdepend(?:s|ed)?\s+on\b[^.\n]{0,120}\bcapacity\b/i.test(lineText) || /\b(?:check|evaluat(?:e|ing)|framework\s+for\s+evaluating)\b[^.\n]{0,120}\bcapacity\b/i.test(lineText)) return 'LEGAL_RETAIN'
  if (/\.test\.[cm]?[jt]sx?$/.test(normalized) || /scripts\/check-/.test(normalized)) return 'TEST_FIXTURE'
  if (normalized.startsWith('content/product-visualization/')) return 'GOVERNANCE_RECORD'
  if (normalized === 'lib/truth/owner-decisions.ts') return 'GOVERNANCE_RECORD'
  if (normalized === 'lib/sanity/content.ts' && /sample production\|sample time\|2-3\|2–3/.test(lineText)) return 'DETECTION_RULE'
  if (/legacy-claim-(?:policy|normalizer)|scan-v9-red-claims|studio\/schemaTypes\/validation\.ts|studio\/schemaTypes\/documents\/caseStudy\.ts|lib\/product-visualization\/policy\.ts/.test(normalized)) return 'DETECTION_RULE'
  if (normalized.startsWith('scripts/')) return 'NON_PUBLIC_TOOLING'
  if (normalized.startsWith('docs/') || /POXIOL_V\d/.test(normalized)) return 'GOVERNANCE_RECORD'
  return 'PUBLIC_REVIEW'
}

function gitFiles(): string[] {
  return execFileSync('git', ['-c', 'core.quotepath=false', 'ls-files', '-co', '--exclude-standard', '-z'], {encoding: 'utf8'})
    .split('\0')
    .filter(Boolean)
}

function valueFor(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function main() {
  const roots = /^(?:app|components|content|lib|public|scripts|studio)\//
  const findings = [] as Array<{path: string; line: number; kind: V9ClaimKind; value: string; classification: ResidualClassification}>
  for (const path of gitFiles().filter((file) => roots.test(file.replaceAll('\\', '/')))) {
    if (/\.(?:png|jpe?g|gif|webp|ico|woff2?|ttf|pdf|zip)$/i.test(path)) continue
    if (/\.jsx?$/.test(path) && existsSync(path.replace(/\.jsx?$/, (extension) => extension === '.jsx' ? '.tsx' : '.ts'))) continue
    let content = ''
    try { content = readFileSync(path, 'utf8') } catch { continue }
    content.split(/\r?\n/).forEach((lineText, index) => {
      for (const match of scanV9ClaimText(lineText)) {
        findings.push({path: path.replaceAll('\\', '/'), line: index + 1, kind: match.kind, value: match.value, classification: classifyResidual(path, claimContextForClassification(lineText, match))})
      }
    })
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    total: findings.length,
    publicReview: findings.filter((item) => item.classification === 'PUBLIC_REVIEW').length,
    byClassification: Object.fromEntries([...new Set(findings.map((item) => item.classification))].sort().map((key) => [key, findings.filter((item) => item.classification === key).length])),
    byKind: Object.fromEntries([...new Set(findings.map((item) => item.kind))].sort().map((key) => [key, findings.filter((item) => item.kind === key).length])),
    findings,
  }
  const jsonPath = valueFor('--json')
  if (jsonPath) writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({total: summary.total, publicReview: summary.publicReview, byClassification: summary.byClassification, byKind: summary.byKind}))
  if (process.argv.includes('--fail-public') && summary.publicReview > 0) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
