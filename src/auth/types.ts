import type { Where } from 'payload'

import type { AccountStatus, AuthAction, AuthEffect, AuthResource, AuthScope } from './constants'

export type RelationValue<T extends PolicyRecord = PolicyRecord> = string | number | T | null | undefined

export type PolicyRecord = {
  id?: string | number
  [key: string]: unknown
}

export type PermissionConditions = {
  customWhere?: Where | null
  ownerField?: string | null
  publicWhere?: Where | null
  scope?: AuthScope | null
  tenantField?: string | null
  tenantUserField?: string | null
  userField?: string | null
}

export type PolicyPermission = PolicyRecord & {
  action?: AuthAction | string | null
  conditions?: PermissionConditions | null
  effect?: AuthEffect | string | null
  enabled?: boolean | null
  key?: string | null
  resource?: AuthResource | string | null
  validFrom?: string | null
  validUntil?: string | null
}

export type PolicyRole = PolicyRecord & {
  enabled?: boolean | null
  inherits?: RelationValue<PolicyRole>[] | null
  isSuperAdmin?: boolean | null
  key?: string | null
  permissions?: RelationValue<PolicyPermission>[] | null
}

export type PolicyRoleAssignment = PolicyRecord & {
  enabled?: boolean | null
  endsAt?: string | null
  role?: RelationValue<PolicyRole>
  startsAt?: string | null
  tenant?: string | null
}

export type PolicyUser = PolicyRecord & {
  accountStatus?: AccountStatus | string | null
  attributes?: Record<string, unknown> | null
  collection?: string | null
  department?: string | null
  directPermissions?: RelationValue<PolicyPermission>[] | null
  email?: string | null
  roleAssignments?: PolicyRoleAssignment[] | null
  roles?: RelationValue<PolicyRole>[] | null
  tenant?: string | null
}

export type PermissionGrant = {
  permission: PolicyPermission
  source?: 'direct' | 'role'
  sourceKey?: string | null
  tenant?: string | null
}

export type AccessProfile = {
  grants: PermissionGrant[]
  isSuperAdmin: boolean
  roles: PolicyRole[]
  user: PolicyUser
}

export type PolicyEvaluationOptions = {
  action: AuthAction | string
  booleanOnly?: boolean
  now?: Date
  resource: AuthResource | string
  scopedBoolean?: boolean
}

export type PolicyEvaluationResult = boolean | Where
