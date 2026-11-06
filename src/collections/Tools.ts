import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import { featuredField, siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Tools: CollectionConfig = {
  slug: 'tools',
  labels: { singular: '工具', plural: 'AI 工具' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'site', 'pricing', 'featuredRank', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('tools', 'slug')] },
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
      label: '工具名称',
      required: true,
    },
    slugField,
    {
      name: 'summary',
      type: 'textarea',
      label: '一句话介绍',
      required: true,
    },
    {
      name: 'description',
      type: 'blocks',
      label: '详细介绍',
      blocks: bodyBlocks,
    },
    {
      name: 'url',
      type: 'text',
      label: '官网链接',
      required: true,
      validate: (value: unknown) =>
        typeof value === 'string' && /^https?:\/\//i.test(value)
          ? true
          : '官网链接必须是 http(s) 地址',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '分类、人群与标签',
    },
    {
      name: 'pricing',
      type: 'select',
      label: '价格形态',
      defaultValue: 'unknown',
      options: [
        { label: '免费', value: 'free' },
        { label: '免费增值', value: 'freemium' },
        { label: '付费', value: 'paid' },
        { label: '未知', value: 'unknown' },
      ],
    },
    {
      name: 'platforms',
      type: 'array',
      label: '平台',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    featuredField,
    seoFields,
  ],
}
