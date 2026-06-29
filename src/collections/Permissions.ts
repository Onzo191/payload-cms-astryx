import type { CollectionConfig } from 'payload'

import { canCollection, canCollectionBoolean, canField } from '@/auth/access'
import {
  AUTH_ACTION_OPTIONS,
  AUTH_COLLECTION_GROUP,
  AUTH_EFFECT_OPTIONS,
  AUTH_RESOURCE_OPTIONS,
  AUTH_SCOPE_OPTIONS,
} from '@/auth/constants'

const optionList = <T extends readonly { label: string; value: string }[]>(options: T) =>
  options.map((option) => ({ ...option }))

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  access: {
    admin: canCollectionBoolean('permissions', 'admin'),
    create: canCollectionBoolean('permissions', 'create'),
    delete: canCollection('permissions', 'delete'),
    read: canCollection('permissions', 'read'),
    update: canCollection('permissions', 'update'),
  },
  admin: {
    defaultColumns: ['name', 'key', 'resource', 'action', 'effect', 'enabled'],
    group: AUTH_COLLECTION_GROUP,
    listSearchableFields: ['name', 'key', 'resource', 'action'],
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
        description: 'Stable machine key, for example users.read.own.',
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
          name: 'resource',
          type: 'select',
          admin: {
            width: '40%',
          },
          defaultValue: 'users',
          index: true,
          options: optionList(AUTH_RESOURCE_OPTIONS),
          required: true,
        },
        {
          name: 'action',
          type: 'select',
          admin: {
            width: '30%',
          },
          defaultValue: 'read',
          index: true,
          options: optionList(AUTH_ACTION_OPTIONS),
          required: true,
        },
        {
          name: 'effect',
          type: 'select',
          admin: {
            width: '30%',
          },
          defaultValue: 'allow',
          options: optionList(AUTH_EFFECT_OPTIONS),
          required: true,
        },
      ],
    },
    {
      name: 'conditions',
      type: 'group',
      fields: [
        {
          name: 'scope',
          type: 'select',
          defaultValue: 'global',
          options: optionList(AUTH_SCOPE_OPTIONS),
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ownerField',
              type: 'text',
              admin: {
                condition: (_data, siblingData) => siblingData?.scope === 'own',
                description: 'Document field compared to the current account. Common values: id, createdBy.',
                width: '50%',
              },
              defaultValue: 'createdBy',
            },
            {
              name: 'userField',
              type: 'text',
              admin: {
                condition: (_data, siblingData) => siblingData?.scope === 'own',
                description: 'Account field used for ownership comparison. Common value: id.',
                width: '50%',
              },
              defaultValue: 'id',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'tenantField',
              type: 'text',
              admin: {
                condition: (_data, siblingData) => siblingData?.scope === 'tenant',
                description: 'Document field compared to account tenant.',
                width: '50%',
              },
              defaultValue: 'tenant',
            },
            {
              name: 'tenantUserField',
              type: 'text',
              admin: {
                condition: (_data, siblingData) => siblingData?.scope === 'tenant',
                description: 'Account field that stores tenant identity.',
                width: '50%',
              },
              defaultValue: 'tenant',
            },
          ],
        },
        {
          name: 'publicWhere',
          type: 'json',
          admin: {
            condition: (_data, siblingData) => siblingData?.scope === 'public',
            description: 'Payload where filter for public documents.',
          },
          defaultValue: {
            _status: {
              equals: 'published',
            },
          },
        },
        {
          name: 'customWhere',
          type: 'json',
          admin: {
            condition: (_data, siblingData) => siblingData?.scope === 'custom',
            description:
              'Payload where filter. Supports tokens like $user.id, $user.tenant, $grant.tenant, and $now.',
          },
        },
      ],
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
          name: 'validFrom',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '33%',
          },
        },
        {
          name: 'validUntil',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'system',
      type: 'checkbox',
      access: {
        update: canField('*', 'manage'),
      },
      admin: {
        description: 'Seed-managed permission. Only super admins can change this flag.',
        position: 'sidebar',
      },
      defaultValue: false,
    },
  ],
  timestamps: true,
}
