import assert from 'node:assert/strict'
import test from 'node:test'

import * as releaseManifest from '../lib/release/release-manifest.mjs'

const {buildReleaseManifest} = releaseManifest

const commit = 'a'.repeat(40)
const digest = 'b'.repeat(64)

test('forces construction packages to remain production unauthorized', () => {
  const manifest = buildReleaseManifest({
    commits: [commit],
    sourceFiles: [],
    outputFiles: [],
    gates: {c1: true, c2: true, c3: true, c4: true},
  })

  assert.equal(manifest.status, 'PREVIEW_READY_PRODUCTION_NO_GO')
  assert.equal(manifest.productionAuthorized, false)
  assert.equal(manifest.deploymentPerformed, false)
  assert.equal(manifest.cmsWrites, 0)
  assert.equal(manifest.realFormSubmissions, 0)
})

test('sorts file entries by path', () => {
  const manifest = buildReleaseManifest({
    commits: [commit],
    sourceFiles: [
      {path: 'z.txt', sha256: digest},
      {path: 'a.txt', sha256: 'c'.repeat(64)},
    ],
    outputFiles: [],
    gates: {c1: true, c2: true, c3: true, c4: true},
  })

  assert.deepEqual(manifest.sourceFiles.map((item) => item.path), ['a.txt', 'z.txt'])
})

test('uses canonical LF hashes for governed text files without rewriting binary bytes', () => {
  assert.equal(
    typeof releaseManifest.sha256ReleaseFile,
    'function',
    'construction release hashes must have a cross-platform file contract',
  )
  const lf = Buffer.from('alpha\nbeta\n', 'utf8')
  const crlf = Buffer.from('alpha\r\nbeta\r\n', 'utf8')
  assert.equal(
    releaseManifest.sha256ReleaseFile('content/policy.json', lf),
    releaseManifest.sha256ReleaseFile('content/policy.json', crlf),
  )
  assert.notEqual(
    releaseManifest.sha256ReleaseFile('public/image.png', lf),
    releaseManifest.sha256ReleaseFile('public/image.png', crlf),
  )
})

test('treats CRLF and LF manifest serialization as the same governed record', () => {
  assert.equal(
    typeof releaseManifest.releaseManifestTextMatches,
    'function',
    'construction manifest checks must be portable across Git line-ending policies',
  )
  const lf = '{\n  "schemaVersion": 1\n}\n'
  const crlf = lf.replaceAll('\n', '\r\n')

  assert.equal(releaseManifest.releaseManifestTextMatches(crlf, lf), true)
  assert.equal(
    releaseManifest.releaseManifestTextMatches('{\n  "schemaVersion": 2\n}\n', lf),
    false,
  )
})

test('canonicalizes only Next export scheduling noise while retaining rendered HTML changes', () => {
  const first = Buffer.from(`<!DOCTYPE html><html><head><script src="/a.js" async=""></script><title>POXIOL</title><link rel="icon" href="/icon.svg"/></head><body><main>Stable buyer copy</main><script>self.__next_f.push([1,"2:[\\"$\\",\\"main\\",null,{\\"children\\":\\"Stable buyer copy\\"}]\\n"])</script></body></html>`)
  const reordered = Buffer.from(`<!DOCTYPE html><html><head><link rel="icon" href="/icon.svg"/><title>POXIOL</title><script src="/a.js" async=""></script></head><body><main>Stable buyer copy</main><script>self.__next_f.push([1,"a:[\\"$\\",\\"main\\",null,{\\"children\\":\\"Stable buyer copy\\"}]\\n"])</script></body></html>`)
  const changedCopy = Buffer.from(`<!DOCTYPE html><html><head><link rel="icon" href="/icon.svg"/><title>POXIOL</title><script src="/a.js" async=""></script></head><body><main>Changed buyer copy</main><script>self.__next_f.push([1,"a:[\\"$\\",\\"main\\",null,{\\"children\\":\\"Changed buyer copy\\"}]\\n"])</script></body></html>`)
  const changedAsset = Buffer.from(`<!DOCTYPE html><html><head><link rel="icon" href="/icon.svg"/><title>POXIOL</title><script src="/b.js" async=""></script></head><body><main>Stable buyer copy</main><script>self.__next_f.push([1,"a:[\\"$\\",\\"main\\",null,{\\"children\\":\\"Stable buyer copy\\"}]\\n"])</script></body></html>`)

  assert.equal(
    releaseManifest.sha256ReleaseFile('out/about/index.html', first),
    releaseManifest.sha256ReleaseFile('out/about/index.html', reordered),
  )
  assert.notEqual(
    releaseManifest.sha256ReleaseFile('out/about/index.html', first),
    releaseManifest.sha256ReleaseFile('out/about/index.html', changedCopy),
  )
  assert.notEqual(
    releaseManifest.sha256ReleaseFile('out/about/index.html', first),
    releaseManifest.sha256ReleaseFile('out/about/index.html', changedAsset),
  )
})

