import type { Block } from 'payload'

import { heroField } from '@/shared/fields/heroField'

export const heroBlock: Block = {
  slug: 'hero',
  fields: [heroField()],
}
