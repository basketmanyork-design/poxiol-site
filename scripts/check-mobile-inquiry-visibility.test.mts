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
  assert.match(component, /querySelectorAll<HTMLElement>\('\[data-inquiry-form\]'\)/)
  assert.match(component, /new IntersectionObserver/)
  assert.match(component, /observer\.disconnect\(\)/)
  assert.match(component, /}, \[pathname\]\)/)
  assert.match(component, /if \(formInView\) return null/)
})

test('every live inquiry form opts into mobile-bar avoidance', async () => {
  for (const file of [
    'components/forms/ContactForm.tsx',
    'components/forms/GeneralInquiryForm.tsx',
    'components/forms/FreeMockupForm.tsx',
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
