import type { CollectionConfig } from 'payload'

import {
  canCollection,
  canCollectionBoolean,
  canField,
  combineAccessResults,
  selfUserAccess,
} from '@/auth/access'
import { applyAccountLifecycle, preventHardDeleteMicrosoftAccount } from '@/auth/accountLifecycle'
import { assignDefaultAccountRole } from '@/auth/defaults'
import { ACCOUNT_STATUS_OPTIONS } from '@/auth/constants'

const accountStatusOptions = ACCOUNT_STATUS_OPTIONS.map((option) => ({ ...option }))
const userReadAccess = canCollection('users', 'read')
const userUpdateAccess = canCollection('users', 'update')

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: canCollectionBoolean('users', 'admin'),
    create: canCollectionBoolean('users', 'create', {
      allowFirstUserCreate: true,
    }),
    delete: canCollection('users', 'delete'),
    read: async (args) => combineAccessResults(await userReadAccess(args), selfUserAccess(args)),
    unlock: canCollectionBoolean('users', 'unlock'),
    update: async (args) => combineAccessResults(await userUpdateAccess(args), selfUserAccess(args)),
  },
  admin: {
    defaultColumns: ['email', 'displayName', 'accountStatus', 'tenant', 'updatedAt'],
    group: 'Access Control',
    listSearchableFields: ['email', 'displayName', 'firstName', 'lastName', 'tenant'],
    useAsTitle: 'email',
  },
  auth: {
    lockTime: 10 * 60 * 1000,
    maxLoginAttempts: 5,
    tokenExpiration: 60 * 60 * 8,
    useAPIKey: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'displayName',
          type: 'text',
          admin: {
            width: '34%',
          },
          index: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'authProvider',
          type: 'select',
          access: {
            create: () => false,
            update: () => false,
          },
          admin: {
            readOnly: true,
            width: '25%',
          },
          defaultValue: 'local',
          options: [
            { label: 'Local', value: 'local' },
            { label: 'Microsoft', value: 'microsoft' },
          ],
          saveToJWT: true,
        },
        {
          name: 'accountStatus',
          type: 'select',
          access: {
            update: canField('users', 'manage'),
          },
          admin: {
            width: '25%',
          },
          defaultValue: 'active',
          index: true,
          options: accountStatusOptions,
          required: true,
          saveToJWT: true,
        },
        {
          name: 'tenant',
          type: 'text',
          access: {
            update: canField('users', 'manage'),
          },
          admin: {
            description: 'Primary tenant key used by tenant-scoped ABAC rules.',
            width: '25%',
          },
          index: true,
          saveToJWT: true,
        },
        {
          name: 'department',
          type: 'text',
          access: {
            update: canField('users', 'manage'),
          },
          admin: {
            width: '25%',
          },
          index: true,
          saveToJWT: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lastMicrosoftLoginAt',
          type: 'date',
          access: {
            update: () => false,
          },
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Set automatically after a successful Microsoft login.',
            readOnly: true,
            width: '33%',
          },
        },
        {
          name: 'offboardedAt',
          type: 'date',
          access: {
            update: () => false,
          },
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Set automatically when the account is offboarded.',
            readOnly: true,
            width: '33%',
          },
        },
        {
          name: 'deactivationReason',
          type: 'text',
          access: {
            update: () => false,
          },
          admin: {
            description: 'Set automatically when the account is suspended, locked, or offboarded.',
            readOnly: true,
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'microsoftObjectID',
      type: 'text',
      access: {
        read: canField('users', 'manage'),
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      index: true,
      unique: true,
    },
    {
      name: 'microsoftTenantID',
      type: 'text',
      access: {
        read: canField('users', 'manage'),
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      index: true,
    },
    {
      name: 'microsoftLinkedAt',
      type: 'date',
      access: {
        read: canField('users', 'manage'),
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'microsoftIdentityNote',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/MicrosoftIdentityNote',
        },
      },
    },
    {
      name: 'roles',
      type: 'relationship',
      access: {
        read: canField('*', 'manage'),
        update: canField('*', 'manage'),
      },
      admin: {
        description: 'Baseline roles that are always active for this account.',
      },
      hasMany: true,
      maxDepth: 3,
      relationTo: 'roles',
      saveToJWT: true,
    },
    {
      name: 'roleAssignments',
      type: 'array',
      access: {
        read: canField('*', 'manage'),
        update: canField('*', 'manage'),
      },
      admin: {
        description:
          'Dynamic role grants. Tenant and date bounds are folded into policy evaluation.',
      },
      fields: [
        {
          name: 'role',
          type: 'relationship',
          maxDepth: 3,
          relationTo: 'roles',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'tenant',
              type: 'text',
              admin: {
                description: 'Optional tenant key that constrains this role grant.',
                width: '33%',
              },
            },
            {
              name: 'startsAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                width: '33%',
              },
            },
            {
              name: 'endsAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                width: '34%',
              },
            },
          ],
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'note',
          type: 'textarea',
        },
      ],
      saveToJWT: false,
    },
    {
      name: 'directPermissions',
      type: 'relationship',
      access: {
        read: canField('*', 'manage'),
        update: canField('*', 'manage'),
      },
      admin: {
        description: 'Emergency per-account permission grants. Prefer roles for normal use.',
      },
      hasMany: true,
      maxDepth: 2,
      relationTo: 'permissions',
      saveToJWT: false,
    },
    {
      name: 'attributes',
      type: 'json',
      admin: {
        description: 'Free-form ABAC attributes. Reference via $user.attributes.someKey.',
      },
    },
  ],
  hooks: {
    beforeChange: [assignDefaultAccountRole, applyAccountLifecycle],
    beforeDelete: [preventHardDeleteMicrosoftAccount],
  },
}
