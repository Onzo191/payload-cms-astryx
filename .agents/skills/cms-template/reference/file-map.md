# File Map

## Module Roots

- `src/features/users`: auth collection, roles, user seed helpers.
- `src/features/media`: upload collection and media metadata.
- `src/features/pages`: landing pages, page blocks, page-specific workflow config.
- `src/features/news`: news articles, article SEO, author/category/tag relationships.
- `src/features/reports`: annual and periodic report metadata, file relationship, extraction jobs.
- `src/features/taxonomy`: categories and tags.
- `src/features/audit`: audit log collection.

## Shared Roots

- `src/shared/access`: RBAC and row-level access helpers.
- `src/shared/workflow`: workflow states, transition permissions, transition validation hooks.
- `src/shared/fields`: reusable Payload field factories.
- `src/shared/blocks`: reusable landing-page blocks.
- `src/shared/hooks`: audit, revalidation, and slug hooks.
- `src/shared/seo`: metadata, robots, sitemap, JSON-LD, and llms.txt helpers.
- `src/shared/constants`: roles and stable collection/global slugs.

## Top-Level Integration

- `src/payload.config.ts`: imports modules and registers collections, globals, endpoints, jobs, DB, editor, and plugins.
- `src/globals`: global site settings, header, footer, SEO defaults.
- `src/jobs`: Payload task configs.
- `src/endpoints`: root Payload endpoints.
- `docs/MIGRATION_RULES.md`: mandatory type generation and migration rules for schema changes.
- `docs`: English architecture and operating docs.
