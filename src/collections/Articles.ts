import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import {
  featuredField,
  publishedDateField,
  siteField,
  slugField,
} from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: '文章/资讯', plural: '文章/资讯' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'site', 'publishedDate', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('articles', 'slug')] },
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
      maxLength: 320,
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
      label: '正文',
      blocks: bodyBlocks,
    },
    {
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '分类与标签',
    },
    {
      name: 'sourceName',
      type: 'text',
      label: '来源名称',
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: '原文链接',
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' && /^https?:\/\//i.test(value)) ||
        '来源链接必须是 http(s) 地址',
    },
    publishedDateField,
    featuredField,
    seoFields,
  ],
}
