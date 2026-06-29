import type { Payload } from 'payload'

export const seedSuperAdmin = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seed hook placeholder: create the first super-admin from env vars.')
}
