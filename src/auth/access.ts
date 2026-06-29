import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

import { buildAccessProfile, evaluateAccessProfile } from './policy'
import type { AccessProfile, PolicyEvaluationOptions, PolicyEvaluationResult, PolicyUser } from './types'

type AuthzRequestContext = {
  authzProfile?: Promise<AccessProfile | null>
}

type BooleanAccess = ({ req }: { req: PayloadRequest }) => boolean | Promise<boolean>

type CollectionActionOptions = Pick<PolicyEvaluationOptions, 'booleanOnly' | 'scopedBoolean'> & {
  allowFirstUserCreate?: boolean
}

const getAuthzContext = (req: PayloadRequest): AuthzRequestContext =>
  req.context as PayloadRequest['context'] & AuthzRequestContext

const isWhere = (value: PolicyEvaluationResult): value is Where =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const combineAccessResults = (...results: PolicyEvaluationResult[]): PolicyEvaluationResult => {
  if (results.some((result) => result === true)) {
    return true
  }

  const wheres = results.filter(isWhere)

  if (wheres.length === 0) {
    return false
  }

  if (wheres.length === 1) {
    return wheres[0]
  }

  return {
    or: wheres,
  }
}

const loadAccessProfile = async (req: PayloadRequest): Promise<AccessProfile | null> => {
  const userCollection = req.user?.collection || 'users'

  if (!req.user?.id || userCollection !== 'users') {
    return null
  }

  try {
    const user = await req.payload.findByID({
      collection: 'users',
      depth: 6,
      id: req.user.id,
      overrideAccess: true,
      req,
    })

    return buildAccessProfile(user as unknown as PolicyUser)
  } catch (error) {
    req.payload.logger.warn({
      err: error,
      msg: 'Unable to load full authz profile; falling back to request user',
    })

    return buildAccessProfile(req.user as unknown as PolicyUser)
  }
}

export const getRequestAccessProfile = async (
  req: PayloadRequest,
): Promise<AccessProfile | null> => {
  const context = getAuthzContext(req)

  context.authzProfile ||= loadAccessProfile(req)

  return context.authzProfile
}

export const evaluateRequestAccess = async (
  req: PayloadRequest,
  options: PolicyEvaluationOptions,
): Promise<PolicyEvaluationResult> => {
  const profile = await getRequestAccessProfile(req)

  return evaluateAccessProfile(profile, options)
}

const canBootstrapFirstUser = async (req: PayloadRequest) => {
  if (req.user) {
    return false
  }

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
  })

  return totalDocs === 0
}

export const canCollection = (
  resource: string,
  action: string,
  options: CollectionActionOptions = {},
): Access => {
  return async ({ req }) => {
    if (options.allowFirstUserCreate && action === 'create' && (await canBootstrapFirstUser(req))) {
      return true
    }

    return evaluateRequestAccess(req, {
      action,
      booleanOnly: options.booleanOnly,
      resource,
      scopedBoolean: options.scopedBoolean,
    })
  }
}

export const canCollectionBoolean = (
  resource: string,
  action: string,
  options: CollectionActionOptions = {},
): BooleanAccess => {
  return async ({ req }) => {
    if (options.allowFirstUserCreate && action === 'create' && (await canBootstrapFirstUser(req))) {
      return true
    }

    const result = await evaluateRequestAccess(req, {
      action,
      booleanOnly: true,
      resource,
      scopedBoolean: options.scopedBoolean,
    })

    return result === true
  }
}

export const canField = (
  resource: string,
  action = 'manage',
  options: Pick<PolicyEvaluationOptions, 'scopedBoolean'> = {},
): FieldAccess => {
  return async ({ req }) => {
    const result = await evaluateRequestAccess(req, {
      action,
      booleanOnly: true,
      resource,
      scopedBoolean: options.scopedBoolean,
    })

    return result === true
  }
}

export const selfUserAccess = ({ req }: { req: PayloadRequest }): PolicyEvaluationResult => {
  if (!req.user?.id) {
    return false
  }

  return {
    id: {
      equals: req.user.id,
    },
  }
}
