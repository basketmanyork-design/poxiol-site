# POXIOL Construction C1 Acceptance Record

Date: 2026-08-29

Stage: C1 — Source convergence and guarded candidate import

Status: Accepted for continued local construction only

## Source contract

- Production repository: `https://github.com/basketmanyork-design/poxiol-site.git`
- Approved production baseline: `ae452f70b4a027822fc4340db683746e90653fc1`
- Construction branch: `codex/construction-completion`
- Construction worktree: `.worktrees/poxiol-cloudflare-construction`
- Guarded candidate import manifest: `construction/candidate-import.json`
- Candidate import manifest SHA-256: `BBCF6FBB61AA2FAA17516A66E34204B77D43712FD0B724BE098D80AB5BE4D171`
- Manifest entries: 205
- Convergence commit: `715761ce5275c244f9f180f281387b09f1db941e`

The import tooling validates the repository and pinned production commit, rejects denied paths and path traversal, checks file size and SHA-256 before copying, expands only referenced source dependencies, and verifies the imported result.

## Verification evidence

- `npm run check:construction-source`: PASS — 25 tests; 205-file manifest reproduced and verified.
- `npm test`: PASS — source, legal-release, indexing, redirect, buyer-content, media, inquiry, analytics, and CMS safety contracts passed.
- `npm run build:prelaunch`: PASS — 124 static pages generated.
- Generated-output checks: PASS — legal gate, release indexing, CMS redirect baseline, canonical integrity, global/channel positioning, V8 buyer pages, product visualization, conversion CTAs, inquiry recovery, and five Formspree endpoint checks.
- `git diff --cached --check`: PASS before the convergence commit.
- Local prelaunch environment file: ignored by Git; no credential or environment file was committed.

## Known observations and deferred gates

- Legal approval remains pending; production release stays blocked by the executable legal gate.
- Production authorization has not been granted.
- The read-only Sanity redirect query was unavailable during the local build, so the build retained the repository's base redirect set.
- The locked dependency tree reports 10 audit findings (2 moderate and 8 high); no automatic dependency mutation was made in C1.
- Next.js reported existing raw-image LCP recommendations and Node reported module-type performance warnings; neither caused a failed test or build.

## External-mutation declaration

- `productionAuthorized`: `false`
- `deploymentPerformed`: `false`
- DNS changes: none
- Cloudflare production changes: none
- CMS writes: none
- Form submissions: none
- Analytics writes or configuration changes: none

C1 authorizes only the next local construction stage. It does not authorize publication, production traffic changes, legal release, or external-system mutation.
