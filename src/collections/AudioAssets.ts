import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { uploadSizeLimit } from '@/hooks/uploadLimit'
import { enforceStorageQuota } from '@/hooks/storageQuota'
import {
  canCreateForSite,
  canManageSiteContent,
  uploadedFileRead,
} from '@/access/siteAccess'
import { siteField } from '@/fields/common'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const AudioAssets: CollectionConfig = {
  slug: 'audio-assets',
  labels: { singular: '音频文件', plural: '音频文件' },
  admin: {
    useAsTitle: 'title',
    group: '媒体',
    description: '支持 MP3、M4A、AAC、OGG。第一版建议单文件不超过 50MB。',
  },
  access: {
    create: canCreateForSite,
    delete: canManageSiteContent,
    read: uploadedFileRead,
    update: canManageSiteContent,
  },
  hooks: {
    beforeChange: [
      uploadSizeLimit(50 * 1024 * 1024),
      enforceStorageQuota,
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media/audio'),
    mimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/x-m4a'],
    pasteURL: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '音频标题',
      required: true,
    },
    {
      name: 'artist',
      type: 'text',
      label: '艺术家',
    },
    {
      name: 'durationSeconds',
      type: 'number',
      label: '时长（秒）',
      min: 0,
    },
    {
      name: 'license',
      type: 'text',
      label: '授权方式',
    },
    {
      name: 'rightsOwner',
      type: 'text',
      label: '版权所有者',
    },
    siteField,
  ],
}
