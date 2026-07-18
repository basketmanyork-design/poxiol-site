const fs = require('fs');
const path = require('path');

const RUN_DIR = path.resolve(__dirname, '../migration-output/run-2026-07-17T02-23-36');
const ndjsonPath = path.join(RUN_DIR, 'content-drafts.ndjson');

async function audit() {
  const lines = fs.readFileSync(ndjsonPath, 'utf8').split('\n').filter(l => l.trim());
  const report = {
    totalLines: lines.length,
    validJson: 0,
    drafts: 0,
    published: 0,
    byType: {},
    piiRemaining: 0,
    invalidReferences: 0,
    idSet: new Set(),
    maxIdLength: 0
  };

  const PII_BLACKLIST = ['Delfina', 'Lucia Moniz', 'Henry Martin', 'Tahir Godett', 'David Francois'];

  lines.forEach(line => {
    try {
      const doc = JSON.parse(line);
      report.validJson++;
      
      // 1. Prefix check
      if (doc._id.startsWith('drafts.')) report.drafts++;
      else report.published++;

      // 2. Type check
      report.byType[doc._type] = (report.byType[doc._type] || 0) + 1;

      // 3. ID uniqueness
      report.idSet.add(doc._id);
      if (doc._id.length > report.maxIdLength) report.maxIdLength = doc._id.length;

      // 4. PII physical scan
      PII_BLACKLIST.forEach(name => {
        if (line.includes(name)) report.piiRemaining++;
      });

    } catch (e) {
      console.error('Invalid JSON line:', line);
    }
  });

  console.log(JSON.stringify({
    ...report,
    idSet: report.idSet.size,
    duplicateIds: report.validJson - report.idSet.size
  }, null, 2));
}

audit();
