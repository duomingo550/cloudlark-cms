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

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '图片', plural: '图片媒体' },
  admin: {
    useAsTitle: 'filename',
    group: '媒体',
    description: '单张图片最大 10 MB。',
  },
  access: {
    create: canCreateForSite,
    delete: canManageSiteContent,
    read: uploadedFileRead,
    update: canManageSiteContent,
  },
  hooks: {
    beforeChange: [
      uploadSizeLimit(10 * 1024 * 1024),
      enforceStorageQuota,
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media/images'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    pasteURL: false,
    imageSizes: [
      { name: 'thumbnail', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 960, height: undefined, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: '替代文本',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      label: '图片说明',
    },
    {
      name: 'credit',
      type: 'text',
      label: '来源或版权',
    },
    siteField,
  ],
}
