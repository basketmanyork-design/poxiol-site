const fs = require("fs");
const readline = require("readline");
const path = require("path");

async function list() {
    const filePath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run", "documents.ndjson");
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    const ids = [];
    for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);
        if (doc._type === "article") ids.push(doc._id);
    }
    console.log(ids.length);
    console.log(JSON.stringify(ids, null, 2));
}
list();
