import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

const read = (path: string) => readFileSync(path, 'utf8')
const link = read('components/legal/PrivacyStatusLink.tsx')

test('pending policy is labelled as a draft', () => {
  assert.match(link, /approved\s*\?/)
  assert.match(link, /Draft privacy notice/)
  assert.match(link, /pending owner and legal approval/)
})

test('approved policy uses the final label', () => {
  assert.match(link, /Privacy Policy/)
})

test('every public inquiry form consumes the server-owned status', () => {
  assert.match(read('components/forms/GeneralInquiryForm.tsx'), /PrivacyStatusLink approved=\{privacyPolicyApproved\}/)
  assert.match(read('components/forms/ContactForm.tsx'), /PrivacyStatusLink approved=\{privacyPolicyApproved\}/)
  assert.match(read('components/v8/ProjectQualificationForm.tsx'), /privacyPolicyApproved=\{privacyPolicyApproved\}/)

  for (const page of ['app/page.tsx', 'app/free-mockup/page.tsx', 'app/get-quote/page.tsx', 'app/sample-order/page.tsx']) {
    const source = read(page)
    assert.match(source, /legalPolicyApproved\(\)/, `${page} must evaluate the governed legal state on the server`)
    assert.match(source, /privacyPolicyApproved=\{legalPolicyApproved\(\)\}/, `${page} must pass the governed state into its form`)
  }
})
