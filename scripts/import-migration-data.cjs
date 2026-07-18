const fs = require('fs');

async function run() {
  const isConfirmed = process.argv.includes('--confirm-drafts-only');
  const dataset = process.argv.find(a => a.startsWith('--confirm-dataset='))?.split('=')[1];
  
  if (!isConfirmed || dataset !== 'production') {
    console.error('Error: SAFETY LOCK. You must provide --confirm-drafts-only and --confirm-dataset=production.');
    console.error('This script is intentionally locked to prevent unauthorized Stage C1 import.');
    process.exit(1);
  }

  const inputPath = process.argv.find(a => a.startsWith('--input='))?.split('=')[1];
  if (!inputPath || !fs.existsSync(inputPath)) {
    console.error('Error: Input NDJSON file not found.');
    process.exit(1);
  }

  console.log('--- READY FOR SANITY IMPORT ---');
  console.log('NOTE: Actual import requires "sanity dataset import" command.');
  console.log('To execute, run: npx sanity dataset import ' + inputPath + ' production');
}

run().catch(console.error);
