import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createPageMetadata } from "../lib/seo/page-metadata.ts";
import { pseoPages } from "../lib/pseo.ts";

const SITE_ORIGIN = "https://www.poxiol.com";
const STAGE_ONE_SLUGS = [
  "soccer-jersey-buying-guide",
  "oem-vs-odm-sportswear",
  "best-sportswear-fabrics",
  "how-sublimation-printing-works-for-teamwear",
  "how-to-choose-a-teamwear-manufacturer",
  "custom-basketball-uniforms-for-schools",
  "custom-soccer-uniforms-for-academies",
  "soccer-jersey-supplier-australia",
  "oem-basketball-apparel-manufacturer",
  "custom-baseball-jerseys-for-clubs",
  "soccer-teamwear-supplier-usa",
  "custom-volleyball-uniforms-for-schools",
  "oem-soccer-apparel-manufacturer",
  "soccer-teamwear-supplier-uk",
  "custom-basketball-jerseys-melbourne",
  "oem-baseball-apparel-manufacturer",
  "custom-soccer-kits-london",
  "oem-volleyball-apparel-manufacturer",
  "custom-teamwear-new-york",
] as const;

test("creates exact self-canonical Open Graph metadata for every pSEO page", () => {
  assert.equal(pseoPages.length, 19);
  assert.deepEqual(
    pseoPages.map(({ slug }) => slug),
    STAGE_ONE_SLUGS,
  );
  assert.equal(new Set(STAGE_ONE_SLUGS).size, 19);

  for (const page of pseoPages) {
    assert.ok(page.title.trim());
    assert.ok(page.intro.trim());
    assert.ok(page.h1.trim());
    const canonical = `/${page.slug}/`;
    const metadata = createPageMetadata({
      title: page.title,
      description: page.intro,
      canonical,
    });

    assert.equal(metadata.title, page.title);
    assert.equal(metadata.description, page.intro);
    assert.deepEqual(metadata.alternates, { canonical });
    assert.deepEqual(metadata.openGraph, {
      title: page.title,
      description: page.intro,
      url: `${SITE_ORIGIN}${canonical}`,
      type: "website",
      siteName: "POXIOL Teamwear",
    });
    assert.equal(metadata.twitter, undefined);
    assert.equal(metadata.keywords, undefined);
  }
});

test("accepts an exact same-origin absolute canonical and preserves optional metadata", () => {
  const canonical = `${SITE_ORIGIN}/custom-teamwear-new-york/`;
  const metadata = createPageMetadata({
    title: "Example title",
    description: "Example description",
    canonical,
    metadata: { robots: { index: false, follow: true } },
  });

  assert.deepEqual(metadata.alternates, { canonical });
  assert.equal(metadata.openGraph?.url, canonical);
  assert.deepEqual(metadata.robots, { index: false, follow: true });
});

test("rejects empty fields and unsafe canonical URLs", () => {
  const valid = {
    title: "Example title",
    description: "Example description",
    canonical: "/example/",
  };

  for (const input of [
    { ...valid, title: "" },
    { ...valid, description: " " },
    { ...valid, canonical: "example/" },
    { ...valid, canonical: "/example/?preview=1" },
    { ...valid, canonical: "/example/#section" },
    { ...valid, canonical: "http://www.poxiol.com/example/" },
    { ...valid, canonical: "https://poxiol.com/example/" },
    { ...valid, canonical: "https://example.com/example/" },
  ]) {
    assert.throws(() => createPageMetadata(input), /metadata|canonical/i);
  }
});

test("the dynamic pSEO route delegates successful metadata to the shared helper", async () => {
  const source = await readFile("app/[slug]/page.tsx", "utf8");

  assert.match(source, /import \{ createPageMetadata \} from "@\/lib\/seo\/page-metadata";/);
  assert.match(source, /return createPageMetadata\(\{/);
  assert.match(source, /if \(!page\) return \{ title: "Page Not Found" \};/);
  assert.match(source, /title: page\.title/);
  assert.match(source, /description: page\.intro/);
  assert.match(source, /canonical: `\/\$\{page\.slug\}\//);
});
