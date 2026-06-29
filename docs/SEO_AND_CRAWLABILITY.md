# SEO And Crawlability

This CMS is optimized for search engines and AI crawlers by storing structured metadata, rendering crawlable content, and exposing machine-readable summaries.

## Content Requirements

Public pages, news, and reports should provide:

- stable slug
- title
- summary or excerpt
- canonical URL when needed
- meta title and description
- Open Graph image
- schema type
- publish date
- archive state

## Public Query Rules

Public APIs and sitemap generation must exclude:

- drafts
- review content
- changes requested content
- archived content
- authenticated-only media

## Structured Data

Use JSON-LD for:

- `WebPage`
- `NewsArticle`
- `Report`
- `Organization`
- `BreadcrumbList`

Helpers live in `src/shared/seo/jsonLd.ts`.

## Reports

Reports should not rely only on binary PDF content. Store:

- uploaded report file
- human summary
- key metrics
- extracted text
- year and period

This allows search engines and AI crawlers to understand the report without parsing the PDF themselves.

## AI Crawl Surface

Use `llms.txt` for a compact map of public, authoritative content. Do not include draft, private, or archived content.
