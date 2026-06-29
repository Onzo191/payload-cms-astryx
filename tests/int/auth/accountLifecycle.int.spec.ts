import { describe, expect, it } from 'vitest'

import { buildInactiveAccountUpdate, isInactiveAccountStatus } from '@/auth/accountLifecycle'

const now = new Date('2026-01-01T00:00:00.000Z')

describe('account lifecycle helpers', () => {
  it('keeps active and invited accounts unchanged', () => {
    expect(isInactiveAccountStatus('active')).toBe(false)
    expect(isInactiveAccountStatus('invited')).toBe(false)
    expect(buildInactiveAccountUpdate({ data: { accountStatus: 'active' }, now })).toEqual({
      accountStatus: 'active',
    })
  })

  it('clears sessions and records offboarding metadata for offboarded accounts', () => {
    expect(
      buildInactiveAccountUpdate({
        data: {
          accountStatus: 'offboarded',
          sessions: [
            {
              createdAt: now.toISOString(),
              expiresAt: '2026-01-02T00:00:00.000Z',
              id: 'session-id',
            },
          ],
        },
        now,
      }),
    ).toEqual({
      accountStatus: 'offboarded',
      deactivationReason: 'account-status-deactivated',
      offboardedAt: now.toISOString(),
      sessions: [],
    })
  })

  it('clears sessions for suspended and locked accounts without forcing offboardedAt', () => {
    expect(
      buildInactiveAccountUpdate({
        data: {
          accountStatus: 'suspended',
          deactivationReason: 'manual-suspension',
        },
        now,
      }),
    ).toEqual({
      accountStatus: 'suspended',
      deactivationReason: 'manual-suspension',
      offboardedAt: undefined,
      sessions: [],
    })
  })
})
