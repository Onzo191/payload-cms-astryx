import type { CollectionAfterChangeHook } from 'payload'

export const revalidateHook: CollectionAfterChangeHook = ({ doc }) => {
  return doc
}
