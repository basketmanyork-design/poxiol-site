import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
import {test} from 'node:test'

import ts from 'typescript'

import {
  SPORT_CATEGORIES,
  WEARING_SCENARIOS,
  productDiscoveryInquiryHref,
} from '../lib/product-taxonomy.ts'

const require = createRequire(import.meta.url)
const jsxRuntime = require('react/jsx-runtime')

function ImageStub() {
  return null
}

function LinkStub() {
  return null
}

function ArrowRightStub() {
  return null
}

function loadProductDiscovery() {
  const compiled = ts.transpileModule(
    readFileSync('components/products/ProductDiscovery.tsx', 'utf8'),
    {
      compilerOptions: {
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText

  const module = {exports: {}} as {exports: Record<string, unknown>}
  vm.runInNewContext(compiled, {
    exports: module.exports,
    module,
    require: (id: string) => {
      if (id === 'react/jsx-runtime') return jsxRuntime
      if (id === 'next/image') return {__esModule: true, default: ImageStub}
      if (id === 'next/link') return {__esModule: true, default: LinkStub}
      if (id === 'lucide-react') return {ArrowRight: ArrowRightStub}
      if (id === '@/lib/product-taxonomy') {
        return {SPORT_CATEGORIES, WEARING_SCENARIOS, productDiscoveryInquiryHref}
      }
      throw new Error(`Unexpected module: ${id}`)
    },
  })

  return module.exports.ProductDiscovery as () => unknown
}

function walk(node: unknown, visit: (value: Record<string, unknown>) => void) {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit))
    return
  }
  if (!node || typeof node !== 'object') return

  const value = node as Record<string, unknown>
  visit(value)
  const props = value.props as Record<string, unknown> | undefined
  if (props) walk(props.children, visit)
}

test('all product discovery cards brighten their image across the full hover and focus hot zone', () => {
  const ProductDiscovery = loadProductDiscovery()
  const cards: Array<Record<string, unknown>> = []

  walk(ProductDiscovery(), (node) => {
    const props = node.props as Record<string, unknown> | undefined
    if (props?.['data-product-scene']) cards.push(node)
  })

  assert.equal(cards.length, 15)

  for (const card of cards) {
    const descendants: Array<Record<string, unknown>> = []
    walk(card, (node) => descendants.push(node))

    const image = descendants.find((node) => node.type === ImageStub)
    const overlay = descendants.find((node) => {
      const props = node.props as Record<string, unknown> | undefined
      return typeof props?.className === 'string' && props.className.includes('bg-gradient-to-b')
    })
    const imageClass = String((image?.props as Record<string, unknown> | undefined)?.className ?? '')
    const overlayClass = String((overlay?.props as Record<string, unknown> | undefined)?.className ?? '')

    assert.match(imageClass, /group-hover:brightness-125/)
    assert.match(imageClass, /group-focus-within:brightness-125/)
    assert.match(imageClass, /transition-\[filter,transform\]/)
    assert.match(imageClass, /motion-reduce:transition-none/)
    assert.match(overlayClass, /group-hover:opacity-80/)
    assert.match(overlayClass, /group-focus-within:opacity-80/)
    assert.match(overlayClass, /transition-opacity/)
    assert.match(overlayClass, /motion-reduce:transition-none/)
  }
})
