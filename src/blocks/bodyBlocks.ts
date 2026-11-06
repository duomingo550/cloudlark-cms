import type { Block, Field } from 'payload'

const captionField: Field = {
  name: 'caption',
  type: 'textarea',
  label: '说明',
}

export const bodyBlocks: Block[] = [
  {
    slug: 'richText',
    labels: { singular: '富文本', plural: '富文本' },
    fields: [
      {
        name: 'content',
        type: 'richText',
        required: true,
      },
    ],
  },
  {
    slug: 'image',
    labels: { singular: '图片', plural: '图片' },
    fields: [
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      captionField,
    ],
  },
  {
    slug: 'gallery',
    labels: { singular: '图集', plural: '图集' },
    fields: [
      {
        name: 'items',
        type: 'array',
        label: '图片',
        minRows: 1,
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
          },
          captionField,
        ],
      },
    ],
  },
  {
    slug: 'video',
    labels: { singular: '视频', plural: '视频' },
    fields: [
      {
        name: 'provider',
        type: 'select',
        required: true,
        defaultValue: 'bilibili',
        options: [
          { label: 'Bilibili', value: 'bilibili' },
          { label: 'YouTube', value: 'youtube' },
          { label: 'Vimeo', value: 'vimeo' },
          { label: '腾讯视频', value: 'tencent' },
          { label: '外部链接', value: 'external' },
        ],
      },
      {
        name: 'url',
        type: 'text',
        required: true,
        admin: {
          description: '仅允许白名单平台的 https 地址',
        },
      },
      {
        name: 'poster',
        type: 'upload',
        relationTo: 'media',
        label: '视频封面',
      },
      {
        name: 'title',
        type: 'text',
        label: '视频标题',
      },
      captionField,
    ],
  },
  {
    slug: 'audio',
    labels: { singular: '音乐播放器', plural: '音乐播放器' },
    fields: [
      {
        name: 'track',
        type: 'relationship',
        relationTo: 'tracks',
        required: true,
        label: '音乐作品',
      },
    ],
  },
  {
    slug: 'chart',
    labels: { singular: '图表', plural: '图表' },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        label: '图表图片或 SVG',
      },
      {
        name: 'dataTable',
        type: 'textarea',
        label: '无障碍数据表',
        admin: {
          description: '可填写 CSV 或制表符分隔数据，发布时用于文字替代',
        },
      },
      {
        name: 'source',
        type: 'text',
        label: '数据来源',
      },
      captionField,
    ],
  },
  {
    slug: 'comicReader',
    labels: { singular: '漫画阅读器', plural: '漫画阅读器' },
    fields: [
      {
        name: 'images',
        type: 'array',
        label: '漫画页面',
        minRows: 1,
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
          },
          {
            name: 'alt',
            type: 'text',
            label: '页面描述',
          },
        ],
      },
      {
        name: 'readingMode',
        type: 'select',
        defaultValue: 'vertical',
        options: [
          { label: '竖屏连续阅读', value: 'vertical' },
          { label: '单页阅读', value: 'page' },
        ],
      },
    ],
  },
  {
    slug: 'fileDownload',
    labels: { singular: '文件下载', plural: '文件下载' },
    fields: [
      {
        name: 'file',
        type: 'relationship',
        relationTo: 'download-assets',
        required: true,
      },
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
        name: 'buttonLabel',
        type: 'text',
        defaultValue: '下载文件',
      },
    ],
  },
]
