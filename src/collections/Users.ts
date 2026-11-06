import { APIError, type CollectionConfig } from 'payload'

import {
  adminOnly,
  adminOnlyField,
  canAccessAdmin,
  isPlatformAdmin,
} from '@/access/siteAccess'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '用户', plural: '用户' },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'platformRole'],
    group: '系统',
  },
  access: {
    admin: canAccessAdmin,
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const password = data?.password
        if (typeof password === 'string' && password.length < 12) {
          throw new APIError('密码至少需要 12 个字符', 400)
        }
        return data
      },
    ],
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
