import type { Field } from 'payload'

import { WORKFLOW_STATUS_LABELS, WORKFLOW_STATUSES } from '@/shared/workflow/transitionMap'

export const workflowFields = (): Field[] => [
  {
    name: 'workflowStatus',
    type: 'select',
    admin: {
      position: 'sidebar',
    },
    defaultValue: 'draft',
    index: true,
    options: WORKFLOW_STATUSES.map((status) => ({
      label: WORKFLOW_STATUS_LABELS[status],
      value: status,
    })),
    required: true,
  },
  {
    name: 'reviewNotes',
    type: 'textarea',
    admin: {
      position: 'sidebar',
    },
  },
  {
    name: 'publishedAt',
    type: 'date',
    admin: {
      date: {
        pickerAppearance: 'dayAndTime',
      },
      position: 'sidebar',
    },
    index: true,
  },
  {
    name: 'approvedAt',
    type: 'date',
    admin: {
      position: 'sidebar',
    },
  },
  {
    name: 'archivedAt',
    type: 'date',
    admin: {
      position: 'sidebar',
    },
    index: true,
  },
]
