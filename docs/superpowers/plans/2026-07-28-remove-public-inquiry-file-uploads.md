# Remove Public Inquiry File Uploads Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all public attachment controls and Formspree attachment submission paths from `StructuredRfqForm` and `ContactForm`.

**Architecture:** Keep both current text-only submission pipelines intact while deleting only file-specific UI, state, analytics calls, and payload mutation. Both forms render the same approved guidance and reuse their existing CMS-derived `publicEmail` and `whatsappHref` props.

**Tech Stack:** Next.js 14, React 18, TypeScript, Node test runner, Formspree.

## Global Constraints

- Use this exact copy: `Have logo, reference design or size-chart files? Submit your inquiry first. After we reply, send the files by email or WhatsApp with your team or brand name.`
- Do not hardcode a new email address or phone number.
- Preserve ordinary RFQ fields, validation, Human Review, success/error behavior, and CMS/Studio media capabilities.
- Do not merge, mark PR #39 Ready for Review, deploy, or force push.

---

### Task 1: Add the public-upload regression test

**Files:**
- Create: `tests/public-inquiry-no-upload.test.mjs`
- Test: `tests/public-inquiry-no-upload.test.mjs`

**Interfaces:**
- Consumes: source files `components/forms/StructuredRfqForm.tsx` and `components/forms/ContactForm.tsx`
- Produces: a Node test that protects the approved public-form contract

- [ ] **Step 1: Write the failing test**

Read both form files and assert that each contains the approved guidance,
references `publicEmail` and `whatsappHref`, and contains none of:
`type="file"`, `logoFile`, `referenceFile`, `techPackFile`. Assert that
`ContactForm` does not append `logo_file`, `reference_design_file`, or
`size_chart_tech_pack_file`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/public-inquiry-no-upload.test.mjs`

Expected: FAIL because both forms still contain file inputs and attachment
submission logic.

### Task 2: Remove StructuredRfqForm uploads

**Files:**
- Modify: `components/forms/StructuredRfqForm.tsx`
- Test: `tests/public-inquiry-no-upload.test.mjs`

**Interfaces:**
- Consumes: existing `publicEmail: string` and `whatsappHref: string` props
- Produces: a text-only Formspree payload and configured supplemental-file links

- [ ] **Step 1: Implement the minimal change**

Remove the loop that copies `File` values into `payload`, delete the three
`FileField` calls, and delete the now-unused `FileField` component. Insert the
approved guidance with a `mailto:${publicEmail}` link and the existing
`whatsappHref`.

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/public-inquiry-no-upload.test.mjs`

Expected: ContactForm assertions still fail; StructuredRfqForm assertions pass.

### Task 3: Remove ContactForm uploads

**Files:**
- Modify: `components/forms/ContactForm.tsx`
- Test: `tests/public-inquiry-no-upload.test.mjs`

**Interfaces:**
- Consumes: existing optional `publicEmail` and `whatsappHref` props
- Produces: the existing text-only `FormData` submission and configured supplemental-file links

- [ ] **Step 1: Implement the minimal change**

Remove `trackFileUpload`, the three file states, the three attachment appends,
and all file inputs. Retain the design message textarea. Add the exact guidance
with links derived from the existing props, using `/contact/` only as the
already-established missing-config fallback.

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/public-inquiry-no-upload.test.mjs`

Expected: PASS.

- [ ] **Step 3: Run the complete frontend test suite**

Run: `npm test`

Expected: PASS.

### Task 4: Verify builds and delivery state

**Files:**
- Verify: all changed files

**Interfaces:**
- Consumes: completed form changes
- Produces: verified Draft PR branch update

- [ ] **Step 1: Run TypeScript and frontend build**

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 2: Run Studio checks**

Run from `studio`: `npm ci --legacy-peer-deps`

Run from `studio`: `npx tsc --noEmit`

Run from `studio`: `npm run build`

Expected: all PASS.

- [ ] **Step 3: Run source and diff safety checks**

Confirm the two public form files have zero matches for file inputs and the
three forbidden camelCase names. Run `git diff --check` and verify no unrelated
upload capability changed.

- [ ] **Step 4: Commit and push**

Commit with:

`fix: remove file uploads from public inquiry forms`

Push normally to `origin/feat/poxiol-geo-aao-foundation`, then confirm PR #39
remains Draft. Do not merge or deploy.
