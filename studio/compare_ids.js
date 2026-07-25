const fs = require("fs");
const path = require("path");

const dryRun = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tmp", "cms-migration-dry-run-first.json"), "utf8"));
const candidateKeys = dryRun.candidateKeys;

const ndjsonPath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run", "documents.ndjson");
const ndjsonLines = fs.readFileSync(ndjsonPath, "utf8").split("\n").filter(l => l.trim());
const ndjsonIds = ndjsonLines.map(line => JSON.parse(line)._id);

console.log("Candidates not in NDJSON:");
candidateKeys.forEach(key => {
    const id = key.split(".")[1]; // This is a guess on how keys map to IDs
    if (!ndjsonIds.includes(id) && !ndjsonIds.includes(key)) {
        console.log(key);
    }
});
