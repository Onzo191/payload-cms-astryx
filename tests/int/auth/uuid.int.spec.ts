import { describe, expect, it } from 'vitest'

import { createUUIDv7, UUID_V7_REGEX } from '@/auth/uuid'

describe('UUID helpers', () => {
  it('creates RFC 9562 UUID v7 values', () => {
    const id = createUUIDv7(new Date('2026-01-01T00:00:00.000Z'))

    expect(id).toMatch(UUID_V7_REGEX)
    expect(id.slice(14, 15)).toBe('7')
  })
})
