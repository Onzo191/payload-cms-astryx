import type { TaskConfig } from 'payload'

export const searchIndexingJob: TaskConfig<{
  input: {
    collectionSlug?: string
    documentId?: string
  }
  output: { indexed: boolean }
}> = {
  slug: 'searchIndexing',
  handler: async () => {
    return {
      output: {
        indexed: true,
      },
    }
  },
  inputSchema: [
    {
      name: 'collectionSlug',
      type: 'text',
    },
    {
      name: 'documentId',
      type: 'text',
    },
  ],
  outputSchema: [
    {
      name: 'indexed',
      type: 'checkbox',
      required: true,
    },
  ],
  retries: 2,
}
