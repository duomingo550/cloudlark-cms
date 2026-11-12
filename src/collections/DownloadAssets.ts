import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { uploadSizeLimit } from '@/hooks/uploadLimit'
import { enforceStorageQuota } from '@/hooks/storageQuota'
import {
  canCreateForSite,
  canManageSiteContent,
  downloadFileRead,
} from '@/access/siteAccess'
import { siteField } from '@/fields/common'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const DownloadAssets: CollectionConfig = {
  slug: 'download-assets',
  labels: { singular: '下载文件', plural: '下载文件' },
  admin: {
    useAsTitle: 'title',
    group: '媒体',
    description: '支持 ZIP、PDF，单个文件最大 200 MB。',
  },
  access: {
    create: canCreateForSite,
    delete: canManageSiteContent,
    read: downloadFileRead,
    update: canManageSiteContent,
  },
  hooks: {
    beforeChange: [
      uploadSizeLimit(200 * 1024 * 1024),
      enforceStorageQuota,
    ],
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
    siteField,
  ],
}
