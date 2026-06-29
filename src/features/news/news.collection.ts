import type { CollectionConfig } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'
import { auditHook, revalidateHook } from '@/shared/hooks'
import { validateWorkflowTransition } from '@/shared/workflow'
import { newsAccess } from './news.access'
import { newsFields } from './news.fields'
import { populateNewsSlug } from './news.hooks'

export const News: CollectionConfig = {
  slug: COLLECTION_SLUGS.news,
  access: newsAccess,
  admin: {
    defaultColumns: ['title', 'author', 'workflowStatus', '_status', 'publishedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: newsFields,
  hooks: {
    afterChange: [auditHook, revalidateHook],
    beforeChange: [validateWorkflowTransition],
    beforeValidate: [populateNewsSlug],
  },
  timestamps: true,
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    maxPerDoc: 100,
  },
}
