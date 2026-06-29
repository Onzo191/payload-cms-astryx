import type { Where } from 'payload'

import { ACTIVE_ACCOUNT_STATUSES, SUPER_ADMIN_ROLE_KEY } from './constants'
import type {
  AccessProfile,
  PermissionConditions,
  PermissionGrant,
  PolicyEvaluationOptions,
  PolicyEvaluationResult,
  PolicyPermission,
  PolicyRecord,
  PolicyRole,
  PolicyRoleAssignment,
  PolicyUser,
  RelationValue,
} from './types'

const DEFAULT_OWNER_FIELD = 'createdBy'
const DEFAULT_USER_FIELD = 'id'
const DEFAULT_TENANT_FIELD = 'tenant'
const DEFAULT_PUBLIC_WHERE: Where = {
  _status: {
    equals: 'published',
  },
}

const isRecord = (value: unknown): value is PolicyRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toArray = <T>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : [])

export const relationToRecord = <T extends PolicyRecord>(value: RelationValue<T>): T | null =>
  isRecord(value) ? (value as T) : null

const isPolicyPermission = (value: PolicyPermission | null): value is PolicyPermission =>
  value !== null

const getPath = (record: PolicyRecord | null | undefined, path: string): unknown => {
  if (!record) {
    return undefined
  }

  return path.split('.').reduce<unknown>((current, segment) => {
    if (!isRecord(current)) {
      return undefined
    }

    return current[segment]
  }, record)
}

const isActiveWindow = ({
  endsAt,
  now,
  startsAt,
}: {
  endsAt?: string | null
  now: Date
  startsAt?: string | null
}) => {
  const nowTime = now.getTime()
  const startsAtTime = startsAt ? Date.parse(startsAt) : Number.NaN
  const endsAtTime = endsAt ? Date.parse(endsAt) : Number.NaN

  if (!Number.isNaN(startsAtTime) && startsAtTime > nowTime) {
    return false
  }

  if (!Number.isNaN(endsAtTime) && endsAtTime < nowTime) {
    return false
  }

  return true
}

const isRoleActive = (role: PolicyRole | null, now: Date) =>
  Boolean(role && role.enabled !== false && isActiveWindow({ now }))

const isRoleAssignmentActive = (assignment: PolicyRoleAssignment, now: Date) =>
  assignment.enabled !== false &&
  isActiveWindow({
    endsAt: assignment.endsAt,
    now,
    startsAt: assignment.startsAt,
  })

const isPermissionActive = (permission: PolicyPermission, now: Date) =>
  permission.enabled !== false &&
  isActiveWindow({
    endsAt: permission.validUntil,
    now,
    startsAt: permission.validFrom,
  })

const resourceMatches = (permissionResource: unknown, requestedResource: string) =>
  permissionResource === '*' || permissionResource === requestedResource

const actionMatches = (permissionAction: unknown, requestedAction: string) =>
  permissionAction === 'manage' || permissionAction === requestedAction

const permissionMatches = (
  permission: PolicyPermission,
  { action, now, resource }: Required<Pick<PolicyEvaluationOptions, 'action' | 'now' | 'resource'>>,
) =>
  isPermissionActive(permission, now) &&
  resourceMatches(permission.resource, resource) &&
  actionMatches(permission.action, action)

const normalizeWhereValue = (
  value: unknown,
  user: PolicyUser,
  grant: Pick<PermissionGrant, 'tenant'>,
  now: Date,
): unknown => {
  if (typeof value === 'string') {
    if (value.startsWith('$user.')) {
      return getPath(user, value.replace('$user.', ''))
    }

    if (value === '$grant.tenant') {
      return grant.tenant
    }

    if (value === '$now') {
      return now.toISOString()
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeWhereValue(item, user, grant, now))
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        normalizeWhereValue(nestedValue, user, grant, now),
      ]),
    )
  }

  return value
}

export const interpolateWhere = (
  where: Where,
  user: PolicyUser,
  grant: Pick<PermissionGrant, 'tenant'> = {},
  now = new Date(),
): Where => normalizeWhereValue(where, user, grant, now) as Where

const compactWhere = (items: Array<false | Where>): Where | false => {
  const wheres = items.filter(Boolean) as Where[]

  if (wheres.length === 0) {
    return false
  }

  if (wheres.length === 1) {
    return wheres[0]
  }

  return {
    and: wheres,
  }
}

const orWhere = (items: Where[]): Where => {
  if (items.length === 1) {
    return items[0]
  }

  return {
    or: items,
  }
}

