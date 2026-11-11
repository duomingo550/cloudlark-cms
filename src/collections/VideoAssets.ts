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

export const VideoAssets: CollectionConfig = {
  slug: 'video-assets',
  labels: { singular: '视频文件', plural: '视频文件' },
  admin: {
    useAsTitle: 'title',
    group: '媒体',
    description: '视频文件（mp4/webm/mov）；用于视频作品与正文内嵌',
  },
  access: {
    create: canCreateForSite,
    delete: canManageSiteContent,
    read: uploadedFileRead,
    update: canManageSiteContent,
  },
  hooks: {
    beforeChange: [
      uploadSizeLimit(200 * 1024 * 1024),
      enforceStorageQuota,
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media/videos'),
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    pasteURL: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '视频标题',
      required: true,
    },
    {
      name: 'duration',
      type: 'number',
      label: '时长（秒）',
      min: 0,
    },
    siteField,
  ],
}
