# Cloudflare Phase 1 Checklist

## 1. Confirm Production Branch
- Dashboard → Workers & Pages → poxiol-site → Settings → Build
- Production branch: `main`
- Verify: `4c9a70c` or later commit is deployed

## 2. Production Deployment Commit
- Deployments → Production → current deployment → View Details
- Record the commit SHA

## 3. Purge Cache
- Caching → Configuration → Purge Everything
- Wait for completion (usually < 30 seconds)

## 4. Redirect Rules
- Check: `poxiol.com` → `www.poxiol.com` (301)
- Check: `http://` → `https://` (301)
- Verify: `curl -I http://poxiol.com/` returns 301 to `https://www.poxiol.com/`

## 5. Cache Rules
- Verify no cache rule splits pages by User-Agent
- Verify HTML pages are not cached with stale versions

## 6. Email Address Obfuscation
- Security → Settings → Scrape Shield: set Email Address Obfuscation to OFF
- Verify: all `mailto:` links work on live site

## 7. Domain Verification
- `curl -I http://poxiol.com/` → 301
- `curl -I https://poxiol.com/` → 301
- `curl -I http://www.poxiol.com/` → 301
- `curl -I https://www.poxiol.com/` → 200

## 8. Verify No User-Agent Caching
- `curl -H "User-Agent: Googlebot" https://www.poxiol.com/ | head -20`
- Compare with normal browser output
- Both should show same core content

## 9. Post-Deploy Verification
- `https://www.poxiol.com/` → 200, no "Loading form..." 
- `https://www.poxiol.com/factory/` → 200, "2–3 days"
- `https://www.poxiol.com/contact/` → 200, mailto: link works
- `https://www.poxiol.com/faq/` → 200, all categories strings
