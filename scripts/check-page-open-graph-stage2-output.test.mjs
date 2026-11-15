import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const SITE_ORIGIN = "https://www.poxiol.com";
const HOME_TITLE = "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL";
const HOME_DESCRIPTION =
  "Custom basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors.";
const OUTPUT_DIRECTORY = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? "out");

const PAGES = [
  ["/products/", "Custom Teamwear by Sport & Wearing Scenario | POXIOL", "Explore POXIOL custom teamwear by sport or wearing scenario. Product construction, material, quantity and timing are confirmed after project review.", "Custom Teamwear by Sport and Wearing Scenario", "https://www.poxiol.com/products/", "8ea028f70541f883e2c5e48b3dfeaf1ef029a97af5a6358c40f69e970ab34f75", 3, "e2036dc1977f73e42a2488dc6729895d6941ae881c170bb1fba8115506ac0852", "6efd1fca3fa82a4325e0ce6ae8487f7d0b1b310bf196d6751386ffa95cbc7449"],
  ["/products/running-track-uniforms/", "Running & Track Uniforms for Teams | POXIOL", "Plan custom running and track uniforms for clubs, schools or sportswear brands. Review singlet and shorts options, fit, artwork, quantity and delivery needs.", "Running & Track Uniforms", "https://www.poxiol.com/products/running-track-uniforms/", "51a60cd60dd5cc99dafb6e0bfa341923ad009357502d23aa5917880a5fc106e0", 1, "59e17b92b1bcc9a969e0f36f8f0db3f753956aafb03cf428f43b84cf46aa353a", "2a1bad55c82c8aa08a0bd6b178a04502f77d5ba3787c76e0929cdf83d6b633a5"],
  ["/products/warm-up-wear/", "Warm-Up Wear and Team Tracksuits | POXIOL", "Plan custom warm-up wear for teams, clubs, schools or sportswear brands. Review jacket and trouser configuration, fit, branding, quantity and delivery needs.", "Warm-Up Wear", "https://www.poxiol.com/products/warm-up-wear/", "9450945eedd46f75eca72ee63e49b4d6848c934144af4f5902023b324940aa0b", 1, "d6e0bc920e455ead8630194a8d5148c7f2e0f95dbe8d3eaabae66865db70a039", "750ea99271d9cae13165a0edfbf98069ba29d5fad1d2efae143028691fad877a"],
  ["/resources/", "Teamwear Knowledge Center | Buying Guides & Specs", "Buying guides, fabric and sizing specs, and manufacturing know-how for custom teamwear buyers, written for clubs, schools, brands and distributors.", "Teamwear Knowledge & Buying Guides", "https://www.poxiol.com/resources/", "6f7e80ae6d1f85fbc4c15ad317e354fd5e2c945714e38dfd9fca428ecf0574f0", 2, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "cc5ac3beb5987541f37cc30d5e05169091c630c47f7e53575ea8986c86255beb"],
  ["/projects/", "Teamwear Planning Scenarios | POXIOL", "Explore planning scenarios for custom teamwear briefs, sample review, quality checkpoints, packing needs and target delivery windows.", "Teamwear Planning Scenarios", "https://www.poxiol.com/projects/", "d98406babddb699a77c4b10ba929b504bfd77cbed383da546f29e32440a88d62", 2, "17573217d120de11931e6befcf356df3ba36aa2d6c736e7d6175566866d51217", "a4c13b3540fd0464a8d69911a25f4ad6eaee221a16227d325199fa951a37bc87"],
  ["/blog/", "POXIOL Blog | Teamwear SEO Articles", "Articles on teamwear sourcing, fabric selection, printing methods, sampling and production planning for clubs, schools and sportswear brands.", "Teamwear SEO Articles", "https://www.poxiol.com/blog/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "39b2c1dafbf7bb99277cbc4b8031e39179606150cef3b42edd45fc50c7ccf518"],
  ["/faq/", "Frequently Asked Questions | Custom Teamwear FAQ | POXIOL", "Find answers to common questions about custom teamwear manufacturing, MOQ, production times, printing methods and sportswear fabrics at POXIOL.", "Frequently Asked Questions", "https://www.poxiol.com/faq/", "17b03bb76ca29d70c7689bd8d92158f07aee6c6645b0adc508c9d0bb21573181", 2, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "94197dfd4946b6050b9d47f72087854c10b9998a4704bef17876f0b41bf2a70b"],
  ["/fabric-guide/", "Sportswear Fabric Guide: Mesh, Interlock & More | POXIOL", "Compare mesh, interlock, bird eye, quick-dry polyester and spandex fabrics by breathability, stretch, durability and printing fit for custom teamwear.", "Sportswear Fabric Guide For Custom Teamwear", "https://www.poxiol.com/fabric-guide/", "e47940327f0f91072889bcc9ba2bc4ebe385c33f058e009e2840933f9420d2b3", 2, "8dfda5577fe47827ab376e6b344f0bc333afc350d4e6c6be6e095c4438225ccb", "ab3db41ea49f011ddd7cfe914e1847c4cad96848d3262272b8be550df789e8f6"],
  ["/printing-guide/", "Sportswear Printing Guide | Sublimation & Embroidery", "Compare sublimation, screen printing, embroidery and heat transfer for custom teamwear, basketball uniforms and soccer kits before you specify.", "Sportswear Printing Guide For Custom Teamwear", "https://www.poxiol.com/printing-guide/", "90bb11317da95868496c5b3df88947045c3f82309062fe87e3214a46333d858b", 1, "8dfda5577fe47827ab376e6b344f0bc333afc350d4e6c6be6e095c4438225ccb", "d1bb52f3994e630247fd8d71e04a8f46a1f36bdc51d2a090d2e57231677990d1"],
  ["/certificates-testing/", "Certificates & Testing | Teamwear Quality Documents", "Review POXIOL custom teamwear quality documents, fabric testing options, inspection records and verified production evidence for B2B sportswear buyers.", "Certificates & Testing for Custom Teamwear Buyers", "https://www.poxiol.com/certificates-testing/", "2bb2e6694164a2cfc44aa49f4ae4509be3a02d6d3d1822333dfc31f7a7425ea9", 3, "16419d1fb42f40ae705653ef3f4ff45c6ecb92450f640ea59644583151395dfb", "53ddca0a0c41776bfb915c6cb9458a7740662ee3d42ac5ac3bb22d1403a8b7fe"],
  ["/shipping-after-sales/", "Shipping and After-Sales Process | POXIOL", "Review POXIOL production planning, shipping confirmation, tracking updates and the project-specific order issue review process.", "Shipping and After-Sales Process", "https://www.poxiol.com/shipping-after-sales/", "eb2b38fa7b3c4f7fc982b321bf1d4323f2020056299a54f63e48dabae483fffa", 1, "17573217d120de11931e6befcf356df3ba36aa2d6c736e7d6175566866d51217", "c5ac70d4c2085aaf18615f9c676e952954c460243eaca15f454fa191e68986ea"],
  ["/design-gallery/", "Custom Teamwear Design Gallery | POXIOL Inspiration", "Explore our collection of custom basketball uniforms, soccer kits, and training wear designs. Get inspiration for your team's next look with POXIOL.", "Custom Teamwear Design Inspiration", "https://www.poxiol.com/design-gallery/", "86ec4e5769f1d45199eb004bbc576219414a5f263980679d92919aae8ce465a2", 1, "e726020f6f0f178e8a29204b3174c2749c846b776c0bd75cf49940c02536614b", "e91e44aef622a0cad4b22004f36aedaa5e88a81c8300427587d42d8389cebd7d"],
  ["/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "OEM vs ODM Sportswear: A Decision Guide for Brands | POXIOL", "Compare OEM and ODM paths for a custom sportswear project. Use a practical decision matrix and project brief checklist before requesting a quote.", "OEM vs ODM Sportswear: A Decision Guide for Brands", "https://www.poxiol.com/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "793d3cdac71082f40c14d78cefd892beee2724f07e4deb13279089da2cf2d68c", 1, "16419d1fb42f40ae705653ef3f4ff45c6ecb92450f640ea59644583151395dfb", "dc761a95d4cd035e0f387e9bb3b4fbf7ea7af7c581a2f7cfdb41d5477fc33253"],
  ["/privacy-policy/", "Privacy Policy | POXIOL", "How POXIOL handles project inquiry information submitted by B2B custom teamwear buyers, including what we collect and how long we keep it.", "Privacy Policy", "https://www.poxiol.com/privacy-policy/", "f9f5ef6a687f6a0faef38b192ab5368b1f99d727bbc19d5c73fa6e280d25c5a9", 1, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "d5f0afa493de684a6c37e9b054a962955a1f0f546a3362461f5388067b4b3ee2"],
  ["/terms/", "Terms | POXIOL", "General website and inquiry terms for POXIOL custom teamwear buyers, covering quotes, samples, production schedules and order changes.", "Terms", "https://www.poxiol.com/terms/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "dc0ee376330f101e4679fbabfc9831e9792837ba8123d0b366d07266176b83e8"],
  ["/intellectual-property-policy/", "Intellectual Property Policy | POXIOL", "POXIOL only supports buyer-owned, original or properly authorized artwork for custom teamwear production, including logos, prints and embroidery files.", "Intellectual Property Policy", "https://www.poxiol.com/intellectual-property-policy/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "eff2dc75d75f7098aa92552c75a783134ae5d9b4bf338b806af4e3a66816eca4"],
  ["/products/training-wear/", "Custom Training Wear & Warm-up Suits Manufacturer | POXIOL", "Custom training wear, warm-up suits, tracksuits, and jackets for clubs, schools and brands. POXIOL offers OEM/ODM and high-color sublimation printing. Sample timing is confirmed after project review.", "Training Wear", "https://www.poxiol.com/products/training-wear/", "beb59acd482b62b54340bc9f6fc411618dc9dcbcd9670a3147a624d8457d7429", 3, "528208cdd29962baafc02bce501c730644b1baa7c606c06b0f107da930581471", "4d667e8c0dfcab81a55bffeb6d00d3bc81f110cbf0ce59a3997cae9007307b16"],
  ["/products/hoodies-jackets/", "Custom Hoodies & Jackets Manufacturer | Team Outerwear | POXIOL", "Custom team hoodies, jackets, and outerwear for clubs and brands. POXIOL offers high-color sublimation. Sample timing is confirmed after project review.", "Hoodies & Jackets", "https://www.poxiol.com/products/hoodies-jackets/", "b994655428cf6c4a613329f08ff6f464d2f056f2e2ef67e5aa5a71034c25d071", 3, "c7ba6d2a45e97638b1c985cda181c56e88065facc8afedc429cc0639d984c122", "1bd3844d2d95af5e1cf80556067042034747200b36db0102b03ff124bc331c28"],
  ["/products/team-accessories/", "Custom Team Accessories Manufacturer | POXIOL", "Custom team socks, bags, and accessories to complete your team look. High-quality manufacturing with POXIOL quality support. Sample timing is confirmed after project review.", "Team Accessories", "https://www.poxiol.com/products/team-accessories/", "edb9df122309f59e658346ace298ec43c8d9495e476a5a10275fabeaaf365d9f", 3, "db6823167eadd1bbe03bb933c7a14520445ce72916f30870d82ed3ff358bf6f9", "e22424d0fd7ce33dc8bd8554287267a44aaba3919b92fcf8d9252cc7cc4c4759"],
];

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)="([^"]*)"/g)].map(([, name, value]) => [name, decodeHtml(value)]));
}

