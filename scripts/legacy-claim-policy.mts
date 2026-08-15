export type LegacyClaimKind =
  | 'moq'
  | 'one-set-sample'
  | 'sample-timing'
  | 'production-timing'
  | 'mockup-timing'
  | 'shipping-timing'
  | 'business-scale'
  | 'guarantee'
  | 'certification'

export type LegacyClaimMatch = {
  kind: LegacyClaimKind
  value: string
  index: number
}

const punctuationRange = String.raw`[-\u2010-\u2015]`

export const legacyClaimPatterns: ReadonlyArray<{
  kind: LegacyClaimKind
  pattern: RegExp
}> = [
  {
    kind: 'moq',
    pattern: new RegExp(
      String.raw`\bMOQ\s*(?::|is)?\s*(?:from\s+)?1(?:\s*(?:set|piece))?\b|\b1\s*${punctuationRange}?\s*set\s+MOQ\b|\bminimum\s+order(?:\s+quantity)?\s*(?:is|:)?\s*1\s*set\b`,
      'gi',
    ),
  },
  {
    kind: 'one-set-sample',
    pattern: new RegExp(
      String.raw`\b1\s*${punctuationRange}?\s*(?:set|piece)\s+(?:custom\s+\w+\s+)?sample\b|\bsample\s+MOQ\s*(?::|is)?\s*1\s*set\b`,
      'gi',
    ),
  },
  {
    kind: 'sample-timing',
    pattern: new RegExp(String.raw`\bsampl(?:e|ing)[^.\n]{0,80}\b(?:2\s*${punctuationRange}\s*3|3\s*${punctuationRange}\s*5|5\s*${punctuationRange}\s*7|7\s*${punctuationRange}\s*10)\s*(?:working\s*)?days\b|\b2\s*${punctuationRange}\s*3\s*(?:working\s*)?days\b`, 'gi'),
  },
  {
    kind: 'production-timing',
    pattern: new RegExp(String.raw`\b(?:bulk\s+)?production[^.\n]{0,80}\b(?:3\s*${punctuationRange}\s*5|7\s*${punctuationRange}\s*12|10\s*${punctuationRange}\s*20)\s*(?:working\s*)?days\b|\b7\s*${punctuationRange}\s*12\s*(?:working\s*)?days\b`, 'gi'),
  },
  {
    kind: 'mockup-timing',
    pattern: new RegExp(
      String.raw`\bwithin\s+(?:2\s+hours|24\s+hours|1\s+business\s+day)\b|\b(?:1\s*${punctuationRange}\s*2|2)\s*${punctuationRange}?\s*hours?\b[^.\n]{0,50}\b(?:mockup|design\s+support)\b|\b(?:mockup|design\s+support)[^.\n]{0,50}\b(?:1\s*${punctuationRange}\s*2|2)\s*hours?\b|\b2h\s+mockup\b|\bfree\s+mockup[^.\n]{0,40}\b2h\b|\bresponse\s+within\s+1\s+business\s+day\b`,
      'gi',
    ),
  },
  {
    kind: 'shipping-timing',
    pattern: new RegExp(String.raw`\b(?:express\s+)?(?:international\s+)?(?:delivery|shipping)[^.\n]{0,80}\b\d+\s*${punctuationRange}\s*\d+\s*business\s+days\b|\b\d+\s*${punctuationRange}\s*\d+\s*business\s+days\b[^.\n]{0,80}\b(?:delivery|shipping|courier)\b`, 'gi'),
  },
  {
    kind: 'business-scale',
    pattern: /\b(?:over\s+)?\d+\+?\s*years\s+(?:of\s+[\w -]{0,30}experience|experience|mastering)\b|\b(?:3,?000|5,?000)\+?\s*teams\b|\bover\s+\d[\d,]*\s+(?:\w+\s+)?(?:teams|academies)\b|\b\d[\d,]*\+?\s*(?:employees|workers|staff|machines|sewing\s+machines)\b|\b\d[\d,]*(?:\.\d+)?\s*(?:m²|m2|sqm|square\s+meters?)\b|\b\d[\d,]*\+?\s*(?:sets|pieces|units)\s*(?:per|\/)\s*(?:day|month)\b/gi,
  },
  {
    kind: 'guarantee',
    pattern: /\bguaranteed\s+(?:delivery|quality|shipping|DDP|response\s+time|production\s+time)\b/gi,
  },
  {
    kind: 'certification',
    pattern: /(?<![-_])\b(?:ISO(?:\s*\d+)?|BSCI|SGS|CE|OEKO[- ]TEX|WRAP|Sedex)\b(?![-_])/gi,
  },
] as const

export function findLegacyClaims(content: string): LegacyClaimMatch[] {
  const matches: LegacyClaimMatch[] = []

  for (const {kind, pattern} of legacyClaimPatterns) {
    pattern.lastIndex = 0
    for (const match of content.matchAll(pattern)) {
      matches.push({kind, value: match[0], index: match.index ?? 0})
    }
  }

  return matches.sort((left, right) => left.index - right.index || left.kind.localeCompare(right.kind))
}
