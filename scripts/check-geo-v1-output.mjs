import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8')
const decodeText = (value) => value
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
const visibleText = (html) => decodeText(
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim(),
)

const pages = {
  home: read('out/index.html'),
  about: read('out/about/index.html'),
  basketball: read('out/products/basketball-uniforms/index.html'),
}

function canonicalLinks(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(tag))
    .map((tag) => tag.match(/\bhref=["']([^"']+)["']/i)?.[1])
    .filter(Boolean)
}

function visibleH1Count(html) {
  const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  return [...withoutScripts.matchAll(/<h1\b([^>]*)>/gi)].filter((match) => {
    const attrs = match[1] || ''
    return !/\bhidden\b/i.test(attrs) &&
      !/\baria-hidden=["']true["']/i.test(attrs) &&
      !/\bclass=["'][^"']*\bsr-only\b/i.test(attrs) &&
      !/\bstyle=["'][^"']*(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(attrs)
  }).length
}

for (const [name, html] of Object.entries(pages)) {
  assert.equal(visibleH1Count(html), 1, `${name} must render exactly one visible H1`)
  const canonicals = canonicalLinks(html)
  assert.equal(canonicals.length, 1, `${name} must render exactly one canonical link`)
  assert.equal(new URL(canonicals[0], 'https://www.poxiol.com').host, 'www.poxiol.com', `${name} canonical host must be www.poxiol.com`)
}

const homeText = visibleText(pages.home)
for (const phrase of [
  'Custom Teamwear Manufacturer for Basketball, Soccer & Multi-Sport Teams',
  'POXIOL provides OEM custom uniforms for clubs, schools, sports brands and distributors with full customization, flexible MOQ and quality-controlled production.',
  'Who Is POXIOL?',
  'POXIOL is a B2B custom sportswear manufacturer specializing in basketball uniforms, soccer kits and multi-sport team apparel.',
  'Who We Help',
  'Youth Teams',
  'Schools & Academies',
  'Sports Brands',
  'Distributors',
]) assert.ok(homeText.includes(phrase), `homepage is missing GEO V1 phrase: ${phrase}`)

const aboutText = visibleText(pages.about)
for (const phrase of [
  'POXIOL is a B2B custom teamwear manufacturer specializing in basketball uniforms, soccer kits and multi-sport apparel.',
  'clubs, schools, teamwear brands and distributors',
  'OEM and private label production',
  'Manufacturing Process',
  'Design Confirmation',
  'Sample Development',
  'Material Preparation',
  'Production',
  'Quality Inspection',
  'International Shipping',
]) assert.ok(aboutText.toLowerCase().includes(phrase.toLowerCase()), `About is missing GEO V1 phrase: ${phrase}`)

const basketballText = visibleText(pages.basketball)
for (const phrase of [
  'Product Overview',
  'Product Type',
  'Application',
  'Customization',
  'Production Type',
  'Suitable For',
  'Technical Specifications',
  'Fabric',
  'Printing Technology',
  'Customization Options',
  'Available Sizes',
  'MOQ',
  'Recommended For',
]) assert.ok(basketballText.includes(phrase), `basketball product page is missing GEO field: ${phrase}`)

const approvedQuestions = [
  'Is POXIOL a manufacturer or trading company?',
  'Can small teams order custom basketball uniforms?',
  'Can basketball jerseys include custom names and numbers?',
  'What information is needed for a custom uniform quote?',
]
for (const question of approvedQuestions) assert.ok(basketballText.includes(question), `visible basketball FAQ is missing: ${question}`)

function jsonLdNodes(html) {
  const roots = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
  const nodes = []
  for (const rootValue of roots) {
    const values = Array.isArray(rootValue) ? rootValue : [rootValue]
    for (const value of values) {
      nodes.push(value)
      if (Array.isArray(value?.['@graph'])) nodes.push(...value['@graph'])
    }
  }
  return nodes
}

const homeNodes = jsonLdNodes(pages.home)
const organizations = homeNodes.filter((node) => node?.['@type'] === 'Organization')
assert.equal(organizations.length, 1, 'homepage must expose one Organization node')
assert.deepEqual(
  {
    id: organizations[0]['@id'],
    name: organizations[0].name,
    url: organizations[0].url,
    description: organizations[0].description,
    industry: organizations[0].industry,
  },
  {
    id: 'https://www.poxiol.com/#organization',
    name: 'POXIOL',
    url: 'https://www.poxiol.com',
    description: 'Custom Teamwear Manufacturer specializing in basketball, soccer and multi-sport uniforms.',
    industry: 'Sportswear Manufacturing',
  },
)
const websites = homeNodes.filter((node) => node?.['@type'] === 'WebSite')
assert.equal(websites.length, 1, 'homepage must retain one WebSite node')
assert.equal(websites[0].publisher?.['@id'], 'https://www.poxiol.com/#organization')

const basketballFaqPages = jsonLdNodes(pages.basketball).filter((node) => node?.['@type'] === 'FAQPage')
assert.ok(basketballFaqPages.length > 0, 'basketball page must expose FAQPage JSON-LD')
const schemaQuestions = basketballFaqPages.flatMap((node) => node.mainEntity || []).map((item) => item.name)
for (const question of approvedQuestions) assert.ok(schemaQuestions.includes(question), `FAQPage JSON-LD is missing: ${question}`)

const sitemap = read('out/sitemap.xml')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
assert.ok(sitemapUrls.length > 0, 'sitemap must contain URLs')
assert.ok(sitemapUrls.every((url) => url.startsWith('https://www.poxiol.com')), 'all sitemap URLs must use the canonical www domain')

const robots = read('public/robots.txt')
for (const crawler of ['GPTBot', 'PerplexityBot', 'Google-Extended', 'ClaudeBot']) {
  assert.match(robots, new RegExp(`User-agent: ${crawler}\\r?\\nAllow: /(?:\\r?\\n|$)`), `${crawler} must be explicitly allowed`)
}

console.log('POXIOL GEO V1 rendered-output checks passed')
