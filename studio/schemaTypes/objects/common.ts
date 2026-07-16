import {defineField, defineType} from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO 配置',
  type: 'object',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO 标题 (Title)',
      type: 'string',
      description: '建议控制在 50-60 字符以内。',
      validation: (Rule) => Rule.max(70).warning('标题过长可能在搜索结果中被截断'),
    }),
    defineField({
      name: 'metaDescription',
      title: '元描述 (Meta Description)',
      type: 'text',
      rows: 3,
      description: '必填。简选页面核心内容，吸引用户点击。',
      validation: (Rule) => Rule.required().min(50).max(160),
    }),
    defineField({
      name: 'canonicalUrl',
      title: '权威链接 (Canonical URL)',
      type: 'url',
      description: '必须使用 https://www.poxiol.com/ 开头的完整 URL。',
      validation: (Rule) => Rule.uri({
        scheme: ['https'],
      }).custom((url) => {
        if (!url) return true
        return url.startsWith('https://www.poxiol.com/') ? true : '必须以 https://www.poxiol.com/ 开头'
      }),
    }),
    defineField({
      name: 'ogImage',
      title: '社交分享图片 (OG Image)',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '图片描述 (Alt Text)',
          validation: (Rule) => Rule.required(),
        }
      ]
    }),
    defineField({
      name: 'indexStatus',
      title: '索引状态',
      type: 'string',
      options: {
        list: [
          {title: 'Index (允许索引)', value: 'index'},
          {title: 'No-Index (禁止索引)', value: 'noindex'},
        ],
        layout: 'radio',
      },
      initialValue: 'index',
    }),
  ],
})

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: '带描述的图片',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'altText',
      title: 'Alt 描述文字 (必填)',
      type: 'string',
      description: '用于 SEO 和无障碍。禁止使用 image1, photo 等无意义词。',
      validation: (Rule) => Rule.required().custom((alt) => {
        if (!alt) return true
        const low = alt.toLowerCase()
        return ['image', 'photo', 'banner', 'img'].includes(low) ? '请提供具体的图片描述内容' : true
      }),
    }),
    defineField({
      name: 'isRealFactoryEvidence',
      title: '真实工厂证据？',
      type: 'boolean',
      description: '如果是实拍工厂/生产照片，请勾选此项以获得更高权重。AI 生成图严禁勾选。',
      initialValue: false,
    }),
  ],
})
