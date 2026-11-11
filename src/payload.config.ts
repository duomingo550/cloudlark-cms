import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { zh } from '@payloadcms/translations/languages/zh'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { AudioAssets } from '@/collections/AudioAssets'
import { Articles } from '@/collections/Articles'
import { ComicChapters } from '@/collections/ComicChapters'
import { ComicSeries } from '@/collections/ComicSeries'
import { DownloadAssets } from '@/collections/DownloadAssets'
import { LearningPaths } from '@/collections/LearningPaths'
import { Leads } from '@/collections/Leads'
import { Media } from '@/collections/Media'
import { Memberships } from '@/collections/Memberships'
import { Pages } from '@/collections/Pages'
import { Products } from '@/collections/Products'
import { Sections } from '@/collections/Sections'
import { Sites } from '@/collections/Sites'
import { Skills } from '@/collections/Skills'
import { Terms } from '@/collections/Terms'
import { Tools } from '@/collections/Tools'
import { Tracks } from '@/collections/Tracks'
import { Tutorials } from '@/collections/Tutorials'
import { Users } from '@/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
const payloadSecret = process.env.PAYLOAD_SECRET || ''
if (
  payloadSecret.length < 32 ||
  payloadSecret === 'replace-with-a-long-random-secret'
) {
  throw new Error(
    'PAYLOAD_SECRET must be at least 32 characters and must not use the example value',
  )
}
const databaseAdapter =
  process.env.DATABASE_ADAPTER === 'postgres'
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL || '',
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./cloudlark.db',
        },
      })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · 云雀 CMS',
    },
    components: {
      beforeNavLinks: ['@/components/admin/DashboardLink'],
      graphics: {
        Icon: '@/components/admin/Icon',
        Logo: '@/components/admin/Logo',
      },
    },
  },
  collections: [
    Pages,
    Articles,
    Tutorials,
    Tools,
    Products,
    Tracks,
    LearningPaths,
    Skills,
    ComicSeries,
    ComicChapters,
    Terms,
    Media,
    AudioAssets,
    DownloadAssets,
    Sections,
    Sites,
    Memberships,
    Users,
    Leads,
  ],
  cors: [serverURL],
  csrf: [serverURL],
  db: databaseAdapter,
  defaultDepth: 2,
  editor: lexicalEditor(),
  graphQL: {
    // 生产环境关闭 GraphQL Playground，避免暴露可在生产执行任意查询的调试台。
    disablePlaygroundInProduction: process.env.NODE_ENV === 'production',
  },
  i18n: {
    supportedLanguages: { zh },
  },
  secret: payloadSecret,
  serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    abortOnLimit: true,
    limits: {
      fields: 20,
      fieldSize: 1024 * 1024,
      files: 1,
      fileSize: 200 * 1024 * 1024,
    },
    requestSizeLimit: 201 * 1024 * 1024,
  },
})
