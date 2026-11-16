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
  ["/products/", "Custom Teamwear by Sport & Wearing Scenario | POXIOL", "Explore POXIOL custom teamwear by sport or wearing scenario. Product construction, material, quantity and timing are confirmed after project review.", "Custom Teamwear by Sport and Wearing Scenario", "https://www.poxiol.com/products/", "1d2d3edc77e76bfe53aa7b74c9412185ea5abdc1f15479b0e3028d552634f123", 3, "3176447041205cc2ee5599262deed8455248412a08da9ed6ee7d6d6ddd2fb747", "9e6b69f5af858e6237d9dd3aab836bd1a2ba4fa3a3bc2a0ac04f72c2e68ca402"],
  ["/products/running-track-uniforms/", "Running & Track Uniforms for Teams | POXIOL", "Plan custom running and track uniforms for clubs, schools or sportswear brands. Review singlet and shorts options, fit, artwork, quantity and delivery needs.", "Running & Track Uniforms", "https://www.poxiol.com/products/running-track-uniforms/", "51a60cd60dd5cc99dafb6e0bfa341923ad009357502d23aa5917880a5fc106e0", 1, "59e17b92b1bcc9a969e0f36f8f0db3f753956aafb03cf428f43b84cf46aa353a", "5bc0979bf747ed2114d25721fc4ea3e7a6f8d09297580619e5fb965409e5dc3f"],
  ["/products/warm-up-wear/", "Warm-Up Wear and Team Tracksuits | POXIOL", "Plan custom warm-up wear for teams, clubs, schools or sportswear brands. Review jacket and trouser configuration, fit, branding, quantity and delivery needs.", "Warm-Up Wear", "https://www.poxiol.com/products/warm-up-wear/", "9450945eedd46f75eca72ee63e49b4d6848c934144af4f5902023b324940aa0b", 1, "d6e0bc920e455ead8630194a8d5148c7f2e0f95dbe8d3eaabae66865db70a039", "750ea99271d9cae13165a0edfbf98069ba29d5fad1d2efae143028691fad877a"],
  ["/resources/", "Teamwear Knowledge Center | Buying Guides & Specs", "Buying guides, fabric and sizing specs, and manufacturing know-how for custom teamwear buyers, written for clubs, schools, brands and distributors.", "Teamwear Knowledge & Buying Guides", "https://www.poxiol.com/resources/", "52a0506215589a233c29cade61747bdcae221e8b8aa302d0a9609972f7dc4363", 3, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "502139c572972847bc735bd4fdec4f92fa933d7ac54279a4c4ac94f036709eca"],
  ["/projects/", "Teamwear Planning Scenarios | POXIOL", "Explore planning scenarios for custom teamwear briefs, sample review, quality checkpoints, packing needs and target delivery windows.", "Teamwear Planning Scenarios", "https://www.poxiol.com/projects/", "d98406babddb699a77c4b10ba929b504bfd77cbed383da546f29e32440a88d62", 2, "17573217d120de11931e6befcf356df3ba36aa2d6c736e7d6175566866d51217", "940d15dc2f51683d985918396ca3a91e7fa6be7596379ff677a01854d93e851c"],
  ["/blog/", "POXIOL Blog | Teamwear SEO Articles", "Articles on teamwear sourcing, fabric selection, printing methods, sampling and production planning for clubs, schools and sportswear brands.", "Teamwear SEO Articles", "https://www.poxiol.com/blog/", "343cd736874b1f714c6dac577507ead3c3d3c95d331a07ee6f10dd6d6e5fd091", 3, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "39b2c1dafbf7bb99277cbc4b8031e39179606150cef3b42edd45fc50c7ccf518"],
  ["/faq/", "Frequently Asked Questions | Custom Teamwear FAQ | POXIOL", "Find answers to common questions about custom teamwear manufacturing, MOQ, production times, printing methods and sportswear fabrics at POXIOL.", "Frequently Asked Questions", "https://www.poxiol.com/faq/", "17b03bb76ca29d70c7689bd8d92158f07aee6c6645b0adc508c9d0bb21573181", 2, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "94197dfd4946b6050b9d47f72087854c10b9998a4704bef17876f0b41bf2a70b"],
  ["/fabric-guide/", "Sportswear Fabric Guide: Mesh, Interlock & More | POXIOL", "Compare mesh, interlock, bird eye, quick-dry polyester and spandex fabrics by breathability, stretch, durability and printing fit for custom teamwear.", "Sportswear Fabric Guide For Custom Teamwear", "https://www.poxiol.com/fabric-guide/", "b0db7e3989ae2f09b794d2a4443db38d0a9993815356915188e4af6d492bd7ce", 2, "8dfda5577fe47827ab376e6b344f0bc333afc350d4e6c6be6e095c4438225ccb", "804ff5630823ca3656c085b1d228cc6e2edeb3d853df577e96b930e8aa71cbae"],
  ["/printing-guide/", "Sportswear Printing Guide | Sublimation & Embroidery", "Compare sublimation, screen printing, embroidery and heat transfer for custom teamwear, basketball uniforms and soccer kits before you specify.", "Sportswear Printing Guide For Custom Teamwear", "https://www.poxiol.com/printing-guide/", "90bb11317da95868496c5b3df88947045c3f82309062fe87e3214a46333d858b", 1, "8dfda5577fe47827ab376e6b344f0bc333afc350d4e6c6be6e095c4438225ccb", "d1bb52f3994e630247fd8d71e04a8f46a1f36bdc51d2a090d2e57231677990d1"],
  ["/certificates-testing/", "Certificates & Testing | Teamwear Quality Documents", "Review POXIOL custom teamwear quality documents, fabric testing options, inspection records and verified production evidence for B2B sportswear buyers.", "Certificates & Testing for Custom Teamwear Buyers", "https://www.poxiol.com/certificates-testing/", "2bb2e6694164a2cfc44aa49f4ae4509be3a02d6d3d1822333dfc31f7a7425ea9", 3, "16419d1fb42f40ae705653ef3f4ff45c6ecb92450f640ea59644583151395dfb", "53ddca0a0c41776bfb915c6cb9458a7740662ee3d42ac5ac3bb22d1403a8b7fe"],
  ["/shipping-after-sales/", "Shipping and After-Sales Process | POXIOL", "Review POXIOL production planning, shipping confirmation, tracking updates and the project-specific order issue review process.", "Shipping and After-Sales Process", "https://www.poxiol.com/shipping-after-sales/", "eb2b38fa7b3c4f7fc982b321bf1d4323f2020056299a54f63e48dabae483fffa", 1, "17573217d120de11931e6befcf356df3ba36aa2d6c736e7d6175566866d51217", "77f1ad86c0c353cce7b969849c0d6703dcf7b93ed76324e8ae99d41ccc087cbe"],
  ["/design-gallery/", "Custom Teamwear Design Gallery | POXIOL Inspiration", "Explore our collection of custom basketball uniforms, soccer kits, and training wear designs. Get inspiration for your team's next look with POXIOL.", "Custom Teamwear Design Inspiration", "https://www.poxiol.com/design-gallery/", "9ca6ae615b7447c84b77449c5d289c32bcbd913bb0acda5badac9caff94ae060", 2, "e726020f6f0f178e8a29204b3174c2749c846b776c0bd75cf49940c02536614b", "a31e6c362ecf349d24087dc3afa47d5dc26a3f44682ec0c26b5b9b4f5720db24"],
  ["/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "OEM vs ODM Sportswear: A Decision Guide for Brands | POXIOL", "Compare OEM and ODM paths for a custom sportswear project. Use a practical decision matrix and project brief checklist before requesting a quote.", "OEM vs ODM Sportswear: A Decision Guide for Brands", "https://www.poxiol.com/guides/oem-odm-sportswear-manufacturing-guide-for-brands/", "793d3cdac71082f40c14d78cefd892beee2724f07e4deb13279089da2cf2d68c", 1, "16419d1fb42f40ae705653ef3f4ff45c6ecb92450f640ea59644583151395dfb", "dc761a95d4cd035e0f387e9bb3b4fbf7ea7af7c581a2f7cfdb41d5477fc33253"],
  ["/privacy-policy/", "Privacy Policy | POXIOL", "How POXIOL handles project inquiry information submitted by B2B custom teamwear buyers, including what we collect and how long we keep it.", "Privacy Policy", "https://www.poxiol.com/privacy-policy/", "f9f5ef6a687f6a0faef38b192ab5368b1f99d727bbc19d5c73fa6e280d25c5a9", 1, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "c2d78d4c7a624fc4bb9979619a3453209e41bc05f92e687a3c99610b73cefa26"],
  ["/terms/", "Terms | POXIOL", "General website and inquiry terms for POXIOL custom teamwear buyers, covering quotes, samples, production schedules and order changes.", "Terms", "https://www.poxiol.com/terms/", "447fa4e170f591a3421d36b52d3b5f1ab3cbb4402b016f02b8ec80e4377e76d8", 2, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "dc0ee376330f101e4679fbabfc9831e9792837ba8123d0b366d07266176b83e8"],
  ["/intellectual-property-policy/", "Intellectual Property Policy | POXIOL", "POXIOL only supports buyer-owned, original or properly authorized artwork for custom teamwear production, including logos, prints and embroidery files.", "Intellectual Property Policy", "https://www.poxiol.com/intellectual-property-policy/", "f742e32acbb354c533be63add6b7b62d1869b3def75af5c41a958fb33595e315", 2, "6749903f35dfdb6e9f1e8ea07ea6fbcc7ba7b243c9ceaa3cff6d771276943728", "eff2dc75d75f7098aa92552c75a783134ae5d9b4bf338b806af4e3a66816eca4"],
  ["/products/training-wear/", "Custom Training Wear & Warm-up Suits Manufacturer | POXIOL", "Custom training wear, warm-up suits, tracksuits and jackets for clubs, schools and brands. OEM/ODM, sublimation printing and project-based production.", "Training Wear", "https://www.poxiol.com/products/training-wear/", "49708e7d5f5d3c5b7b5c6af3c5cdc6354a60bae94fc6133c31f612bbe22c9128", 3, "528208cdd29962baafc02bce501c730644b1baa7c606c06b0f107da930581471", "7b26a37b707078411befc259acf336fa2f82727d68e4a1660dd07c5c2fb64a86"],
  ["/products/hoodies-jackets/", "Custom Hoodies & Jackets Manufacturer | POXIOL", "Custom team hoodies, jackets, and outerwear for clubs and brands. POXIOL offers high-color sublimation. Sample timing is confirmed after project review.", "Hoodies & Jackets", "https://www.poxiol.com/products/hoodies-jackets/", "07e0bd83261f697842910704fb61725060fb28fcb3d4b314c2e2a69f32124d6b", 3, "c7ba6d2a45e97638b1c985cda181c56e88065facc8afedc429cc0639d984c122", "a76ec168b409be36b266e76d3fc97d56a468d75b0a8a9902107b87ae25665a89"],
  ["/products/team-accessories/", "Custom Team Socks, Bags & Accessories Manufacturer | POXIOL", "Custom team socks, bags and accessories that complete your kit. Colour matching and quality checks before shipment, planned around your project.", "Team Accessories", "https://www.poxiol.com/products/team-accessories/", "ba63c7632617fd12bf0f6e2ba5f65d5d338bb13a6c4be6e71c8b7b7db47c3cd1", 3, "db6823167eadd1bbe03bb933c7a14520445ce72916f30870d82ed3ff358bf6f9", "6074596d6a25b31c5811d5fac2301e2e6ef91b0cd77c7c2f8dd9179aca3720e6"],
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

test("Sitemap stays at 87 unique URLs and only the homepage keeps generic Open Graph", async () => {
  const sitemap = await readFile(path.join(OUTPUT_DIRECTORY, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decodeHtml(url));
  assert.equal(urls.length, 87);
  assert.equal(new Set(urls).size, 87);
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
