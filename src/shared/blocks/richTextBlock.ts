import type { Block } from 'payload'

export const richTextBlock: Block = {
  slug: 'richText',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
