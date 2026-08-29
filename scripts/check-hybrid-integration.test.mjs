import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'
import {test} from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import {assertLocalHybridReview} from '../lib/hybrid/local-review.mjs'

const validReviewEnvironment = {
  POXIOL_INTEGRATION_REVIEW: 'local',
  POXIOL_INTEGRATION_ORIGIN: 'http://127.0.0.1:4466',
}

test('the governed production record captures the exact authorized launch', () => {
  const approval = JSON.parse(readFileSync(path.join(process.cwd(), 'content/release/production-approval.json'), 'utf8'))
  assert.equal(approval.status, 'APPROVED')
  assert.equal(approval.approvedAt, '2026-08-30')
  assert.equal(approval.approvedBy, 'POXIOL legal representative')
  assert.equal(approval.deploymentTarget, 'https://www.poxiol.com')
  assert.match(approval.approvalBasis, /direct production deployment/i)
})

test('accepts the explicitly opted-in loopback review environment', () => {
  assert.doesNotThrow(() => assertLocalHybridReview(validReviewEnvironment))
})

test('accepts preview branches and opens main only for a complete governed production approval', () => {
  const approvedProduction = {
    status: 'APPROVED',
    approvedAt: '2026-08-30',
    approvedBy: 'POXIOL legal representative',
  }
  const mainEnvironment = {
    CF_PAGES: '1',
    CF_PAGES_BRANCH: 'main',
    CF_PAGES_URL: 'https://www.poxiol.com',
  }
  assert.doesNotThrow(() => assertLocalHybridReview({
    CF_PAGES: '1',
    CF_PAGES_BRANCH: 'codex/construction-completion',
    CF_PAGES_URL: 'https://preview.example.pages.dev',
  }))
  assert.doesNotThrow(() => assertLocalHybridReview(mainEnvironment, approvedProduction))
  assert.throws(() => assertLocalHybridReview(mainEnvironment, {
    ...approvedProduction,
    status: 'PENDING_OWNER_APPROVAL',
  }), {message: 'LOCAL_HYBRID_REVIEW_ONLY'})
  assert.throws(() => assertLocalHybridReview(mainEnvironment, {
    ...approvedProduction,
    approvedBy: null,
  }), {message: 'LOCAL_HYBRID_REVIEW_ONLY'})
})

for (const origin of ['http://127.0.0.1:80', 'http://localhost:80', 'http://[::1]:80']) {
  test(`accepts an explicitly written loopback port after URL normalization: ${origin}`, () => {
    assert.doesNotThrow(() => assertLocalHybridReview({...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: origin}))
  })
}

for (const environment of [
  {},
  {...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: 'https://127.0.0.1:4466'},
  {...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: 'http://example.com:4466'},
  {...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: 'http://user@127.0.0.1:4466'},
  {...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: 'http://127.0.0.1:4466/review'},
  {...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: 'http://127.0.0.1:4466?test=1'},
  {...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: 'http://127.0.0.1:4466#review'},
  {...validReviewEnvironment, POXIOL_INTEGRATION_ORIGIN: 'http://127.0.0.1'},
  {...validReviewEnvironment, CF_PAGES: '0'},
  {...validReviewEnvironment, CF_PAGES_URL: 'https://example.pages.dev'},
  {...validReviewEnvironment, VERCEL: '0'},
  {...validReviewEnvironment, VERCEL_ENV: 'preview'},
]) {
  test(`rejects non-local review environment ${JSON.stringify(environment)}`, () => {
    assert.throws(() => assertLocalHybridReview(environment), {message: 'LOCAL_HYBRID_REVIEW_ONLY'})
  })
}

const require = createRequire(import.meta.url)
const jsxRuntime = {jsx: (type, props) => ({type, props: props || {}}), jsxs: (type, props) => ({type, props: props || {}}), Fragment: Symbol('Fragment')}
function compile(filename, dependencies = {}) {
  const module = {exports: {}}
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022}}).outputText
  vm.runInNewContext(code, {exports: module.exports, require(name) { return dependencies[name] ?? require(name) }, console})
  return module.exports
}
function nodes(node) { if (typeof node === 'string') return [node]; return !node || typeof node !== 'object' ? [] : [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)] }

