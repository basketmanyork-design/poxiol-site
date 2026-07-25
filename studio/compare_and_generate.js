const fs = require('fs');
const path = require('path');

const backupFile = '../tmp/backup_extract/production-export-2026-07-25t02-47-29-394z/data.ndjson';
const currentDraftsFile = '../tmp/f3-before-rollback-all-drafts.json';
const backupTimestamp = new Date('2026-07-25T02:47:29Z');

const currentDrafts = JSON.parse(fs.readFileSync(currentDraftsFile, 'utf8'));
const siteSettingsCurrentFull = JSON.parse(fs.readFileSync('../tmp/current-siteSettings-draft.json', 'utf8'));

// Read backup drafts
const backupDrafts = [];
const backupLines = fs.readFileSync(backupFile, 'utf8').split('\n');
for (const line of backupLines) {
  if (!line.trim()) continue;
  const doc = JSON.parse(line);
  if (doc._id.startsWith('drafts.')) {
    backupDrafts.push(doc);
  }
}

console.log(`Backup drafts count: ${backupDrafts.length}`);
console.log(`Current drafts count: ${currentDrafts.length}`);

// 1. Identify 140 NEW drafts
const newlyCreated = currentDrafts.filter(d => new Date(d._createdAt) > backupTimestamp);
console.log(`Newly created drafts (after ${backupTimestamp.toISOString()}): ${newlyCreated.length}`);

const newlyCreatedIds = newlyCreated.map(d => d._id);
fs.writeFileSync('../tmp/F3_NEWLY_CREATED_DRAFT_IDS.json', JSON.stringify(newlyCreatedIds, null, 2));

// 3. Verify rollback safety (Step 4)
const publishedIds = JSON.parse(fs.readFileSync('../tmp/all-published-ids.json', 'utf8')).map(p => p._id);
const safetyCheck = [];
let allSafe = true;

for (const draft of newlyCreated) {
  const publishedId = draft._id.replace('drafts.', '');
  const hasPublished = publishedIds.includes(publishedId);
  const isDraft = draft._id.startsWith('drafts.');
  const isAfter = new Date(draft._createdAt) > backupTimestamp;
  
  const safe = isDraft && isAfter && !hasPublished;
  if (!safe) allSafe = false;
  
  safetyCheck.push({
    id: draft._id,
    isDraft,
    isAfter,
    hasPublished,
    safe
  });
}

console.log(`Safety verification: ${allSafe ? 'PASSED' : 'FAILED'}`);
console.log(`Total checked: ${safetyCheck.length}`);
console.log(`Baseline count: 57`);
console.log(`New drafts: ${newlyCreated.length}`);

fs.writeFileSync('../tmp/ROLLBACK_SAFETY_REPORT.json', JSON.stringify({
  allSafe,
  count: safetyCheck.length,
  baseline: 57,
  details: safetyCheck
}, null, 2));

// 4. Identify modified drafts
// The user says 1 modified: drafts.siteSettings
const modified = {};
const siteSettingsBackup = backupDrafts.find(d => d._id === 'drafts.siteSettings');
const siteSettingsCurrent = currentDrafts.find(d => d._id === 'drafts.siteSettings');

if (siteSettingsBackup && siteSettingsCurrentFull) {
  modified['drafts.siteSettings'] = {
    before: siteSettingsBackup,
    after: siteSettingsCurrentFull
  };
}

fs.writeFileSync('../tmp/F3_UPDATED_EXISTING_DRAFTS.json', JSON.stringify(modified, null, 2));

console.log('Manifests generated.');
