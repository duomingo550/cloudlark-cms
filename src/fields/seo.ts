import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    position: 'sidebar',
    description: '选填。留空会用站点默认 SEO',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'SEO 标题',
      maxLength: 70,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'SEO 描述',
      maxLength: 180,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '分享图',
    },
    {
      name: 'canonical',
      type: 'text',
      label: 'Canonical URL',
    },
    {
      name: 'noindex',
      type: 'checkbox',
      label: '禁止搜索引擎收录',
      defaultValue: false,
    },
  ],
}
