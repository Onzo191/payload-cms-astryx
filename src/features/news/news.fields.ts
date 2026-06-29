import type { Field } from 'payload'

import { heroField, seoField, slugField, workflowFields } from '@/shared/fields'

export const newsFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  slugField(),
  {
    name: 'excerpt',
    type: 'textarea',
    required: true,
  },
  heroField(),
  {
    name: 'content',
    type: 'richText',
    required: true,
  },
  {
    name: 'author',
    type: 'relationship',
    admin: {
      position: 'sidebar',
    },
    relationTo: 'users',
  },
  {
    name: 'categories',
    type: 'relationship',
    admin: {
      position: 'sidebar',
    },
    hasMany: true,
    relationTo: 'categories',
  },
  {
    name: 'tags',
    type: 'relationship',
    admin: {
      position: 'sidebar',
    },
    hasMany: true,
    relationTo: 'tags',
  },
  seoField(),
  ...workflowFields(),
]
