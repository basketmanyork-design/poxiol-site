# Cloudflare Pages Deployment Checklist

## 1. Configure forms

Create two Formspree forms:

- POXIOL Free Mockup Request
- POXIOL Contact

Then add environment variables in Cloudflare Pages:

```bash
NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT=https://formspree.io/f/xxxxxxx
NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT=https://formspree.io/f/yyyyyyy
```

## 2. Build locally

```bash
npm install
npm run build
```

Confirm output folder:

```txt
out/
```

## 3. Push to GitHub

```bash
git add .
git commit -m "Prepare POXIOL static site for Cloudflare Pages"
git push origin main
```

## 4. Cloudflare Pages settings

```txt
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Root directory: /
```

## 5. Namecheap domain

In Namecheap:

```txt
Domain List 鈫?Manage 鈫?Nameservers 鈫?Custom DNS
```

Paste the 2 Cloudflare nameservers.

## 6. Custom domain

In Cloudflare Pages:

```txt
Workers & Pages 鈫?your project 鈫?Custom domains
```

Add:

```txt
poxiol.com
www.poxiol.com
```

## 7. Test pages

- `/`
- `/free-mockup/`
- `/contact/`
- `/custom-basketball-uniforms/`
- `/custom-soccer-kits/`
- `/custom-baseball-softball-uniforms/`
- `/custom-running-marathon-wear/`
- `/custom-training-wear/`

## Notes

This package is static-export ready. It intentionally does not include API routes, server actions, database code, or server-side email sending.
