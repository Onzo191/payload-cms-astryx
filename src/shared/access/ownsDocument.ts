import type { Access } from 'payload'

import { isAdmin } from './requireRole'

export const ownsDocument = (ownerField = 'createdBy'): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    if (isAdmin(user)) return true

    return {
      [ownerField]: {
        equals: user.id,
      },
    }
  }
}
