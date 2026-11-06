import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import { featuredField, siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Tracks: CollectionConfig = {
  slug: 'tracks',
  labels: { singular: '音乐作品', plural: '音乐作品' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'album', 'site', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('tracks', 'slug')] },
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
      label: '曲名',
      required: true,
    },
    slugField,
    {
      name: 'artist',
      type: 'text',
      label: '艺术家',
      required: true,
    },
    {
      name: 'album',
      type: 'text',
      label: '专辑',
    },
    {
      name: 'releaseDate',
      type: 'date',
      label: '发行日期',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: '封面',
    },
    {
      name: 'audio',
      type: 'relationship',
      relationTo: 'audio-assets',
      required: true,
      label: '音频文件',
    },
    {
      name: 'lyrics',
      type: 'textarea',
      label: '歌词',
    },
    {
      name: 'credits',
      type: 'textarea',
      label: '创作与制作信息',
    },
    {
      name: 'license',
      type: 'text',
      label: '授权方式',
    },
    {
      name: 'description',
      type: 'blocks',
      label: '作品介绍',
      blocks: bodyBlocks,
    },
    {
      name: 'streamingLinks',
      type: 'array',
      label: '外部音乐平台',
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
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '风格与标签',
    },
    featuredField,
    seoFields,
  ],
}
