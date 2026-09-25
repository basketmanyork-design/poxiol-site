import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

function visibleHtml(path) {
  return readFileSync(path, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
}

function hasExactLink(html, href, label) {
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`<a\\b[^>]*href=["']${escapedHref}["'][^>]*>\\s*${escapedLabel}\\s*<\\/a>`, 'i').test(html)
}

test('the Basketball pillar exposes the consolidated buying guide in visible page content', () => {
  const html = visibleHtml('out/products/basketball-uniforms/index.html')

  assert.match(html, />Plan Your Basketball Uniform Order</)
  assert.equal(
    hasExactLink(
      html,
      '/guides/how-to-order-custom-basketball-uniforms/',
      'Read the Custom Basketball Uniform Buying Guide →',
    ),
    true,
  )
})

test('the consolidated buying guide links back to the Basketball pillar in visible article content', () => {
  const html = visibleHtml('out/guides/how-to-order-custom-basketball-uniforms/index.html')

  assert.match(html, />Explore Custom Basketball Uniforms</)
  assert.equal(
    hasExactLink(
      html,
      '/products/basketball-uniforms/',
      'View Custom Basketball Uniforms →',
    ),
    true,
  )
})

test('the Basketball product callout remains limited to the approved survivor guide', () => {
  const unrelatedGuide = visibleHtml('out/guides/b2b-sourcing-faq/index.html')

  assert.doesNotMatch(unrelatedGuide, />Explore Custom Basketball Uniforms</)
  assert.equal(
    hasExactLink(unrelatedGuide, '/products/basketball-uniforms/', 'View Custom Basketball Uniforms →'),
    false,
  )
})
