# POXIOL GEO Deploy Guide

## 1. Copy Files

Copy these into your current website project:

- `public/llms.txt`
- `public/brand.json`
- `public/ai-summary.json`
- `components/seo/StructuredData.tsx`
- `app/ai-summary/page.tsx`

## 2. Add Structured Data to Homepage

In `app/page.tsx`, import:

```tsx
import StructuredData, { organizationSchema, websiteSchema, homepageFaqSchema } from "@/components/seo/StructuredData";
```

Then inside the root return of the homepage, add near the top:

```tsx
<StructuredData data={[organizationSchema, websiteSchema, homepageFaqSchema]} />
```

## 3. Add AI Summary to Sitemap

Add:

```txt
https://poxiol.com/ai-summary/
```

to `public/sitemap.xml`.

## 4. Deploy and Test

After Cloudflare Pages deploy, check:

- https://poxiol.com/llms.txt
- https://poxiol.com/brand.json
- https://poxiol.com/ai-summary.json
- https://poxiol.com/ai-summary/

## 5. Validate Schema

Use Google Rich Results Test or Schema.org Validator to test:

- Homepage
- AI Summary page
- Free Mockup page
- Major sports category pages
