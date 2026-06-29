import type { CollectionConfig } from 'payload'

import { isAdmin, requireRole } from '@/shared/access/requireRole'

export const usersAccess: CollectionConfig['access'] = {
  admin: ({ req: { user } }) => Boolean(user),
  create: requireRole(['super-admin', 'admin']),
  delete: requireRole(['super-admin']),
  read: ({ req: { user } }) => {
    if (!user) return false
    if (isAdmin(user)) return true

    return {
      id: {
        equals: user.id,
      },
    }
  },
  update: ({ req: { user } }) => Boolean(user),
}
