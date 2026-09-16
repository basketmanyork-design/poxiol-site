import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createProcurementFormData,validateProcurementFields,type ProcurementFields} from '../lib/procurement-inquiry.ts'
import {ProjectInquiryRequestError,sendProjectInquiry} from '../lib/project-inquiry-request.ts'

const base:ProcurementFields={fullName:'Test Buyer',buyerRole:'Team / School / Club',company:'TEST Club',email:'buyer@example.invalid',whatsapp:'',products:[{product:'Soccer Uniforms',quantity:'25',unit:'sets'}],requiredDeliveryDate:'2026-10-20',deliveryCountry:'US',deliveryPostalCode:'02108',postalNotApplicable:false,additionalDetails:''}
const today='2026-09-15'

test('optional narrative and attachment are not required for a purchasing inquiry',()=>{
  assert.deepEqual(validateProcurementFields(base,today),{})
  const data=createProcurementFormData(base,{intent:'mockup',formType:'TEST',sourcePage:'/free-mockup/',submissionKey:'test-key'})
  assert.equal(data.get('additional_details'),null)
  assert.equal(data.get('delivery_postal_code'),'02108')
  assert.equal(data.get('required_delivery_date'),'2026-10-20')
})
test('email-only and WhatsApp-only submissions both validate; neither contact fails',()=>{
  assert.deepEqual(validateProcurementFields({...base,email:'',whatsapp:'+447700900000'},today),{})
  assert.ok(validateProcurementFields({...base,email:'',whatsapp:''},today).contact)
})
test('exact quantity, in-hand date, country and postal code are required',()=>{
  const errors=validateProcurementFields({...base,products:[{product:'Soccer Uniforms',quantity:'',unit:'sets'}],requiredDeliveryDate:'',deliveryCountry:'',deliveryPostalCode:''},today)
  for(const key of ['quantity-0','requiredDeliveryDate','deliveryCountry','deliveryPostalCode']) assert.ok(errors[key],key)
  assert.ok(validateProcurementFields({...base,requiredDeliveryDate:'2026-02-29'},today).requiredDeliveryDate)
})
test('explicit no-postal-code choice preserves status; edited product is the current purchase',()=>{
  const data=createProcurementFormData({...base,products:[{product:'Warm-Up Wear',quantity:'12',unit:'pieces'}],postalNotApplicable:true,deliveryPostalCode:''},{intent:'quote',formType:'TEST',sourcePage:'/get-quote/',originPage:'/products/soccer-jerseys/',entryProduct:'Soccer Uniforms',submissionKey:'test-key'})
  assert.equal(data.get('postal_code_status'),'not_applicable')
  assert.equal(data.get('requested_product'),'Warm-Up Wear')
  assert.equal(data.get('entry_product_reference'),'Soccer Uniforms')
  assert.equal(data.get('originPage'),'/products/soccer-jerseys/')
  assert.deepEqual(JSON.parse(String(data.get('products'))),[{product:'Warm-Up Wear',quantity:12,unit:'pieces'}])
})
test('a 2xx error body or missing acceptance does not create a success',async()=>{
  for(const payload of [{ok:false,errors:[{message:'bad'}]},{}]){
    await assert.rejects(sendProjectInquiry('https://example.invalid',new FormData(),async()=>new Response(JSON.stringify(payload),{status:200})),(error:unknown)=>error instanceof ProjectInquiryRequestError && error.unconfirmed)
  }
  const accepted=await sendProjectInquiry('https://example.invalid',new FormData(),async()=>new Response(JSON.stringify({ok:true,id:'server_abc12345'}),{status:200}))
  assert.equal(accepted.reference,'server_abc12345')
})