function metaValues(html, key, value) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((entry) => entry[key] === value).map((entry) => entry.content);
}

function linkValues(html, rel) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((entry) => entry.rel === rel).map((entry) => entry.href);
}

function elementText(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  assert.ok(match, `Missing <${tagName}>`);
  return decodeHtml(match[1].replace(/<[^>]*>/g, "").trim());
}

function one(values, label) {
  assert.equal(values.length, 1, `${label} must occur exactly once`);
  return values[0];
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function outputFileForRoute(route) {
  return path.join(OUTPUT_DIRECTORY, ...route.split("/").filter(Boolean), "index.html");
}

async function readOutput(route) {
  return readFile(outputFileForRoute(route), "utf8");
}

function paritySnapshot(html) {
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(([, json]) => JSON.parse(json));
  const inquiryHrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/gi)].map(([, href]) => decodeHtml(href)).filter((href) => /(?:get-quote|free-mockup|wa\.me|mailto:)/i.test(href));
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const visibleText = decodeHtml(body.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
  return {
    robots: metaValues(html, "name", "robots"),
    schemaHash: digest(JSON.stringify(schemas)),
    schemaCount: schemas.length,
    inquiryHash: digest(JSON.stringify(inquiryHrefs)),
    formCount: [...html.matchAll(/<form\b/gi)].length,
    visibleTextHash: digest(visibleText),
  };
}

