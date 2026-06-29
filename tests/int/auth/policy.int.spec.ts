import { describe, expect, it } from 'vitest'

import { buildAccessProfile, evaluateAccessProfile } from '@/auth/policy'

const now = new Date('2026-01-01T00:00:00.000Z')

describe('DRBAC + ABAC policy evaluator', () => {
  it('allows super admins without explicit permission grants', () => {
    const profile = buildAccessProfile(
      {
        accountStatus: 'active',
        id: 'user-1',
        roles: [
          {
            enabled: true,
            isSuperAdmin: true,
            key: 'super-admin',
            permissions: [],
          },
        ],
      },
      now,
    )

    expect(evaluateAccessProfile(profile, { action: 'delete', now, resource: 'permissions' })).toBe(
      true,
    )
  })

  it('turns own-scope account permissions into a Payload where constraint', () => {
    const profile = buildAccessProfile(
      {
        accountStatus: 'active',
        id: 'user-1',
        roles: [
          {
            enabled: true,
            key: 'viewer',
            permissions: [
              {
                action: 'read',
                conditions: {
                  ownerField: 'id',
                  scope: 'own',
                  userField: 'id',
                },
                effect: 'allow',
                enabled: true,
                key: 'users.read.own',
                resource: 'users',
              },
            ],
          },
        ],
      },
      now,
    )

    expect(evaluateAccessProfile(profile, { action: 'read', now, resource: 'users' })).toEqual({
      id: {
        equals: 'user-1',
      },
    })
  })

  it('constrains dynamic role assignments to their tenant', () => {
    const profile = buildAccessProfile(
      {
        accountStatus: 'active',
        id: 'user-1',
        roleAssignments: [
          {
            enabled: true,
            role: {
              enabled: true,
              key: 'tenant-media-manager',
              permissions: [
                {
                  action: 'update',
                  conditions: {
                    scope: 'global',
                    tenantField: 'tenant',
                  },
                  effect: 'allow',
                  enabled: true,
                  key: 'media.update',
                  resource: 'media',
                },
              ],
            },
            tenant: 'tenant-a',
          },
        ],
      },
      now,
    )

    expect(evaluateAccessProfile(profile, { action: 'update', now, resource: 'media' })).toEqual({
      tenant: {
        equals: 'tenant-a',
      },
    })
  })

  it('interpolates custom where tokens from the current account', () => {
    const profile = buildAccessProfile(
      {
        accountStatus: 'active',
        attributes: {
          region: 'apac',
        },
        id: 'user-1',
        roles: [
          {
            enabled: true,
            key: 'regional-reader',
            permissions: [
              {
                action: 'read',
                conditions: {
                  customWhere: {
                    and: [
                      {
                        region: {
                          equals: '$user.attributes.region',
                        },
                      },
                      {
                        createdBy: {
                          equals: '$user.id',
                        },
                      },
                    ],
                  },
                  scope: 'custom',
                },
                effect: 'allow',
                enabled: true,
                key: 'media.read.region-own',
                resource: 'media',
              },
            ],
          },
        ],
      },
      now,
    )

    expect(evaluateAccessProfile(profile, { action: 'read', now, resource: 'media' })).toEqual({
      and: [
        {
          region: {
            equals: 'apac',
          },
        },
        {
          createdBy: {
            equals: 'user-1',
          },
        },
      ],
    })
  })

  it('ignores expired dynamic role assignments', () => {
    const profile = buildAccessProfile(
      {
        accountStatus: 'active',
        id: 'user-1',
        roleAssignments: [
          {
            enabled: true,
            endsAt: '2025-01-01T00:00:00.000Z',
            role: {
              enabled: true,
              key: 'expired-manager',
              permissions: [
                {
                  action: 'manage',
                  conditions: {
                    scope: 'global',
                  },
                  effect: 'allow',
                  enabled: true,
                  key: 'media.manage',
                  resource: 'media',
                },
              ],
            },
          },
        ],
      },
      now,
    )

    expect(evaluateAccessProfile(profile, { action: 'delete', now, resource: 'media' })).toBe(
      false,
    )
  })
})
