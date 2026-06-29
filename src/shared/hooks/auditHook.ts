import type { CollectionAfterChangeHook } from 'payload'

import { COLLECTION_SLUGS } from '@/shared/constants/slugs'

type AuditLogData = {
  action: 'create' | 'update'
  actor?: string
  collectionSlug: string
  documentId: string
  nextValue: Record<string, unknown>
  previousValue: null | Record<string, unknown>
}

export const auditHook: CollectionAfterChangeHook = async ({
  collection,
  context,
  doc,
  operation,
  previousDoc,
  req,
}) => {
  if (collection.slug === COLLECTION_SLUGS.auditLogs || context.skipAudit) return doc

  const data: AuditLogData = {
    action: operation,
    actor: req.user?.id ? String(req.user.id) : undefined,
    collectionSlug: collection.slug,
    documentId: String(doc.id),
    nextValue: doc as Record<string, unknown>,
    previousValue: previousDoc ? (previousDoc as Record<string, unknown>) : null,
  }

  await req.payload.create({
    collection: COLLECTION_SLUGS.auditLogs as 'audit-logs',
    context: {
      ...context,
      skipAudit: true,
    },
    data,
    req,
  })

  return doc
}
