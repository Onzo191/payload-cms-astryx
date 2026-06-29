import type { GlobalConfig } from 'payload'

import { requireRole } from '@/shared/access'
import { GLOBAL_SLUGS } from '@/shared/constants/slugs'

export const SiteSettings: GlobalConfig = {
  slug: GLOBAL_SLUGS.siteSettings,
  access: {
    read: () => true,
    update: requireRole(['super-admin', 'admin']),
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'siteUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'defaultLocale',
      type: 'text',
      defaultValue: 'en',
      required: true,
    },
  ],
}
