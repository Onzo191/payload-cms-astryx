import type { CollectionConfig } from 'payload'

import { requireRole } from '@/shared/access/requireRole'

export const mediaAccess: CollectionConfig['access'] = {
  create: requireRole(['super-admin', 'admin', 'editor', 'author']),
  delete: requireRole(['super-admin', 'admin']),
  read: () => true,
  update: requireRole(['super-admin', 'admin', 'editor', 'author']),
}
