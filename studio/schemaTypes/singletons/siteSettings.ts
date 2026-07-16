import {defineField, defineType} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '网站全局设置',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'brandName',
      title: '品牌名称',
      type: 'string',
      initialValue: 'POXIOL',
    }),
    defineField({
      name: 'siteUrl',
      title: '正式网站 URL',
      type: 'url',
      initialValue: 'https://www.poxiol.com/',
    }),
    defineField({
      name: 'logo',
      title: '网站 Logo',
      type: 'imageWithAlt',
    }),
    {
      name: 'contactInfo',
      title: '联系信息',
      type: 'object',
      fields: [
        {name: 'publicEmail', title: '公开联系邮箱', type: 'string', initialValue: 'york@basketman.cn'},
        {name: 'whatsappNumber', title: 'WhatsApp 号码', type: 'string', initialValue: '+8613055646888'},
        {name: 'whatsappMessage', title: '默认询盘话术', type: 'text'},
      ]
    },
    {
      name: 'footer',
      title: '页脚内容',
      type: 'object',
      fields: [
        {name: 'copyright', title: '版权信息', type: 'string', initialValue: '© 2026 POXIOL Teamwear. All rights reserved.'},
        {name: 'address', title: '公司地址', type: 'text'},
      ]
    },
    {
      name: 'globalSeo',
      title: '全局 SEO 默认值',
      type: 'seoFields',
    }
  ],
})
