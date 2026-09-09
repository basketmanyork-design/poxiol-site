# Approved homepage streamline release — 2026-09-09

## Authority and scope

The owner approved production deployment after reviewing the local candidate for two changes only: compress repeated audience/process explanation and establish a clear homepage entry to the existing fabric library.

The homepage retains its hero audience positioning, six buyer-risk controls, all existing inquiry copy, form fields and destinations. The redundant standalone audience, capabilities and approval-explanation sections are removed. The existing five-step approval path is retained within the buyer-risk section. A compact `Fabric Reference Library` entry follows product discovery and links to `/customization/fabric-options/` without loading the 29 fabric photographs on the homepage.

No fabric-library content, category/filter UI, metadata, global navigation, inquiry behavior, CMS content, business fact, DNS, analytics setting or commercial policy is changed.

## Verification before deployment

- Regression test added before implementation: expected RED for the missing fabric entry, then 24/24 PASS after implementation.
- Full `npm test` and full production-configured static build are required immediately before commit.
- Browser acceptance covers 1440, 768 and 390 pixel widths, section order, no horizontal overflow, direct navigation to the 29-item fabric page, no homepage fabric-image requests, unchanged inquiry forms and original homepage links, and zero real submissions.
- Before/after page height at 900-pixel viewport: desktop 8376px to 6639px; mobile 13213px to 10530px, approximately 20% shorter.

## Deployment and rollback

Publish through the existing Git `main` integration for Cloudflare Pages project `poxiol-site`. After deployment, verify the immutable deployment URL and `https://www.poxiol.com/`, including homepage composition, the fabric entry destination, existing inquiry routes, sitemap/robots, and absence of Cloudflare email-obfuscation output.

Rollback baseline before this release: commit `2e6770b9f8fb1682cb1c76ac180fe3bb1d2f1d2b`; production deployment `d49040aa-4b36-481b-a182-0e6f471d9363` (`https://d49040aa.poxiol-site.pages.dev`). No rollback is performed unless live verification fails and the exact target remains current.
