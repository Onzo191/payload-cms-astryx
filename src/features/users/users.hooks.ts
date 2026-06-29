import type { CollectionBeforeChangeHook } from 'payload'

export const protectFirstSuperAdmin: CollectionBeforeChangeHook = ({ data }) => {
  return data
}
