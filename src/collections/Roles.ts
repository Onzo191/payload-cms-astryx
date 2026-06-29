import type { CollectionConfig } from 'payload'

import { canCollection, canCollectionBoolean, canField } from '@/auth/access'
import { AUTH_COLLECTION_GROUP } from '@/auth/constants'

export const Roles: CollectionConfig = {
  slug: 'roles',
  access: {
    admin: canCollectionBoolean('roles', 'admin'),
    create: canCollectionBoolean('roles', 'create'),
    delete: canCollection('roles', 'delete'),
    read: canCollection('roles', 'read'),
    update: canCollection('roles', 'update'),
  },
  admin: {
    defaultColumns: ['name', 'key', 'enabled', 'isSuperAdmin', 'updatedAt'],
    group: AUTH_COLLECTION_GROUP,
    listSearchableFields: ['name', 'key'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      index: true,
      required: true,
    },
    {
      name: 'key',
      type: 'text',
      admin: {
        description: 'Stable machine key, for example account-manager.',
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          admin: {
            width: '33%',
          },
          defaultValue: true,
        },
        {
          name: 'level',
          type: 'number',
          admin: {
            description: 'Optional hierarchy marker. Lower numbers are more privileged.',
            width: '33%',
          },
          defaultValue: 100,
          min: 0,
        },
        {
          name: 'isSuperAdmin',
          type: 'checkbox',
          access: {
            update: canField('*', 'manage'),
          },
          admin: {
            description: 'Bypasses policy checks. Only super admins can update this field.',
            width: '33%',
          },
          defaultValue: false,
        },
      ],
    },
    {
      name: 'inherits',
      type: 'relationship',
      admin: {
        description: 'Optional parent roles. Permissions are inherited recursively.',
      },
      hasMany: true,
      maxDepth: 3,
      relationTo: 'roles',
    },
    {
      name: 'permissions',
      type: 'relationship',
      admin: {
        description: 'Permission policies granted by this role.',
      },
      hasMany: true,
      maxDepth: 2,
      relationTo: 'permissions',
      required: true,
    },
    {
      name: 'system',
      type: 'checkbox',
      access: {
        update: canField('*', 'manage'),
      },
      admin: {
        description: 'Seed-managed role. Only super admins can change this flag.',
        position: 'sidebar',
      },
      defaultValue: false,
    },
  ],
  timestamps: true,
}
