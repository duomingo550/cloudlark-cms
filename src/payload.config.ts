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
  ],
  cors: [serverURL],
  csrf: [serverURL],
  db: databaseAdapter,
  defaultDepth: 2,
  editor: lexicalEditor(),
  i18n: {
    supportedLanguages: { zh },
  },
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
