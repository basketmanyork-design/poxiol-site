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
    defineField({
      name: 'sampleMinimumOrderQuantity',
      title: 'Sample minimum order quantity',
      type: 'number',
      initialValue: 1,
      description: 'Sample MOQ only. This does not represent the MOQ for all bulk orders.',
      validation: positiveInteger,
    }),
    defineField({
      name: 'sampleQuantityUnit',
      title: 'Sample quantity unit',
      type: 'string',
      initialValue: 'set',
      options: {list: ['set', 'piece']},
      validation: Rule => Rule.required(),
    }),
    defineField({name: 'sampleLeadTimeMinWorkingDays', title: 'Sample lead time minimum (working days)', type: 'number', initialValue: 2, validation: positiveInteger}),
    defineField({
      name: 'sampleLeadTimeMaxWorkingDays',
      title: 'Sample lead time maximum (working days)',
      type: 'number',
      initialValue: 3,
      validation: Rule => Rule.required().integer().min(1).min(Rule.valueOfField('sampleLeadTimeMinWorkingDays')),
    }),
    defineField({name: 'bulkLeadTimeMinWorkingDays', title: 'Bulk lead time minimum (working days)', type: 'number', initialValue: 7, validation: positiveInteger}),
    defineField({
      name: 'bulkLeadTimeMaxWorkingDays',
      title: 'Bulk lead time maximum (working days)',
      type: 'number',
      initialValue: 12,
      validation: Rule => Rule.required().integer().min(1).min(Rule.valueOfField('bulkLeadTimeMinWorkingDays')),
    }),
    defineField({
      name: 'defaultMOQ',
      title: 'Default MOQ',
      type: 'string',
      initialValue: 'Sample MOQ: 1 set for design and quality confirmation. Bulk-order MOQ depends on product type, quantity, fabric, customization and packaging requirements.',
    }),
    defineField({name: 'sampleMOQ', title: 'Sample MOQ', type: 'string', initialValue: '1 set for design and quality confirmation'}),
    defineField({name: 'sampleTime', title: 'Legacy sample time compatibility', type: 'string', initialValue: '2–3 working days after mockup approval'}),
    defineField({name: 'sampleProductionTime', title: 'Sample production time', type: 'string', initialValue: '2–3 working days after mockup approval'}),
    defineField({name: 'bulkProductionTime', title: 'Bulk production time', type: 'string', initialValue: '7–12 working days after sample or artwork approval'}),
    defineField({name: 'bulkProductionNote', title: 'Bulk production note', type: 'text', rows: 2, initialValue: 'Large, complex or peak-season orders require a confirmed production schedule.'}),
    defineField({name: 'mockupTime', title: 'Mockup time', type: 'string', initialValue: 'Usually within 2 hours after receiving complete project requirements.'}),
    defineField({name: 'shippingNotes', title: 'Shipping notes', type: 'text', rows: 3}),
    defineField({name: 'qcStandard', title: 'Quality control standard', type: 'string', initialValue: 'QC is completed before shipment.'}),
    defineField({name: 'sizeTolerance', title: 'Size tolerance', type: 'string', initialValue: '±2 cm'}),
    defineField({name: 'mixedSizes', title: 'Mixed sizes', type: 'string', initialValue: 'Mixed sizes are supported.'}),
    defineField({name: 'customizationStandard', title: 'Customization standard', type: 'text', rows: 3, initialValue: 'Custom team name, player name, number, logo, sponsor artwork and private label options are supported when the buyer owns or is authorized to use the artwork.'}),
    defineField({name: 'qualityPromise', title: 'Quality wording', type: 'text', rows: 3}),
  ],
})
