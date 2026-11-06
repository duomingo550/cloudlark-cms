import type { CollectionConfig } from 'payload'

import { standardContentAccess } from '@/access/siteAccess'
import { siteField, slugField } from '@/fields/common'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Skills: CollectionConfig = {
  slug: 'skills',
  labels: { singular: 'Skill', plural: 'Skill' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'level', 'site', 'updatedAt', '_status'],
    group: '内容',
  },
  access: standardContentAccess,
  hooks: { beforeValidate: [uniquePerSite('skills', 'slug')] },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    siteField,
    {
      name: 'name',
      type: 'text',
      label: '名称',
      required: true,
    },
    slugField,
    {
      name: 'group',
      type: 'text',
      label: '技能分组',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: '说明',
      required: true,
    },
    {
      name: 'level',
      type: 'text',
      label: '掌握程度',
      defaultValue: '入门',
    },
    {
      name: 'position',
      type: 'number',
      label: '排序',
      defaultValue: 10,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'terms',
      type: 'relationship',
      relationTo: 'terms',
      hasMany: true,
      label: '标签',
    },
  ],
}
