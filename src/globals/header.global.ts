import type { GlobalConfig } from 'payload'

import { requireRole } from '@/shared/access'
import { GLOBAL_SLUGS } from '@/shared/constants/slugs'

export const Header: GlobalConfig = {
  slug: GLOBAL_SLUGS.header,
  access: {
    read: () => true,
    update: requireRole(['super-admin', 'admin', 'editor']),
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'navItems',
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
