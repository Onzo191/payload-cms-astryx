import type { TextField } from 'payload'

type SlugFieldOverrides = Partial<
  Pick<TextField, 'access' | 'admin' | 'defaultValue' | 'index' | 'label' | 'required' | 'unique'>
>

export const slugField = (overrides: SlugFieldOverrides = {}): TextField => ({
  name: 'slug',
  type: 'text',
  admin: {
    description: 'URL-safe identifier. Leave blank to generate it from the title.',
    position: 'sidebar',
  },
  index: true,
  required: true,
  unique: true,
  ...overrides,
})
