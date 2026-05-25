# POXIOL Teamwear — Cloudflare Pages Static Website

This package is a Next.js + Tailwind static export website for POXIOL Teamwear.

## Deployment target

- Hosting: Cloudflare Pages
- Domain: Namecheap domain connected through Cloudflare DNS
- Form handling: Formspree endpoints or Tally embed later

## Local test

```bash
npm install
npm run dev
```

Open:

- `/`
- `/free-mockup/`
- `/contact/`
- `/custom-basketball-uniforms/`
- `/custom-soccer-kits/`

## Static build

```bash
npm run build
```

The output folder is:

```txt
out/
```

## Cloudflare Pages settings

```txt
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Root directory: /
```

## Environment variables

In Cloudflare Pages → Settings → Environment variables, add:

```bash
NEXT_PUBLIC_FORMSPREE_FREE_MOCKUP_ENDPOINT=https://formspree.io/f/your_free_mockup_id
NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT=https://formspree.io/f/your_contact_id
```

If you do not configure these, forms will show an endpoint error when submitted.

## Namecheap → Cloudflare DNS

1. Add your domain to Cloudflare.
2. Copy Cloudflare nameservers.
3. In Namecheap: Domain List → Manage → Nameservers → Custom DNS.
4. Paste the two Cloudflare nameservers.
5. In Cloudflare Pages → Custom domains, add `poxiol.com` and `www.poxiol.com`.

## Important

This is a static version. It does not use Next.js API Routes, Server Actions, dynamic SSR, or database connections. All form submissions go to Formspree from the client side.
