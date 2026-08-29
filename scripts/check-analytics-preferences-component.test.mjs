import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {test} from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const jsxRuntime = {
  jsx: (type, props) => ({type, props: props || {}}),
  jsxs: (type, props) => ({type, props: props || {}}),
  Fragment: Symbol('Fragment'),
}

function compile(filename) {
  const module = {exports: {}}
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022},
  }).outputText
  vm.runInNewContext(code, {
    exports: module.exports,
    require(name) {
      if (name === 'react/jsx-runtime') return jsxRuntime
      return require(name)
    },
    console,
  })
  return module.exports
}

function nodes(node) {
  if (typeof node === 'string') return [node]
  if (!node || typeof node !== 'object') return []
  return [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)]
}

test('settled analytics permission becomes a compact privacy choices control', () => {
  const {AnalyticsPreferences} = compile('components/privacy/AnalyticsPreferences.tsx')
  const onChange = () => {}
  const tree = AnalyticsPreferences({permission: 'accepted', onAccept() {}, onReject() {}, onChange})
  const all = nodes(tree)
  const text = all.filter(node => typeof node === 'string').join(' ')
  const buttons = all.filter(node => node?.type === 'button')

  assert.equal(buttons.length, 1)
  assert.equal(buttons[0].props.children, 'Privacy choices')
  assert.equal(buttons[0].props.onClick, onChange)
  assert.match(buttons[0].props['aria-label'], /Change analytics preference \(accepted\)/)
  assert.doesNotMatch(text, /Analytics preference accepted/)
})

test('unknown analytics permission still explains the choice before asking', () => {
  const {AnalyticsPreferences} = compile('components/privacy/AnalyticsPreferences.tsx')
  const tree = AnalyticsPreferences({permission: 'unknown', onAccept() {}, onReject() {}, onChange() {}})
  const text = nodes(tree).filter(node => typeof node === 'string').join(' ')

  assert.match(text, /Optional analytics/)
  assert.match(text, /Accept analytics/)
  assert.match(text, /Reject analytics/)
})
