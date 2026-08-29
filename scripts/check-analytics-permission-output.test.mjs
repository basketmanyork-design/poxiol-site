import assert from 'node:assert/strict'
import {readdirSync, readFileSync} from 'node:fs'
import path from 'node:path'
import test from 'node:test'

function htmlFiles(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : []
  })
}

const homepage = readFileSync('out/index.html', 'utf8')
const allHtml = htmlFiles('out').map((file) => readFileSync(file, 'utf8')).join('\n')

test('static output does not preload optional Google Analytics', () => {
  assert.equal(allHtml.includes('googletagmanager.com/gtag/js'), false)
})

test('the initial preference is unselected and offers both choices', () => {
  assert.match(homepage, /Accept analytics/)
  assert.match(homepage, /Reject analytics/)
  assert.equal(homepage.includes('Analytics preference accepted'), false)
  assert.equal(homepage.includes('Analytics preference rejected'), false)
})
