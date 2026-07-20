import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ 知识库',
  type: 'document',
  icon: HelpCircleIcon,
  groups: [
    {name: 'basic', title: '问答内容'},
    {name: 'target', title: '适用对象'},
    {name: 'meta', title: '管理与审核'},
  ],
  fields: [
    defineField({name: 'question', title: '问题', type: 'string', group: 'basic', validation: (R) => R.required()}),
    defineField({name: 'answer', title: '答案', type: 'portableText', group: 'basic', validation: (R) => R.required()}),
    defineField({name: 'category', title: '分类', type: 'string', group: 'basic', options: {list: [
      'Sample','MOQ','Fabric','Sizing','Customization','Name and Number',
      'Private Label','Quality Control','Packaging','Shipping','Payment',
      'Basketball','Soccer','General Sourcing','Technical','B2B Sourcing',
    ]}}),
    defineField({name: 'applicableSports', title: '适用运动', type: 'array', of: [{type: 'string'}], group: 'target'}),
    defineField({name: 'applicableProducts', title: '适用产品', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}], group: 'target'}),
    defineField({name: 'applicablePages', title: '适用页面', type: 'array', of: [{type: 'string'}], group: 'target'}),
    defineField({name: 'keywords', title: '关键词', type: 'array', of: [{type: 'string'}], group: 'meta'}),
    defineField({name: 'sourceOrEvidence', title: '来源/证据', type: 'text', rows: 2, group: 'meta'}),
    defineField({name: 'displayOrder', title: '排序', type: 'number', initialValue: 0, group: 'meta'}),
    defineField({name: 'publishStatus', title: '发布状态', type: 'publishStatus', group: 'meta'}),
    defineField({name: 'lastReviewedAt', title: '最后审核时间', type: 'datetime', group: 'meta'}),
  ],
  orderings: [
    {name: 'order', title: '按排序', by: [{field: 'displayOrder', direction: 'asc'}]},
    {name: 'category', title: '按分类', by: [{field: 'category', direction: 'asc'}]},
  ],
  preview: {select: {title: 'question', subtitle: 'category'}},
  validation: createRiskValidation(['question', 'answer']),
})
