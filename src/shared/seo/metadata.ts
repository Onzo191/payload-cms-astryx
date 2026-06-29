type SeoInput = {
  description?: string | null
  title?: string | null
}

export const buildMetaTitle = (input: SeoInput, siteName: string): string => {
  return input.title ? `${input.title} | ${siteName}` : siteName
}

export const buildMetaDescription = (input: SeoInput, fallback = ''): string => {
  return input.description || fallback
}
