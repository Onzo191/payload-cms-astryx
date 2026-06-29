import type { Field } from 'payload'

import { seoField, slugField, workflowFields } from '@/shared/fields'

export const reportsFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  slugField(),
  {
    name: 'year',
    type: 'number',
    admin: {
      position: 'sidebar',
    },
    index: true,
    required: true,
  },
  {
    name: 'period',
    type: 'select',
    admin: {
      position: 'sidebar',
    },
    defaultValue: 'annual',
    options: ['annual', 'quarterly', 'monthly', 'custom'],
    required: true,
  },
  {
    name: 'reportType',
    type: 'select',
    admin: {
      position: 'sidebar',
    },
    defaultValue: 'revenue',
    options: ['revenue', 'financial', 'impact', 'operations', 'other'],
    required: true,
  },
  {
    name: 'file',
    type: 'upload',
    relationTo: 'media',
    required: true,
  },
  {
    name: 'summary',
    type: 'textarea',
    required: true,
  },
  {
    name: 'keyMetrics',
    type: 'array',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'value',
        type: 'text',
        required: true,
      },
      {
        name: 'unit',
        type: 'text',
      },
    ],
  },
  {
    name: 'extractedText',
    type: 'textarea',
    admin: {
      description: 'Machine-readable text extracted from the uploaded report file.',
    },
  },
  {
    name: 'categories',
    type: 'relationship',
    hasMany: true,
    relationTo: 'categories',
  },
  seoField(),
  ...workflowFields(),
]
