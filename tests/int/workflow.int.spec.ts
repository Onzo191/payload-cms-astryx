import { describe, expect, it } from 'vitest'

import { canPublish, canReview, isValidTransition } from '@/shared/workflow'

describe('workflow primitives', () => {
  it('allows configured transitions', () => {
    expect(isValidTransition('draft', 'review')).toBe(true)
    expect(isValidTransition('review', 'approved')).toBe(true)
    expect(isValidTransition('approved', 'published')).toBe(true)
  })

  it('rejects invalid transitions', () => {
    expect(isValidTransition('draft', 'published')).toBe(false)
    expect(isValidTransition('archived', 'published')).toBe(false)
  })

  it('checks publish and review roles', () => {
    expect(canPublish({ roles: ['admin'] })).toBe(true)
    expect(canPublish({ roles: ['editor'] })).toBe(false)
    expect(canReview({ roles: ['reviewer'] })).toBe(true)
  })
})
