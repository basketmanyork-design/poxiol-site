# POXIOL CMS Production Setup

This checkpoint connects the production website to the POXIOL Sanity CMS without merging the full `sanity-admin-mvp` branch into `main` and without changing the public URL structure.

## Node runtime

- Approved runtime for CI and future Cloudflare Pages builds: Node 22.
- The repository pins this with `.node-version` and `package.json` engines (`22.x`).
- Do not change the Cloudflare runtime in this checkpoint; configure Node 22 manually during the approved production rollout.

## Content source modes

- `NEXT_PUBLIC_CONTENT_SOURCE=legacy`: use legacy hardcoded fallback only.
- `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`: server-side draft preview. Requires `SANITY_READ_TOKEN` in the Preview environment only.
- `NEXT_PUBLIC_CONTENT_SOURCE=sanity` or unset: server-side published Sanity content with legacy fallback. This is the production default.

## Environment variables

Production:

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity`
- `NEXT_PUBLIC_SANITY_PROJECT_ID=oqpv1xbc`
- `NEXT_PUBLIC_SANITY_DATASET=production`

Preview only:

- `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`
- `NEXT_PUBLIC_SANITY_PROJECT_ID=oqpv1xbc`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_READ_TOKEN` with Viewer/read-only permission for the production dataset

Do not create any public `NEXT_PUBLIC_` token variable. Do not expose tokens in code, logs, PR text, or browser bundles.

## Publish-to-production automation

To enable Sanity Publish -> Cloudflare Pages Build -> production update, configure this manually in Sanity and Cloudflare:

1. In Cloudflare Pages, create a Deploy Hook for the production website project.
2. In Sanity Manage, create a webhook for document publish/update events that calls the Cloudflare Deploy Hook URL.
3. Scope the webhook to published CMS document types such as `siteSettings`, `navigationSettings`, `footerSettings`, `sitePage`, `productCategory`, `product`, `caseStudy`, `faqItem`, `article`, and `redirectRule`.
4. Keep the Deploy Hook URL out of the repository and PR descriptions.
5. Keep `SANITY_READ_TOKEN` out of Cloudflare Production unless a future production draft workflow explicitly requires it.

No webhook, deploy hook, secret, token, Dataset Import, or Seed was executed by this checkpoint.

## CMS operation notes

- Use Site Settings for brand name, site URL, public email, sales email, WhatsApp number/message, Alibaba URL, company address, copyright, and global SEO defaults.
- Use Navigation and Footer singletons for header navigation and footer columns.
- Use Site Pages for homepage and core static pages such as About, Factory, Manufacturing, Quality Control Process, Customization, Contact, OEM/ODM, Free Mockup, Sample Order, and Get Quote.
- Use Product Categories and Products for `/products/` and `/products/[slug]/`.
- Use Case Studies for `/projects/` and `/projects/[slug]/`.
- Use FAQ for `/faq/` and article FAQ references.
- Use Articles and Guides for `/blog/`, `/guides/`, `/resources/`, and their detail routes.
- Use Redirect Rules to manage 301 redirect data. Cloudflare/Next redirect hook-up should be enabled after the production deploy hook is configured.
## Migration cutover plan

1. Run the deterministic dry run: `node scripts/cms-migration-dry-run.ts`.
2. Manually review `docs/CMS_MIGRATION_DRY_RUN.md`, `docs/CMS_MIGRATION_DRY_RUN_SUMMARY.json`, and the ignored detailed artifacts under `tmp/cms-migration-dry-run/`.
3. Create a Sanity backup/export before any future import attempt.
4. Import migrated content as Draft documents only; do not import directly as Published content.
5. Review all Draft documents in Studio, including images, alt text, SEO fields, references, and redirect rules.
6. Validate the Preview site against Draft content before any publish batch.
7. Publish content in small batches, starting with global settings/navigation/footer, then core pages, product categories/products, case studies, FAQs, articles, and redirects.
8. Keep `CMS_LEGACY_LIST_MODE=merge` during migration; switch to `CMS_LEGACY_LIST_MODE=strict` only after content coverage is complete and manually approved.
9. Trigger the Cloudflare Pages production build only after Preview acceptance and batch publish approval.
10. Run a production smoke test for existing URLs, metadata, forms, header/footer, redirects, product pages, case studies, FAQ, blog/guides/resources, and mobile layout.
11. Roll back by reverting `NEXT_PUBLIC_CONTENT_SOURCE` to `legacy`, restoring the previous Cloudflare deployment, and unpublishing or correcting problematic CMS documents only after a Sanity backup/export is available.

Never publish migration output directly as Published content. The dry run is not an import tool and does not write to Sanity.
## Schema deployment status

Sanity project `oqpv1xbc` / dataset `production` already has a hosted Studio, but Schema Registry has not been confirmed as deployed for this local Studio schema. This branch must not use MCP schema deployment.

After explicit future approval, schema deployment should be performed from the approved local Studio commit:

```bash
cd studio
npx sanity@latest schema deploy
```

Before any content import or publish step, confirm:

- Schema Registry can read the deployed schema.
- Studio is built from the approved commit.
- Every planned migration type is registered in `studio/schemaTypes/index.ts`.
- Studio fields, GROQ queries, and frontend resolver fields match.
- Migration output is imported as Draft only, never directly as Published content.

## Cloudflare Deployment Preflight

- **Node Requirement**: Node 22 (pinned in `.node-version` and `package.json`).
- **Build Command**: `npm run build` (or `set NEXT_PUBLIC_CONTENT_SOURCE=legacy&&set CMS_LEGACY_LIST_MODE=merge&&npm run build` for Legacy mode test).
- **Output Directory**: `out/` (Static Export) or `.next/` depending on configuration.
- **Required Env Vars**:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
- **Preview Env Vars**:
  - `NEXT_PUBLIC_CONTENT_SOURCE=sanity-preview`
  - `SANITY_READ_TOKEN`
- **Production Env Vars**:
  - `NEXT_PUBLIC_CONTENT_SOURCE=sanity`
- **CMS Legacy List Mode**: `merge` (during migration) or `strict` (post-migration).
- **Content Source**: `sanity` (Production default).
- **Deploy Hook Config**: To be configured in Cloudflare Pages (future).
- **Cache Purge Plan**: Manual purge or via Cloudflare API after successful build.
- **Rollback Plan**: Revert `NEXT_PUBLIC_CONTENT_SOURCE` to `legacy` and redeploy previous successful build.

**cloudflarePreflightIssueCount**: 0
