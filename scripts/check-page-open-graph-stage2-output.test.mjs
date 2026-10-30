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
  ["/products/", "Custom Teamwear by Sport & Wearing Scenario | POXIOL", "Explore POXIOL custom teamwear by sport or wearing scenario. Product construction, material, quantity and timing are confirmed after project review.", "Custom Teamwear by Sport and Wearing Scenario", "https://www.poxiol.com/products/", "8ea028f70541f883e2c5e48b3dfeaf1ef029a97af5a6358c40f69e970ab34f75", 3, "4b02e056cab502e1588b2d67da9b11b6aa5063fc211690e018da5a490b1fbb16", "4c106c2b245d1da4acfc8ccb13bcad877523fe02c3f24c212618e6213c5fd969"],
  ["/products/running-track-uniforms/", "Running & Track Uniforms for Teams | POXIOL", "Plan custom running and track uniforms for clubs, schools or sportswear brands. Review singlet and shorts options, fit, artwork, quantity and delivery needs.", "Running & Track Uniforms", "https://www.poxiol.com/products/running-track-uniforms/", "51a60cd60dd5cc99dafb6e0bfa341923ad009357502d23aa5917880a5fc106e0", 1, "7ad2c70a548f4f7e092541a02d5ca9c2ba593045ec569f7bb8b3b4974c97fb8f", "71415e9490733f05df5cbdb56332452b43845203bbf4169a4295eb0fb486a86d"],
  ["/products/warm-up-wear/", "Warm-Up Wear and Team Tracksuits | POXIOL", "Plan custom warm-up wear for teams, clubs, schools or sportswear brands. Review jacket and trouser configuration, fit, branding, quantity and delivery needs.", "Warm-Up Wear", "https://www.poxiol.com/products/warm-up-wear/", "9450945eedd46f75eca72ee63e49b4d6848c934144af4f5902023b324940aa0b", 1, "19f3561b3bb0deea3a099e7f293fc7cc8c246600949ab4cd159b5608abd18b03", "42d51d7324b0de8c49d506609079baaa1e132eaf5366982e61763bd8f66f0043"],
  ["/resources/", "Teamwear Knowledge Center | Sportswear Buying Guides | POXIOL", "Explore POXIOL resources including buying guides, fabric knowledge, and manufacturing insights.", "Teamwear Knowledge & Buying Guides", "https://www.poxiol.com/resources/", "022899339fc0a36a44387d764e2db8e51a2d229a06bf000f151a33562a97300b", 1, "04e74ce74824e359fce52d2fb82092de27aa86b01c30189b5b2f29cf1c01e035", "e37b162c2cc044a80a6b32fc29cebcc7b59ee31c91a096e0ca384f402436bf45"],
  ["/projects/", "Teamwear Planning Scenarios | POXIOL", "Explore planning scenarios for custom teamwear briefs, sample review, quality checkpoints, packing needs and target delivery windows.", "Teamwear Planning Scenarios", "https://www.poxiol.com/projects/", "022899339fc0a36a44387d764e2db8e51a2d229a06bf000f151a33562a97300b", 1, "bcd0b65d6dfdfdce3ce2e52e770461e678eb290528d46df99372ee2c5815f680", "100f2e14475e897b6ba1d6e7ecff2a8b2554cbc8982e7a3faba16603ae655355"],
  ["/blog/", "POXIOL Blog | Teamwear SEO Articles", "Teamwear sourcing articles, manufacturing notes and buyer education from POXIOL.", "Teamwear SEO Articles", "https://www.poxiol.com/blog/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "04e74ce74824e359fce52d2fb82092de27aa86b01c30189b5b2f29cf1c01e035", "5ef0757030bbf60cf52bbe3ffc17dafdb956c054dfd80f309313d0372d0e84a2"],
  ["/faq/", "Frequently Asked Questions | Custom Teamwear FAQ | POXIOL", "Find answers to common questions about custom teamwear manufacturing, MOQ, production times, printing methods and sportswear fabrics at POXIOL.", "Frequently Asked Questions", "https://www.poxiol.com/faq/", "c4c9015d73c19020189ba5a8c0381288f3b3c1fc95ff918afc8588a80eecf26f", 1, "04e74ce74824e359fce52d2fb82092de27aa86b01c30189b5b2f29cf1c01e035", "d56e0603c1f7853d3997c7c2023c832188f6f04d6d94d85d9c26d383c704e1fd"],
  ["/fabric-guide/", "Sportswear Fabric Guide: Mesh, Interlock & More | POXIOL", "Compare mesh, interlock, bird eye, quick-dry polyester and spandex fabrics by breathability, stretch, durability and printing fit for custom teamwear.", "Sportswear Fabric Guide For Custom Teamwear", "https://www.poxiol.com/fabric-guide/", "638fd6ff57181298cc641b9fac16feef59056d228153d86ba917c295d7154c66", 1, "837fc43abf48ed6c1f452953c8f1a68ecbbfc470ac030b6651b0dfa3ab7f209d", "4b2077c41053565030e1ea445295be9059930bbcb3385f881c152f2ce2320e4c"],
  ["/printing-guide/", "Sportswear Printing Guide | Sublimation, Screen Printing & Embroidery | POXIOL", "Learn about sublimation printing, screen printing, embroidery and heat transfer methods for custom teamwear, basketball uniforms, soccer kits and sportswear manufacturing.", "Sportswear Printing Guide For Custom Teamwear", "https://www.poxiol.com/printing-guide/", "90bb11317da95868496c5b3df88947045c3f82309062fe87e3214a46333d858b", 1, "837fc43abf48ed6c1f452953c8f1a68ecbbfc470ac030b6651b0dfa3ab7f209d", "c8666cd993b4c131dae475136b6b21cf0dd767a7d23941bdacdff65cf6225e94"],
  ["/certificates-testing/", "Certificates & Testing | POXIOL Custom Teamwear Quality Documents", "Review POXIOL custom teamwear quality documents, fabric testing options, inspection records and verified production evidence for B2B sportswear buyers.", "Certificates & Testing for Custom Teamwear Buyers", "https://www.poxiol.com/certificates-testing/", "862e7a572dd853a70b19e605ea6f96349ca5207840af914703c7d1c6b92ee476", 3, "005afe3211b70a1b761870dca4e80b9c8705019d095e3e27868aeabd0c5b8251", "8340ebd0a31e9daee6e9f3926e82508a8841337274a16ddec5e0364cd75ee758"],
  ["/shipping-after-sales/", "Shipping and After-Sales Process | POXIOL", "Review POXIOL production planning, shipping confirmation, tracking updates and the project-specific order issue review process.", "Shipping and After-Sales Process", "https://www.poxiol.com/shipping-after-sales/", "2085d3d5998ba7064bd63d404978682a79f78272f449a98d343c8942ea204d40", 1, "bcd0b65d6dfdfdce3ce2e52e770461e678eb290528d46df99372ee2c5815f680", "f182023d24691ab1d23a9d38f007d8d91a7d25a1fdcf189921ff825ec4fb1cbf"],
  ["/design-gallery/", "Custom Teamwear Design Gallery | POXIOL Inspiration", "Explore our collection of custom basketball uniforms, soccer kits, and training wear designs. Get inspiration for your team's next look with POXIOL.", "Custom Teamwear Design Inspiration", "https://www.poxiol.com/design-gallery/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "152adc528057adc4525a112a7d73ce3eafbfa669b0a763fd8c0505340a8e3144", "012e70be7bc5ad7cb40d9a33661f0a7d6a93d16d54f3e5ba5717dfb2564b9ec9"],
  ["/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "OEM vs ODM Sportswear: A Decision Guide for Brands | POXIOL", "Compare OEM and ODM paths for a custom sportswear project. Use a practical decision matrix and project brief checklist before requesting a quote.", "OEM vs ODM Sportswear: A Decision Guide for Brands", "https://www.poxiol.com/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "793d3cdac71082f40c14d78cefd892beee2724f07e4deb13279089da2cf2d68c", 1, "005afe3211b70a1b761870dca4e80b9c8705019d095e3e27868aeabd0c5b8251", "75707067727195c5d055aa6fb2d88d64ac08d275af53554f933ffb352324b2a3"],
  ["/privacy-policy/", "Privacy Policy | POXIOL", "How POXIOL handles project inquiry information submitted by B2B custom teamwear buyers.", "Privacy Policy", "https://www.poxiol.com/privacy-policy/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "04e74ce74824e359fce52d2fb82092de27aa86b01c30189b5b2f29cf1c01e035", "bd97cbc574e793f05b96b457e6636db11e8107cc6aaec88e8b1d9f88a619e21c"],
  ["/terms/", "Terms | POXIOL", "General website and inquiry terms for POXIOL custom teamwear buyers.", "Terms", "https://www.poxiol.com/terms/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "04e74ce74824e359fce52d2fb82092de27aa86b01c30189b5b2f29cf1c01e035", "6f69cb031cd227ff33342227276b9184e8eb61c7ddf12178d611090904a1c5cf"],
  ["/intellectual-property-policy/", "Intellectual Property Policy | POXIOL", "POXIOL only supports buyer-owned, original or properly authorized artwork for custom teamwear production.", "Intellectual Property Policy", "https://www.poxiol.com/intellectual-property-policy/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "04e74ce74824e359fce52d2fb82092de27aa86b01c30189b5b2f29cf1c01e035", "c5ebf7a4f0188ebccbfa5bf2cdaec8d4e54bc5ca23b8650995bfeb27afdd2540"],
  ["/products/training-wear/", "Custom Training Wear & Warm-up Suits Manufacturer | POXIOL", "Custom training wear, warm-up suits, tracksuits, and jackets for clubs, schools and brands. POXIOL offers OEM/ODM and high-color sublimation printing with Sample timing is confirmed after project review.", "Training Wear", "https://www.poxiol.com/products/training-wear/", "beb59acd482b62b54340bc9f6fc411618dc9dcbcd9670a3147a624d8457d7429", 3, "4b8d1ee016d3a60673a25723fb8a8382fcbf89de648cafa231d7538ca069b08d", "9d6227127c7c1181cab59448aebf8cd5f16e0528c686d407b07847138e76f050"],
  ["/products/hoodies-jackets/", "Custom Hoodies & Jackets Manufacturer | Team Outerwear | POXIOL", "Custom team hoodies, jackets, and outerwear for clubs and brands. POXIOL offers high-color sublimation and Sample timing is confirmed after project review.", "Hoodies & Jackets", "https://www.poxiol.com/products/hoodies-jackets/", "b994655428cf6c4a613329f08ff6f464d2f056f2e2ef67e5aa5a71034c25d071", 3, "2676d81ae2d190cd6512310a75725812bd5cb2ffe7cdfb62ad6fe3aacf265835", "eebfcf62dc08951adec95517c3b2412cc67dd68e9ee26b2447552f37e084e9f5"],
  ["/products/team-accessories/", "Custom Team Accessories Manufacturer | POXIOL", "Custom team socks, bags, and accessories to complete your team look. High-quality manufacturing with POXIOL quality support and Sample timing is confirmed after project review.", "Team Accessories", "https://www.poxiol.com/products/team-accessories/", "edb9df122309f59e658346ace298ec43c8d9495e476a5a10275fabeaaf365d9f", 3, "88e60f192886014e8769a58c7c67f1ab1b280e65462d5758a1cdd265b7d1b86e", "97a86ccdd5c140bdf44bb9f7713b8e9220c5729c3e8d271024bc082ca6b41fbf"],
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
