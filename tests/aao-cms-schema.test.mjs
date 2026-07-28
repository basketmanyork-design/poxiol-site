import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CMS procurement standards expose comparable numeric ranges", async () => {
  const schema = await readFile("studio/schemaTypes/singletons/procurementStandards.ts", "utf8");
  for (const field of [
    "minimumOrderQuantity",
    "sampleLeadTimeMinDays",
    "sampleLeadTimeMaxDays",
    "bulkLeadTimeMinDays",
    "bulkLeadTimeMaxDays",
    "capabilityVersion",
  ]) {
    assert.match(schema, new RegExp(`name: '${field}'`));
  }
  assert.match(schema, /\.min\(1\)/);
});
