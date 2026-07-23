# POXIOL CMS Production Setup

This checkpoint connects the production website to the POXIOL Sanity CMS without merging the full `sanity-admin-mvp` branch into `main` and without changing the public URL structure.

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
