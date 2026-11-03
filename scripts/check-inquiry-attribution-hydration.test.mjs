import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {join} from 'node:path'
import {runInNewContext} from 'node:vm'
import {fileURLToPath} from 'node:url'
import {contextFromPage, contextualInquiryHref} from '../lib/inquiry-context.ts'
import {sanitizeGoogleAdsAttribution} from '../lib/google-ads-attribution.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const require = createRequire(new URL('../package.json', import.meta.url))
const ts = require('typescript')
const hook = readFileSync(join(root, 'components/useInquiryContext.ts'), 'utf8')

function renderHook(url, server = false) {
  let state
  let effect
  const box = {
    exports: {}, URL,
    require(name) {
      if (name === 'react') return {
        useState(initial) { if (state === undefined) state = initial; return [state, value => { state = value }] },
        useEffect(callback) { effect = callback },
      }
      if (name === 'next/navigation') return {usePathname: () => url.pathname}
      if (name === '@/lib/inquiry-context') return {contextFromPage}
      if (name === '@/lib/google-ads-attribution') return {sanitizeGoogleAdsAttribution}
      throw new Error(`Unexpected import ${name}`)
    },
  }
  if (!server) box.window = {location: url}
  const compiled = ts.transpileModule(hook, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText
  runInNewContext(compiled, box)
  return {render: () => box.exports.useInquiryContext(), flush: () => effect(), move(next) { url = new URL(next); box.window.location = url }}
}

for (const path of ['/', '/products/basketball-uniforms/', '/private-label-teamwear/', '/resources/teamwear-manufacturer-evaluation-checklist/', '/get-quote/', '/sample-order/', '/free-mockup/', '/contact/']) {
  const url = new URL(`https://www.poxiol.com${path}?utm_source=poxiol_team&utm_medium=internal_test&utm_campaign=hydration_regression`)
  const server = renderHook(url, true).render()
  const client = renderHook(url)
  assert.equal(JSON.stringify(client.render()), JSON.stringify(server), `${path} initial hydration parity`)
  client.flush()
  assert.match(contextualInquiryHref('/get-quote/', client.render()), /utm_campaign=hydration_regression/, `${path} attribution after effect`)
  client.move('https://www.poxiol.com/products/soccer-jerseys/')
  assert.equal(client.render().adsAttribution.utm_source, undefined, `${path} no stale source after route change`)
}

const invalid = renderHook(new URL('https://www.poxiol.com/products/basketball-uniforms/?utm_source=buyer%40example.com&token=private'))
invalid.render(); invalid.flush()
assert.equal(invalid.render().adsAttribution.utm_source, undefined)

const mobile = readFileSync(join(root, 'components/MobileInquiryLink.tsx'), 'utf8')
const decision = readFileSync(join(root, 'components/seo-growth/BuyerDecisionPanel.tsx'), 'utf8')
assert.match(mobile, /\.\.\.contextFromPage\(normalizedPath\), adsAttribution/)
assert.match(decision, /<InquiryLink[\s\S]*?href=\{link\.href\}/)
console.log('Inquiry attribution hydration, route isolation, privacy and five-link binding contracts passed')
