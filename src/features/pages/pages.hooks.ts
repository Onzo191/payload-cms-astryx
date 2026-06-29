import type { CollectionBeforeChangeHook } from 'payload'

import { populateSlugFrom } from '@/shared/hooks'

export const populatePageSlug = populateSlugFrom('title')

export const populateFullPath: CollectionBeforeChangeHook = ({ data }) => {
  if (typeof data.slug === 'string') {
    data.fullPath = data.slug === 'home' ? '/' : `/${data.slug}`
  }

  return data
}
