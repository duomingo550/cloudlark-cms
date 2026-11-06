import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import { publishedDateField, siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const ComicChapters: CollectionConfig = {
  slug: 'comic-chapters',
  labels: { singular: '漫画章节', plural: '漫画章节' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'series', 'chapterNumber', 'site', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('comic-chapters', 'slug')] },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    siteField,
    {
      name: 'series',
      type: 'relationship',
      relationTo: 'comic-series',
      required: true,
      index: true,
      label: '所属系列',
    },
    {
      name: 'title',
      type: 'text',
      label: '章节标题',
      required: true,
    },
    slugField,
    {
      name: 'chapterNumber',
      type: 'number',
      label: '章节序号',
      required: true,
      min: 1,
    },
    {
      name: 'body',
      type: 'blocks',
      label: '章节内容',
      blocks: bodyBlocks,
      admin: {
        description: '建议只放一个漫画阅读器区块',
      },
    },
    publishedDateField,
    seoFields,
  ],
}
