import type { CollectionConfig } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'
import { auditHook, revalidateHook } from '@/shared/hooks'
import { validateWorkflowTransition } from '@/shared/workflow'
import { reportsAccess } from './reports.access'
import { reportsFields } from './reports.fields'
import { populateReportSlug } from './reports.hooks'

export const Reports: CollectionConfig = {
  slug: COLLECTION_SLUGS.reports,
  access: reportsAccess,
  admin: {
    defaultColumns: ['title', 'year', 'period', 'workflowStatus', '_status', 'publishedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: reportsFields,
  hooks: {
    afterChange: [auditHook, revalidateHook],
    beforeChange: [validateWorkflowTransition],
    beforeValidate: [populateReportSlug],
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
