import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {test} from 'node:test'

import {updateVisibleInquiryForms} from '../lib/mobile-inquiry-visibility.ts'

test('mobile inquiry visibility tracks every form that intersects the viewport', () => {
  const quoteForm = {id: 'quote-form'}
  const contactForm = {id: 'contact-form'}

  let visible = updateVisibleInquiryForms(new Set(), [
    {target: quoteForm, isIntersecting: true},
    {target: contactForm, isIntersecting: false},
  ])
  assert.deepEqual([...visible], [quoteForm])

  visible = updateVisibleInquiryForms(visible, [
    {target: contactForm, isIntersecting: true},
  ])
  assert.equal(visible.size, 2)

  visible = updateVisibleInquiryForms(visible, [
    {target: quoteForm, isIntersecting: false},
  ])
  assert.deepEqual([...visible], [contactForm])
})

test('mobile inquiry bar observes marked forms and fully leaves the interaction tree', async () => {
  const component = await readFile('components/MobileInquiryBar.tsx', 'utf8')
  assert.match(component, /usePathname/)
  assert.match(component, /const pathname = usePathname\(\)/)
  assert.match(component, /querySelectorAll<HTMLElement>\('\[data-inquiry-form\], \[data-mobile-inquiry-hero\]'\)/)
  assert.match(component, /new IntersectionObserver/)
  assert.match(component, /observer\.disconnect\(\)/)
  assert.match(component, /}, \[pathname\]\)/)
  assert.match(component, /if \(formInView\) return null/)
})

test('every live inquiry form opts into mobile-bar avoidance', async () => {
  for (const file of [
    'components/forms/ContactForm.tsx',
    'components/forms/GeneralInquiryForm.tsx',
  ]) {
    const source = await readFile(file, 'utf8')
    assert.match(source, /<form\b[^>]*data-inquiry-form/, `${file} must identify its live inquiry form`)
  }
})

test('opened mobile menu uses a fully opaque surface', async () => {
  const menu = await readFile('components/MobileMenu.tsx', 'utf8')
  const openPanel = menu.match(/<div className="([^"]*top-20[^"]*)">/)?.[1]
  assert.ok(openPanel, 'mobile menu panel must remain identifiable')
  assert.match(openPanel, /bg-neutral-950(?:\s|$)/)
  assert.doesNotMatch(openPanel, /bg-neutral-950\/\d+/)
  assert.doesNotMatch(openPanel, /backdrop-blur/)
})

test('opening the mobile menu removes competing fixed layers', async () => {
  const [menu, preferences, globals] = await Promise.all([
    readFile('components/MobileMenu.tsx', 'utf8'),
    readFile('components/privacy/AnalyticsPreferences.tsx', 'utf8'),
    readFile('app/globals.css', 'utf8'),
  ])
  assert.match(menu, /poxiol-mobile-menu-open/)
  assert.match(preferences, /poxiol-analytics-preferences/)
  assert.match(globals, /body:has\(\.poxiol-mobile-menu-open\) \.poxiol-mobile-cta/)
  assert.match(globals, /body:has\(\.poxiol-mobile-menu-open\) \.poxiol-analytics-preferences/)
})

test('analytics preference panel yields the hero CTA space when no mobile inquiry bar is present', async () => {
  const globals = await readFile('app/globals.css', 'utf8')
  assert.match(globals, /body:not\(:has\(\.poxiol-mobile-cta\)\) \.poxiol-analytics-preferences/)
  assert.match(globals, /@media \(max-width:380px\)/)
})

test('the mobile inquiry bar also stays out of the Hero viewport', async () => {
  const [bar, homepage] = await Promise.all([
    readFile('components/MobileInquiryBar.tsx', 'utf8'),
    readFile('components/home-optimization/HomepageOptimization.tsx', 'utf8'),
  ])
  assert.match(bar, /data-mobile-inquiry-hero/)
  assert.match(homepage, /data-mobile-inquiry-hero/)
})
