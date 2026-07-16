import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const author = defineType({
  name: 'author',
  title: '作者',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', title: '姓名', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'role', title: '职位', type: 'string'}),
    defineField({name: 'brand', title: '所属品牌', type: 'string', initialValue: 'POXIOL'}),
    defineField({name: 'profilePhoto', title: '头像', type: 'imageWithAlt'}),
    defineField({name: 'shortBio', title: '简介', type: 'text', rows: 3}),
    defineField({name: 'fullBio', title: '完整介绍', type: 'text', rows: 5}),
    defineField({name: 'expertise', title: '专长领域', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'active', title: '激活', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'profilePhoto'}},
})
