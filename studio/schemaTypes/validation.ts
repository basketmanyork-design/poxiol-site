// 高风险品牌/组织词（第三方商标）- 发布时阻止
const HIGH_RISK_BRANDS = [
  'Nike', 'Adidas', 'Jordan', 'Puma', 'Under Armour', 'New Balance',
  'NBA', 'NCAA', 'WNBA', 'FIBA', 'FIFA', 'Olympic', 'Dri-FIT',
]

// 绝对化承诺词 - 发布时警告
const ABSOLUTE_CLAIMS = [
  'guaranteed delivery', 'perfect quality', 'never fade',
  'never crack', 'never peel', '100% guaranteed', 'lifetime guarantee',
  'best manufacturer', 'top supplier', 'top manufacturer',
]

export function checkRiskWords(text: string): {brandRisks: string[], claimRisks: string[]} {
  const lower = text.toLowerCase()
  const brandRisks = HIGH_RISK_BRANDS.filter(w => lower.includes(w.toLowerCase()))
  const claimRisks = ABSOLUTE_CLAIMS.filter(w => lower.includes(w.toLowerCase()))
  return {brandRisks, claimRisks}
}

export function createRiskValidation(fields: string[]) {
  return (doc: any) => {
    const issues: string[] = []
    for (const field of fields) {
      const val = doc?.[field]
      if (!val) continue
      const text = typeof val === 'string' ? val : JSON.stringify(val)
      const {brandRisks, claimRisks} = checkRiskWords(text)
      if (brandRisks.length) {
        issues.push(`[高风险] 字段 "${field}" 包含第三方品牌/组织词: ${brandRisks.join(', ')}。请确认拥有授权，否则应删除。`)
      }
      if (claimRisks.length) {
        issues.push(`[警告] 字段 "${field}" 包含绝对化承诺: ${claimRisks.join(', ')}。建议改为稳妥可验证表述。`)
      }
    }
    if (issues.length) {
      return issues.join('\n')
    }
    return true
  }
}
