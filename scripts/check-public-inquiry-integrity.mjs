import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const contact = readFileSync('components/forms/ContactForm.tsx', 'utf8')
const leadPipeline = readFileSync('lib/v8/leads.ts', 'utf8')
const analyticsClient = readFileSync('lib/analytics/client.ts', 'utf8')
const analyticsCore = readFileSync('lib/analytics/core.ts', 'utf8')

function renderedContactFileNames() {
  const slots = []
  let cursor = 0
  const hooks = {
    useState(initial) {const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => {slots[i] = typeof value === 'function' ? value(slots[i]) : value}]},
    useRef(initial) {const i = cursor++; return slots[i] ??= {current: initial}},
    useEffect() {cursor++},
  }
  const cache = new Map()
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename)
    const exports = {}
    cache.set(filename, exports)
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022},
    }).outputText
    vm.runInNewContext(code, {
      exports, Error, URL, URLSearchParams, Response, AbortController, setTimeout, clearTimeout,
      FormData: class extends FormData {constructor() {super()}},
      process: {env: {NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT: 'https://example.invalid/never-sent'}},
      window: {location: {pathname: '/get-quote/', search: '', href: 'https://www.poxiol.com/get-quote/'}},
      crypto: {randomUUID: () => 'qa-id'},
      fetch: async() => {throw new Error('Integrity render must not submit')},
      require(name) {
        if (name === 'react') return hooks
        if (name === 'next/navigation') return {usePathname: () => '/get-quote/', useRouter: () => ({push() {}})}
        if (name === 'next/link') return {default: props => require('react').createElement('a', props)}
        if (!name.startsWith('@/') && !name.startsWith('.')) return require(name)
        let resolved = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(filename), name)
        if (!existsSync(resolved)) resolved = ['.ts', '.tsx'].map(ext => resolved + ext).find(existsSync)
        assert.ok(resolved, `Cannot resolve ${name}`)
        if (resolved.endsWith('.json')) return {default: JSON.parse(readFileSync(resolved, 'utf8'))}
        return load(resolved)
      },
    })
    return exports
  }
  function expand(node) {
    if (!node || typeof node !== 'object') return []
    if (typeof node.type === 'function') return expand(node.type(node.props))
    return [node, ...[node.props?.children].flat(Infinity).flatMap(expand)]
  }
  cursor = 0
  const Component = load(path.resolve('components/forms/ContactForm.tsx')).default
  const nodes = expand(Component({intent: 'quote', formId: 'factory_quote_form', formType: 'Get Quote Conversion', publicEmail: 'sales@example.invalid', whatsappHref: 'https://wa.me/8613055646888'}))
  return nodes.filter(node => node.type === 'input' && node.props?.type === 'file').map(node => node.props.name)
}

const expectedAttachments = ['logo_file', 'reference_design_file', 'size_chart_tech_pack_file']
assert.deepEqual(renderedContactFileNames(), expectedAttachments, 'ContactForm must render the three buyer attachment inputs')
for (const attachment of expectedAttachments) {
  assert.ok(leadPipeline.includes(attachment), `Missing Formspree attachment mapping: ${attachment}`)
}

for (const contract of [
  'new FormData()',
  'NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT',
  'trackFileSelect',
  'trackFileUpload',
  'trackFormSubmit',
  'trackLead',
  'router.push',
  'errorMessage',
  'whatsappHref',
  'publicEmail',
]) {
  assert.ok(contact.includes(contract) || leadPipeline.includes(contract), `ContactForm pipeline contract missing: ${contract}`)
}

for (const utmField of ['utm_source', 'utm_medium', 'utm_campaign']) {
  assert.ok(analyticsClient.includes(utmField) || analyticsCore.includes(utmField), `UTM contract missing: ${utmField}`)
}

console.log('public inquiry integrity contracts passed')
