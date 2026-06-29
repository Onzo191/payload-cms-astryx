import type { TaskConfig } from 'payload'

export const reportTextExtractionJob: TaskConfig<{
  input: { reportId: string }
  output: { extracted: boolean }
}> = {
  slug: 'reportTextExtraction',
  handler: async () => {
    return {
      output: {
        extracted: true,
      },
    }
  },
  inputSchema: [
    {
      name: 'reportId',
      type: 'text',
      required: true,
    },
  ],
  outputSchema: [
    {
      name: 'extracted',
      type: 'checkbox',
      required: true,
    },
  ],
  retries: 2,
}
