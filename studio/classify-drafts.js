const fs = require('fs');
const path = require('path');

const draftsFile = path.join(__dirname, '..', 'tmp', 'all-drafts.json');
const drafts = JSON.parse(fs.readFileSync(draftsFile, 'utf8'));
const backupTime = new Date('2026-07-25T10:47:19.000Z').getTime();

const classification = [];
const createdIds = [];
const updatedIds = [];
const unchangedIds = [];

const singletons = ['siteSettings', 'procurementStandards'];

drafts.forEach(d => {
  const createdAt = new Date(d._createdAt).getTime();
  const category = createdAt > backupTime ? 'F3_V2_CREATED' : 'BASELINE';
  
  classification.push({
    _id: d._id,
    _type: d._type,
    _createdAt: d._createdAt,
    category
  });

  if (category === 'F3_V2_CREATED') {
    createdIds.push(d._id);
  } else {
    // BASELINE
    if (singletons.includes(d._type)) {
      updatedIds.push(d._id);
    } else {
      unchangedIds.push(d._id);
    }
  }
});

fs.writeFileSync(path.join(__dirname, '..', 'tmp', 'f3v2-classification.json'), JSON.stringify(classification, null, 2));
fs.writeFileSync(path.join(__dirname, '..', 'tmp', 'F3V2_ROLLBACK_CREATED_IDS.json'), JSON.stringify(createdIds, null, 2));
fs.writeFileSync(path.join(__dirname, '..', 'tmp', 'F3V2_ROLLBACK_UPDATED_IDS.json'), JSON.stringify(updatedIds, null, 2));
fs.writeFileSync(path.join(__dirname, '..', 'tmp', 'F3V2_ROLLBACK_UNCHANGED_IDS.json'), JSON.stringify(unchangedIds, null, 2));

console.log('Classification Summary:');
console.log('- F3_V2_CREATED: ' + createdIds.length);
console.log('- BASELINE (Updated Singletons): ' + updatedIds.length);
console.log('- BASELINE (Unchanged): ' + unchangedIds.length);
console.log('Total: ' + drafts.length);
