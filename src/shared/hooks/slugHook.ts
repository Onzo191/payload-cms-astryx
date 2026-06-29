import type { CollectionBeforeValidateHook } from 'payload'

export const formatSlug = (value: string): string => {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const populateSlugFrom = (sourceField = 'title'): CollectionBeforeValidateHook => {
  return ({ data }) => {
    if (!data) return data

    const source = data[sourceField]

    if (!data.slug && typeof source === 'string') {
      data.slug = formatSlug(source)
    }

    return data
  }
}
