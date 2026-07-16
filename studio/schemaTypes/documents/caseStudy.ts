import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: '客户案例',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'basic', title: '基本信息'},
    {name: 'buyer', title: '买家信息（注意隐私）'},
    {name: 'project', title: '项目详情'},
    {name: 'result', title: '项目成果'},
    {name: 'media', title: '图片管理'},
    {name: 'relations', title: '关联关系'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---- 基本信息 ----
    defineField({name: 'title', title: '案例标题', type: 'string', group: 'basic', validation: (R) => R.required()}),
    defineField({name: 'slug', title: 'URL Slug', type: 'slug', group: 'basic', options: {source: 'title', maxLength: 60}, validation: (R) => R.required()}),
    // ---- 买家信息 ----
    defineField({name: 'buyerType', title: '买家类型', type: 'string', group: 'buyer'}),
    defineField({name: 'countryOrRegion', title: '国家/地区', type: 'string', group: 'buyer'}),
    defineField({name: 'buyerName', title: '买家名称', type: 'string', group: 'buyer', description: '⚠️ 仅在获得授权后填写真实名称。'}),
    defineField({name: 'buyerNameDisclosure', title: '名称披露方式', type: 'string', group: 'buyer', options: {list: [{title: '隐藏', value: 'hidden'}, {title: '脱敏', value: 'anonymized'}, {title: '公开', value: 'public'}], layout: 'radio'}, initialValue: 'hidden'}),
    // ---- 项目详情 ----
    defineField({name: 'productCategory', title: '产品分类', type: 'reference', to: [{type: 'productCategory'}], group: 'project'}),
    defineField({name: 'relatedProducts', title: '关联产品', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}], group: 'project'}),
    defineField({name: 'orderQuantity', title: '订单数量', type: 'string', group: 'project'}),
    defineField({name: 'projectDate', title: '项目日期', type: 'date', group: 'project'}),
    defineField({name: 'projectBackground', title: '项目背景', type: 'text', rows: 3, group: 'project'}),
    defineField({name: 'buyerChallenge', title: '买家挑战', type: 'text', rows: 3, group: 'project'}),
    defineField({name: 'solution', title: 'POXIOL 解决方案', type: 'text', rows: 3, group: 'project'}),
    defineField({name: 'fabric', title: '面料', type: 'string', group: 'project'}),
    defineField({name: 'printingMethod', title: '印花方式', type: 'string', group: 'project'}),
    defineField({name: 'customizationDetails', title: '定制细节', type: 'text', rows: 2, group: 'project'}),
    defineField({name: 'sampleTimeline', title: '样品时间', type: 'string', group: 'project'}),
    defineField({name: 'productionTimeline', title: '生产时间', type: 'string', group: 'project'}),
    defineField({name: 'qcProcess', title: 'QC 流程', type: 'text', rows: 2, group: 'project'}),
    defineField({name: 'packaging', title: '包装方式', type: 'string', group: 'project'}),
    defineField({name: 'deliveryMethod', title: '物流方式', type: 'string', group: 'project'}),
    // ---- 成果 ----
    defineField({name: 'projectResult', title: '项目成果', type: 'text', rows: 3, group: 'result'}),
    defineField({name: 'buyerFeedback', title: '客户反馈', type: 'text', rows: 3, group: 'result', description: '⚠️ 仅在获得授权后填写。'}),
    defineField({name: 'buyerFeedbackPermission', title: '反馈授权', type: 'boolean', initialValue: false, group: 'result'}),
    // ---- 图片 ----
    defineField({name: 'heroImage', title: 'Hero 图片', type: 'imageWithAlt', group: 'media'}),
    defineField({name: 'projectGallery', title: '项目图库', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'qcImages', title: 'QC 图片', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'packingImages', title: '包装图片', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'shippingImages', title: '物流图片', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    // ---- 关联 ----
    defineField({name: 'relatedGuides', title: '关联指南', type: 'array', of: [{type: 'reference', to: [{type: 'article'}]}], group: 'relations'}),
    defineField({name: 'faqReferences', title: '关联 FAQ', type: 'array', of: [{type: 'faqReference'}], group: 'relations'}),
    // ---- SEO ----
    defineField({name: 'seo', title: 'SEO 配置', type: 'seoFields', group: 'seo'}),
    defineField({name: 'publishStatus', title: '发布状态', type: 'publishStatus', group: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'countryOrRegion', media: 'heroImage'}},
  validation: createRiskValidation(['title', 'projectBackground', 'solution']),
})
