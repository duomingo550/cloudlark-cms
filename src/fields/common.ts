import type { Field } from 'payload'

import { adminOnlyField } from '@/access/siteAccess'

export const siteField: Field = {
  name: 'site',
  type: 'relationship',
  relationTo: 'sites',
  required: true,
  index: true,
  admin: {
    position: 'sidebar',
  },
  access: {
    update: adminOnlyField,
  },
}

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: '用于独立 URL，例如 /news/ai-trends/',
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || !value.trim()) return '请填写 slug'
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : 'slug 只能使用小写字母、数字和连字符'
  },
}

export const publishedDateField: Field = {
  name: 'publishedDate',
  type: 'date',
  label: '发布日期',
  admin: {
    date: {
      pickerAppearance: 'dayAndTime',
    },
    position: 'sidebar',
  },
}

export const featuredField: Field = {
  name: 'featuredRank',
  type: 'number',
  label: '推荐排序',
  min: 0,
  admin: {
    position: 'sidebar',
    description: '大于 0 时进入本周推荐，数字越小越靠前',
  },
}
