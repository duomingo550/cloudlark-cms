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
import { autoFillSlugAndSite } from '@/hooks/autoFill'
import { uniquePerSite } from '@/hooks/uniquePerSite'
import { aiConfigured } from '@/lib/ai'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: '文章/资讯', plural: '文章/资讯' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'updatedAt'],
    description: '发布后出现在 /news 路径；保存草稿不会上线。',
    components: {
      edit: {
        // 3.93 的 beforeDocumentControls 类型是 CustomComponent[]，接受数组。
        // AiDraftButton 用 clientProps 显式传入 configured：未配置时按钮禁用；
        // 不传则组件默认 false（同样禁用），避免误发请求。
        beforeDocumentControls: [
          '@/components/admin/PublishHint',
          {
            path: '@/components/admin/AiDraftButton',
            clientProps: { configured: aiConfigured() },
          },
        ],
      },
    },
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [autoFillSlugAndSite, uniquePerSite('articles', 'slug')] },
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
      admin: {
        position: 'sidebar',
        description: '可留空',
      },
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
      admin: {
        description: '可留空',
      },
    },
    {
      name: 'sourceName',
      type: 'text',
      label: '来源名称',
      admin: {
        position: 'sidebar',
        description: '可留空',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: '原文链接',
      admin: {
        description: '可留空',
      },
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
