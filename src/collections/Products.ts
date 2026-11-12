import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import { featuredField, siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { autoFillSlugAndSite } from '@/hooks/autoFill'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: '产品/服务', plural: '产品与服务' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'statusLabel', 'updatedAt'],
    description: '发布后出现在 /products 路径；保存草稿不会上线。',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/PublishHint'],
      },
    },
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [autoFillSlugAndSite, uniquePerSite('products', 'slug')] },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    siteField,
    {
      name: 'name',
      type: 'text',
      label: '名称',
      required: true,
    },
    slugField,
    {
      name: 'kind',
      type: 'select',
      label: '类型',
      required: true,
      defaultValue: 'digital-product',
      options: [
        { label: '智能体', value: 'agent' },
        { label: '课程', value: 'course' },
        { label: '服务', value: 'service' },
        { label: '数字产品', value: 'digital-product' },
        { label: '会员社群', value: 'membership' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: '一句话介绍',
      required: true,
    },
    {
      name: 'body',
      type: 'blocks',
      label: '详细介绍',
      blocks: bodyBlocks,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: '封面',
      admin: {
        position: 'sidebar',
        description: '可留空',
      },
    },
    {
      name: 'priceLabel',
      type: 'text',
      label: '价格文案',
      admin: {
        description: '例如 ¥99、待定价、按需报价',
      },
    },
    {
      name: 'statusLabel',
      type: 'select',
      label: '销售状态',
      defaultValue: 'coming-soon',
      options: [
        { label: '可购买', value: 'available' },
        { label: '即将上线', value: 'coming-soon' },
        { label: '开发中', value: 'building' },
        { label: '按需咨询', value: 'consult' },
        { label: '已下架', value: 'retired' },
      ],
    },
    {
      name: 'purchaseUrl',
      type: 'text',
      label: '购买或咨询链接',
      admin: {
        position: 'sidebar',
        description: '可留空',
      },
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' && /^https?:\/\//i.test(value)) ||
        '购买或咨询链接必须是 http(s) 地址',
    },
    {
      name: 'download',
      type: 'relationship',
      relationTo: 'download-assets',
      label: '交付文件',
      admin: {
        position: 'sidebar',
        description: '可留空',
      },
    },
    {
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '分类与人群',
      admin: {
        description: '可留空',
      },
    },
    featuredField,
    seoFields,
  ],
}
