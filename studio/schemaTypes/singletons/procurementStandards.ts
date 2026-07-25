import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const procurementStandards = defineType({
  name: 'procurementStandards',
  title: 'Procurement Standards',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'defaultMOQ', title: 'Default MOQ', type: 'string', initialValue: 'MOQ 1 set supported'}),
    defineField({name: 'sampleTime', title: 'Sample production time', type: 'string', initialValue: '2-3 days after mockup confirmation'}),
    defineField({name: 'bulkProductionTime', title: 'Bulk production time', type: 'string'}),
    defineField({name: 'mockupTime', title: 'Mockup time', type: 'string'}),
    defineField({name: 'shippingNotes', title: 'Shipping notes', type: 'text', rows: 3}),
    defineField({name: 'qualityPromise', title: 'Quality wording', type: 'text', rows: 3}),
  ],
})
