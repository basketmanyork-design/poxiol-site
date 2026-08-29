import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {test} from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)

function compile(filename, dependencies = {}) {
  const module = {exports: {}}
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  vm.runInNewContext(code, {
    exports: module.exports,
    require(name) { return dependencies[name] ?? require(name) },
  })
  return module.exports
}

test('desktop product links close their disclosure and restore summary focus', () => {
  const filename = 'components/DesktopMenuLink.tsx'
  assert.equal(existsSync(filename), true, `${filename} must provide the desktop disclosure interaction`)

  const component = compile(filename, {
    'react/jsx-runtime': {jsx: (type, props) => ({type, props})},
    '@/components/InquiryLink': {default: (props) => ({type: 'a', props})},
  })
  let removed = null
  let focusOptions = null
  let originalClickCalled = false
  const summary = {focus(options) { focusOptions = options }}
  const details = {
    removeAttribute(attribute) { removed = attribute },
    querySelector(selector) { return selector === 'summary' ? summary : null },
  }
  const rendered = component.default({
    href: '/products/#sport-rugby',
    onClick() { originalClickCalled = true },
    children: 'Rugby',
  })
  rendered.props.onClick({currentTarget: {closest: selector => selector === 'details' ? details : null}})

  assert.equal(originalClickCalled, true)
  assert.equal(removed, 'open')
  assert.equal(focusOptions?.preventScroll, true)
})

test('mobile menu reserves scroll clearance above the fixed inquiry bar', () => {
  const source = readFileSync('components/MobileMenu.tsx', 'utf8')
  assert.match(source, /pb-\[calc\(6\.5rem\+env\(safe-area-inset-bottom\)\)\]/)
})
