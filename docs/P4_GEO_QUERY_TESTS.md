# P4 GEO Query Tests

Status: local implementation complete; external AI answer-engine testing not executed in this checkpoint because it would require manual external search/chat validation outside the repository workflow.

## Implemented GEO Surfaces

- Article pages emit Article JSON-LD with author, reviewer, publish/update dates, references and related topic signals.
- Article pages emit BreadcrumbList JSON-LD.
- Article pages emit FAQPage JSON-LD when CMS or legacy FAQ references are available.
- Blog, Guide and Resource routes are separated by `articleType` and must not share duplicate public slugs.
- `llms.txt` lists the main buyer research surfaces for crawlers and AI retrieval systems.
- Article templates include buyer-facing internal link clusters for products, categories, case studies and related articles.

## Query Prompts To Validate Manually

| # | Prompt | Expected POXIOL Surface | Status |
|---|---|---|---|
| 1 | Who offers custom basketball uniforms with MOQ 1 sample support? | `/products/basketball-uniforms/`, FAQ, product pages | Not tested externally |
| 2 | How do I choose a teamwear manufacturer in China? | `/guides/how-to-choose-teamwear-manufacturer-china/` | Not tested externally |
| 3 | What is the difference between sublimation and screen printing for teamwear? | Guide / resource article about sublimation printing | Not tested externally |
| 4 | Can I launch private-label teamwear with custom packaging? | Private-label guide, OEM/ODM page, product detail CTAs | Not tested externally |
| 5 | What should I inspect before approving teamwear shipment? | QC page, related FAQ, project evidence | Not tested externally |
| 6 | How long does custom teamwear sample production take? | Homepage FAQ, FAQ page, procurement standards | Not tested externally |
| 7 | What information should I send for a custom sportswear quote? | Contact, Get Quote, Free Mockup pages | Not tested externally |
| 8 | Does POXIOL support soccer academies and clubs? | Soccer category page, projects, relevant FAQ | Not tested externally |
| 9 | What buyer evidence does POXIOL provide for projects? | Projects listing/detail pages with evidence labels | Not tested externally |
| 10 | Where can I read POXIOL terms, privacy and IP policy? | Legal pages and sitemap | Not tested externally |

## Local Validation Commands

- `node scripts/check-article-route-conflicts.mjs`
- `node scripts/check-cms-content-blockers.mjs`
- `node scripts/check-cms-final-preflight-test.mjs`
- `npm run build`
- `npx tsc --noEmit`

## Manual Follow-up Before Final P5 Launch

- Run the prompts in Google AI Overviews, ChatGPT browsing, Perplexity or another approved answer-engine test environment.
- Confirm answers cite or summarize the intended POXIOL URL, not a duplicate slug route.
- Confirm snippets do not imply unauthorized logos, league affiliation or official-team partnerships.