export const buildJsonLd = (type: string, data: Record<string, unknown>): Record<string, unknown> => {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }
}
