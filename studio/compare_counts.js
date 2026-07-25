const fs = require("fs");
const path = require("path");

const dryRun = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tmp", "cms-migration-dry-run-first.json"), "utf8"));
const planned = dryRun.plannedDocumentsByType;

const ndjsonPath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run", "documents.ndjson");
const ndjsonLines = fs.readFileSync(ndjsonPath, "utf8").split("\n").filter(l => l.trim());
const ndjsonCounts = {};
ndjsonLines.forEach(line => {
    const doc = JSON.parse(line);
    ndjsonCounts[doc._type] = (ndjsonCounts[doc._type] || 0) + 1;
});

console.log("Planned vs NDJSON:");
for (const type in planned) {
    console.log(`${type}: Planned ${planned[type]}, NDJSON ${ndjsonCounts[type] || 0}`);
}
