import { APIError } from 'payload'
import type { CollectionBeforeChangeHook } from 'payload'

import { canTransitionTo } from './permissions'
import { isValidTransition, isWorkflowStatus } from './transitionMap'
import type { WorkflowStatus } from './transitionMap'

type WorkflowDocument = {
  id: number | string
  approvedAt?: string
  archivedAt?: string
  publishedAt?: string
  reviewedAt?: string
  workflowStatus?: WorkflowStatus
}

export const validateWorkflowTransition: CollectionBeforeChangeHook<WorkflowDocument> = ({
  data,
  originalDoc,
  req,
}) => {
  const nextStatus = data.workflowStatus

  if (!nextStatus) return data
  if (!isWorkflowStatus(nextStatus)) {
    throw new APIError(`Invalid workflow status: ${String(nextStatus)}`, 400)
  }

  const previousStatus = originalDoc?.workflowStatus ?? 'draft'

  if (!isValidTransition(previousStatus, nextStatus)) {
    throw new APIError(`Invalid workflow transition: ${previousStatus} -> ${nextStatus}`, 400)
  }

  if (!canTransitionTo(req.user, nextStatus)) {
    throw new APIError(`You do not have permission to transition content to ${nextStatus}`, 403)
  }

  const now = new Date().toISOString()

  if (nextStatus === 'approved' && !data.approvedAt) data.approvedAt = now
  if (nextStatus === 'review' && !data.reviewedAt) data.reviewedAt = now
  if (nextStatus === 'published' && !data.publishedAt) data.publishedAt = now
  if (nextStatus === 'archived' && !data.archivedAt) data.archivedAt = now

  return data
}
