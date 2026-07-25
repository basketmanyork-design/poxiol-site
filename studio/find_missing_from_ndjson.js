const fs = require("fs");
const readline = require("readline");
const path = require("path");

async function run() {
    const candPath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run", "candidates.ndjson");
    const docPath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run", "documents.ndjson");
    
    const docIds = new Set();
    const docStream = fs.createReadStream(docPath);
    const rlDoc = readline.createInterface({ input: docStream, crlfDelay: Infinity });
    for await (const line of rlDoc) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);
        docIds.add(doc._id);
    }

    const missing = [];
    const candStream = fs.createReadStream(candPath);
    const rlCand = readline.createInterface({ input: candStream, crlfDelay: Infinity });
    for await (const line of rlCand) {
        if (!line.trim()) continue;
        const cand = JSON.parse(line);
        // Try both possible ID formats
        if (!docIds.has(cand.sanityDocumentId) && !docIds.has(cand.candidateKey)) {
            missing.push(cand);
        }
    }
    console.log(JSON.stringify(missing, null, 2));
}
run();
