import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const TARGETS = [
  ["/products/", "app/products/page.tsx", "static"],
  ["/products/running-track-uniforms/", "app/products/running-track-uniforms/page.tsx", "static"],
  ["/products/warm-up-wear/", "app/products/warm-up-wear/page.tsx", "static"],
  ["/resources/", "app/resources/page.tsx", "static"],
  ["/projects/", "app/projects/page.tsx", "static"],
  ["/blog/", "app/blog/page.tsx", "static"],
  ["/faq/", "app/faq/page.tsx", "static"],
  ["/fabric-guide/", "app/fabric-guide/page.tsx", "static"],
  ["/printing-guide/", "app/printing-guide/page.tsx", "static"],
  ["/certificates-testing/", "app/certificates-testing/page.tsx", "static"],
  ["/shipping-after-sales/", "app/shipping-after-sales/page.tsx", "static"],
  ["/design-gallery/", "app/design-gallery/page.tsx", "static"],
  [
    "/guides/oem-odm-sportswear-manufacturing-guide-for-brands/",
    "app/guides/oem-odm-sportswear-manufacturing-guide-for-brands/page.tsx",
    "static",
  ],
  ["/privacy-policy/", "app/privacy-policy/page.tsx", "legal"],
  ["/terms/", "app/terms/page.tsx", "legal"],
  ["/intellectual-property-policy/", "app/intellectual-property-policy/page.tsx", "legal"],
  ["/products/training-wear/", "app/products/training-wear/page.tsx", "cms"],
  ["/products/hoodies-jackets/", "app/products/hoodies-jackets/page.tsx", "cms"],
  ["/products/team-accessories/", "app/products/team-accessories/page.tsx", "cms"],
] as const;

async function pageFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await pageFiles(candidate)));
    if (entry.isFile() && entry.name === "page.tsx") files.push(candidate.replaceAll("\\", "/"));
  }
  return files;
}

test("freezes exactly 19 unique Stage 2 route and source-file pairs", async () => {
  assert.equal(TARGETS.length, 19);
  assert.equal(new Set(TARGETS.map(([route]) => route)).size, 19);
  assert.equal(new Set(TARGETS.map(([, file]) => file)).size, 19);

  for (const [route, file] of TARGETS) {
    assert.ok(route.startsWith("/") && route.endsWith("/"), `${route} must be canonical`);
    assert.ok((await readFile(file, "utf8")).length > 0, `${file} must exist`);
  }
});

test("the helper exports the exact root Twitter preservation contract", async () => {
  const helper = await readFile("lib/seo/page-metadata.ts", "utf8");
  assert.match(helper, /export const PRESERVED_ROOT_TWITTER_METADATA/);
  assert.match(helper, /card:\s*["']summary["']/);
  assert.match(helper, /title:\s*["']Custom Teamwear & Sports Uniforms Manufacturer \| POXIOL["']/);
  assert.match(
    helper,
    /description:\s*["']Custom basketball, soccer and baseball uniforms for clubs, schools, youth programs, sports brands and distributors\.["']/,
  );
});

test("all and only the 19 Stage 2 route sources adopt the helper and preserved Twitter", async () => {
  const targetFiles = new Set(TARGETS.map(([, file]) => file));
  for (const [, file] of TARGETS) {
    const source = await readFile(file, "utf8");
    assert.match(source, /createPageMetadata/, `${file} must consume createPageMetadata`);
    assert.match(
      source,
      /PRESERVED_ROOT_TWITTER_METADATA/,
      `${file} must preserve the rendered root Twitter contract`,
    );
    assert.match(source, /twitter:\s*PRESERVED_ROOT_TWITTER_METADATA/);
  }

  for (const file of await pageFiles("app")) {
    const source = await readFile(file, "utf8");
    if (!targetFiles.has(file)) {
      assert.doesNotMatch(
        source,
        /PRESERVED_ROOT_TWITTER_METADATA/,
        `${file} is outside the approved Stage 2 migration`,
      );
    }
  }

  for (const file of ["app/layout.tsx", "app/[slug]/page.tsx"]) {
    assert.doesNotMatch(await readFile(file, "utf8"), /PRESERVED_ROOT_TWITTER_METADATA/);
  }
});

test("legal and CMS-backed routes preserve fail-closed robots behavior", async () => {
  for (const [, file, kind] of TARGETS) {
    const source = await readFile(file, "utf8");
    if (kind === "legal") {
      assert.match(source, /\.\.\.legalPolicyMetadata\(\)/, `${file} must preserve legal robots`);
    }
    if (kind === "cms") {
      assert.match(source, /if\s*\(!pageData\)\s*return\s*\{\s*\}/, `${file} must preserve missing-page metadata`);
      assert.match(
        source,
        /robots:\s*pageData\.noIndex\s*\?\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}\s*:\s*undefined/,
        `${file} must preserve CMS noindex behavior`,
      );
      assert.match(source, /title:\s*pageData\.metaTitle/);
      assert.match(source, /description:\s*pageData\.metaDescription/);
    }
  }
});
