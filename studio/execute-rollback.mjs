import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import path from 'path';

const client = createClient({
  projectId: 'oqpv1xbc',
  dataset: 'production',
  apiVersion: 'v2023-08-01',
  token: process.env.SANITY_AUTH_TOKEN || 'sk6WtvHPmkZRABzQt3PbBWO2eq6FICoEloPuy5ieC3b0Y7G7H6nYnlTg9rEbStknElTTFooWR1FQ82dk0',
  useCdn: false,
});

async function rollback() {
  const tmpDir = '../tmp';
  
  // 1. Delete newly created drafts
  const idsToDelete = JSON.parse(readFileSync(path.join(tmpDir, 'F3_NEWLY_CREATED_DRAFT_IDS.json'), 'utf8'));
  console.log(`Found ${idsToDelete.length} documents to delete.`);
  
  // Delete in batches of 20
  for (let i = 0; i < idsToDelete.length; i += 20) {
    const batch = idsToDelete.slice(i, i + 20);
    const transaction = client.transaction();
    batch.forEach(id => transaction.delete(id));
    await transaction.commit();
    console.log(`Deleted batch ${Math.floor(i/20) + 1}`);
  }

  // 2. Restore siteSettings
  const updatedDocs = JSON.parse(readFileSync(path.join(tmpDir, 'F3_UPDATED_EXISTING_DRAFTS.json'), 'utf8'));
  const siteSettingsBefore = updatedDocs['drafts.siteSettings'].before;
  
  if (siteSettingsBefore) {
    console.log('Restoring drafts.siteSettings...');
    await client.createOrReplace(siteSettingsBefore);
    console.log('Restored drafts.siteSettings successfully.');
  } else {
    console.warn('Could not find backup for siteSettings in F3_UPDATED_EXISTING_DRAFTS.json');
  }
  
  console.log('Rollback complete.');
}

rollback().catch(err => {
  console.error('Rollback failed:', err);
  process.exit(1);
});
