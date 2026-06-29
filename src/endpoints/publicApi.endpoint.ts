import type { Endpoint } from 'payload'

export const publicApiEndpoint: Endpoint = {
  path: '/public/health',
  method: 'get',
  handler: () => {
    return Response.json({
      ok: true,
      service: 'payload-astryx',
    })
  },
}
