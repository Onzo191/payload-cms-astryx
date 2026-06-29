import type { CollectionConfig } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'
import { slugField } from '@/shared/fields'
import { populateSlugFrom } from '@/shared/hooks'
import { taxonomyAccess } from './taxonomy.access'

export const Tags: CollectionConfig = {
  slug: COLLECTION_SLUGS.tags,
  access: taxonomyAccess,
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Taxonomy',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
  ],
  hooks: {
    beforeValidate: [populateSlugFrom('title')],
  },
  timestamps: true,
}
