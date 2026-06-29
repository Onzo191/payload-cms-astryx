import type { Field } from 'payload'

export const heroField = (): Field => ({
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'standard',
      options: ['standard', 'compact', 'immersive'],
    },
  ],
})
