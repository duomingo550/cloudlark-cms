import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { bodyBlocks } from '@/blocks/bodyBlocks'
import { publishedDateField, siteField, slugField } from '@/fields/common'
import { seoFields } from '@/fields/seo'
import { autoFillSlugAndSite } from '@/hooks/autoFill'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: '视频作品', plural: '视频作品' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'updatedAt'],
    group: '内容',
    description: '视频作品；发布后出现在 /videos',
  },
  access: standardContentAccess,
  hooks: {
    beforeValidate: [autoFillSlugAndSite, uniquePerSite('videos', 'slug')],
  },
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
      label: '视频标题',
      required: true,
    },
    slugField,
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: '封面',
      admin: {
        description: '可留空',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: '外链视频地址',
      admin: {
        description:
          'B 站 / YouTube / Vimeo 页面地址，或自托管的 MP4 直链；与视频文件至少填一个，可留空',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'video-assets',
      label: '视频文件',
      admin: {
        description:
          '可留空。上传 mp4/webm/mov 后详情页会内嵌播放；也可改用上面的外链地址',
      },
    },
    {
      name: 'duration',
      type: 'number',
      label: '时长（秒）',
      min: 0,
      admin: {
        description: '可留空；填了会在列表和详情页显示',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '简介',
      admin: {
        description: '列表卡片与详情页摘要；可留空',
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
    },
    publishedDateField,
    seoFields,
  ],
}
