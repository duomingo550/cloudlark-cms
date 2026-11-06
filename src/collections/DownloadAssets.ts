import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { uploadSizeLimit } from '@/hooks/uploadLimit'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const DownloadAssets: CollectionConfig = {
  slug: 'download-assets',
  labels: { singular: '下载文件', plural: '下载文件' },
  admin: {
    useAsTitle: 'title',
    group: '媒体',
    description: '支持 ZIP、PDF，单个文件最大 200 MB。公开访问策略将在下载接口阶段进一步收紧。',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [uploadSizeLimit(200 * 1024 * 1024)],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media/downloads'),
    mimeTypes: ['application/zip', 'application/x-zip-compressed', 'application/pdf'],
    pasteURL: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '文件标题',
      required: true,
    },
    {
      name: 'version',
      type: 'text',
      label: '版本',
      defaultValue: '1.0.0',
    },
    {
      name: 'checksum',
      type: 'text',
      label: 'SHA-256',
    },
    {
      name: 'accessPolicy',
      type: 'select',
      label: '访问策略',
      defaultValue: 'public',
      options: [
        { label: '公开下载', value: 'public' },
        { label: '仅链接可见', value: 'unlisted' },
        { label: '授权后下载', value: 'entitled' },
      ],
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
