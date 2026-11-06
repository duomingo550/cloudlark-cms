import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import { publishedDateField, siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  labels: { singular: '教程', plural: '教程' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'site', 'durationMinutes', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('tutorials', 'slug')] },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    siteField,
    {
      name: 'title',
      type: 'text',
      label: '标题',
      required: true,
    },
    slugField,
    {
      name: 'excerpt',
      type: 'textarea',
      label: '摘要',
      required: true,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: '封面',
    },
    {
      name: 'body',
      type: 'blocks',
      label: '教程正文',
      blocks: bodyBlocks,
    },
    {
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '分类、人群与难度',
    },
    {
      name: 'durationMinutes',
      type: 'number',
      label: '预计学习时间（分钟）',
      min: 0,
    },
    {
      name: 'relatedTools',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      label: '关联工具',
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: '关联产品',
    },
    publishedDateField,
    seoFields,
  ],
}