test('canonicalizes Next Flight record scheduling while retaining payload changes', () => {
  const first = Buffer.from(':HL["/style.css","style"]\n1:I[9807,["2619","/a.js","3305","/b.js"],"default"]\n2:["$","main",null,{"children":"Stable buyer copy","ref":"$L1"}]\n3:T3,abc')
  const reordered = Buffer.from('a:T3,abc\nb:["$","main",null,{"ref":"$L9","children":"Stable buyer copy"}]\nc:I[9807,["3305","/b.js","2619","/a.js"],"default"]\n:HL["/style.css","style"]\n')
  const changed = Buffer.from('a:T3,abd\nb:["$","main",null,{"ref":"$L9","children":"Changed buyer copy"}]\nc:I[9807,["3305","/b.js","2619","/a.js"],"default"]\n:HL["/style.css","style"]\n')

  assert.equal(
    releaseManifest.sha256ReleaseFile('out/about/index.txt', first),
    releaseManifest.sha256ReleaseFile('out/about/index.txt', reordered),
  )
  assert.notEqual(
    releaseManifest.sha256ReleaseFile('out/about/index.txt', first),
    releaseManifest.sha256ReleaseFile('out/about/index.txt', changed),
  )
})

test('refuses to seal construction hashes from output that does not match the governed route release', () => {
  assert.equal(
    typeof releaseManifest.assertConstructionOutputMatchesRouteRelease,
    'function',
    'construction generation must validate its output against the route release before writing hashes',
  )

  const canonicalSitemap = '<urlset><url><loc>https://www.poxiol.com/</loc></url></urlset>\n'
  const routeManifest = {
    source: {
      candidateSitemapSha256: releaseManifest.sha256ReleaseFile('out/sitemap.xml', Buffer.from(canonicalSitemap)),
      candidateCount: 1,
      renderedCount: 2,
    },
  }

  assert.doesNotThrow(() => releaseManifest.assertConstructionOutputMatchesRouteRelease({
    routeManifest,
    candidateSitemap: canonicalSitemap,
    renderedCount: 2,
  }))

  const fallbackSitemap = '<urlset><url><loc>https://www.poxiol.com/</loc></url><url><loc>https://www.poxiol.com/fallback/</loc></url></urlset>\n'
  assert.throws(
    () => releaseManifest.assertConstructionOutputMatchesRouteRelease({
      routeManifest,
      candidateSitemap: fallbackSitemap,
      renderedCount: 3,
    }),
    /CONSTRUCTION_RELEASE_ROUTE_OUTPUT_STALE:candidateSitemapSha256,candidateCount,renderedCount/,
  )
})

test('rejects invalid commits, digests, duplicate paths and implicit gates', () => {
  assert.throws(
    () => buildReleaseManifest({commits: ['short'], sourceFiles: [], outputFiles: [], gates: {}}),
    /INVALID_COMMIT/,
  )
  assert.throws(
    () => buildReleaseManifest({
      commits: [commit],
      sourceFiles: [{path: 'a.txt', sha256: 'A'.repeat(64)}],
      outputFiles: [],
      gates: {c1: true, c2: true, c3: true, c4: true},
    }),
    /INVALID_SHA256/,
  )
  assert.throws(
    () => buildReleaseManifest({
      commits: [commit],
      sourceFiles: [{path: 'same', sha256: digest}],
      outputFiles: [{path: 'same', sha256: digest}],
      gates: {c1: true, c2: true, c3: true, c4: true},
    }),
    /DUPLICATE_PATH/,
  )
  assert.throws(
    () => buildReleaseManifest({
      commits: [commit],
      sourceFiles: [],
      outputFiles: [],
      gates: {c1: true, c2: true, c3: true},
    }),
    /INVALID_GATE:c4/,
  )
})
