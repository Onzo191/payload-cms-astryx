import type { CollectionBeforeChangeHook, Payload } from 'payload'

import { DEFAULT_MEMBER_ROLE_KEY, SUPER_ADMIN_ROLE_KEY } from './constants'

type SeededDoc = {
  id: number | string
  key?: string | null
}

type DefaultPermissionDefinition = {
  action: string
  conditions?: Record<string, unknown>
  description?: string
  effect?: 'allow' | 'deny'
  key: string
  name: string
  resource: string
}

type DefaultRoleDefinition = {
  description?: string
  isSuperAdmin?: boolean
  key: string
  name: string
  permissionKeys: string[]
}

const defaultPermissions: DefaultPermissionDefinition[] = [
  {
    action: 'manage',
    conditions: { scope: 'global' },
    description: 'Unrestricted access across all registered resources.',
    key: 'system.manage-all',
    name: 'Manage all resources',
    resource: '*',
  },
  {
    action: 'manage',
    conditions: { scope: 'global' },
    description: 'Create, read, update, delete, and open accounts in the admin UI.',
    key: 'users.manage',
    name: 'Manage accounts',
    resource: 'users',
  },
  {
    action: 'read',
    conditions: { ownerField: 'id', scope: 'own', userField: 'id' },
    description: 'Read the current account document only.',
    key: 'users.read.own',
    name: 'Read own account',
    resource: 'users',
  },
  {
    action: 'update',
    conditions: { ownerField: 'id', scope: 'own', userField: 'id' },
    description: 'Update the current account document only; sensitive fields remain field-locked.',
    key: 'users.update.own',
    name: 'Update own account',
    resource: 'users',
  },
  {
    action: 'manage',
    conditions: { scope: 'global' },
    description: 'Manage role definitions and role inheritance.',
    key: 'roles.manage',
    name: 'Manage roles',
    resource: 'roles',
  },
  {
    action: 'manage',
    conditions: { scope: 'global' },
    description: 'Manage permission policies and ABAC conditions.',
    key: 'permissions.manage',
    name: 'Manage permissions',
    resource: 'permissions',
  },
  {
    action: 'manage',
    conditions: { scope: 'global' },
    description: 'Create, update, delete, and administer media.',
    key: 'media.manage',
    name: 'Manage media',
    resource: 'media',
  },
  {
    action: 'read',
    conditions: { scope: 'global' },
    description: 'Read media metadata and files.',
    key: 'media.read',
    name: 'Read media',
    resource: 'media',
  },
]

const defaultRoles: DefaultRoleDefinition[] = [
  {
    description: 'Bootstrap and break-glass administrator. Bypasses policy checks.',
    isSuperAdmin: true,
    key: SUPER_ADMIN_ROLE_KEY,
    name: 'Super Admin',
    permissionKeys: ['system.manage-all'],
  },
  {
    description: 'Maintains accounts, roles, and permissions.',
    key: 'account-manager',
    name: 'Account Manager',
    permissionKeys: ['users.manage', 'roles.manage', 'permissions.manage', 'media.read'],
  },
  {
    description: 'Maintains media assets.',
    key: 'media-manager',
    name: 'Media Manager',
    permissionKeys: ['media.manage', 'media.read'],
  },
  {
    description: 'Default authenticated account with self-service profile access.',
    key: DEFAULT_MEMBER_ROLE_KEY,
    name: 'Viewer',
    permissionKeys: ['users.read.own', 'users.update.own', 'media.read'],
  },
]

const findOneByKey = async ({
  collection,
  key,
  payload,
}: {
  collection: 'permissions' | 'roles'
  key: string
  payload: Payload
}): Promise<SeededDoc | null> => {
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      key: {
        equals: key,
      },
    },
  })

  return (result.docs[0] as SeededDoc | undefined) || null
}

const upsertByKey = async ({
  collection,
  data,
  key,
  payload,
}: {
  collection: 'permissions' | 'roles'
  data: Record<string, unknown>
  key: string
  payload: Payload
}): Promise<SeededDoc> => {
  const existing = await findOneByKey({ collection, key, payload })

  if (existing) {
    const updated = await payload.update({
      collection,
      data: data as never,
      id: existing.id,
      overrideAccess: true,
    })

    return updated as SeededDoc
  }

  const created = await payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
  })

  return created as SeededDoc
}

export const ensureAuthDefaults = async (payload: Payload) => {
  const permissionsByKey = new Map<string, SeededDoc>()
  const rolesByKey = new Map<string, SeededDoc>()

  for (const permission of defaultPermissions) {
    const doc = await upsertByKey({
      collection: 'permissions',
      data: {
        ...permission,
        effect: permission.effect || 'allow',
        enabled: true,
      },
      key: permission.key,
      payload,
    })

    permissionsByKey.set(permission.key, doc)
  }

  for (const role of defaultRoles) {
    const permissionIds = role.permissionKeys
      .map((permissionKey) => permissionsByKey.get(permissionKey)?.id)
      .filter((id): id is string | number => id !== undefined)

    const doc = await upsertByKey({
      collection: 'roles',
      data: {
        description: role.description,
        enabled: true,
        isSuperAdmin: role.isSuperAdmin || false,
        key: role.key,
        name: role.name,
        permissions: permissionIds,
        system: true,
      },
      key: role.key,
      payload,
    })

    rolesByKey.set(role.key, doc)
  }

  return {
    permissionsByKey,
    rolesByKey,
  }
}

const hasValues = (value: unknown) => Array.isArray(value) && value.length > 0

export const assignDefaultAccountRole: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || hasValues(data?.roles)) {
    return data
  }

  const { rolesByKey } = await ensureAuthDefaults(req.payload)
  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
  })

  const roleKey = totalDocs === 0 ? SUPER_ADMIN_ROLE_KEY : DEFAULT_MEMBER_ROLE_KEY
  const defaultRole = rolesByKey.get(roleKey)

  if (defaultRole?.id) {
    return {
      ...data,
      roles: [defaultRole.id],
    }
  }

  return data
}
