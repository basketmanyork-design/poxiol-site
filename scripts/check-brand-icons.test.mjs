import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFile(path.join(root, relativePath));
const readText = async (relativePath) => (await read(relativePath)).toString("utf8");

function pngDimensions(buffer) {
  assert.deepEqual(
    [...buffer.subarray(0, 8)],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    "PNG signature must be valid",
  );
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

test("PNG assets use the required square dimensions", async () => {
  const expected = new Map([
    ["public/favicon-48.png", 48],
    ["public/favicon-192.png", 192],
    ["public/favicon-512.png", 512],
    ["public/apple-touch-icon.png", 180],
  ]);

  for (const [relativePath, size] of expected) {
    const dimensions = pngDimensions(await read(relativePath));
    assert.deepEqual(dimensions, { width: size, height: size }, relativePath);
  }
});

test("favicon.ico contains 16, 32 and 48 pixel PNG frames", async () => {
  const ico = await read("public/favicon.ico");
  assert.equal(ico.readUInt16LE(0), 0, "ICO reserved field");
  assert.equal(ico.readUInt16LE(2), 1, "ICO image type");
  assert.equal(ico.readUInt16LE(4), 3, "ICO image count");

  const sizes = [];
  for (let index = 0; index < 3; index += 1) {
    const entry = 6 + (index * 16);
    const width = ico[entry] || 256;
    const height = ico[entry + 1] || 256;
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    assert.equal(width, height, "ICO frames must be square");
    assert.ok(length > 0, "ICO frame must not be empty");
    pngDimensions(ico.subarray(offset, offset + length));
    sizes.push(width);
  }
  assert.deepEqual(sizes, [16, 32, 48]);
});

test("SVG brand mark is self-contained and script-free", async () => {
  const svg = await readText("public/poxiol-logo.svg");
  assert.match(svg, /^<svg[^>]+viewBox="0 0 512 512"/);
  assert.match(svg, /#132329/i);
  assert.match(svg, /#B9F500/i);
  assert.doesNotMatch(svg, /<script|javascript:|<image|(?:xlink:)?href=/i);
});

test("Next metadata points to stable public icon URLs without a data URL favicon", async () => {
  const layout = await readText("app/layout.tsx");
  assert.match(layout, /url:\s*"\/favicon\.ico"/);
  assert.match(layout, /url:\s*"\/favicon-48\.png"/);
  assert.match(layout, /url:\s*"\/apple-touch-icon\.png"/);
  assert.match(layout, /manifest:\s*"\/manifest\.webmanifest"/);
  assert.doesNotMatch(layout, /rel="icon"[^>]+data:image/i);
});

test("web manifest references the 192 and 512 pixel icons", async () => {
  const manifest = await readText("app/manifest.ts");
  assert.match(manifest, /export const dynamic = "force-static"/);
  assert.match(manifest, /src:\s*"\/favicon-192\.png"/);
  assert.match(manifest, /src:\s*"\/favicon-512\.png"/);
  assert.match(manifest, /theme_color:\s*"#132329"/i);
});

test("Organization and Brand schemas use the absolute formal logo URL", async () => {
  const geoSchema = await readText("components/seo/GEOStructuredData.tsx");
  const legacySchema = await readText("components/seo/StructuredData.tsx");
  assert.match(geoSchema, /const brandLogoUrl = `\$\{baseUrl\}\/poxiol-logo\.svg`/);
  assert.equal((geoSchema.match(/"logo": brandLogoUrl/g) || []).length, 2);
  assert.match(legacySchema, /"logo": "https:\/\/www\.poxiol\.com\/poxiol-logo\.svg"/);
});

test("static homepage output exposes crawlable icon links and logo schema", async () => {
  const html = await readText("out/index.html");
  assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest"\/>/);
  assert.match(html, /<link rel="icon" href="\/favicon\.ico" type="image\/x-icon" sizes="16x16 32x32 48x48"\/>/);
  assert.match(html, /<link rel="icon" href="\/favicon-48\.png" type="image\/png" sizes="48x48"\/>/);
  assert.match(html, /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png" type="image\/png" sizes="180x180"\/>/);
  assert.equal((html.match(/"logo":"https:\/\/www\.poxiol\.com\/poxiol-logo\.svg"/g) || []).length, 2);
  assert.doesNotMatch(html, /rel="icon"[^>]+data:image/i);
});
