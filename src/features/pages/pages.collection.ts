import type { CollectionConfig } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'
import { auditHook, revalidateHook } from '@/shared/hooks'
import { validateWorkflowTransition } from '@/shared/workflow'
import { pagesAccess } from './pages.access'
import { pagesFields } from './pages.fields'
import { populateFullPath, populatePageSlug } from './pages.hooks'

export const Pages: CollectionConfig = {
  slug: COLLECTION_SLUGS.pages,
  access: pagesAccess,
  admin: {
    defaultColumns: ['title', 'slug', 'workflowStatus', '_status', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: pagesFields,
  hooks: {
    afterChange: [auditHook, revalidateHook],
    beforeChange: [populateFullPath, validateWorkflowTransition],
    beforeValidate: [populatePageSlug],
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
