const cases = [
  ['published', 'sanity', true],
  ['draft', 'sanity', false],
  [undefined, 'sanity', false],
  ['draft', 'sanity-preview', true],
  ['published', 'sanity-preview', true],
  ['unpublished', 'sanity-preview', false],
]

function isDocumentVisible(status, source) {
  if (source === 'legacy') return false
  if (source === 'sanity-preview') return status === 'draft' || status === 'published'
  return status === 'published'
}

for (const [status, source, expected] of cases) {
  const actual = isDocumentVisible(status, source)
  if (actual !== expected) {
    throw new Error(`visibility failed for ${String(status)} + ${source}: expected ${expected}, got ${actual}`)
  }
}

console.log('cms visibility matrix passed')