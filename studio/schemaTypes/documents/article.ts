import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const article = defineType({
  name: 'article',
  title: '文章与指南',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'basic', title: '基础信息'},
    {name: 'content', title: '文章内容'},
    {name: 'authoring', title: '作者与审核'},
    {name: 'relations', title: '关联关系'},
    {name: 'display', title: '显示设置'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---- 基础信息 ----
    defineField({name: 'title', title: '文章标题', type: 'string', group: 'basic', validation: (R) => R.required()}),
    defineField({name: 'slug', title: 'URL Slug', type: 'slug', group: 'basic', options: {source: 'title', maxLength: 80}, validation: (R) => R.required()}),
    defineField({name: 'articleType', title: '文章类型', type: 'string', group: 'basic', options: {list: [
      {title: '博客', value: 'Blog'},
      {title: '采购指南', value: 'Buying Guide'},
      {title: '技术指南', value: 'Technical Guide'},
      {title: 'Checklist', value: 'Checklist'},
      {title: '对比文章', value: 'Comparison'},
      {title: '资源', value: 'Resource'},
      {title: 'SEO 文章', value: 'SEO Article'},
      {title: 'FAQ 中心', value: 'FAQ Hub'},
    ]}, validation: (R) => R.required()}),
    defineField({name: 'excerpt', title: '摘要', type: 'text', rows: 2, group: 'basic'}),
    defineField({name: 'featuredImage', title: '主图', type: 'imageWithAlt', group: 'basic'}),
    // ---- 文章内容 ----
    defineField({name: 'body', title: '正文', type: 'portableText', group: 'content', validation: (R) => R.required()}),
    defineField({name: 'keyTakeaways', title: '核心要点', type: 'array', of: [{type: 'string'}], group: 'content'}),
    // ---- 作者与审核 ----
    defineField({name: 'author', title: '作者', type: 'reference', to: [{type: 'author'}], group: 'authoring'}),
    defineField({name: 'reviewedBy', title: '审核人', type: 'reference', to: [{type: 'author'}], group: 'authoring'}),
    defineField({name: 'publishedAt', title: '发布时间', type: 'datetime', group: 'authoring'}),
    defineField({name: 'updatedAt', title: '更新时间', type: 'datetime', group: 'authoring'}),
    defineField({name: 'methodology', title: '方法论/数据来源', type: 'text', rows: 2, group: 'authoring'}),
    defineField({name: 'references', title: '参考文献', type: 'array', of: [{type: 'url'}], group: 'authoring'}),
    // ---- 关联 ----
    defineField({name: 'relatedProducts', title: '关联产品', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}], group: 'relations'}),
    defineField({name: 'relatedCategories', title: '关联分类', type: 'array', of: [{type: 'reference', to: [{type: 'productCategory'}]}], group: 'relations'}),
    defineField({name: 'relatedCaseStudies', title: '关联案例', type: 'array', of: [{type: 'reference', to: [{type: 'caseStudy'}]}], group: 'relations'}),
    defineField({name: 'relatedArticles', title: '关联文章', type: 'array', of: [{type: 'reference', to: [{type: 'article'}]}], group: 'relations'}),
    defineField({name: 'faqReferences', title: '关联 FAQ', type: 'array', of: [{type: 'faqReference'}], group: 'relations'}),
    // ---- 显示 ----
    defineField({name: 'cta', title: '行动号召 (CTA)', type: 'callToAction', group: 'display'}),
    defineField({name: 'featured', title: '精选', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'displayOrder', title: '排序', type: 'number', initialValue: 0, group: 'display'}),
    defineField({name: 'publishStatus', title: '发布状态', type: 'publishStatus', group: 'display'}),
    // ---- SEO ----
    defineField({name: 'seo', title: 'SEO 配置', type: 'seoFields', group: 'seo'}),
  ],
  orderings: [
    {name: 'published', title: '按发布时间', by: [{field: 'publishedAt', direction: 'desc'}]},
    {name: 'order', title: '按排序', by: [{field: 'displayOrder', direction: 'asc'}]},
    {name: 'type', title: '按类型', by: [{field: 'articleType', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'articleType', media: 'featuredImage'}},
  validation: createRiskValidation(['title', 'excerpt']),
})
