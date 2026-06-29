import type { GlobalConfig } from 'payload'

import { requireRole } from '@/shared/access'
import { GLOBAL_SLUGS } from '@/shared/constants/slugs'
import { seoField } from '@/shared/fields'

export const SeoDefaults: GlobalConfig = {
  slug: GLOBAL_SLUGS.seoDefaults,
  access: {
    read: () => true,
    update: requireRole(['super-admin', 'admin', 'editor']),
  },
  admin: {
    group: 'Site',
  },
  fields: [seoField()],
}
