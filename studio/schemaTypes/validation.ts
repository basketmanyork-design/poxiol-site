import type {DocumentRule, SanityDocument} from 'sanity'

const HIGH_RISK_BRANDS = [
  'Nike', 'Adidas', 'Jordan', 'Puma', 'Under Armour', 'New Balance',
  'NBA', 'NCAA', 'WNBA', 'FIBA', 'FIFA', 'Olympic', 'Dri-FIT',
]

const ABSOLUTE_CLAIMS = [
  'guaranteed delivery', 'perfect quality', 'never fade',
  'never crack', 'never peel', '100% guaranteed', 'lifetime guarantee',
  'best manufacturer', 'top supplier', 'top manufacturer',
]

export function checkRiskWords(text: string): {brandRisks: string[]; claimRisks: string[]} {
  const lower = text.toLowerCase()
  const brandRisks = HIGH_RISK_BRANDS.filter((word) => lower.includes(word.toLowerCase()))
  const claimRisks = ABSOLUTE_CLAIMS.filter((word) => lower.includes(word.toLowerCase()))
  return {brandRisks, claimRisks}
}

export function createRiskValidation(fields: string[]) {
  return (rule: DocumentRule) =>
    rule.custom((doc: SanityDocument | undefined) => {
      const issues: string[] = []
      for (const field of fields) {
        const val = doc?.[field]
        if (!val) continue
        const text = typeof val === 'string' ? val : JSON.stringify(val)
        const {brandRisks, claimRisks} = checkRiskWords(text)
        if (brandRisks.length) {
          issues.push(`[High risk] Field "${field}" contains third-party brand or organization terms: ${brandRisks.join(', ')}. Confirm authorization or remove them.`)
        }
        if (claimRisks.length) {
          issues.push(`[Warning] Field "${field}" contains absolute claims: ${claimRisks.join(', ')}. Use verifiable wording instead.`)
        }
      }
      return issues.length ? issues.join('\n') : true
    })
}
