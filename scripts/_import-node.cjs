const {createClient} = require('../studio/node_modules/@sanity/client');
const fs = require('fs');
const path = require('path');

const token = process.env.SANITY_AUTH_TOKEN;
if (!token) { console.error('SANITY_AUTH_TOKEN not set'); process.exit(1); }

const ndjson = 'C:\\Users\\Administrator\\.accio\\accounts\\1750218270\\agents\\DID-F456DA-2B0D4C\\project\\poxiol-static-deploy\\poxiol-cloudflare-static\\migration-output\\run-2026-07-17-03-15-18\\content-drafts.ndjson';
const lines = fs.readFileSync(ndjson, 'utf8').split('\n').filter(l => l.trim());
console.log(`Importing ${lines.length} documents...`);

const client = createClient({ projectId: 'oqpv1xbc', dataset: 'production', token: token.trim(), apiVersion: '2024-01-01', useCdn: false });

let ok = 0, fail = 0;
async function run() {
  for (const line of lines) {
    const doc = JSON.parse(line.trim());
    try {
      await client.createOrReplace(doc);
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok} / ${lines.length}`);
    } catch (e) {
      fail++;
      console.error(`  FAIL: ${doc._id} - ${e.message}`);
      if (fail >= 3) break;
    }
  }
  console.log(`DONE: ${ok} OK, ${fail} FAIL of ${lines.length}`);
}
run().catch(e => { console.error(e); process.exit(1); });
