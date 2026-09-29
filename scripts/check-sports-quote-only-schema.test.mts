import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const outputMode = process.argv.includes('--output')

const targets = [
  {
    route: '/products/team-accessories/',
    page: 'app/products/team-accessories/page.tsx',
    label: 'Team Accessories',
  },
  {
    route: '/products/training-wear/',
    page: 'app/products/training-wear/page.tsx',
    label: 'Training Wear',
  },
  {
    route: '/products/hoodies-jackets/',
    page: 'app/products/hoodies-jackets/page.tsx',
    label: 'Hoodies & Jackets',
  },
] as const

function read(relativePath: string) {
  return readFileSync(path.join(root, relativePath), 'utf8')
}

function outputPath(route: string) {
  return path.join(root, 'out', ...route.split('/').filter(Boolean), 'index.html')
}

function jsonLdNodes(html: string) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(([, raw]) => {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : [parsed]
    })
}

if (!outputMode) {
  test('the three quote-only routes share the bounded SportsLandingPage template', () => {
    for (const target of targets) {
      const source = read(target.page)
      assert.match(source, /<SportsLandingPage\s+data=\{pageData\}\s*\/>/, `${target.route} must use SportsLandingPage`)
    }
  })

  test('SportsLandingPage uses service, FAQ and one standalone breadcrumb without ProductSchema', () => {
    const source = read('components/sports/SportsLandingPage.tsx')
    assert.doesNotMatch(source, /\bProductSchema\b/, 'quote-only shared template must not declare ProductSchema')
    assert.equal((source.match(/<ServiceSchema\b/g) || []).length, 1, 'shared template must declare one ServiceSchema')
    assert.equal((source.match(/<FAQSchema\b/g) || []).length, 1, 'shared template must declare one FAQSchema')
    assert.equal((source.match(/<BreadcrumbSchema\b/g) || []).length, 1, 'shared template must declare one standalone BreadcrumbSchema')
  })
} else {
  for (const target of targets) {
    test(`${target.route} renders the truthful quote-only schema set`, () => {
      const html = readFileSync(outputPath(target.route), 'utf8')
      const nodes = jsonLdNodes(html)
      const count = (type: string) => nodes.filter((node) => node?.['@type'] === type).length

      assert.equal(count('Product'), 0, `${target.route} must not claim Product rich-result eligibility`)
      assert.equal(count('Service'), 1, `${target.route} must render one Service`)
      assert.equal(count('FAQPage'), 1, `${target.route} must render one FAQPage`)
      assert.equal(count('BreadcrumbList'), 1, `${target.route} must render one BreadcrumbList`)

      const service = nodes.find((node) => node?.['@type'] === 'Service')
      assert.equal(service.name, `Custom ${target.label} Manufacturing`)
      assert.equal('price' in service, false, `${target.route} must not invent a Service price`)
      assert.equal('offers' in service, false, `${target.route} must not invent a Service offer`)

      const breadcrumb = nodes.find((node) => node?.['@type'] === 'BreadcrumbList')
      assert.deepEqual(
        breadcrumb.itemListElement.map((item: {position: number; name: string; item: string}) => ({
          position: item.position,
          name: item.name,
          item: item.item,
        })),
        [
          {position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
          {position: 2, name: 'Products', item: 'https://www.poxiol.com/products/'},
          {position: 3, name: target.label, item: `https://www.poxiol.com${target.route}`},
        ],
      )
    })
  }
}
