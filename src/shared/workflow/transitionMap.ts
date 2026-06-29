export const WORKFLOW_STATUSES = [
  'draft',
  'review',
  'changes_requested',
  'approved',
  'published',
  'archived',
] as const

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number]

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  approved: 'Approved',
  archived: 'Archived',
  changes_requested: 'Changes Requested',
  draft: 'Draft',
  published: 'Published',
  review: 'Review',
}

export const transitionMap: Record<WorkflowStatus, WorkflowStatus[]> = {
  approved: ['published', 'changes_requested', 'archived'],
  archived: ['draft'],
  changes_requested: ['draft', 'review', 'archived'],
  draft: ['review', 'archived'],
  published: ['archived', 'changes_requested'],
  review: ['approved', 'changes_requested', 'draft', 'archived'],
}

export const isWorkflowStatus = (value: unknown): value is WorkflowStatus => {
  return typeof value === 'string' && WORKFLOW_STATUSES.includes(value as WorkflowStatus)
}

export const isValidTransition = (from: WorkflowStatus, to: WorkflowStatus): boolean => {
  return from === to || transitionMap[from].includes(to)
}
