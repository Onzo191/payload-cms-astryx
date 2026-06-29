import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ensureAuthDefaults } from './auth/defaults'
import { Permissions } from './collections/Permissions'
import { Roles } from './collections/Roles'
import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProductionBuild =
  process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build'
const shouldSeedAuthDefaults = process.env.PAYLOAD_SEED_AUTH_DEFAULTS !== 'false' && !isProductionBuild

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Roles, Permissions, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  onInit: async (payload) => {
    if (shouldSeedAuthDefaults) {
      await ensureAuthDefaults(payload)
    }
  },
})
