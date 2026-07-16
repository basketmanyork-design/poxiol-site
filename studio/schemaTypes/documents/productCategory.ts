import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {createRiskValidation} from '../validation'

export const productCategory = defineType({
  name: 'productCategory',
  title: '产品分类',
  type: 'document',
  icon: TagIcon,
  groups: [
    {name: 'basic', title: '基础信息'},
    {name: 'hero', title: 'Hero 区域'},
    {name: 'content', title: '内容管理'},
    {name: 'relations', title: '关联关系'},
    {name: 'display', title: '显示设置'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---- 基础信息 ----
    defineField({name: 'categoryName', title: '分类名称', type: 'string', group: 'basic', validation: (R) => R.required()}),
    defineField({name: 'shortName', title: '简称', type: 'string', group: 'basic'}),
    defineField({name: 'slug', title: 'URL Slug', type: 'slug', group: 'basic', options: {source: 'categoryName', maxLength: 60, slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 60)}, validation: (R) => R.required()}),
    defineField({name: 'categoryCode', title: '分类编码', type: 'string', group: 'basic'}),
    // ---- Hero ----
    defineField({name: 'heroTitle', title: 'Hero 标题', type: 'string', group: 'hero'}),
    defineField({name: 'heroDescription', title: 'Hero 描述', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroImage', title: 'Hero 图片', type: 'imageWithAlt', group: 'hero'}),
    defineField({name: 'cardImage', title: '卡片图片', type: 'imageWithAlt', group: 'hero'}),
    // ---- 内容 ----
    defineField({name: 'introduction', title: '分类介绍', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'buyerTypes', title: '适用买家类型', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'keyFeatures', title: '核心特性', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'fabricOptions', title: '面料选项', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'customizationOptions', title: '定制选项', type: 'array', of: [{type: 'string'}], group: 'content'}),
    // ---- 关联 ----
    defineField({name: 'relatedGuides', title: '关联指南', type: 'array', of: [{type: 'reference', to: [{type: 'article'}]}], group: 'relations'}),
    defineField({name: 'faqReferences', title: '关联 FAQ', type: 'array', of: [{type: 'faqReference'}], group: 'relations'}),
    // ---- 显示 ----
    defineField({name: 'showInHeader', title: '在导航中显示', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'showOnHomepage', title: '在首页显示', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'featured', title: '精选', type: 'boolean', initialValue: false, group: 'display'}),
    defineField({name: 'displayOrder', title: '排序 (数字越小越前)', type: 'number', initialValue: 0, group: 'display'}),
    defineField({name: 'publishStatus', title: '发布状态', type: 'publishStatus', group: 'display'}),
    // ---- SEO ----
    defineField({name: 'seo', title: 'SEO 配置', type: 'seoFields', group: 'seo'}),
  ],
  orderings: [{name: 'order', title: '按排序', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'categoryName', subtitle: 'slug.current', media: 'cardImage'}},
  validation: createRiskValidation(['categoryName', 'heroTitle', 'heroDescription', 'introduction']),
})
