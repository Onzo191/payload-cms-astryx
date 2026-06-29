import type { CollectionConfig } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'
import { mediaAccess } from './media.access'
import { mediaFields } from './media.fields'

export const Media: CollectionConfig = {
  slug: COLLECTION_SLUGS.media,
  access: mediaAccess,
  admin: {
    defaultColumns: ['filename', 'alt', 'visibility', 'updatedAt'],
    group: 'Assets',
  },
  fields: mediaFields,
  timestamps: true,
  upload: {
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        height: 300,
        width: 400,
      },
      {
        name: 'card',
        height: 630,
        width: 1200,
      },
    ],
  },
}
