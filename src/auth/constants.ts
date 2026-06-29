export const AUTH_RESOURCE_OPTIONS = [
  { label: 'All resources', value: '*' },
  { label: 'Accounts', value: 'users' },
  { label: 'Roles', value: 'roles' },
  { label: 'Permissions', value: 'permissions' },
  { label: 'Media', value: 'media' },
] as const

export const AUTH_ACTION_OPTIONS = [
  { label: 'Manage', value: 'manage' },
  { label: 'Create', value: 'create' },
  { label: 'Read', value: 'read' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
  { label: 'Admin UI', value: 'admin' },
  { label: 'Unlock', value: 'unlock' },
  { label: 'Read versions', value: 'readVersions' },
] as const

export const AUTH_SCOPE_OPTIONS = [
  { label: 'Global', value: 'global' },
  { label: 'Own document', value: 'own' },
  { label: 'Same tenant', value: 'tenant' },
  { label: 'Public filter', value: 'public' },
  { label: 'Custom where', value: 'custom' },
] as const

export const AUTH_EFFECT_OPTIONS = [
  { label: 'Allow', value: 'allow' },
  { label: 'Deny', value: 'deny' },
] as const

export const ACCOUNT_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Locked', value: 'locked' },
  { label: 'Offboarded', value: 'offboarded' },
] as const

export const AUTH_RESOURCE_VALUES = AUTH_RESOURCE_OPTIONS.map((option) => option.value)
export const AUTH_ACTION_VALUES = AUTH_ACTION_OPTIONS.map((option) => option.value)
export const AUTH_SCOPE_VALUES = AUTH_SCOPE_OPTIONS.map((option) => option.value)
export const AUTH_EFFECT_VALUES = AUTH_EFFECT_OPTIONS.map((option) => option.value)
export const ACCOUNT_STATUS_VALUES = ACCOUNT_STATUS_OPTIONS.map((option) => option.value)

export type AuthResource = (typeof AUTH_RESOURCE_VALUES)[number]
export type AuthAction = (typeof AUTH_ACTION_VALUES)[number]
export type AuthScope = (typeof AUTH_SCOPE_VALUES)[number]
export type AuthEffect = (typeof AUTH_EFFECT_VALUES)[number]
export type AccountStatus = (typeof ACCOUNT_STATUS_VALUES)[number]

export const AUTH_COLLECTION_GROUP = 'Access Control'

export const SUPER_ADMIN_ROLE_KEY = 'super-admin'
export const DEFAULT_MEMBER_ROLE_KEY = 'viewer'

export const ACTIVE_ACCOUNT_STATUSES: AccountStatus[] = ['active', 'invited']
