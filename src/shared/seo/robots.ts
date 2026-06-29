export const robotsFromSeoValue = (value?: string | null): string => {
  if (value === 'noindex-follow') return 'noindex,follow'
  if (value === 'noindex-nofollow') return 'noindex,nofollow'

  return 'index,follow'
}
