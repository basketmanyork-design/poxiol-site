const fs = require("fs");
const readline = require("readline");
const path = require("path");

async function find() {
    const filePath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run", "candidates.ndjson");
    if (!fs.existsSync(filePath)) {
        console.log("candidates.ndjson not found at " + filePath);
        return;
    }
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    for await (const line of rl) {
        if (!line.trim()) continue;
        const cand = JSON.parse(line);
        if (cand.action === "reuse") {
            console.log(JSON.stringify(cand, null, 2));
        }
    }
}
find();
