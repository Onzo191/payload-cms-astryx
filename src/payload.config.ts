import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { previewEndpoint, publicApiEndpoint, webhooksEndpoint } from './endpoints'
import { AuditLogs, Categories, Media, News, Pages, Reports, Tags, Users } from './features'
import { Footer, Header, SeoDefaults, SiteSettings } from './globals'
import { reportTextExtractionJob, searchIndexingJob, sitemapJob } from './jobs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Tags, Pages, News, Reports, AuditLogs],
  editor: lexicalEditor(),
  endpoints: [publicApiEndpoint, previewEndpoint, webhooksEndpoint],
  globals: [Header, Footer, SiteSettings, SeoDefaults],
  jobs: {
    tasks: [sitemapJob, searchIndexingJob, reportTextExtractionJob],
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    blocksAsJSON: true,
    idType: 'uuidv7',
    migrationDir: path.resolve(dirname, '../migrations'),
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [],
})
