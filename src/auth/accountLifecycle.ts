import type { CollectionBeforeChangeHook, CollectionBeforeDeleteHook, Payload } from 'payload'

import type { User } from '@/payload-types'

import { ACTIVE_ACCOUNT_STATUSES } from './constants'

const DEFAULT_DEACTIVATION_REASON = 'account-status-deactivated'
const MICROSOFT_HARD_DELETE_ERROR =
  'Microsoft-linked accounts must be offboarded instead of hard deleted.'

type AccountLifecycleData = Partial<User> & {
  accountStatus?: User['accountStatus']
  deactivationReason?: null | string
  offboardedAt?: null | string
  sessions?: User['sessions']
}

export const isInactiveAccountStatus = (status: null | string | undefined) =>
  Boolean(status && !(ACTIVE_ACCOUNT_STATUSES as readonly string[]).includes(status))

export const buildInactiveAccountUpdate = ({
  data,
  now = new Date(),
}: {
  data: AccountLifecycleData
  now?: Date
}): AccountLifecycleData => {
  if (!isInactiveAccountStatus(data.accountStatus)) {
    return data
  }

  return {
    ...data,
    deactivationReason: data.deactivationReason || DEFAULT_DEACTIVATION_REASON,
    offboardedAt: data.accountStatus === 'offboarded' ? data.offboardedAt || now.toISOString() : data.offboardedAt,
    sessions: [],
  }
}

export const applyAccountLifecycle: CollectionBeforeChangeHook<User> = ({ data }) => {
  return buildInactiveAccountUpdate({
    data,
  })
}

export const preventHardDeleteMicrosoftAccount: CollectionBeforeDeleteHook = async ({
  context,
  id,
  req,
}) => {
  if (context.allowHardDeleteMicrosoftUser === true) {
    return
  }

  const user = await req.payload.findByID({
    collection: 'users',
    depth: 0,
    id,
    overrideAccess: true,
    showHiddenFields: true,
  })

  if (user?.microsoftObjectID) {
    throw new Error(MICROSOFT_HARD_DELETE_ERROR)
  }
}

export const softOffboardAccount = async ({
  payload,
  reason = 'microsoft-account-deprovisioned',
  userID,
}: {
  payload: Payload
  reason?: string
  userID: string
}) => {
  return payload.update({
    collection: 'users',
    data: buildInactiveAccountUpdate({
      data: {
        accountStatus: 'offboarded',
        deactivationReason: reason,
      },
    }),
    id: userID,
    overrideAccess: true,
  })
}
