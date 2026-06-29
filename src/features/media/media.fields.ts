import type { Field } from 'payload'

export const mediaFields: Field[] = [
  {
    name: 'alt',
    type: 'text',
    required: true,
  },
  {
    name: 'caption',
    type: 'textarea',
  },
  {
    name: 'credit',
    type: 'text',
  },
  {
    name: 'visibility',
    type: 'select',
    defaultValue: 'public',
    options: ['public', 'authenticated'],
    required: true,
  },
]
