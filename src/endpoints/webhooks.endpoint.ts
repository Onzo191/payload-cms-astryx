import type { Endpoint } from 'payload'

export const webhooksEndpoint: Endpoint = {
  path: '/webhooks/:provider',
  method: 'post',
  handler: async (req) => {
    const configuredSecret = process.env.WEBHOOK_SECRET
    const providedSecret = req.headers.get('x-webhook-secret')

    if (configuredSecret && providedSecret !== configuredSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return Response.json({
      accepted: true,
      provider: req.routeParams?.provider,
    })
  },
}
