import type { Field } from 'payload'

export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  admin: {
    description: 'Search, social, and crawler metadata.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 70,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 170,
    },
    {
      name: 'canonicalUrl',
      type: 'text',
    },
    {
      name: 'robots',
      type: 'select',
      defaultValue: 'index-follow',
      options: [
        { label: 'Index, Follow', value: 'index-follow' },
        { label: 'Noindex, Follow', value: 'noindex-follow' },
        { label: 'Noindex, Nofollow', value: 'noindex-nofollow' },
      ],
    },
    {
      name: 'openGraphImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'schemaType',
      type: 'select',
      defaultValue: 'WebPage',
      options: ['WebPage', 'NewsArticle', 'Report', 'Article'],
    },
  ],
})
