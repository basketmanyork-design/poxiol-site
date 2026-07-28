import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("publishes AAO discovery links and avoids unsupported search actions", async () => {
  const [llms, summary, aiPage, sitemap] = await Promise.all([
    readFile("public/llms.txt", "utf8"),
    readFile("public/ai-summary.json", "utf8").then(JSON.parse),
    readFile("out/ai-summary/index.html", "utf8"),
    readFile("out/sitemap.xml", "utf8"),
  ]);

  assert.match(llms, /\/\.well-known\/poxiol-capabilities\.json/);
  assert.match(llms, /\/\.well-known\/poxiol-rfq-schema\.json/);
  assert.equal(summary.automaticCommerce, false);
  assert.equal(summary.humanReviewRequired, true);
  assert.doesNotMatch(aiPage, /SearchAction/);
  assert.match(sitemap, /https:\/\/www\.poxiol\.com\/ai-summary\//);
});
