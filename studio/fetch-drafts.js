const h = {'Authorization': 'Bearer sk6WtvHPmkZRABzQt3PbBWO2eq6FICoEloPuy5ieC3b0Y7G7H6nYnlTg9rEbStknElTTFooWR1FQ82dk0'};
fetch('https://oqpv1xbc.api.sanity.io/v2023-08-01/data/query/production?query=*%5B_id+in+path(%22drafts.**%22)%5D%7B_id%2C_type%2C_createdAt%2C_rev%7D',{headers:h})
.then(r=>r.json()).then(d=>{
  if (d.error) throw new Error(JSON.stringify(d.error));
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, '..', 'tmp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'all-drafts.json'), JSON.stringify(d.result, null, 2));
  console.log('Saved ' + d.result.length + ' drafts to tmp/all-drafts.json');
}).catch(e=>console.error(e))
