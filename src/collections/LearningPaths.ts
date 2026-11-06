import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const LearningPaths: CollectionConfig = {
  slug: 'learning-paths',
  labels: { singular: '学习路线', plural: '学习路线' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'site', 'position', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('learning-paths', 'slug')] },
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
      label: '路线标题',
      required: true,
    },
    slugField,
    {
      name: 'description',
      type: 'textarea',
      label: '简介',
      required: true,
    },
    {
      name: 'position',
      type: 'number',
      label: '排序',
      defaultValue: 10,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'steps',
      type: 'array',
      label: '学习步骤',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'url',
          type: 'text',
          label: '相关链接',
        },
      ],
    },
    {
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '人群与难度',
    },
    seoFields,
  ],
}
