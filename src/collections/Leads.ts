import { APIError, type CollectionBeforeValidateHook, type CollectionConfig } from 'payload'

import { adminOnly, adminOnlyField } from '@/access/siteAccess'

const FIVE_MINUTES_MS = 5 * 60 * 1000
const MAX_SUBMISSIONS_PER_WINDOW = 3
const MAX_MESSAGE_LENGTH = 5000

/** 只接受字符串，顺手去掉首尾空白；其他类型一律当作空值。 */
const asText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

/** 基本的邮箱形状校验：本地部分 + @ + 域名 + 点 + 后缀，不允许空白。 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * 1. 自动补站点：联系页是匿名提交，前端不会带 site。
 * 单站点产品，直接取 sites 第一条。
 */
const resolveLeadSite: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data || data.site) return data

  const { docs } = await req.payload.find({
    collection: 'sites',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    sort: 'createdAt',
  })
  if (docs[0]) data.site = docs[0].id

  return data
}

/**
 * 2. 校验必填与长度：先于字段级 required 校验给出统一的 400 文案。
 */
const validateLead: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data

  const name = asText(data.name)
  const email = asText(data.email)
  const message = typeof data.message === 'string' ? data.message : ''

  if (!name || !email || !message.trim()) {
    throw new APIError('请填写称呼、邮箱和内容', 400)
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new APIError('邮箱格式不正确', 400)
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new APIError('内容超出长度限制', 400)
  }

  // 落库前统一去掉首尾空白，避免匿名请求塞进无意义的空白。
  data.name = name
  data.email = email
  data.message = message

  return data
}

/**
 * 3. 简单限流：同一邮箱 5 分钟内最多 3 条。
 * 已被限流的重复提交不会落库，所以计数只看已存在的线索。
 */
const limitLeadRate: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  // 限流只针对新提交；管理员更新状态/备注时不应被历史提交次数挡住。
  if (!data || operation === 'update') return data

  const email = asText(data.email)
  if (!email) return data

  const since = new Date(Date.now() - FIVE_MINUTES_MS).toISOString()
  const { totalDocs } = await req.payload.count({
    collection: 'leads',
    overrideAccess: true,
    where: {
      and: [
        { email: { equals: email } },
        { createdAt: { greater_than: since } },
      ],
    },
  })

  if (totalDocs >= MAX_SUBMISSIONS_PER_WINDOW) {
    throw new APIError('提交太频繁，请稍后再试', 400)
  }

  return data
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: '线索', plural: '线索' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    group: '站点管理',
    description: '来自联系表单的咨询线索；仅管理员可见',
  },
  access: {
    // 联系表单匿名可提交；查询、修改、删除只对登录管理员开放。
    create: () => true,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    // 顺序固定：先补站点，再校验内容，最后限流（限流需要校验后的 email）。
    beforeValidate: [resolveLeadSite, validateLead, limitLeadRate],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '称呼',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: '邮箱',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: '内容',
      required: true,
      admin: {
        description: '最多 5000 字',
      },
    },
    {
      name: 'source',
      type: 'text',
      label: '来源',
      defaultValue: 'contact',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: '处理状态',
      defaultValue: 'new',
      options: [
        { label: '新线索', value: 'new' },
        { label: '已联系', value: 'contacted' },
        { label: '已归档', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
      // 匿名提交不能伪造处理状态。
      access: {
        create: () => false,
        read: adminOnlyField,
        update: adminOnlyField,
      },
    },
    {
      name: 'note',
      type: 'textarea',
      label: '内部备注',
      // 内部备注只给管理员看，匿名提交不能写入。
      access: {
        create: () => false,
        read: adminOnlyField,
        update: adminOnlyField,
      },
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      label: '站点',
      index: true,
      admin: {
        position: 'sidebar',
        description: '由系统自动填入，无需手动选择',
      },
      // 由 beforeValidate 钩子自动填，匿名请求不能自行指定。
      access: {
        create: () => false,
        read: adminOnlyField,
        update: adminOnlyField,
      },
    },
  ],
}
