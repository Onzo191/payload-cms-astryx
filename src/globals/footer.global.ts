import type { GlobalConfig } from 'payload'

import { requireRole } from '@/shared/access'
import { GLOBAL_SLUGS } from '@/shared/constants/slugs'

export const Footer: GlobalConfig = {
  slug: GLOBAL_SLUGS.footer,
  access: {
    read: () => true,
    update: requireRole(['super-admin', 'admin', 'editor']),
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'copyright',
      type: 'text',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
