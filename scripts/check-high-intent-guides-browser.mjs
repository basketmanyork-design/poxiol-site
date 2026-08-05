import assert from 'node:assert/strict'
import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const {chromium} = require('playwright')
const baseUrl = process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:4173'
const routes = [
  '/guides/reversible-vs-single-layer-basketball-uniforms/',
  '/guides/custom-basketball-uniform-fabric-gsm/',
  '/guides/sample-first-vs-bulk-teamwear-order/',
  '/guides/custom-basketball-uniform-cost-factors/',
]
const viewports = [
  {name: 'desktop', width: 1440, height: 1000},
  {name: 'mobile', width: 390, height: 844},
]

const browser = await chromium.launch({headless: true, executablePath: process.env.BROWSER_EXECUTABLE || undefined})
const results = []
try {
  for (const viewport of viewports) {
    const page = await browser.newPage({viewport})
    const consoleErrors = []
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('pageerror', (error) => consoleErrors.push(error.message))
    for (const route of routes) {
      consoleErrors.length = 0
      const response = await page.goto(new URL(route, baseUrl).href, {waitUntil: 'load'})
      assert.equal(response?.status(), 200, `${viewport.name} ${route} must return 200`)
      const audit = await page.evaluate(() => {
        const h1s = [...document.querySelectorAll('h1')].filter((node) => {
          const style = getComputedStyle(node)
          const box = node.getBoundingClientRect()
          return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0
        })
        const brokenImages = [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src)
        const jsonLdErrors = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) => {
          try { JSON.parse(script.textContent || ''); return [] } catch { return ['invalid-json-ld'] }
        })
        const actionable = [...document.querySelectorAll('a[href]')].map((link) => link.getAttribute('href')).filter((href) => href && (href.startsWith('/contact') || href.startsWith('/free-mockup') || href.startsWith('/sample-order') || href.startsWith('mailto:') || href.includes('wa.me')))
        return {
          h1Count: h1s.length,
          canonical: document.querySelectorAll('link[rel="canonical"]').length,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          brokenImages,
          jsonLdErrors,
          actionableCount: actionable.length,
        }
      })
      assert.equal(audit.h1Count, 1, `${viewport.name} ${route} must have one visible H1`)
      assert.equal(audit.canonical, 1, `${viewport.name} ${route} must have one canonical`)
      assert.equal(audit.overflow, false, `${viewport.name} ${route} has horizontal overflow`)
      assert.deepEqual(audit.brokenImages, [], `${viewport.name} ${route} has broken images`)
      assert.deepEqual(audit.jsonLdErrors, [], `${viewport.name} ${route} has invalid JSON-LD`)
      assert.ok(audit.actionableCount >= 2, `${viewport.name} ${route} must retain actionable CTA links`)
      assert.deepEqual(consoleErrors, [], `${viewport.name} ${route} has console errors`)
      results.push({viewport: viewport.name, route, ...audit, consoleErrors: 0})
    }
    await page.close()
  }
} finally {
  await browser.close()
}
console.log(JSON.stringify({status: 'passed', pages: results.length, results}))
