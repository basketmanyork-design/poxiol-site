import assert from 'node:assert/strict'
import {validateManifest, approvalSummary} from './validate-real-production-assets.mts'
import type {RealProductionAsset} from '../lib/real-production/types.ts'

const approved: RealProductionAsset = {
  assetId:'approved-front', sampleId:'POXIOL-RP-TEST', sourceId:'POXIOL-SOURCE-TEST-FRONT',
  view:'FRONT', completenessGrade:'A', filename:'approved-front.webp', source:'Original POXIOL studio photograph', photographerOrOwner:'POXIOL',
  productRelationship:'POXIOL-owned sample', verificationStatus:'VERIFIED_POXIOL', publicUseApproved:true,
  peopleVisible:false, peopleAuthorization:'NOT_APPLICABLE', thirdPartyLogoVisible:false, thirdPartyLogoAuthorization:'NOT_APPLICABLE',
  customerArtworkVisible:false, customerArtworkAuthorization:'NOT_APPLICABLE', privateInformationVisible:false,
  sport:'basketball', category:'front', evidenceContext:'product', alt:'Front of a finished basketball uniform sample',
  caption:'Finished basketball sample shown from the front.', intendedPages:['basketball'], verificationNote:'Approved original.',
  verifiedAt:'2026-08-14', verifiedBy:'POXIOL content owner', publicPath:'/real-production/approved-front.webp', width:1200, height:800,
}

assert.deepEqual(validateManifest({version:1, assets:[]}), {total:0, publishable:0, blocked:0, issues:[]})
const unsafe = validateManifest({version:1, assets:[{...approved, privateInformationVisible:true}]}, {checkFiles:false})
assert.equal(unsafe.publishable, 0)
assert.equal(unsafe.blocked, 1)
assert.match(unsafe.issues[0].issues.join(','), /private-information/)
const valid = validateManifest({version:1, assets:[approved]}, {checkFiles:false})
assert.equal(valid.publishable, 1)
const missingFile = validateManifest({version:1, assets:[approved]})
assert.match(missingFile.issues[0].issues.join(','), /missing-public-file/)
const duplicate = validateManifest({version:1, assets:[approved, approved]}, {checkFiles:false})
assert.match(duplicate.issues.flatMap((item)=>item.issues).join(','), /duplicate-asset-id/)
assert.match(approvalSummary({version:1, assets:[approved]}, {checkFiles:false}), /approved-front/)
assert.match(approvalSummary({version:1, assets:[]}), /Verified asset count: 0/)

const gitignore = (await import('node:fs')).readFileSync('.gitignore', 'utf8')
assert.match(gitignore, /content\/real-production\/inbox\/\*/)
assert.match(gitignore, /content\/real-production\/approved\/\*/)
assert.match(gitignore, /content\/real-production\/rejected\/\*/)

console.log('Real Production workflow checks passed')
