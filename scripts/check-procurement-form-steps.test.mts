import assert from 'node:assert/strict'
import test from 'node:test'
import {
  PROCUREMENT_FORM_STEPS,
  errorsForProcurementStep,
  firstValidationSection,
} from '../lib/procurement-form-steps.ts'
import {validateProcurementFields, type ProcurementFields} from '../lib/procurement-inquiry.ts'

const valid: ProcurementFields = {
  fullName: 'Test Buyer',
  buyerRole: 'Team / School / Club',
  company: 'Test Club',
  email: 'buyer@example.invalid',
  whatsapp: '',
  products: [{product: 'Basketball Uniforms', quantity: '25', unit: 'sets'}],
  requiredDeliveryDate: '2026-10-20',
  deliveryCountry: 'US',
  deliveryPostalCode: '02108',
  postalNotApplicable: false,
  additionalDetails: '',
}

test('defines the exact ordered three-step contract', () => {
  assert.deepEqual(PROCUREMENT_FORM_STEPS, [
    {id: 'products', title: 'Products'},
    {id: 'delivery', title: 'Delivery'},
    {id: 'contact', title: 'Contact'},
  ])
})

test('filters dynamic and fixed errors into their visible step', () => {
  const errors = {
    products: 'products',
    'product-0': 'product',
    'quantity-0': 'quantity',
    'unit-0': 'unit',
    additionalDetails: 'details',
    file: 'file',
    requiredDeliveryDate: 'date',
    deliveryCountry: 'country',
    deliveryPostalCode: 'postal',
    fullName: 'name',
    contact: 'contact',
    email: 'email',
    whatsapp: 'whatsapp',
  }
  assert.deepEqual(Object.keys(errorsForProcurementStep(errors, 'products')), [
    'products', 'product-0', 'quantity-0', 'unit-0', 'additionalDetails', 'file',
  ])
  assert.deepEqual(Object.keys(errorsForProcurementStep(errors, 'delivery')), [
    'requiredDeliveryDate', 'deliveryCountry', 'deliveryPostalCode',
  ])
  assert.deepEqual(Object.keys(errorsForProcurementStep(errors, 'contact')), [
    'fullName', 'contact', 'email', 'whatsapp',
  ])
})

test('the existing validator respects the no-postal declaration', () => {
  assert.equal(validateProcurementFields({...valid, postalNotApplicable: true, deliveryPostalCode: ''}, '2026-09-28').deliveryPostalCode, undefined)
  const errors = validateProcurementFields({...valid, postalNotApplicable: false, deliveryPostalCode: ''}, '2026-09-28')
  assert.equal(firstValidationSection(errors), 'delivery')
})

test('classifies only governed validation sections', () => {
  assert.equal(firstValidationSection({'product-2': 'required'}), 'products')
  assert.equal(firstValidationSection({requiredDeliveryDate: 'required'}), 'delivery')
  assert.equal(firstValidationSection({email: 'invalid'}), 'contact')
  assert.equal(firstValidationSection({file: 'invalid'}), 'file')
  assert.equal(firstValidationSection({unexpected: 'invalid'}), 'form')
  assert.equal(firstValidationSection({}), 'form')
})
