import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { canCollection, canCollectionBoolean, canField } from '@/auth/access'

const setCreatedBy: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && req.user?.id && !data?.createdBy) {
    return {
      ...data,
      createdBy: req.user.id,
    }
  }

  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    admin: canCollectionBoolean('media', 'admin'),
    create: canCollectionBoolean('media', 'create'),
    delete: canCollection('media', 'delete'),
    read: () => true,
    update: canCollection('media', 'update'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      access: {
        read: canField('media', 'manage'),
        update: canField('media', 'manage'),
      },
      admin: {
        position: 'sidebar',
      },
      index: true,
      maxDepth: 1,
      relationTo: 'users',
    },
  ],
  hooks: {
    beforeChange: [setCreatedBy],
  },
  upload: true,
}
