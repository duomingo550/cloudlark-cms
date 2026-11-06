import type { CollectionConfig } from 'payload'

import { adminOnly, memberRead } from '@/access/siteAccess'

export const Sites: CollectionConfig = {
  slug: 'sites',
  labels: { singular: '站点', plural: '站点' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isDefault', 'updatedAt'],
    group: '站点管理',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: memberRead,
    update: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '站点名称',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: '站点标识',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: '仅使用小写字母、数字和连字符',
      },
      validate: (value: unknown) =>
        typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : '站点标识只能使用小写字母、数字和连字符',
    },
    {
      name: 'domains',
      type: 'array',
      label: '绑定域名',
      fields: [
        {
          name: 'host',
          type: 'text',
          required: true,
          admin: {
            description: '例如 www.example.com，不含协议',
          },
        },
      ],
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: '默认站点',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: '本地开发或未匹配域名时使用',
      },
    },
    {
      name: 'publicUrl',
      type: 'text',
      label: '公开访问地址',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'brand',
      type: 'group',
      label: '品牌设置',
      fields: [
        {
          name: 'tagline',
          type: 'text',
          label: '一句话定位',
        },
        {
          name: 'description',
          type: 'textarea',
          label: '站点描述',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
        },
        {
          name: 'primaryColor',
          type: 'text',
          label: '主色',
          defaultValue: '#1f7a5a',
        },
        {
          name: 'footerText',
          type: 'text',
          label: '页脚文字',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: '社交与外部链接',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: '默认 SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: '默认标题',
        },
        {
          name: 'description',
          type: 'textarea',
          label: '默认描述',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '默认分享图',
        },
      ],
    },
    {
      name: 'storageQuotaMb',
      type: 'number',
      label: '媒体存储额度（MB）',
      defaultValue: 1024,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
