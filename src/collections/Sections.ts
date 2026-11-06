import type { CollectionConfig } from 'payload'

import {
  canCreateForSite,
  canReadSite,
  canManageSiteContent,
} from '@/access/siteAccess'
import { siteField } from '@/fields/common'
import { uniquePerSite } from '@/hooks/uniquePerSite'

export const Sections: CollectionConfig = {
  slug: 'sections',
  labels: { singular: '栏目', plural: '栏目管理' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'kind', 'sourceCollection', 'position', 'visible', 'site'],
    group: '站点管理',
    description: '控制前台栏目、导航、顺序和数据来源。新增栏目无需修改页面代码。',
  },
  access: {
    create: canCreateForSite,
    delete: canManageSiteContent,
    read: canReadSite,
    update: canManageSiteContent,
  },
  hooks: {
    beforeValidate: [
      uniquePerSite('sections', 'key'),
      uniquePerSite('sections', 'routePath'),
    ],
  },
  fields: [
    siteField,
    {
      name: 'key',
      type: 'text',
      label: '栏目标识',
      required: true,
      admin: {
        description: '例如 tools、news、music',
      },
    },
    {
      name: 'label',
      type: 'text',
      label: '栏目名称',
      required: true,
    },
    {
      name: 'kind',
      type: 'select',
      label: '栏目形态',
      required: true,
      defaultValue: 'collection',
      options: [
        { label: '内容集合', value: 'collection' },
        { label: '独立页面', value: 'page' },
        { label: '外部链接', value: 'external' },
      ],
    },
    {
      name: 'sourceCollection',
      type: 'select',
      label: '内容来源',
      admin: {
        condition: (_, siblingData) => siblingData?.kind === 'collection',
      },
      options: [
        { label: '资讯', value: 'articles' },
        { label: '教程', value: 'tutorials' },
        { label: '工具', value: 'tools' },
        { label: '产品与服务', value: 'products' },
        { label: '音乐', value: 'tracks' },
        { label: '漫画', value: 'comic-series' },
        { label: '学习路线', value: 'learning-paths' },
        { label: 'Skill', value: 'skills' },
      ],
    },
    {
      name: 'filter',
      type: 'text',
      label: '筛选条件',
      admin: {
        description: '简单条件，例如 kind=agent 或 category=ai-coding',
      },
    },
    {
      name: 'routePath',
      type: 'text',
      label: '访问路径',
      required: true,
      admin: {
        description: '例如 tools、news、music',
      },
    },
    {
      name: 'templateKey',
      type: 'select',
      label: '展示模板',
      required: true,
      defaultValue: 'list',
      options: [
        { label: '通用列表', value: 'list' },
        { label: '工具网格', value: 'tool-grid' },
        { label: '文章列表', value: 'article-list' },
        { label: '产品网格', value: 'product-grid' },
        { label: '音乐列表', value: 'track-list' },
        { label: '漫画列表', value: 'comic-list' },
        { label: 'Skill 网格', value: 'skill-grid' },
      ],
    },
    {
      name: 'position',
      type: 'number',
      label: '排序',
      required: true,
      defaultValue: 10,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      label: '启用栏目',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      label: '显示在首页',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInNav',
      type: 'checkbox',
      label: '显示在顶部导航',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: '外部 URL',
      admin: {
        condition: (_, siblingData) => siblingData?.kind === 'external',
      },
    },
  ],
}
