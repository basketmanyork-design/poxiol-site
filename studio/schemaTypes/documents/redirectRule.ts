import {defineField, defineType} from 'sanity'
import {TransferIcon} from '@sanity/icons'

export const redirectRule = defineType({
  name: 'redirectRule',
  title: '301 重定向管理',
  type: 'document',
  icon: TransferIcon,
  fields: [
    defineField({
      name: 'sourcePath', 
      title: '原始路径 (Source)', 
      type: 'string', 
      description: '必须以 / 开头且以 / 结尾。例如: /old-slug/', 
      validation: (R) => R.required().regex(/^\/.*\/$/, '路径必须以 / 开头且以 / 结尾')
    }),
    defineField({
      name: 'destinationPath', 
      title: '目标路径 (Destination)', 
      type: 'string', 
      description: '例如: /new-slug/', 
      validation: (R) => R.required().regex(/^\/.*\/$/, '路径必须以 / 开头且以 / 结尾')
    }),
    defineField({
      name: 'redirectType', 
      title: '类型', 
      type: 'string', 
      options: {list: [{title: '301 (永久)', value: '301'}, {title: '302 (临时)', value: '302'}]},
      initialValue: '301'
    }),
    defineField({name: 'active', title: '生效状态', type: 'boolean', initialValue: true}),
    defineField({name: 'relatedDocument', title: '关联文档', type: 'reference', to: [{type: 'product'}, {type: 'article'}, {type: 'productCategory'}]}),
  ],
  preview: {
    select: {title: 'sourcePath', subtitle: 'destinationPath'}
  },
  validation: (Rule) => Rule.custom((doc: any) => {
    if (!doc.sourcePath || !doc.destinationPath) return true
    if (doc.sourcePath === doc.destinationPath) {
      return '原始路径与目标路径不能相同（A -> A 循环）。'
    }
    return true
  })
})
