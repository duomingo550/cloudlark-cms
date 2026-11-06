import type { CollectionConfig } from 'payload'

import {
  canCreateForSite,
  canManageSiteContent,
  canReadSite,
} from '@/access/siteAccess'
import { siteField } from '@/fields/common'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Terms: CollectionConfig = {
  slug: 'terms',
  labels: { singular: '分类项', plural: '分类法' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'taxonomy', 'site', 'updatedAt'],
    group: '内容',
  },
  access: {
    create: canCreateForSite,
    delete: canManageSiteContent,
    read: canReadSite,
    update: canManageSiteContent,
  },
  hooks: { beforeValidate: [uniquePerSite('terms', 'slug')] },
  fields: [
    siteField,
    {
      name: 'name',
      type: 'text',
      label: '名称',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: '标识',
      required: true,
      index: true,
    },
    {
      name: 'taxonomy',
      type: 'select',
      label: '分类法',
      required: true,
      defaultValue: 'category',
      options: [
        { label: '内容分类', value: 'category' },
        { label: '适用人群', value: 'audience' },
        { label: '难度等级', value: 'level' },
        { label: '标签', value: 'tag' },
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'terms',
      label: '上级分类',
    },
    {
      name: 'description',
      type: 'textarea',
      label: '说明',
    },
  ],
}
