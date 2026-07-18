import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const faqCategory = defineType({
  name: 'faqCategory',
  title: 'FAQ 分类',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({name: 'name', title: '分类名称', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}, validation: (R) => R.required()}),
    defineField({name: 'description', title: '分类描述', type: 'text', rows: 2}),
    defineField({name: 'displayOrder', title: '排序', type: 'number', initialValue: 0}),
    defineField({name: 'active', title: '激活状态', type: 'boolean', initialValue: true}),
    defineField({name: 'internalNotes', title: '内部备注', type: 'text', rows: 2}),
  ],
  preview: {
    select: {title: 'name'}
  }
})
