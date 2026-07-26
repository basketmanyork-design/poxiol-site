# CMS Phase 2 — Strict Preview Report

## Cloudflare Pages Preview URLs
- Site: https://codex-poxiol-cms-phase2-cont.poxiol-site.pages.dev
- Admin: https://codex-poxiol-cms-phase2-cont.poxiol-admin.pages.dev
- Commit: 4c9a70c

## Strict Mode Configuration

| Variable | Current State |
|----------|---------------|
| NEXT_PUBLIC_CONTENT_SOURCE | **NOT CONFIGURED** (defaults to `sanity` → published perspective) |
| CMS_LEGACY_LIST_MODE | **NOT CONFIGURED** (defaults to `merge`) |
| SANITY_READ_TOKEN | **NOT CONFIGURED** |
| contentSource observed | `sanity` (published perspective + legacy fallback) |
| listMode observed | `merge` (legacy content visible on about/factory/manufacturing/contact) |
| fallbackUsed | **true** (legacy placeholders on about, factory, manufacturing, contact pages) |

**Status: BLOCKED_STRICT_PREVIEW_CONFIGURATION**

Cloudflare Pages preview environment variables are not configured. The preview is running in merge mode with legacy fallback content. To enable strict preview:
1. Set `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview` (build-time variable)
2. Set `CMS_LEGACY_LIST_MODE=strict` 
3. Set `SANITY_READ_TOKEN=<read-only preview secret>` (preview secret, not build variable)
4. Redeploy the branch preview

## Route Audit Results

All routes return HTTP 200. Content serves from legacy fallback where Sanity data is not available in current perspective.

| Route | HTTP | H1 | Content | Images | Notes |
|-------|------|----|---------|--------|-------|
| / | 200 | ✅ | ✅ | local paths | Homepage renders Sanity-promoted content |
| /about/ | 200 | ✅ | ⚠️ legacy | local | Legacy placeholder: "can be overridden in Sanity" |
| /factory/ | 200 | ✅ | ⚠️ legacy | local | Legacy content, parameter "2–5 days" |
| /manufacturing/ | 200 | ✅ | ⚠️ legacy | local | Legacy placeholder |
| /contact/ | 200 | ✅ | ⚠️ legacy | local | Legacy placeholder, form functional |
| /products/basketball-uniforms/ | 200 | ✅ | ✅ | local | Full procurement table, 2-3 Days parameter |
| /faq/ | 200 | ✅ | ✅ | N/A | All FAQ questions/answers visible |
| /sitemap.xml | 200 | N/A | ✅ | N/A | Valid XML, www.poxiol.com URLs |
| /robots.txt | 200 | N/A | ✅ | N/A | Correct sitemap reference |
| /llms.txt | 200 | N/A | ✅ | N/A | Current parameters: 2-3 Days, MOQ 1 Set, Free Mockup |

## Parameter Conflicts Detected

| Location | Value Found | Expected | Source |
|----------|------------|----------|--------|
| /factory/ | "2–5 days" | 2–3 Days | legacy.ts fallback |
| /about/ | Legacy placeholder text | Sanity sitePage | merge mode fallback |
| /manufacturing/ | Legacy placeholder text | Sanity sitePage | merge mode fallback |
| /contact/ | Legacy placeholder text | Sanity sitePage | merge mode fallback |

Homepage, FAQ, and Basketball Category show correct unified parameters.
