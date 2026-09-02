import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
import {createRequire} from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'

// Exercise the actual component handlers in memory, with no DOM or network.
// Hook storage is intentionally minimal; rendered-browser checks cover the UI.
const require = createRequire(import.meta.url)
const compiled = ts.transpileModule(readFileSync('components/forms/GeneralInquiryForm.tsx', 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022},
}).outputText
const requestModule = {}
vm.runInNewContext(ts.transpileModule(readFileSync('lib/project-inquiry-request.ts', 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText, {exports: requestModule, Error})

function harness({submit = async () => {}, tracking = {}, uuid = () => 'test-id'} = {}) {
  const slots = []
  let cursor = 0
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, Error, String,
    process: {env: {NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT: 'https://example.invalid/never-sent'}},
    window: {location: {href: 'https://example.invalid/contact/'}},
    crypto: {randomUUID: uuid},
    FormData: class {get() {return ''}},
    require(name) {
      if (name === 'react') return {
        useEffect() {},
        useState(initial) {
          const index = cursor++
          if (!(index in slots)) slots[index] = initial
          return [slots[index], value => {slots[index] = typeof value === 'function' ? value(slots[index]) : value}]
        },
        useRef(initial) {const index = cursor++; return slots[index] ??= {current: initial}},
      }
      if (name === '@/lib/general-inquiry') return {submitGeneralInquiry: submit}
      if (name === '@/lib/project-inquiry-request') return requestModule
      if (name === '@/lib/analytics/client') return {trackFormStart() {}, trackFormSubmit() {}, trackLead() {}, ...tracking}
      if (name === '@/lib/analytics/core') return {
        createLeadEventContext(form_id, form_type) {return {lead_type: 'general_inquiry', form_id, form_type}},
      }
      if (name === '@/lib/v8/leads') return {getV8ConversionEntry: () => ({ctaLabel: 'Send My Question'})}
      if (name === '@/components/useInquiryContext') return {useInquiryContext: () => ({product:'',style:'',sport:'',source:''})}
      if (name === './InquiryReference') return {InquiryReference: () => null}
      if (name === '@/components/InquiryLink') return {default: () => null}
      if (name === '../legal/PrivacyStatusLink') return {PrivacyStatusLink: () => null}
      if (name === '@/lib/inquiry-context') return {publicSourcePath: () => '/contact/'}
      return require(name)
    },
  })
  function render() {cursor = 0; return exports.default({publicEmail: 'sales@example.invalid', whatsappHref: 'https://example.invalid/chat'})}
  function nodes(node) {
    if (!node || typeof node !== 'object') return []
    return [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)]
  }
  function find(predicate) {return nodes(render()).find(predicate)}
  function edit(name, value) {find(node => node.props?.name === name).props.onChange({target: {value}})}
  const send = () => render().props.onSubmit({preventDefault() {}, currentTarget: {}})
  return {render, find, edit, send}
}

test('analytics failure cannot discard a buyer edit', () => {
  const ui = harness({tracking: {trackFormStart() {throw Error('tracking denied')}}})
  assert.doesNotThrow(() => ui.edit('message', 'How do I start?'))
  assert.equal(ui.find(node => node.props?.name === 'message').props.value, 'How do I start?')
})

for (const failure of ['trackFormSubmit', 'trackLead', 'uuid']) {
  test(`accepted inquiry stays successful when ${failure} fails`, async () => {
    let accepted = 0
    const throws = () => {throw Error('noncritical analytics failure')}
    const ui = harness({submit: async () => {accepted++}, tracking: {[failure]: throws}, ...(failure === 'uuid' ? {uuid: throws} : {})})
    await ui.send()
    assert.equal(accepted, 1)
    assert.ok(ui.find(node => node.props?.role === 'status'))
    assert.equal(ui.find(node => node.props?.role === 'alert'), undefined)
    assert.equal(ui.find(node => node.type === 'button').props.disabled, true)
    await ui.send()
    assert.equal(accepted, 1, 'Accepted inquiries cannot be sent twice')
  })
}

test('pending submission blocks duplicate sends; rejection retains text and allows retry', async () => {
  let rejectRequest
  let calls = 0
  const ui = harness({submit: () => {calls++; return calls === 1 ? new Promise((_resolve, reject) => {rejectRequest = reject}) : Promise.resolve()}})
  ui.edit('message', 'How do I start?')
  ui.edit('email', 'buyer@example.com')
  const pending = ui.send()
  await ui.send()
  assert.equal(calls, 1)
  assert.equal(ui.find(node => node.type === 'button').props.disabled, true)
  rejectRequest(Error('Provider unavailable'))
  await pending
  assert.ok(ui.find(node => node.props?.role === 'alert'))
  assert.equal(ui.find(node => node.props?.role === 'status'), undefined)
  assert.equal(ui.find(node => node.props?.name === 'message').props.value, 'How do I start?')
  assert.equal(ui.find(node => node.type === 'button').props.disabled, false)
  await ui.send()
  assert.equal(calls, 2)
  assert.ok(ui.find(node => node.props?.role === 'status'))
  assert.equal(ui.find(node => node.props?.role === 'alert'), undefined)
})
