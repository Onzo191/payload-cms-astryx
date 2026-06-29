import type { CollectionConfig } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'
import { auditAccess } from './audit.access'

export const AuditLogs: CollectionConfig = {
  slug: COLLECTION_SLUGS.auditLogs,
  access: auditAccess,
  admin: {
    defaultColumns: ['collectionSlug', 'documentId', 'action', 'actor', 'createdAt'],
    group: 'System',
    useAsTitle: 'documentId',
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      options: ['create', 'update'],
      required: true,
    },
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'collectionSlug',
      type: 'text',
      index: true,
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
      index: true,
      required: true,
    },
    {
      name: 'previousValue',
      type: 'json',
    },
    {
      name: 'nextValue',
      type: 'json',
    },
  ],
  timestamps: true,
}
