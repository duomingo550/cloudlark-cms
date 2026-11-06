import type { CollectionConfig } from 'payload'

import { adminOnly, isPlatformAdmin } from '@/access/siteAccess'

export const Memberships: CollectionConfig = {
  slug: 'memberships',
  labels: { singular: '站点成员', plural: '站点成员' },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'site', 'role', 'updatedAt'],
    group: '站点管理',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: ({ req }) => {
      if (isPlatformAdmin(req.user)) return true
      if (!req.user) return false
      return { user: { equals: (req.user as { id: number | string }).id } }
    },
    update: adminOnly,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      index: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: '所有者', value: 'owner' },
        { label: '编辑者', value: 'editor' },
        { label: '只读成员', value: 'viewer' },
      ],
    },
  ],
}
