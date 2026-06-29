import type { Block } from 'payload'

export const reportEmbedBlock: Block = {
  slug: 'reportEmbed',
  fields: [
    {
      name: 'report',
      type: 'relationship',
      relationTo: 'reports',
      required: true,
    },
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'summary',
      options: ['summary', 'card', 'download'],
    },
  ],
}
