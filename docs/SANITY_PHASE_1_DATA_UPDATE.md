# Sanity Phase 1 — Procurement Standards Data Update

## 1. Confirm Configuration
- Project ID: `oqpv1xbc`
- Dataset: `production`
- Document ID: `drafts.procurementStandards` / `procurementStandards`
- Verify: `npx sanity query "count(*[_id == 'drafts.procurementStandards'])" --project oqpv1xbc --dataset production`

## 2. Backup Current Document
```bash
npx sanity query "*[_id == 'drafts.procurementStandards'][0]" --project oqpv1xbc --dataset production > backup-procurement-$(date +%Y%m%d).json
```

## 3. Current Fields (before)
| Field | Current Value |
|-------|---------------|
| mockupTime | Free 3D Mockup |
| sampleTime | 2-3 Days After Mockup Confirmation |
| bulkProductionTime | 15-25 Days Depending on Order Size |

## 4. Target Fields (after)
Replace all with:

```json
{
  "mockupTime": "Free mockup usually within 2 hours after receiving complete project requirements.",
  "mockupTimeNote": "Complex designs or incomplete files may require additional time.",
  "sampleMOQ": "MOQ 1 set for sample development.",
  "sampleProductionTime": "Sample production usually takes 2–3 working days after mockup approval.",
  "bulkProductionTime": "Bulk production usually takes 7–12 working days after sample or artwork approval.",
  "bulkProductionNote": "Large, complex or peak-season orders require a confirmed production schedule.",
  "qcStandard": "Quality control inspection before shipment.",
  "sizeTolerance": "Normal finished-garment measurement tolerance: ±2 cm.",
  "mixedSizes": "Mixed adult and youth sizes are supported.",
  "customizationNotice": "Custom team name, player name, number, logo, sponsor artwork and private label options are supported when the buyer owns or is authorized to use the artwork.",
  "shippingTimeNote": "3–7 business days depending on country.",
  "lastUpdated": "2026-07-27"
}
```

## 5. Dry Run
```bash
python -c "
import json
current = json.loads(open('backup-procurement-2026*.json').read())
patch = {...}  # target fields above
print('Current:', json.dumps({k:current.get(k) for k in patch}, indent=2))
print('New:', json.dumps(patch, indent=2))
print('No changes have been made.')
"
```

## 6. Apply
```bash
python -c "
import json, urllib.request
T='your-token-here'
MUT='https://oqpv1xbc.api.sanity.io/v2021-10-21/data/mutate/production'
patch = {...}
data = json.dumps({'mutations':[{'patch':{'id':'drafts.procurementStandards','set':patch}}]}).encode()
r = urllib.request.Request(MUT, data=data, method='POST')
r.add_header('Authorization', 'Bearer '+T); r.add_header('Content-Type', 'application/json')
resp = urllib.request.urlopen(r, timeout=15)
print(json.loads(resp.read()))
"
```

## 7. Publish
After updating the draft, publish the document to make changes live.

## 8. Rollback
```bash
python -c "
# Read backup and restore
backup = json.loads(open('backup-procurement-*.json').read())
patch = {k: backup.get(k) for k in [...existing fields...]}
# Apply patch in reverse
"
```

## 9. Verify
```bash
npx sanity query "*[_id == 'procurementStandards'][0]{mockupTime, sampleMOQ, bulkProductionTime}" --project oqpv1xbc --dataset production
```

Verify on www.poxiol.com that procurement parameters display correctly.
