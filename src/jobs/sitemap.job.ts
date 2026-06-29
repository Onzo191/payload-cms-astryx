import type { TaskConfig } from 'payload'

export const sitemapJob: TaskConfig<{
  input: Record<string, never>
  output: { generated: boolean }
}> = {
  slug: 'sitemap',
  handler: async () => {
    return {
      output: {
        generated: true,
      },
    }
  },
  outputSchema: [
    {
      name: 'generated',
      type: 'checkbox',
      required: true,
    },
  ],
  retries: 1,
}