test("all 19 Stage 2 outputs mirror exact existing metadata into Open Graph", async () => {
  assert.equal(PAGES.length, 19);
  assert.equal(new Set(PAGES.map(([route]) => route)).size, 19);

  for (const [route, title, description, h1, canonical, schemaHash, schemaCount, inquiryHash, visibleTextHash] of PAGES) {
    const html = await readOutput(route);
    assert.equal(elementText(html, "title"), title, `${route} title`);
    assert.equal(one(metaValues(html, "name", "description"), `${route} description`), description);
    assert.equal(one(linkValues(html, "canonical"), `${route} canonical`), canonical);
    assert.equal(elementText(html, "h1"), h1, `${route} H1`);
    assert.equal(one(metaValues(html, "property", "og:title"), `${route} og:title`), title);
    assert.equal(one(metaValues(html, "property", "og:description"), `${route} og:description`), description);
    assert.equal(one(metaValues(html, "property", "og:url"), `${route} og:url`), canonical);
    assert.equal(one(metaValues(html, "property", "og:type"), `${route} og:type`), "website");
    assert.equal(one(metaValues(html, "property", "og:site_name"), `${route} og:site_name`), "POXIOL Teamwear");
    assert.deepEqual(metaValues(html, "property", "og:image"), [], `${route} must not gain og:image`);
    const footer = html.slice(html.indexOf("<footer"), html.indexOf("</footer>") + "</footer>".length);
    assert.equal((footer.match(/<address\b/g) ?? []).length, 1, `${route} must have one footer company block`);
    const copyrightAt = footer.indexOf("© 2026 POXIOL Teamwear. All rights reserved.");
    assert.ok(copyrightAt >= 0, `${route} copyright row must remain`);
    assert.ok(footer.indexOf("<address") > copyrightAt, `${route} company block must follow the copyright row`);
    assert.equal(one(metaValues(html, "name", "twitter:card"), `${route} twitter:card`), "summary");
    assert.equal(one(metaValues(html, "name", "twitter:title"), `${route} twitter:title`), HOME_TITLE);
    assert.equal(one(metaValues(html, "name", "twitter:description"), `${route} twitter:description`), HOME_DESCRIPTION);
    assert.deepEqual(paritySnapshot(html), { robots: [], schemaHash, schemaCount, inquiryHash, formCount: 0, visibleTextHash }, `${route} non-OG parity`);
  }
});

