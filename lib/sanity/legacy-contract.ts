import legacyPublicContract from '../../content/cms/legacy-public-contract.json' with {type: 'json'}

type ContractType = keyof typeof legacyPublicContract
type ValidationResult = {ok: true} | {ok: false; issues: string[]}

const forbiddenField = /^(?:.*(?:token|secret|password|apiKey|customer|buyerEmail|recipient).*)$/i

function collectForbiddenFields(value: unknown, issues: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectForbiddenFields(item, issues)
    return
  }
  if (!value || typeof value !== 'object') return

  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenField.test(key)) issues.add(`forbidden-field:${key}`)
    collectForbiddenFields(nested, issues)
  }
}

export function validateLegacyPublicDocument(type: string, value: unknown): ValidationResult {
  const issues = new Set<string>()
  const allowedFields = legacyPublicContract[type as ContractType]

  if (!allowedFields) issues.add(`unknown-document-type:${type}`)
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    issues.add('invalid-document')
  } else {
    collectForbiddenFields(value, issues)
    if (allowedFields) {
      for (const key of Object.keys(value)) {
        if (!allowedFields.includes(key as never) && !forbiddenField.test(key)) {
          issues.add(`unrecognized-field:${key}`)
        }
      }
    }
  }

  return issues.size ? {ok: false, issues: Array.from(issues).sort()} : {ok: true}
}

export function safeLegacyContent<T>(
  type: string,
  result: T | null | undefined,
  fallback: T,
  options: {required?: boolean} = {},
): T {
  if (result == null) return fallback

  const values = Array.isArray(result) ? result : [result]
  const issues = values.flatMap((value) => {
    const validation = validateLegacyPublicDocument(type, value)
    return validation.ok ? [] : validation.issues
  })
  if (!issues.length) return result

  const stableIssues = Array.from(new Set(issues)).sort()
  if (options.required) {
    throw new Error(`SANITY_PUBLIC_CONTRACT_REQUIRED:${type}:${stableIssues.join(',')}`)
  }
  console.warn(`[sanity-public-contract] ${type}: ${stableIssues.join(',')}`)
  return fallback
}
