export const USER_ROLES = [
  'super-admin',
  'admin',
  'editor',
  'author',
  'reviewer',
  'viewer',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export const ROLE_LABELS: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  author: 'Author',
  reviewer: 'Reviewer',
  viewer: 'Viewer',
}

export const CONTENT_EDITOR_ROLES: UserRole[] = ['super-admin', 'admin', 'editor']
export const CONTENT_AUTHOR_ROLES: UserRole[] = ['super-admin', 'admin', 'editor', 'author']
export const CONTENT_REVIEWER_ROLES: UserRole[] = ['super-admin', 'admin', 'reviewer']
export const CONTENT_PUBLISHER_ROLES: UserRole[] = ['super-admin', 'admin']
