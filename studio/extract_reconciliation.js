const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "tmp", "cms-migration-dry-run-first.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
console.log(JSON.stringify(data.reconciliation, null, 2));
