import type { Field } from 'payload'

import { ROLE_LABELS, USER_ROLES } from '@/shared/constants/roles'

export const usersFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    defaultValue: 'Unnamed User',
    required: true,
  },
  {
    name: 'roles',
    type: 'select',
    access: {
      update: ({ req: { user } }) => {
        const roles = Array.isArray(user?.roles) ? user.roles : []

        return roles.includes('super-admin') || roles.includes('admin')
      },
    },
    admin: {
      position: 'sidebar',
    },
    defaultValue: ['viewer'],
    hasMany: true,
    options: USER_ROLES.map((role) => ({
      label: ROLE_LABELS[role],
      value: role,
    })),
    required: true,
    saveToJWT: true,
  },
  {
    name: 'status',
    type: 'select',
    admin: {
      position: 'sidebar',
    },
    defaultValue: 'active',
    options: ['active', 'invited', 'suspended'],
    required: true,
    saveToJWT: true,
  },
  {
    name: 'avatar',
    type: 'upload',
    relationTo: 'media',
  },
  {
    name: 'bio',
    type: 'textarea',
  },
]
