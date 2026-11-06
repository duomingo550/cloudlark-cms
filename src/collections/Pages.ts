import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import { siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: '页面', plural: '页面' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'site', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('pages', 'slug')] },
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
      label: '页面标题',
      required: true,
    },
    slugField,
    {
      name: 'excerpt',
      type: 'textarea',
      label: '页面摘要',
    },
    {
      name: 'body',
      type: 'blocks',
      label: '页面内容',
      blocks: bodyBlocks,
    },
    seoFields,
  ],
}
