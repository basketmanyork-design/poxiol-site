# POXIOL CMS Admin SOP

This SOP is for Phase 1+ POXIOL CMS operation after the production CMS integration is approved. It does not authorize Seed, Dataset Import, schema deployment, publishing, or Cloudflare configuration changes by itself.

## Daily content workflow

1. Open the Studio at `https://admin.poxiol.com`.
2. Use **Review Workflow** first:
   - **Draft content**: pages and documents that can be previewed but are not production-visible in `sanity` mode.
   - **Unpublished content**: documents intentionally removed from the live CMS list.
   - **Missing SEO fields**: publishable documents missing `seoTitle` or `metaDescription`.
   - **Missing image alt text**: publishable documents with a hero, primary or featured image but missing alt text.
   - **Redirect rules**: redirect entries that will be written to Cloudflare Pages `_redirects` at build time.
3. Edit only the document type that owns the content:
   - Header and primary navigation: **Navigation** singleton.
   - Footer links and policy links: **Footer** singleton.
   - Email, WhatsApp, Alibaba URL, address and logo: **Site Settings** singleton.
   - MOQ, sample timing, bulk timing, QC and tolerance: **Procurement Standards** singleton.
   - Homepage and core pages: **Site Pages**.
   - Product category pages: **Product Categories**.
   - Product details: **Products**.
   - Projects: **Case Studies**.
   - FAQ page and article FAQ references: **FAQ Categories** and **FAQ Knowledge Base**.
   - Blog, guide and resource pages: **Articles and Guides**.
   - Build-time 301 rules: **301 Redirect Rules**.

## Draft, preview and publish rules

- Keep new or edited work as Draft until reviewed in the Preview environment.
- `publishStatus=draft` is visible only in `sanity-preview` mode.
- `publishStatus=published` is visible in production `sanity` mode.
- `publishStatus=unpublished` suppresses the matching legacy item during migration list merge.
- Do not publish batches until SEO, image alt text, links, contact CTAs and structured data have been checked.

## SEO and GEO checklist

Before publishing a page, product, case study or article:

- Confirm slug and canonical URL keep the approved public URL.
- Add `seoTitle` and `metaDescription`.
- Add an OG image when available.
- Confirm image alt text describes the real image and buyer context.
- For articles, confirm article type is correct: `blog`, `guide` or `resource`.
- Confirm no duplicate public slug exists across `/blog/`, `/guides/` and `/resources/`.
- Add related products, categories, case studies, articles and FAQ when relevant.
- Avoid unauthorized third-party league, team, tournament or brand claims.

## Redirect workflow

- Redirect rules are data only; they are appended to `out/_redirects` during build.
- Source paths must start with `/`.
- Internal destinations must start with `/`.
- External destinations must use `https://`.
- Do not redirect core technical files such as `robots.txt`, `sitemap.xml` or `llms.txt`.
- Test redirects in Preview before production cutover.

## Production rollout gates

Before production rollout:

1. Schema Registry is deployed from the approved local Studio commit.
2. Migration dry run has no blocking route, SEO, image alt or unsupported schema issues.
3. Content is imported as Draft only.
4. Studio editors review Draft content.
5. Preview environment is accepted.
6. Publish happens in approved batches.
7. Cloudflare Deploy Hook is configured outside the repository.
8. Production smoke test confirms header, footer, contact CTAs, sitemap, robots, redirects and key pages.

## Rollback

- Revert `NEXT_PUBLIC_CONTENT_SOURCE` to `legacy` and redeploy the previous successful Cloudflare build.
- If a CMS document caused the issue, unpublish or correct it only after a Sanity backup/export exists.
- Do not delete legacy data during rollback.

## Safety restrictions

- Do not store tokens in `NEXT_PUBLIC_` variables.
- Do not paste tokens into PRs, docs, issues, screenshots or logs.
- Do not run Dataset Import from this SOP.
- Do not run Seed from this SOP.
- Do not upload assets unless a migration apply package explicitly approves it.
- Do not modify Cloudflare settings without a rollout task that explicitly authorizes it.