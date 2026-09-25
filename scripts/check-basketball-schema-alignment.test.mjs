import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import test from 'node:test'

const basketballUrl = 'https://www.poxiol.com/products/basketball-uniforms/'

function flattenNodes(value) {
  if (Array.isArray(value)) return value.flatMap(flattenNodes)
  if (!value || typeof value !== 'object') return []
  const graph = Array.isArray(value['@graph']) ? value['@graph'].flatMap(flattenNodes) : []
  return [value, ...graph]
}

test('the built Basketball page describes its hierarchy and service without an unsupported Product rich-result claim', async () => {
  const html = await readFile(new URL('../out/products/basketball-uniforms/index.html', import.meta.url), 'utf8')
  const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]))
  const nodes = schemas.flatMap(flattenNodes)

  assert.equal(nodes.some((node) => node['@type'] === 'Product'), false)
  assert.equal(nodes.some((node) => node['@type'] === 'Service'), true)
  assert.equal(nodes.some((node) => node['@type'] === 'FAQPage'), true)

  const breadcrumbs = nodes.filter((node) => node['@type'] === 'BreadcrumbList')
  assert.equal(breadcrumbs.length, 1)
  assert.deepEqual(breadcrumbs[0].itemListElement, [
    {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.poxiol.com/'},
    {'@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.poxiol.com/products/'},
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Custom Basketball Uniform Manufacturer for Distributors and Brands',
      item: basketballUrl,
    },
  ])
})
