import {defineField, defineType} from 'sanity'

// ============================================================
// 可复用对象：出版物状态
// ============================================================
export const publishStatus = defineType({
  name: 'publishStatus',
  title: '发布状态',
  type: 'string',
  options: {
    list: [
      {title: '草稿 (Draft)', value: 'draft'},
      {title: '已发布 (Published)', value: 'published'},
      {title: '已下架 (Unpublished)', value: 'unpublished'},
    ],
    layout: 'radio',
  },
  initialValue: 'draft',
})

// ============================================================
// 可复用对象：CTA 按钮
// ============================================================
export const callToAction = defineType({
  name: 'callToAction',
  title: '行动号召 (CTA)',
  type: 'object',
  fields: [
    defineField({name: 'label', title: '按钮文案', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'url', title: '链接地址', type: 'url', validation: (R) => R.required()}),
    defineField({name: 'style', title: '样式', type: 'string', options: {list: [{title: '主要 (绿底)', value: 'primary'}, {title: '次要 (边框)', value: 'secondary'}], layout: 'radio'}, initialValue: 'primary'}),
  ],
})

// ============================================================
// 可复用对象：内部链接
// ============================================================
export const internalLink = defineType({
  name: 'internalLink',
  title: '内部链接',
  type: 'object',
  fields: [
    defineField({name: 'label', title: '链接文案', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'page', title: '目标页面', type: 'reference', to: [{type: 'sitePage'}, {type: 'productCategory'}, {type: 'product'}, {type: 'article'}]}),
  ],
  preview: {select: {title: 'label'}},
})

// ============================================================
// 可复用对象：FAQ 引用
// ============================================================
export const faqReference = defineType({
  name: 'faqReference',
  title: 'FAQ 引用',
  type: 'object',
  fields: [
    defineField({name: 'faq', title: '选择 FAQ', type: 'reference', to: [{type: 'faqItem'}], validation: (R) => R.required()}),
    defineField({name: 'displayOrder', title: '排序', type: 'number', initialValue: 0}),
  ],
  preview: {select: {title: 'faq.question'}},
})

// ============================================================
// 可复用对象：关联内容
// ============================================================
export const relatedContent = defineType({
  name: 'relatedContent',
  title: '关联内容',
  type: 'object',
  fields: [
    defineField({name: 'title', title: '模块标题', type: 'string'}),
    defineField({name: 'guides', title: '关联指南', type: 'array', of: [{type: 'reference', to: [{type: 'article'}]}]}),
    defineField({name: 'products', title: '关联产品', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}]}),
    defineField({name: 'caseStudies', title: '关联案例', type: 'array', of: [{type: 'reference', to: [{type: 'caseStudy'}]}]}),
  ],
})

// ============================================================
// 可复用对象：采购参数覆写
// ============================================================
export const procurementOverride = defineType({
  name: 'procurementOverride',
  title: '采购参数覆写',
  type: 'object',
  description: '仅在该产品参数确实与全局标准不同时使用。',
  fields: [
    defineField({name: 'overrideMOQ', title: '覆写起订量', type: 'boolean', initialValue: false}),
    defineField({name: 'overriddenMOQ', title: '自定义起订量', type: 'string', hidden: ({parent}) => !parent?.overrideMOQ}),
    defineField({name: 'overrideSampleTime', title: '覆写样品时间', type: 'boolean', initialValue: false}),
    defineField({name: 'overriddenSampleTime', title: '自定义样品时间', type: 'string', hidden: ({parent}) => !parent?.overrideSampleTime}),
    defineField({name: 'overrideReason', title: '覆写原因（必填）', type: 'text', rows: 2, hidden: ({parent}) => !parent?.overrideMOQ && !parent?.overrideSampleTime}),
  ],
})
