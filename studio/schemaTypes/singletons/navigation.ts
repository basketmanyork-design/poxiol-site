import {defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons'

export const navigationSettings = defineType({
  name: 'navigationSettings',
  title: '导航管理',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'headerNavigation',
      title: '主导航菜单',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'label', title: '显示名称', type: 'string', validation: (R) => R.required()},
          {name: 'linkType', title: '链接类型', type: 'string', options: {list: [{title: '内部页面', value: 'internal'}, {title: '外部 URL', value: 'external'}]}, initialValue: 'internal'},
          {name: 'internalPage', title: '内部页面引用', type: 'reference', to: [{type: 'sitePage'}, {type: 'productCategory'}, {type: 'article'}], hidden: ({parent}) => parent?.linkType !== 'internal'},
          {name: 'externalUrl', title: '外部 URL', type: 'url', hidden: ({parent}) => parent?.linkType !== 'external'},
          {name: 'openInNewWindow', title: '新窗口打开', type: 'boolean', initialValue: false},
          {name: 'subMenu', title: '子菜单', type: 'array', of: [{
            type: 'object',
            fields: [
              {name: 'label', title: '显示名称', type: 'string'},
              {name: 'internalPage', title: '页面引用', type: 'reference', to: [{type: 'sitePage'}, {type: 'productCategory'}, {type: 'article'}]}
            ]
          }]}
        ]
      }]
    })
  ]
})

export const footerSettings = defineType({
  name: 'footerSettings',
  title: '页脚管理',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'footerColumns',
      title: '页脚栏目',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'title', title: '栏目标题', type: 'string'},
          {name: 'links', title: '链接列表', type: 'array', of: [{
            type: 'object',
            fields: [
              {name: 'label', title: '显示名称', type: 'string'},
              {name: 'page', title: '引用', type: 'reference', to: [{type: 'sitePage'}, {type: 'productCategory'}, {type: 'article'}]}
            ]
          }]}
        ]
      }]
    }),
    defineField({name: 'copyright', title: '版权信息', type: 'string'}),
    defineField({name: 'policyLinks', title: '政策链接', type: 'array', of: [{
      type: 'object',
      fields: [
        {name: 'label', title: '名称', type: 'string'},
        {name: 'url', title: '链接', type: 'url'}
      ]
    }]})
  ]
})