test('renders the approved global-buyer content with distinct existing inquiry targets', () => {
  const leads = compile('lib/v8/leads.ts')
  const inquiryContext = compile('lib/inquiry-context.ts', {'./v8/leads.ts': leads})
  const productTaxonomy = compile('lib/product-taxonomy.ts', {'./inquiry-context.ts': inquiryContext})
  const home = compile('lib/hybrid/home.ts')
  const component = compile('components/hybrid/HomepageHybrid.tsx', {
    'react/jsx-runtime': jsxRuntime,
    'next/image': {default: (props) => ({type: 'img', props})},
    'next/link': {default: (props) => ({type: 'a', props})},
    '@/components/InquiryLink': {default: (props) => ({type: 'a', props})},
    '@/components/v8/ProjectQualificationForm': {ProjectQualificationForm: () => ({type: 'form', props: {}})},
    '@/lib/hybrid/home': home,
    '@/lib/product-taxonomy': productTaxonomy,
    './HomepageHybrid.module.css': {default: {}},
  })
  const tree = component.HomepageHybrid({publicEmail: 'sales@example.invalid', whatsappHref: 'https://wa.me/8613055646888'})
  const text = nodes(tree).filter(node => typeof node === 'string').join(' ')
  const anchors = nodes(tree).filter(node => node?.props?.href).map(node => node.props)
  assert.match(text, /For Teamwear Distributors, Dealers, Brands & Custom Resellers/)
  assert.match(text, /Design Accuracy.*Size & Fit.*Project Deadline.*Sample-to-Bulk.*Reorder Consistency.*Account Expansion/)
  assert.match(text, /Approval planning/)
  assert.match(text, /Plan the approval path before production/)
  assert.doesNotMatch(text, /Local editorial review|Owner-approved editorial wording only|Evidence pending|local source projection|pilot does not add a second form/i)
  assert.equal((text.match(/Final feasibility remains project-specific/g) || []).length, 1)
  assert.equal(anchors.filter(anchor => anchor.href === '/free-mockup/').some(anchor => anchor.children === 'Upload Your Design'), true)
  assert.equal(anchors.filter(anchor => anchor.href === '/get-quote/?product=Full%20Teamwear&source=%2F').some(anchor => anchor.children === 'Build Your Range'), true)
  assert.equal(anchors.filter(anchor => anchor.href === '/sample-order/').some(anchor => anchor.children === 'Start a Sample'), true)
  const illustration = nodes(tree).find(node => node?.props?.src)?.props
  assert.equal(illustration?.src, '/images/poxiol-teamwear-hero-poxiol-only-v2.webp')
  assert.match(text, /Illustrative teamwear configuration/)
})

test('keeps approved navigation groups and destination-labelled legacy routes', () => {
  const navigation = compile('lib/navigation.ts')
  const groups = Object.fromEntries(navigation.HEADER_NAV.map(item => [item.label, item.children || []]))
  assert.deepEqual(Array.from(groups.Products, item => item.href), ['/products/', '/products/#sports', '/products/#scenarios', '/products/basketball-uniforms/', '/products/soccer-jerseys/'])
  assert.deepEqual(Array.from(groups.Solutions, item => item.href), ['/private-label-teamwear/', '/oem-odm/', '/sample-order/'])
  assert.deepEqual(Array.from(groups['Why POXIOL'], item => item.href), ['/customization/', '/quality-control-process/', '/fabric-guide/', '/shipping-after-sales/'])
  assert.deepEqual(Array.from(groups['About POXIOL'], item => item.href), ['/about/', '/factory/', '/contact/'])
})

test('Header renders real semantic disclosures for every navigation group with children', async () => {
  const navigation = compile('lib/navigation.ts')
  const ui = compile('components/ui.tsx', {
    'react/jsx-runtime': jsxRuntime,
    react: {},
    'next/link': {default: () => null},
    '@/lib/sanity/content': {getSiteChrome: async () => ({brandName: 'POXIOL', logo: null})},
    '@/lib/navigation': navigation,
    '@/components/MobileMenu': {default: () => null},
    '@/components/MobileInquiryLink': {default: () => null},
    '@/components/MobileInquiryBar': {default: () => null},
    '@/components/InquiryLink': {default: () => null},
  })
  const header = await ui.Header()
  const disclosures = nodes(header).filter(node => node.type === 'details')
  assert.equal(disclosures.length, 4)
  for (const disclosure of disclosures) assert.ok(nodes(disclosure).some(node => node.type === 'summary'), 'Each desktop disclosure must use a native summary control')
})

function mobileMenuHarness() {
  const slots = []
  let cursor = 0
  const navigation = compile('lib/navigation.ts')
  const menu = compile('components/MobileMenu.tsx', {
    'react/jsx-runtime': jsxRuntime,
    react: {useState(initial) { const index = cursor++; if (!(index in slots)) slots[index] = initial; return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value }] }},
    'next/link': {default: () => null},
    '@/components/InquiryLink': {default: () => null},
    '@/lib/navigation': navigation,
  })
  function render() { cursor = 0; return menu.default() }
  function find(predicate) { return nodes(render()).find(predicate) }
  return {render, find}
}

test('MobileMenu expands a real submenu and closes after a selected child link', () => {
  const menu = mobileMenuHarness()
  menu.find(node => node.type === 'button' && node.props['aria-label'] === 'Open menu').props.onClick()
  assert.equal(menu.find(node => node.type === 'button' && node.props['aria-label'] === 'Close menu').props['aria-expanded'], true)
  menu.find(node => node.type === 'button' && node.props['aria-label'] === 'Toggle Products submenu').props.onClick()
  const productLink = menu.find(node => node.props?.href === '/products/basketball-uniforms/')
  assert.ok(productLink, 'Expanded Products menu must render its actual child link')
  productLink.props.onClick()
  assert.ok(menu.find(node => node.type === 'button' && node.props['aria-label'] === 'Open menu'), 'Selecting a child closes the mobile menu')
})
