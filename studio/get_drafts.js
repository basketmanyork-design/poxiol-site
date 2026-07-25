const fs = require('fs');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oqpv1xbc',
  dataset: 'production',
  token: 'sk6WtvHPmkZRABzQt3PbBWO2eq6FICoEloPuy5ieC3b0Y7G7H6nYnlTg9rEbStknElTTFooWR1FQ82dk0',
  useCdn: false,
  apiVersion: '2024-07-25'
});

async function run() {
  try {
    const drafts = await client.fetch('*[_id in path("drafts.**")]{_id, _type, _createdAt} | order(_createdAt)');
    fs.writeFileSync('../tmp/f3-before-rollback-all-drafts.json', JSON.stringify(drafts, null, 2));
    
    // Fetch all published document IDs
    const publishedIds = await client.fetch('*[!(_id in path("drafts.**"))]{_id}');
    fs.writeFileSync('../tmp/all-published-ids.json', JSON.stringify(publishedIds, null, 2));

    // Fetch full siteSettings draft
    const siteSettings = await client.fetch('*[_id == "drafts.siteSettings"][0]');
    fs.writeFileSync('../tmp/current-siteSettings-draft.json', JSON.stringify(siteSettings, null, 2));

    console.log(`Successfully fetched ${drafts.length} drafts.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
