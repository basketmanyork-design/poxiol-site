const fs = require("fs");
const readline = require("readline");
const path = require("path");

async function count() {
    const filePath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run", "documents.ndjson");
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    const counts = {};
    for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);
        counts[doc._type] = (counts[doc._type] || 0) + 1;
    }
    console.log(JSON.stringify(counts, null, 2));
}
count();
