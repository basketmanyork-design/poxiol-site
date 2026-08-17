import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const procurementStandards = defineType({
  name: 'procurementStandards',
  title: 'Procurement Standards',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'quantityPolicy', title: 'Order quantity truth policy', type: 'claimPolicy'}),
    defineField({name: 'sampleTimingPolicy', title: 'Sample timing truth policy', type: 'claimPolicy'}),
    defineField({name: 'productionTimingPolicy', title: 'Production timing truth policy', type: 'claimPolicy'}),
    defineField({name: 'mockupTimingPolicy', title: 'Mockup timing truth policy', type: 'claimPolicy'}),
    defineField({name: 'shippingTimingPolicy', title: 'Shipping timing truth policy', type: 'claimPolicy'}),
    defineField({name: 'measurementTolerancePolicy', title: 'Measurement tolerance truth policy', type: 'claimPolicy'}),
    defineField({name: 'returnPolicyStatus', title: 'Return policy status', type: 'string', options: {list: [{title: 'Policy review required', value: 'POLICY_REVIEW_REQUIRED'}, {title: 'Owner approved', value: 'OWNER_APPROVED'}]}, initialValue: 'POLICY_REVIEW_REQUIRED'}),
    defineField({name: 'defaultMOQ', title: 'Default MOQ', type: 'string', initialValue: 'Order quantity confirmed according to product and project requirements'}),
    defineField({name: 'sampleMOQ', title: 'Sample MOQ', type: 'string', initialValue: 'Confirmed during project consultation'}),
    defineField({name: 'sampleTime', title: 'Legacy sample time compatibility', type: 'string', initialValue: 'Sample timing confirmed after design, material and project review'}),
    defineField({name: 'sampleProductionTime', title: 'Sample production time', type: 'string', initialValue: 'Confirmed after design, material and project review'}),
    defineField({name: 'bulkProductionTime', title: 'Bulk production time', type: 'string', initialValue: 'Confirmed after quantity, size breakdown, customization and approvals'}),
    defineField({name: 'bulkProductionNote', title: 'Bulk production note', type: 'text', rows: 2, initialValue: 'Large, complex or peak-season orders require a confirmed production schedule.'}),
    defineField({name: 'mockupTime', title: 'Mockup time', type: 'string', initialValue: 'Confirmed after receiving the project brief, logo, colors and reference files.'}),
    defineField({name: 'shippingNotes', title: 'Shipping notes', type: 'text', rows: 3}),
    defineField({name: 'qcStandard', title: 'Quality control standard', type: 'string', initialValue: 'Inspection before shipment'}),
    defineField({name: 'sizeTolerance', title: 'Legacy size tolerance', type: 'string', description: 'Historical compatibility field. Do not use it as a return-policy rule.'}),
    defineField({name: 'mixedSizes', title: 'Mixed sizes', type: 'string', initialValue: 'Mixed adult and youth sizes are supported'}),
    defineField({name: 'customizationStandard', title: 'Customization standard', type: 'text', rows: 3, initialValue: 'Custom team name, player name, number, logo, sponsor artwork and private label options are supported when the buyer owns or is authorized to use the artwork.'}),
    defineField({name: 'qualityPromise', title: 'Quality wording', type: 'text', rows: 3}),
  ],
})
