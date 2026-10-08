import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { pseoPages } from "../lib/pseo.ts";

const SITE_ORIGIN = "https://www.poxiol.com";
const HOME_TITLE = "Custom Teamwear & Sports Uniforms Manufacturer | POXIOL";
const HOME_DESCRIPTION =
  "Custom basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors.";
const OUTPUT_DIRECTORY = path.resolve(process.env.POXIOL_OUTPUT_DIR ?? "out");

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
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)="([^"]*)"/g)].map(([, name, value]) => [
      name,
      decodeHtml(value),
    ]),
  );
}

function metaValues(html, key, value) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => attributes(tag))
    .filter((entry) => entry[key] === value)
    .map((entry) => entry.content);
}

function linkValues(html, rel) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map(([tag]) => attributes(tag))
    .filter((entry) => entry.rel === rel)
    .map((entry) => entry.href);
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

function outputFileForUrl(url) {
  const pathname = new URL(url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  return path.join(OUTPUT_DIRECTORY, ...segments, "index.html");
}

async function readOutput(pathname) {
  return readFile(outputFileForUrl(`${SITE_ORIGIN}${pathname}`), "utf8");
}

test("all 19 pSEO outputs mirror their existing page metadata into Open Graph", async () => {
  assert.equal(pseoPages.length, 19);
  assert.equal(new Set(pseoPages.map(({ slug }) => slug)).size, 19);

  for (const page of pseoPages) {
    assert.ok(page.title.trim());
    assert.ok(page.intro.trim());
    assert.ok(page.h1.trim());

    const route = `/${page.slug}/`;
    const absolute = `${SITE_ORIGIN}${route}`;
    const html = await readOutput(route);

    assert.equal(elementText(html, "title"), page.title, `${route} title`);
    assert.equal(one(metaValues(html, "name", "description"), `${route} description`), page.intro);
    assert.equal(one(linkValues(html, "canonical"), `${route} canonical`), absolute);
    assert.equal(elementText(html, "h1"), page.h1, `${route} H1`);
    assert.equal(one(metaValues(html, "property", "og:title"), `${route} og:title`), page.title);
    assert.equal(
      one(metaValues(html, "property", "og:description"), `${route} og:description`),
      page.intro,
    );
    assert.equal(one(metaValues(html, "property", "og:url"), `${route} og:url`), absolute);
    assert.equal(one(metaValues(html, "property", "og:type"), `${route} og:type`), "website");
    assert.equal(
      one(metaValues(html, "property", "og:site_name"), `${route} og:site_name`),
      "POXIOL Teamwear",
    );
    assert.deepEqual(metaValues(html, "property", "og:image"), [], `${route} must not gain og:image`);

    // These root-layout Twitter tags pre-date Stage 1 and must remain unchanged.
    assert.equal(one(metaValues(html, "name", "twitter:card"), `${route} twitter:card`), "summary");
    assert.equal(one(metaValues(html, "name", "twitter:title"), `${route} twitter:title`), HOME_TITLE);
    assert.equal(
      one(metaValues(html, "name", "twitter:description"), `${route} twitter:description`),
      HOME_DESCRIPTION,
    );

    const jsonLd = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .map(([, json]) => JSON.parse(json));
    assert.equal(jsonLd.length, 1, `${route} JSON-LD script count`);
    const expectedFaq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };
    const expectedSchema = page.publisher
      ? [
          expectedFaq,
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: page.title,
            description: page.intro,
            author: { "@id": `${SITE_ORIGIN}/#operator` },
            publisher: { "@id": `${SITE_ORIGIN}/#operator` },
          },
        ]
      : expectedFaq;
    assert.deepEqual(jsonLd[0], expectedSchema, `${route} Schema`);

    assert.match(html, /href="\/get-quote\/(?:[?#][^"]*)?"/, `${route} Get Quote CTA`);
    assert.match(html, /href="\/free-mockup\/"/, `${route} Free Mockup CTA`);
    assert.doesNotMatch(html, /<form\b/i, `${route} must not gain a form`);
  }
});

test("homepage stays unchanged while the completed Stage 2 product hub emits page-specific Open Graph", async () => {
  const homepage = await readOutput("/");
  assert.equal(one(metaValues(homepage, "property", "og:title"), "home og:title"), HOME_TITLE);
  assert.equal(one(metaValues(homepage, "property", "og:description"), "home og:description"), HOME_DESCRIPTION);
  assert.deepEqual(metaValues(homepage, "property", "og:url"), [], "home must not gain og:url");
  assert.equal(one(metaValues(homepage, "name", "twitter:title"), "home twitter:title"), HOME_TITLE);

  const products = await readOutput("/products/");
  const productsTitle = "Custom Teamwear by Sport & Wearing Scenario | POXIOL";
  const productsDescription =
    "Explore POXIOL custom teamwear by sport or wearing scenario. Product construction, material, quantity and timing are confirmed after project review.";
  assert.equal(one(metaValues(products, "property", "og:title"), "products og:title"), productsTitle);
  assert.equal(one(metaValues(products, "property", "og:description"), "products og:description"), productsDescription);
  assert.equal(one(metaValues(products, "property", "og:url"), "products og:url"), `${SITE_ORIGIN}/products/`);
  assert.equal(one(metaValues(products, "property", "og:type"), "products og:type"), "website");
  assert.equal(one(metaValues(products, "property", "og:site_name"), "products og:site_name"), "POXIOL Teamwear");
  assert.deepEqual(metaValues(products, "property", "og:image"), [], "products must not gain og:image");
  assert.equal(one(metaValues(products, "name", "twitter:card"), "products twitter:card"), "summary");
  assert.equal(one(metaValues(products, "name", "twitter:title"), "products twitter:title"), HOME_TITLE);
  assert.equal(one(metaValues(products, "name", "twitter:description"), "products twitter:description"), HOME_DESCRIPTION);
});

test("the 78-URL Sitemap boundary remains fixed and only the homepage keeps generic Open Graph", async () => {
  const sitemap = await readFile(path.join(OUTPUT_DIRECTORY, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decodeHtml(url));

  assert.equal(urls.length, 78);
  assert.equal(new Set(urls).size, 78);
  for (const { slug } of pseoPages) {
    assert.ok(urls.includes(`${SITE_ORIGIN}/${slug}/`), `Sitemap missing /${slug}/`);
  }

  let genericCount = 0;
  for (const url of urls) {
    const html = await readFile(outputFileForUrl(url), "utf8");
    if (one(metaValues(html, "property", "og:title"), `${url} og:title`) === HOME_TITLE) {
      genericCount += 1;
    }
  }
  assert.equal(genericCount, 1);
});
