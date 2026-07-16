import {defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const product = defineType({
  name: 'product',
  title: '产品管理',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'basic', title: '基础信息'},
    {name: 'media', title: '图片管理'},
    {name: 'specs', title: '产品参数'},
    {name: 'custom', title: '定制选项'},
    {name: 'procurement', title: '采购信息'},
    {name: 'relations', title: '关联关系'},
    {name: 'seo', title: 'SEO'},
    {name: 'display', title: '显示设置'},
  ],
  fields: [
    // ---- 基础信息 ----
    defineField({name: 'productName', title: '产品名称', type: 'string', group: 'basic', validation: (R) => R.required()}),
    defineField({name: 'internalSku', title: '内部 SKU', type: 'string', group: 'basic'}),
    defineField({name: 'slug', title: 'URL Slug', type: 'slug', group: 'basic', options: {source: 'productName', maxLength: 60}, validation: (R) => R.required()}),
    defineField({name: 'category', title: '产品分类', type: 'reference', to: [{type: 'productCategory'}], group: 'basic'}),
    defineField({name: 'shortDescription', title: '简短描述', type: 'text', rows: 2, group: 'basic'}),
    defineField({name: 'fullDescription', title: '完整描述', type: 'text', rows: 5, group: 'basic'}),
    // ---- 图片 ----
    defineField({name: 'primaryImage', title: '主图', type: 'imageWithAlt', group: 'media'}),
    defineField({name: 'imageGallery', title: '产品图库', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'detailImages', title: '细节图', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'productionImages', title: '生产图', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'qcImages', title: 'QC 图', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    defineField({name: 'packagingImages', title: '包装图', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media'}),
    // ---- 产品参数 ----
    defineField({name: 'sportType', title: '运动类型', type: 'string', group: 'specs'}),
    defineField({name: 'productType', title: '产品类型', type: 'string', group: 'specs'}),
    defineField({name: 'fabric', title: '面料', type: 'string', group: 'specs'}),
    defineField({name: 'fabricComposition', title: '面料成分', type: 'string', group: 'specs'}),
    defineField({name: 'gsm', title: '克重 (GSM)', type: 'string', group: 'specs'}),
    defineField({name: 'printingMethod', title: '印花方式', type: 'string', group: 'specs'}),
    defineField({name: 'neckline', title: '领型', type: 'string', group: 'specs'}),
    defineField({name: 'sleeveType', title: '袖型', type: 'string', group: 'specs'}),
    defineField({name: 'sizeRange', title: '尺码范围', type: 'string', group: 'specs'}),
    // ---- 定制选项 ----
    defineField({name: 'customLogo', title: '定制 Logo', type: 'boolean', initialValue: true, group: 'custom'}),
    defineField({name: 'customName', title: '定制名称', type: 'boolean', initialValue: true, group: 'custom'}),
    defineField({name: 'customNumber', title: '定制号码', type: 'boolean', initialValue: true, group: 'custom'}),
    defineField({name: 'customColors', title: '定制颜色', type: 'boolean', initialValue: true, group: 'custom'}),
    defineField({name: 'customNeckLabel', title: '定制领标', type: 'boolean', initialValue: false, group: 'custom'}),
    defineField({name: 'customCareLabel', title: '定制洗标', type: 'boolean', initialValue: false, group: 'custom'}),
    defineField({name: 'customHangtag', title: '定制吊牌', type: 'boolean', initialValue: false, group: 'custom'}),
    defineField({name: 'customPackaging', title: '定制包装', type: 'boolean', initialValue: false, group: 'custom'}),
    defineField({name: 'OEM', title: 'OEM', type: 'boolean', initialValue: false, group: 'custom'}),
    defineField({name: 'ODM', title: 'ODM', type: 'boolean', initialValue: false, group: 'custom'}),
    defineField({name: 'privateLabel', title: '自有品牌', type: 'boolean', initialValue: false, group: 'custom'}),
    // ---- 采购信息 ----
    defineField({name: 'buyerTypes', title: '适用买家', type: 'array', of: [{type: 'string'}], group: 'procurement'}),
    defineField({name: 'suitableMarkets', title: '适用市场', type: 'array', of: [{type: 'string'}], group: 'procurement'}),
    defineField({name: 'useCases', title: '使用场景', type: 'array', of: [{type: 'string'}], group: 'procurement'}),
    defineField({name: 'quoteRequirements', title: '报价所需信息', type: 'array', of: [{type: 'string'}], group: 'procurement'}),
    defineField({name: 'productionSteps', title: '生产步骤', type: 'array', of: [{type: 'string'}], group: 'procurement'}),
    defineField({name: 'qcChecklist', title: 'QC 检查项', type: 'array', of: [{type: 'string'}], group: 'procurement'}),
    defineField({name: 'packagingOptions', title: '包装选项', type: 'array', of: [{type: 'string'}], group: 'procurement'}),
    defineField({name: 'shippingNotes', title: '物流说明', type: 'text', rows: 2, group: 'procurement'}),
    defineField({name: 'procurementOverride', title: '采购参数覆写', type: 'procurementOverride', group: 'procurement'}),
    // ---- 关联 ----
    defineField({name: 'relatedProducts', title: '关联产品', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}], group: 'relations'}),
    defineField({name: 'relatedGuides', title: '关联指南', type: 'array', of: [{type: 'reference', to: [{type: 'article'}]}], group: 'relations'}),
    defineField({name: 'relatedCaseStudies', title: '关联案例', type: 'array', of: [{type: 'reference', to: [{type: 'caseStudy'}]}], group: 'relations'}),
    defineField({name: 'faqReferences', title: '关联 FAQ', type: 'array', of: [{type: 'faqReference'}], group: 'relations'}),
    // ---- 显示 ----
    defineField({name: 'featured', title: '精选', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'displayOrder', title: '排序', type: 'number', initialValue: 0, group: 'display'}),
    defineField({name: 'publishStatus', title: '发布状态', type: 'publishStatus', group: 'display'}),
    // ---- SEO ----
    defineField({name: 'seo', title: 'SEO 配置', type: 'seoFields', group: 'seo'}),
    defineField({name: 'publishedAt', title: '发布时间', type: 'datetime', group: 'seo'}),
    defineField({name: 'updatedAt', title: '更新时间', type: 'datetime', group: 'seo'}),
  ],
  orderings: [
    {name: 'order', title: '按排序', by: [{field: 'displayOrder', direction: 'asc'}]},
    {name: 'name', title: '按名称', by: [{field: 'productName', direction: 'asc'}]},
  ],
  preview: {select: {title: 'productName', subtitle: 'category.categoryName', media: 'primaryImage'}},
  validation: createRiskValidation(['productName', 'shortDescription', 'fullDescription']),
})
