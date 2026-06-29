import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, requireRole } from '@/shared/access'

export const newsAccess: CollectionConfig['access'] = {
  create: requireRole(['super-admin', 'admin', 'editor', 'author']),
  delete: requireRole(['super-admin', 'admin']),
  read: authenticatedOrPublished,
  update: requireRole(['super-admin', 'admin', 'editor', 'author']),
}
