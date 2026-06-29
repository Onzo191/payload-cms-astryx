import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, requireRole } from '@/shared/access'

export const pagesAccess: CollectionConfig['access'] = {
  create: requireRole(['super-admin', 'admin', 'editor']),
  delete: requireRole(['super-admin', 'admin']),
  read: authenticatedOrPublished,
  update: requireRole(['super-admin', 'admin', 'editor']),
}
