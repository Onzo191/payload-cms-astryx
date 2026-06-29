import { describe, expect, it } from 'vitest'

import {
  isAllowedMicrosoftEmail,
  safeMicrosoftReturnPath,
  validateMicrosoftClaims,
} from '@/auth/microsoft'

const now = new Date('2026-01-01T00:00:00.000Z')
const validClaims = {
  aud: 'client-id',
  exp: Math.floor(now.getTime() / 1000) + 600,
  iss: 'https://login.microsoftonline.com/tenant-id/v2.0',
  nbf: Math.floor(now.getTime() / 1000) - 60,
  nonce: 'nonce-value',
  oid: 'object-id',
  preferred_username: 'User@VNG.com.vn',
  tid: 'tenant-id',
}

describe('Microsoft auth helpers', () => {
  it('allows only exact @vng.com.vn email addresses', () => {
    expect(isAllowedMicrosoftEmail('user@vng.com.vn')).toBe(true)
    expect(isAllowedMicrosoftEmail('USER@VNG.COM.VN')).toBe(true)
    expect(isAllowedMicrosoftEmail('user@vng.com.vn.evil.test')).toBe(false)
    expect(isAllowedMicrosoftEmail('user@example.com')).toBe(false)
  })

  it('validates Microsoft claims and normalizes the account email', () => {
    expect(
      validateMicrosoftClaims({
        allowedDomain: 'vng.com.vn',
        claims: validClaims,
        clientID: 'client-id',
        nonce: 'nonce-value',
        now,
        tenantID: 'tenant-id',
      }),
    ).toEqual({
      email: 'user@vng.com.vn',
      familyName: undefined,
      givenName: undefined,
      name: undefined,
      objectID: 'object-id',
      tenantID: 'tenant-id',
    })
  })

  it('accepts only relative Microsoft return paths', () => {
    expect(safeMicrosoftReturnPath('/admin/users', '/admin')).toBe('/admin/users')
    expect(safeMicrosoftReturnPath('https://evil.example/admin', '/admin')).toBe('/admin')
    expect(safeMicrosoftReturnPath('//evil.example/admin', '/admin')).toBe('/admin')
    expect(safeMicrosoftReturnPath('admin/users', '/admin')).toBe('/admin')
  })

  it('rejects invalid nonce, audience, tenant, and issuer', () => {
    expect(() =>
      validateMicrosoftClaims({
        allowedDomain: 'vng.com.vn',
        claims: validClaims,
        clientID: 'wrong-client-id',
        nonce: 'nonce-value',
        now,
        tenantID: 'tenant-id',
      }),
    ).toThrow('audience')

    expect(() =>
      validateMicrosoftClaims({
        allowedDomain: 'vng.com.vn',
        claims: validClaims,
        clientID: 'client-id',
        nonce: 'wrong-nonce',
        now,
        tenantID: 'tenant-id',
      }),
    ).toThrow('nonce')

    expect(() =>
      validateMicrosoftClaims({
        allowedDomain: 'vng.com.vn',
        claims: validClaims,
        clientID: 'client-id',
        nonce: 'nonce-value',
        now,
        tenantID: 'other-tenant-id',
      }),
    ).toThrow('tenant')

    expect(() =>
      validateMicrosoftClaims({
        allowedDomain: 'vng.com.vn',
        claims: {
          ...validClaims,
          iss: 'https://issuer.example.com/tenant-id/v2.0',
        },
        clientID: 'client-id',
        nonce: 'nonce-value',
        now,
        tenantID: 'tenant-id',
      }),
    ).toThrow('issuer')
  })
})