test("homepage root Open Graph and Twitter metadata remain unchanged", async () => {
  const html = await readOutput("/");
  assert.equal(one(metaValues(html, "property", "og:title"), "home og:title"), HOME_TITLE);
  assert.equal(one(metaValues(html, "property", "og:description"), "home og:description"), HOME_DESCRIPTION);
  assert.deepEqual(metaValues(html, "property", "og:url"), []);
  assert.equal(one(metaValues(html, "name", "twitter:card"), "home twitter:card"), "summary");
  assert.equal(one(metaValues(html, "name", "twitter:title"), "home twitter:title"), HOME_TITLE);
  assert.equal(one(metaValues(html, "name", "twitter:description"), "home twitter:description"), HOME_DESCRIPTION);
});

test("Sitemap stays at 78 unique URLs and only the homepage keeps generic Open Graph", async () => {
  const sitemap = await readFile(path.join(OUTPUT_DIRECTORY, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decodeHtml(url));
  assert.equal(urls.length, 78);
  assert.equal(new Set(urls).size, 78);
  assert.ok(!urls.includes(`${SITE_ORIGIN}/products/warm-up-wear/`), "Sitemap must exclude retired Warm-Up Wear");
  assert.ok(urls.includes(`${SITE_ORIGIN}/products/training-wear/`), "Sitemap must retain Training Wear survivor");
  for (const [route] of PAGES) {
    if (route === "/products/warm-up-wear/") continue;
    assert.ok(urls.includes(`${SITE_ORIGIN}${route}`), `Sitemap missing ${route}`);
  }

  let genericCount = 0;
  for (const url of urls) {
    const route = new URL(url).pathname;
    const html = await readOutput(route);
    if (one(metaValues(html, "property", "og:title"), `${route} og:title`) === HOME_TITLE) genericCount += 1;
  }
  assert.equal(genericCount, 1);
});
