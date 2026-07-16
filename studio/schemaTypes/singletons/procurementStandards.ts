import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const procurementStandards = defineType({
  name: 'procurementStandards',
  title: '采购参数标准',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'minimumSampleMOQ',
      title: '最低样品起订量 (Sample MOQ)',
      type: 'string',
      initialValue: '1 Set',
      description: '例如: 1 Set',
    }),
    defineField({
      name: 'sampleProductionTime',
      title: '样品生产周期',
      type: 'string',
      initialValue: 'Sample Production: 2–3 Days After Mockup Confirmation',
      description: '统一术语口径。修改此项将影响全站。',
    }),
    defineField({
      name: 'expressDeliveryTime',
      title: '快递物流时效',
      type: 'string',
      initialValue: 'Express international delivery usually takes 3–7 business days depending on country.',
    }),
    defineField({
      name: 'sizeTolerance',
      title: '尺码公差说明',
      type: 'string',
      initialValue: 'Please allow ±2 cm tolerance, which is not a reason for returns.',
    }),
    defineField({
      name: 'mockupPolicy',
      title: '打样政策',
      type: 'text',
      initialValue: 'Free 3D Mockup design in 1-2 hours.',
    }),
  ],
})
