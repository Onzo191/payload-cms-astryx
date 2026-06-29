import type { PayloadRequest } from 'payload'

import { hasRole } from '@/shared/access/requireRole'
import type { UserRole } from '@/shared/constants/roles'
import type { WorkflowStatus } from './transitionMap'

const transitionRoles: Record<WorkflowStatus, UserRole[]> = {
  approved: ['super-admin', 'admin', 'reviewer'],
  archived: ['super-admin', 'admin', 'editor'],
  changes_requested: ['super-admin', 'admin', 'reviewer', 'editor'],
  draft: ['super-admin', 'admin', 'editor', 'author'],
  published: ['super-admin', 'admin'],
  review: ['super-admin', 'admin', 'editor', 'author'],
}

export const canTransitionTo = (
  user: PayloadRequest['user'] | unknown,
  nextStatus: WorkflowStatus,
): boolean => {
  return hasRole(user, transitionRoles[nextStatus])
}

export const canPublish = (user: PayloadRequest['user'] | unknown): boolean => {
  return canTransitionTo(user, 'published')
}

export const canReview = (user: PayloadRequest['user'] | unknown): boolean => {
  return canTransitionTo(user, 'approved') || canTransitionTo(user, 'changes_requested')
}
