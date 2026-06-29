import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'
import { UUID_V7_REGEX } from '@/auth/uuid'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('uses UUID v7 document IDs', async () => {
    expect(payload.db.defaultIDType).toBe('text')
    expect(payload.db.idType).toBe('uuidv7')

    const roles = await payload.find({
      collection: 'roles',
      depth: 0,
      limit: 1,
    })

    expect(roles.docs[0]?.id).toMatch(UUID_V7_REGEX)
  })
})
