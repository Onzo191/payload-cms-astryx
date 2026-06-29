import type { CollectionConfig } from 'payload'

import { requireRole } from '@/shared/access'

export const taxonomyAccess: CollectionConfig['access'] = {
  create: requireRole(['super-admin', 'admin', 'editor']),
  delete: requireRole(['super-admin', 'admin']),
  read: () => true,
  update: requireRole(['super-admin', 'admin', 'editor']),
}
