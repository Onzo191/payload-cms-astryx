import type { CollectionConfig } from 'payload'

import { requireRole } from '@/shared/access'

export const auditAccess: CollectionConfig['access'] = {
  create: requireRole(['super-admin']),
  delete: requireRole(['super-admin']),
  read: requireRole(['super-admin', 'admin']),
  update: requireRole(['super-admin']),
}
