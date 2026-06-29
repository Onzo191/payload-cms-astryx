# CMS Template Architecture

This repository is a module-first Payload CMS template for maintainable editorial systems.

## Goals

- Keep Payload configuration thin and predictable.
- Use feature modules for domain behavior.
- Use shared modules for reusable access, workflow, field, hook, block, and SEO primitives.
- Make agent work token-efficient by keeping file ownership obvious.
- Use UUID IDs only. The Postgres adapter uses `idType: 'uuidv7'`.

## Source Layout

```txt
src/
  payload.config.ts
  features/
  shared/
  globals/
  jobs/
  endpoints/
  tests/
docs/
.agents/skills/
```

## Feature Modules

Each feature owns its collection config and local behavior:

```txt
src/features/pages/
  pages.collection.ts
  pages.access.ts
  pages.fields.ts
  pages.hooks.ts
  pages.blocks.ts
  pages.workflow.ts
```

Feature files may import from `src/shared`, but shared files should not import from feature modules unless there is a deliberate boundary exception.

## Shared Modules

- `shared/access`: RBAC and row-level query constraints.
- `shared/workflow`: workflow states, transition maps, transition permissions, validators.
- `shared/fields`: reusable Payload field factories.
- `shared/blocks`: reusable layout blocks.
- `shared/hooks`: cross-cutting hooks such as audit, revalidation, and slugs.
- `shared/seo`: metadata, JSON-LD, robots, sitemap, and `llms.txt` utilities.
- `shared/constants`: stable role and slug constants.

## Payload Config

`src/payload.config.ts` should only register modules and platform configuration:

- collections
- globals
- endpoints
- jobs
- database adapter
- editor
- plugins

Avoid placing domain logic directly in `payload.config.ts`.

## Data Model

Core collections:

- `users`
- `media`
- `pages`
- `news`
- `reports`
- `categories`
- `tags`
- `audit-logs`

Core globals:

- `header`
- `footer`
- `site-settings`
- `seo-defaults`

## Database

Postgres is the default database. Schema changes should go through Payload migrations for production. Development may use push mode, but production must rely on migration history.

All document IDs are UUID based. Do not introduce integer IDs.

If a database was already created with serial IDs, do not rely on automatic schema push to convert it. Start from a fresh database or write a deliberate manual migration plan for ID conversion.

See `docs/MIGRATION_RULES.md` for the mandatory change matrix. Any persisted Payload schema change must include generated types and a migration.
