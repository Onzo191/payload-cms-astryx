import type { Access, PayloadRequest } from 'payload'

import type { UserRole } from '@/shared/constants/roles'

type UserWithRoles = {
  id?: number | string
  roles?: string[] | null
}

export const getUserRoles = (user: PayloadRequest['user'] | unknown): UserRole[] => {
  const roles = (user as UserWithRoles | null | undefined)?.roles

  return Array.isArray(roles) ? (roles as UserRole[]) : []
}

export const hasRole = (
  user: PayloadRequest['user'] | unknown,
  allowedRoles: readonly UserRole[],
): boolean => {
  const roles = getUserRoles(user)

  return roles.some((role) => allowedRoles.includes(role))
}

export const requireRole = (allowedRoles: readonly UserRole[]): Access => {
  return ({ req: { user } }) => hasRole(user, allowedRoles)
}

export const isSuperAdmin = (user: PayloadRequest['user'] | unknown): boolean => {
  return hasRole(user, ['super-admin'])
}

export const isAdmin = (user: PayloadRequest['user'] | unknown): boolean => {
  return hasRole(user, ['super-admin', 'admin'])
}
