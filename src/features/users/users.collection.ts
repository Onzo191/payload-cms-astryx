import type { CollectionConfig } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'
import { usersAccess } from './users.access'
import { usersFields } from './users.fields'
import { protectFirstSuperAdmin } from './users.hooks'

export const Users: CollectionConfig = {
  slug: COLLECTION_SLUGS.users,
  access: usersAccess,
  admin: {
    defaultColumns: ['email', 'name', 'roles', 'status', 'updatedAt'],
    group: 'System',
    useAsTitle: 'email',
  },
  auth: true,
  fields: usersFields,
  hooks: {
    beforeChange: [protectFirstSuperAdmin],
  },
  timestamps: true,
}
