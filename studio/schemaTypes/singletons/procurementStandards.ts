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
    defineField({name: 'defaultMOQ', title: 'Default MOQ wording', type: 'string', initialValue: 'MOQ 1 set supported'}),
    defineField({name: 'sampleTime', title: 'Sample production wording', type: 'string', initialValue: '2-3 days after mockup confirmation'}),
    defineField({name: 'bulkProductionTime', title: 'Bulk production wording', type: 'string'}),
    defineField({name: 'mockupTime', title: 'Mockup time', type: 'string'}),
    defineField({name: 'shippingNotes', title: 'Shipping notes', type: 'text', rows: 3}),
    defineField({name: 'qualityPromise', title: 'Quality wording', type: 'text', rows: 3}),
  ],
})
