import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'

import {sportsPageSectionCopy} from '../lib/sports-page-copy.ts'

const fixtures = [
  ['Basketball Uniforms', 'Choose the Right Basketball Uniforms Format', 'Basketball Uniforms Project Planning References'],
  ['Soccer Kits', 'Choose the Right Soccer Kits Format', 'Soccer Kits Project Planning References'],
  ['Training Wear', 'Choose the Right Training Wear Format', 'Training Wear Project Planning References'],
  ['Hoodies', 'Choose the Right Hoodies Format', 'Hoodies Project Planning References'],
  ['Team Accessories', 'Choose the Right Team Accessories Format', 'Team Accessories Project Planning References'],
] as const

for (const [productLabel, productTitle, relatedTitle] of fixtures) {
  test(`${productLabel} receives category-specific shared section copy`, () => {
    const copy = sportsPageSectionCopy(productLabel)
    assert.deepEqual(copy, {
      productTypes: {
        eyebrow: `${productLabel} Options`,
        title: productTitle,
        subtitle: 'Compare the product format that fits your roster, use case and customization plan.',
      },
      relatedProjects: {
        eyebrow: 'Related Planning Scenarios',
        title: relatedTitle,
        subtitle: 'Review related planning formats before defining your roster, artwork and delivery plan.',
      },
    })
    if (productLabel !== 'Basketball Uniforms') {
      assert.doesNotMatch(JSON.stringify(copy), /Basketball/)
    }
  })
}

test('the shared sports template binds both heading families to the category helper', () => {
  const source = readFileSync('components/sports/SportsLandingPage.tsx', 'utf8')

  assert.match(source, /const sectionCopy = sportsPageSectionCopy\(productLabel\)/)
  assert.match(source, /<SectionHeading \{\.\.\.sectionCopy\.productTypes\}\s*\/>/)
  assert.match(source, /<SectionHeading \{\.\.\.sectionCopy\.relatedProjects\}\s*\/>/)
  assert.doesNotMatch(source, /Basketball Uniforms Project Planning References/)
})
