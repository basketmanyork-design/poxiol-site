#!/usr/bin/env node
import {execFileSync} from 'node:child_process'
import fs from 'node:fs'

const suspicious = ['\u9225', '\u922b', '\u951b', '\u9286', '\u9428', '\u9346', '\u93c2', '\u6d63', '\u95c2', '\u93bb', '\ufffd', '\u00c3', '\u00e2\u20ac']
const secretPatterns = [
  /SANITY_READ_TOKEN\s*[:=]\s*['"][A-Za-z0-9._-]{16,}['"]/i,
  /NEXT_PUBLIC_[A-Z0-9_]*TOKEN/i,
  /console\.log\([^)]*token/i,
  /Authorization:\s*Bearer\s+[A-Za-z0-9._-]+/i,
]
const git = process.env.GIT_EXE || 'git'
function gitOutput(args) {
  return execFileSync(git, ['-c', 'safe.directory=*', '-c', 'core.quotepath=false', ...args], {encoding: 'utf8'})
}
let output = ''
try {
  output = gitOutput(['diff', '--name-only', '-z', 'origin/main...HEAD'])
} catch {
  output = gitOutput(['ls-files', '-z'])
}
const textFiles = output.split('\0').filter(Boolean)
const binaryExt = /\.(png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|pdf|zip)$/i
let failures = []
for (const file of textFiles) {
  if (binaryExt.test(file)) continue
  if (!fs.existsSync(file)) continue
  const buf = fs.readFileSync(file)
  if (buf.includes(0)) {
    failures.push(file + ': NUL byte in text file')
    continue
  }
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) failures.push(file + ': UTF-8 BOM')
  const text = buf.toString('utf8')
  for (const pattern of suspicious) if (text.includes(pattern)) failures.push(file + ': suspicious mojibake ' + pattern)
  for (const pattern of secretPatterns) if (pattern.test(text)) failures.push(file + ': possible secret/token exposure')
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('cms safety scan passed')