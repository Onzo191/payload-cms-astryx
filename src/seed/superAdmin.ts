import { config as loadEnv } from 'dotenv'
import { getPayload } from 'payload'

import { SUPER_ADMIN_ROLE_KEY } from '@/auth/constants'
import { ensureAuthDefaults } from '@/auth/defaults'

loadEnv({ path: 'test.env' })
loadEnv()

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'super-admin@email.com.vn'
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123'

const getRoleIDByKey = async (payload: Awaited<ReturnType<typeof getPayload>>, key: string) => {
  const result = await payload.find({
    collection: 'roles',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      key: {
        equals: key,
      },
    },
  })

  return result.docs[0]?.id
}

const seedSuperAdmin = async () => {
  const { default: payloadConfig } = await import('@/payload.config')
  const payload = await getPayload({ config: payloadConfig })

  await ensureAuthDefaults(payload)

  const superAdminRoleID = await getRoleIDByKey(payload, SUPER_ADMIN_ROLE_KEY)

  if (!superAdminRoleID) {
    throw new Error(`Missing required role: ${SUPER_ADMIN_ROLE_KEY}`)
  }

  const existingUser = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: SUPER_ADMIN_EMAIL,
      },
    },
  })

  const data = {
    accountStatus: 'active' as const,
    displayName: 'Super Admin',
    email: SUPER_ADMIN_EMAIL,
    firstName: 'Super',
    lastName: 'Admin',
    password: SUPER_ADMIN_PASSWORD,
    roles: [superAdminRoleID],
  }

  if (existingUser.docs[0]) {
    await payload.update({
      collection: 'users',
      data,
      id: existingUser.docs[0].id,
      overrideAccess: true,
    })

    payload.logger.info(`Updated super admin user: ${SUPER_ADMIN_EMAIL}`)
    return
  }

  await payload.create({
    collection: 'users',
    data,
    overrideAccess: true,
  })

  payload.logger.info(`Created super admin user: ${SUPER_ADMIN_EMAIL}`)
}

seedSuperAdmin()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
