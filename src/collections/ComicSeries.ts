import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const ComicSeries: CollectionConfig = {
  slug: 'comic-series',
  labels: { singular: '漫画系列', plural: '漫画系列' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'site', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('comic-series', 'slug')] },
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
      label: '系列标题',
      required: true,
    },
    slugField,
    {
      name: 'synopsis',
      type: 'textarea',
      label: '简介',
      required: true,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: '封面',
    },
    {
      name: 'status',
      type: 'select',
      label: '连载状态',
      defaultValue: 'ongoing',
      options: [
        { label: '连载中', value: 'ongoing' },
        { label: '已完结', value: 'completed' },
        { label: '休刊中', value: 'paused' },
      ],
    },
    {
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '题材与标签',
    },
    seoFields,
  ],
}
