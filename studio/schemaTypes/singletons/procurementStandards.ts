import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

const positiveInteger = (Rule: any) => Rule.required().integer().min(1)

export const procurementStandards = defineType({
  name: 'procurementStandards',
  title: 'Procurement Standards',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'capabilityVersion', title: 'Capability contract version', type: 'string', initialValue: '1.0.0', validation: Rule => Rule.required()}),
    defineField({name: 'minimumOrderQuantity', title: 'Minimum order quantity', type: 'number', initialValue: 1, validation: positiveInteger}),
    defineField({name: 'quantityUnit', title: 'Quantity unit', type: 'string', initialValue: 'set', options: {list: ['piece', 'set']}, validation: Rule => Rule.required()}),
    defineField({name: 'sampleLeadTimeMinDays', title: 'Sample lead time minimum (days)', type: 'number', initialValue: 2, validation: positiveInteger}),
    defineField({name: 'sampleLeadTimeMaxDays', title: 'Sample lead time maximum (days)', type: 'number', initialValue: 3, validation: positiveInteger}),
    defineField({name: 'bulkLeadTimeMinDays', title: 'Bulk lead time minimum (days)', type: 'number', initialValue: 7, validation: positiveInteger}),
    defineField({name: 'bulkLeadTimeMaxDays', title: 'Bulk lead time maximum (days)', type: 'number', initialValue: 12, validation: positiveInteger}),
    defineField({name: 'defaultMOQ', title: 'Default MOQ', type: 'string', initialValue: 'MOQ 1 set supported'}),
    defineField({name: 'sampleMOQ', title: 'Sample MOQ', type: 'string', initialValue: '1 set'}),
    defineField({name: 'sampleTime', title: 'Legacy sample time compatibility', type: 'string', initialValue: '2-3 working days after mockup approval'}),
    defineField({name: 'sampleProductionTime', title: 'Sample production time', type: 'string', initialValue: '2-3 working days after mockup approval'}),
    defineField({name: 'bulkProductionTime', title: 'Bulk production time', type: 'string', initialValue: '7-12 working days after sample or artwork approval'}),
    defineField({name: 'bulkProductionNote', title: 'Bulk production note', type: 'text', rows: 2, initialValue: 'Large, complex or peak-season orders require a confirmed production schedule.'}),
    defineField({name: 'mockupTime', title: 'Mockup time', type: 'string', initialValue: 'Usually within 2 hours after receiving complete project requirements.'}),
    defineField({name: 'shippingNotes', title: 'Shipping notes', type: 'text', rows: 3}),
    defineField({name: 'qcStandard', title: 'Quality control standard', type: 'string', initialValue: 'Inspection before shipment'}),
    defineField({name: 'sizeTolerance', title: 'Size tolerance', type: 'string', initialValue: '±2 cm'}),
    defineField({name: 'mixedSizes', title: 'Mixed sizes', type: 'string', initialValue: 'Mixed adult and youth sizes are supported'}),
    defineField({name: 'customizationStandard', title: 'Customization standard', type: 'text', rows: 3, initialValue: 'Custom team name, player name, number, logo, sponsor artwork and private label options are supported when the buyer owns or is authorized to use the artwork.'}),
    defineField({name: 'qualityPromise', title: 'Quality wording', type: 'text', rows: 3}),
  ],
})
