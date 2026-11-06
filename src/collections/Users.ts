import type { CollectionConfig } from 'payload'

import {
  adminOnly,
  adminOnlyField,
  isPlatformAdmin,
} from '@/access/siteAccess'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '用户', plural: '用户' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'platformRole'],
    group: '系统',
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: adminOnly,
    delete: adminOnly,
    read: ({ req }) => {
      if (isPlatformAdmin(req.user)) return true
      if (!req.user) return false
      return { id: { equals: (req.user as { id: number | string }).id } }
    },
    update: ({ req }) => {
      if (isPlatformAdmin(req.user)) return true
      if (!req.user) return false
      return { id: { equals: (req.user as { id: number | string }).id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '姓名',
      required: true,
    },
    {
      name: 'platformRole',
      type: 'select',
      label: '平台角色',
      defaultValue: 'user',
      required: true,
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
      options: [
        { label: '平台管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
