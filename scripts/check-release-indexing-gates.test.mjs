import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const source = readFileSync('components/seo/GEOStructuredData.tsx', 'utf8')
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText
const exports = {}

vm.runInNewContext(code, {
  exports,
  require(name) {
    if (name === 'react' || name === 'react/jsx-runtime') return require(name)
    if (name === '@/lib/geo-v1') {
      return {
        GEO_V1: {
          canonicalBaseUrl: 'https://www.poxiol.com',
          organization: {
            id: 'https://www.poxiol.com/#organization',
            name: 'POXIOL',
            url: 'https://www.poxiol.com',
            description: 'Custom teamwear manufacturer.',
            industry: 'Sportswear Manufacturing',
          },
        },
      }
    }
    throw new Error(`Unexpected dependency: ${name}`)
  },
})

assert.equal(
  Object.hasOwn(exports, 'LocalBusinessSchema'),
  false,
  'Unverified LocalBusiness facts must not be exportable until owner evidence exists',
)

console.log('release indexing source gates passed')
