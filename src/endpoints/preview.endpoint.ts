import type { Endpoint } from 'payload'

export const previewEndpoint: Endpoint = {
  path: '/preview',
  method: 'get',
  handler: (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return Response.json({
      enabled: true,
    })
  },
}
