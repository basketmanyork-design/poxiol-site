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
  ["/products/", "Custom Teamwear by Sport & Wearing Scenario | POXIOL", "Explore POXIOL custom teamwear by sport or wearing scenario. Product construction, material, quantity and timing are confirmed after project review.", "Custom Teamwear by Sport and Wearing Scenario", "https://www.poxiol.com/products/", "8ea028f70541f883e2c5e48b3dfeaf1ef029a97af5a6358c40f69e970ab34f75", 3, "e2036dc1977f73e42a2488dc6729895d6941ae881c170bb1fba8115506ac0852", "1907b392407f340e899d265d062560a5e0f2c6e3a323ac22fb929c1b88b307cf"],
  ["/products/running-track-uniforms/", "Running & Track Uniforms for Teams | POXIOL", "Plan custom running and track uniforms for clubs, schools or sportswear brands. Review singlet and shorts options, fit, artwork, quantity and delivery needs.", "Running & Track Uniforms", "https://www.poxiol.com/products/running-track-uniforms/", "51a60cd60dd5cc99dafb6e0bfa341923ad009357502d23aa5917880a5fc106e0", 1, "59e17b92b1bcc9a969e0f36f8f0db3f753956aafb03cf428f43b84cf46aa353a", "fb4980f22b690bcdf99a5141719eb98b72e5b20b345d6f935e8df658967449fe"],
  ["/products/warm-up-wear/", "Warm-Up Wear and Team Tracksuits | POXIOL", "Plan custom warm-up wear for teams, clubs, schools or sportswear brands. Review jacket and trouser configuration, fit, branding, quantity and delivery needs.", "Warm-Up Wear", "https://www.poxiol.com/products/warm-up-wear/", "9450945eedd46f75eca72ee63e49b4d6848c934144af4f5902023b324940aa0b", 1, "d6e0bc920e455ead8630194a8d5148c7f2e0f95dbe8d3eaabae66865db70a039", "86e45e27ee04763d03a9323756c9ea2e252c271dcf0dda254ddaef8bf80d05c1"],
  ["/resources/", "Teamwear Knowledge Center | Sportswear Buying Guides | POXIOL", "Explore POXIOL resources including buying guides, fabric knowledge, and manufacturing insights.", "Teamwear Knowledge & Buying Guides", "https://www.poxiol.com/resources/", "022899339fc0a36a44387d764e2db8e51a2d229a06bf000f151a33562a97300b", 1, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "88d5369d2d5425e3718cb967c29ee3b6b028e7074982a765da59c6c77cf8a924"],
  ["/projects/", "Teamwear Planning Scenarios | POXIOL", "Explore planning scenarios for custom teamwear briefs, sample review, quality checkpoints, packing needs and target delivery windows.", "Teamwear Planning Scenarios", "https://www.poxiol.com/projects/", "022899339fc0a36a44387d764e2db8e51a2d229a06bf000f151a33562a97300b", 1, "17573217d120de11931e6befcf356df3ba36aa2d6c736e7d6175566866d51217", "bd78474f7b754ea2a217412121c4bfa60e35fc05ed46fdc8b96f6a3ef0b14bfb"],
  ["/blog/", "POXIOL Blog | Teamwear SEO Articles", "Teamwear sourcing articles, manufacturing notes and buyer education from POXIOL.", "Teamwear SEO Articles", "https://www.poxiol.com/blog/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "08b6516ee57b85c6e9a409bc120ec4f9e7e41af1c9e3cb6438b50fd16320c9e8"],
  ["/faq/", "Frequently Asked Questions | Custom Teamwear FAQ | POXIOL", "Find answers to common questions about custom teamwear manufacturing, MOQ, production times, printing methods and sportswear fabrics at POXIOL.", "Frequently Asked Questions", "https://www.poxiol.com/faq/", "5454847a1c6338e943edf7dcffc4c4c7f884ee3f44a63ebac66aeb54cc8d91e4", 1, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "f265ee64a1156b54813f75919e9c4a9bd5820be62e076e201ef16ffa71203999"],
  ["/fabric-guide/", "Sportswear Fabric Guide | Teamwear Fabric Database | POXIOL", "Explore POXIOL sportswear fabric guide for custom teamwear, including mesh fabric, interlock fabric, bird eye fabric, quick-dry polyester, spandex sports fabric and moisture-wicking materials for basketball, soccer, baseball, volleyball and team sports.", "Sportswear Fabric Guide For Custom Teamwear", "https://www.poxiol.com/fabric-guide/", "0892cffbb8e1a483aa92272976aac47a73dea278ed3f6b1816f59ccdde07fbef", 1, "8dfda5577fe47827ab376e6b344f0bc333afc350d4e6c6be6e095c4438225ccb", "b4a80a099f98c79089ae4354a079f36e17f63659f42eced03b14402a0388f24a"],
  ["/printing-guide/", "Sportswear Printing Guide | Sublimation, Screen Printing & Embroidery | POXIOL", "Learn about sublimation printing, screen printing, embroidery and heat transfer methods for custom teamwear, basketball uniforms, soccer kits and sportswear manufacturing.", "Sportswear Printing Guide For Custom Teamwear", "https://www.poxiol.com/printing-guide/", "90bb11317da95868496c5b3df88947045c3f82309062fe87e3214a46333d858b", 1, "8dfda5577fe47827ab376e6b344f0bc333afc350d4e6c6be6e095c4438225ccb", "fbbd8c87c7b873583f390a3a5ae20c22547e3eb75843638e7faf63df5107a1ee"],
  ["/certificates-testing/", "Certificates & Testing | POXIOL Custom Teamwear Quality Documents", "Review POXIOL custom teamwear quality documents, fabric testing options, inspection records and verified production evidence for B2B sportswear buyers.", "Certificates & Testing for Custom Teamwear Buyers", "https://www.poxiol.com/certificates-testing/", "862e7a572dd853a70b19e605ea6f96349ca5207840af914703c7d1c6b92ee476", 3, "16419d1fb42f40ae705653ef3f4ff45c6ecb92450f640ea59644583151395dfb", "ac284480b51e93513f4753bbb86154005d5090e8a93843862830fcd8524e18e8"],
  ["/shipping-after-sales/", "Shipping and After-Sales Process | POXIOL", "Review POXIOL production planning, shipping confirmation, tracking updates and the project-specific order issue review process.", "Shipping and After-Sales Process", "https://www.poxiol.com/shipping-after-sales/", "2085d3d5998ba7064bd63d404978682a79f78272f449a98d343c8942ea204d40", 1, "17573217d120de11931e6befcf356df3ba36aa2d6c736e7d6175566866d51217", "4098003f307cb0c52eff8726c4d52ffb1ad64324ea3123d8e54547b3661bc07c"],
  ["/design-gallery/", "Custom Teamwear Design Gallery | POXIOL Inspiration", "Explore our collection of custom basketball uniforms, soccer kits, and training wear designs. Get inspiration for your team's next look with POXIOL.", "Custom Teamwear Design Inspiration", "https://www.poxiol.com/design-gallery/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "e726020f6f0f178e8a29204b3174c2749c846b776c0bd75cf49940c02536614b", "8c7ebc5562e87796d7414fbaadb3522a7cc05bcce544030d09b39449575e1c8a"],
  ["/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "OEM vs ODM Sportswear: A Decision Guide for Brands | POXIOL", "Compare OEM and ODM paths for a custom sportswear project. Use a practical decision matrix and project brief checklist before requesting a quote.", "OEM vs ODM Sportswear: A Decision Guide for Brands", "https://www.poxiol.com/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "793d3cdac71082f40c14d78cefd892beee2724f07e4deb13279089da2cf2d68c", 1, "16419d1fb42f40ae705653ef3f4ff45c6ecb92450f640ea59644583151395dfb", "388085770b7338367c13f88b68f2a8d1fc63e660f8732b0e5325f0e07cb89a5a"],
  ["/privacy-policy/", "Privacy Policy | POXIOL", "How POXIOL handles project inquiry information submitted by B2B custom teamwear buyers.", "Privacy Policy", "https://www.poxiol.com/privacy-policy/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "5c72423d3e55c6482d95b6de2ac127885a5bc3cc1cc7984b7a046873d4e23680"],
  ["/terms/", "Terms | POXIOL", "General website and inquiry terms for POXIOL custom teamwear buyers.", "Terms", "https://www.poxiol.com/terms/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "0c2d945fb6ed94c9ae696f34eaf5681d6dba75edfcf107a47bb64111621d612a"],
  ["/intellectual-property-policy/", "Intellectual Property Policy | POXIOL", "POXIOL only supports buyer-owned, original or properly authorized artwork for custom teamwear production.", "Intellectual Property Policy", "https://www.poxiol.com/intellectual-property-policy/", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945", 0, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "43e723fa2373be665990ab974377ad8da2a7e713022bd22cdaa57968040e965e"],
  ["/products/training-wear/", "Custom Training Wear & Warm-up Suits Manufacturer | POXIOL", "Custom training wear, warm-up suits, tracksuits, and jackets for clubs, schools and brands. POXIOL offers OEM/ODM and high-color sublimation printing with Sample timing is confirmed after project review.", "Training Wear", "https://www.poxiol.com/products/training-wear/", "beb59acd482b62b54340bc9f6fc411618dc9dcbcd9670a3147a624d8457d7429", 3, "528208cdd29962baafc02bce501c730644b1baa7c606c06b0f107da930581471", "9f3c921740ccb23573e5d56329e8e9a95c5054ed0c825fb23b98dfe31f2e4ab1"],
  ["/products/hoodies-jackets/", "Custom Hoodies & Jackets Manufacturer | Team Outerwear | POXIOL", "Custom team hoodies, jackets, and outerwear for clubs and brands. POXIOL offers high-color sublimation and Sample timing is confirmed after project review.", "Hoodies & Jackets", "https://www.poxiol.com/products/hoodies-jackets/", "b994655428cf6c4a613329f08ff6f464d2f056f2e2ef67e5aa5a71034c25d071", 3, "c7ba6d2a45e97638b1c985cda181c56e88065facc8afedc429cc0639d984c122", "af7f83cd2c14c2b8d775dbf5d57799034f98ffd231be5982acaacc05eb253f03"],
  ["/products/team-accessories/", "Custom Team Accessories Manufacturer | POXIOL", "Custom team socks, bags, and accessories to complete your team look. High-quality manufacturing with POXIOL quality support and Sample timing is confirmed after project review.", "Team Accessories", "https://www.poxiol.com/products/team-accessories/", "edb9df122309f59e658346ace298ec43c8d9495e476a5a10275fabeaaf365d9f", 3, "db6823167eadd1bbe03bb933c7a14520445ce72916f30870d82ed3ff358bf6f9", "3f0ae56685e4ff8aa8c8df74e3f17eed79c6e33bd884d296374bbedff5178cf8"],
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

test("Sitemap stays at 79 unique URLs and only the homepage keeps generic Open Graph", async () => {
  const sitemap = await readFile(path.join(OUTPUT_DIRECTORY, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decodeHtml(url));
  assert.equal(urls.length, 79);
  assert.equal(new Set(urls).size, 79);
  for (const [route] of PAGES) assert.ok(urls.includes(`${SITE_ORIGIN}${route}`), `Sitemap missing ${route}`);

  let genericCount = 0;
  for (const url of urls) {
    const route = new URL(url).pathname;
    const html = await readOutput(route);
    if (one(metaValues(html, "property", "og:title"), `${route} og:title`) === HOME_TITLE) genericCount += 1;
  }
  assert.equal(genericCount, 1);
});
