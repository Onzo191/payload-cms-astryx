import type { Field } from 'payload'

import { heroField, seoField, slugField, workflowFields } from '@/shared/fields'
import { pageBlocks } from './pages.blocks'

export const pagesFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  slugField(),
  {
    name: 'parent',
    type: 'relationship',
    admin: {
      position: 'sidebar',
    },
    relationTo: 'pages',
  },
  {
    name: 'fullPath',
    type: 'text',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
    index: true,
  },
  heroField(),
  {
    name: 'layout',
    type: 'blocks',
    blocks: pageBlocks,
  },
  seoField(),
  ...workflowFields(),
]
