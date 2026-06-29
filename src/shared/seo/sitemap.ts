export type SitemapEntry = {
  lastModified?: string
  priority?: number
  url: string
}

export const renderSitemap = (entries: SitemapEntry[]): string => {
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ''
      const priority = entry.priority ? `<priority>${entry.priority}</priority>` : ''

      return `<url><loc>${entry.url}</loc>${lastModified}${priority}</url>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}
