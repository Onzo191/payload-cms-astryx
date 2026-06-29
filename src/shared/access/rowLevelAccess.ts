import type { Access, Where } from 'payload'

const publishedContentWhere: Where = {
  and: [
    {
      _status: {
        equals: 'published',
      },
    },
    {
      workflowStatus: {
        equals: 'published',
      },
    },
    {
      archivedAt: {
        exists: false,
      },
    },
  ],
}

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true

  return publishedContentWhere
}

export const publicPublishedOnly: Access = () => publishedContentWhere