const conditionToConstraint = ({
  conditions = {},
  grant,
  now,
  user,
}: {
  conditions?: PermissionConditions | null
  grant: PermissionGrant
  now: Date
  user: PolicyUser
}): boolean | Where => {
  const scope = conditions?.scope || 'global'
  const ownerField = conditions?.ownerField || DEFAULT_OWNER_FIELD
  const userField = conditions?.userField || DEFAULT_USER_FIELD
  const tenantField = conditions?.tenantField || DEFAULT_TENANT_FIELD
  const tenantUserField = conditions?.tenantUserField || DEFAULT_TENANT_FIELD
  const constraints: Array<false | Where> = []

  if (grant.tenant && scope !== 'tenant') {
    constraints.push({
      [tenantField]: {
        equals: grant.tenant,
      },
    })
  }

  if (scope === 'own') {
    const ownerValue = getPath(user, userField)

    if (ownerValue === undefined || ownerValue === null) {
      return false
    }

    constraints.push({
      [ownerField]: {
        equals: ownerValue,
      },
    })
  }

  if (scope === 'tenant') {
    const tenantValue = grant.tenant || getPath(user, tenantUserField)

    if (tenantValue === undefined || tenantValue === null || tenantValue === '') {
      return false
    }

    constraints.push({
      [tenantField]: {
        equals: tenantValue,
      },
    })
  }

  if (scope === 'public') {
    constraints.push(conditions?.publicWhere || DEFAULT_PUBLIC_WHERE)
  }

  if (scope === 'custom') {
    if (!conditions?.customWhere) {
      return false
    }

    constraints.push(interpolateWhere(conditions.customWhere, user, grant, now))
  }

  const where = compactWhere(constraints)

  return where || true
}

const collectPermissionGrantsFromRole = ({
  now,
  role,
  seenRoleKeys,
  tenant,
}: {
  now: Date
  role: PolicyRole
  seenRoleKeys: Set<string>
  tenant?: string | null
}): PermissionGrant[] => {
  const roleKey = role.key || role.id
  const grantKey = `${String(roleKey)}:${tenant || '*'}`

  if (!roleKey || seenRoleKeys.has(grantKey)) {
    return []
  }

  seenRoleKeys.add(grantKey)

  if (!isRoleActive(role, now)) {
    return []
  }

  const directGrants = toArray(role.permissions)
    .map((permission) => relationToRecord<PolicyPermission>(permission))
    .filter(isPolicyPermission)
    .map((permission) => ({
      permission,
      source: 'role' as const,
      sourceKey: role.key || null,
      tenant: tenant || null,
    }))

  const inheritedGrants = toArray(role.inherits).flatMap((inheritedRole) => {
    const inheritedRoleRecord = relationToRecord<PolicyRole>(inheritedRole)

    if (!inheritedRoleRecord) {
      return []
    }

    return collectPermissionGrantsFromRole({
      now,
      role: inheritedRoleRecord,
      seenRoleKeys,
      tenant,
    })
  })

  return [...directGrants, ...inheritedGrants]
}

export const buildAccessProfile = (user: PolicyUser, now = new Date()): AccessProfile => {
  const roles: PolicyRole[] = []
  const seenRoleKeys = new Set<string>()

  const grants = [
    ...toArray(user.directPermissions)
      .map((permission) => relationToRecord<PolicyPermission>(permission))
      .filter(isPolicyPermission)
      .map((permission) => ({
        permission,
        source: 'direct' as const,
        sourceKey: 'direct',
        tenant: null,
      })),
    ...toArray(user.roles).flatMap((role) => {
      const roleRecord = relationToRecord<PolicyRole>(role)

      if (!roleRecord) {
        return []
      }

      roles.push(roleRecord)

      return collectPermissionGrantsFromRole({
        now,
        role: roleRecord,
        seenRoleKeys,
      })
    }),
    ...toArray(user.roleAssignments)
      .filter((assignment) => isRoleAssignmentActive(assignment, now))
      .flatMap((assignment) => {
        const roleRecord = relationToRecord<PolicyRole>(assignment.role)

        if (!roleRecord) {
          return []
        }

        roles.push(roleRecord)

        return collectPermissionGrantsFromRole({
          now,
          role: roleRecord,
          seenRoleKeys,
          tenant: assignment.tenant,
        })
      }),
  ]

  const isSuperAdmin = roles.some(
    (role) => role.key === SUPER_ADMIN_ROLE_KEY || role.isSuperAdmin === true,
  )

  return {
    grants,
    isSuperAdmin,
    roles,
    user,
  }
}

export const evaluateAccessProfile = (
  profile: AccessProfile | null,
  options: PolicyEvaluationOptions,
): PolicyEvaluationResult => {
  if (!profile) {
    return false
  }

  const now = options.now || new Date()
  const accountStatus = profile.user.accountStatus || 'active'

  if (!(ACTIVE_ACCOUNT_STATUSES as readonly string[]).includes(String(accountStatus))) {
    return false
  }

  if (profile.isSuperAdmin) {
    return true
  }

  const matchingGrants = profile.grants.filter(({ permission }) =>
    permissionMatches(permission, {
      action: options.action,
      now,
      resource: options.resource,
    }),
  )

  const denyGrants = matchingGrants.filter(({ permission }) => permission.effect === 'deny')

  if (denyGrants.length > 0) {
    return false
  }

  const allowResults = matchingGrants
    .filter(({ permission }) => !permission.effect || permission.effect === 'allow')
    .map((grant) =>
      conditionToConstraint({
        conditions: grant.permission.conditions,
        grant,
        now,
        user: profile.user,
      }),
    )

  if (allowResults.some((result) => result === true)) {
    return true
  }

  const allowWheres = allowResults.filter(
    (result): result is Where => isRecord(result) && Object.keys(result).length > 0,
  )

  if (allowWheres.length === 0) {
    return false
  }

  if (options.booleanOnly) {
    return Boolean(options.scopedBoolean)
  }

  return orWhere(allowWheres)
}
