# Migration Rules

These rules are mandatory for agents and humans working on Payload schema changes.

## Golden Rule

Any change that modifies persisted Payload schema must produce and run a migration before the work is considered complete.

Persisted schema includes collections, globals, fields, uploads, relationships, drafts, versions, indexes, auth fields, jobs schemas, and database adapter settings.

## Change Matrix

| Change type | Examples | Required actions |
| --- | --- | --- |
| Collection added/removed/renamed | `pages`, `news`, `reports` | `generate:types`, `migrate:create`, review migration, `migrate`, tests |
| Global added/removed/renamed | `site-settings`, `seo-defaults` | `generate:types`, `migrate:create`, review migration, `migrate`, tests |
| Field added/removed/renamed | text, richText, relationship, upload, array, blocks | `generate:types`, `migrate:create`, review migration, `migrate`, tests |
| Field persistence changed | `required`, `unique`, `index`, `localized`, `defaultValue`, field type | `generate:types`, `migrate:create`, review migration, `migrate`, tests |
| Relationship changed | `relationTo`, `hasMany`, polymorphic relationships | `generate:types`, `migrate:create`, review migration, `migrate`, tests |
| Draft/version settings changed | `versions`, `drafts`, `maxPerDoc`, schedule publish | `generate:types`, `migrate:create`, review migration, `migrate`, tests |
| Upload config changed | upload collection, image sizes, focal point, file fields | `generate:types`, `migrate:create` if DB schema changes, tests |
| Auth schema changed | roles, sessions, auth collection fields | `generate:types`, `migrate:create`, review migration, `migrate`, auth tests |
| Jobs schema changed | task `inputSchema`, `outputSchema`, jobs collection overrides | `generate:types`, `migrate:create` if Payload schema changes, tests |
| Database adapter setting changed | `idType`, `blocksAsJSON`, suffixes, schema name | migration plan required; do not auto-push blindly |
| Access-only change | RBAC logic, row-level constraints | no migration; run access/security tests |
| Hook-only change | audit, revalidation, slug generation | no migration unless persisted fields change; run relevant tests |
| Admin UI-only change | labels, descriptions, default columns | no migration unless field persistence changes |
| Docs-only change | README, docs, skills | no migration |

## Required Command Sequence

After a schema change:

```bash
pnpm run generate:types
pnpm run payload -- migrate:create descriptive-migration-name
pnpm run payload -- migrate:status
pnpm run payload -- migrate
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
./node_modules/.bin/vitest run --config ./vitest.config.mts
```

If `pnpm` is unavailable or the installed version is incompatible, use Payload directly:

```bash
NODE_OPTIONS=--no-deprecation ./node_modules/.bin/payload generate:types
NODE_OPTIONS=--no-deprecation ./node_modules/.bin/payload migrate:create descriptive-migration-name
NODE_OPTIONS=--no-deprecation ./node_modules/.bin/payload migrate:status
NODE_OPTIONS=--no-deprecation ./node_modules/.bin/payload migrate
```

## Migration Review Rules

Before accepting a migration:

- Confirm the generated SQL matches the schema intent.
- Check destructive operations carefully: dropped columns, renamed fields, changed field types, required constraints, and enum changes.
- For existing data, add a data backfill step before adding `required` or `not null`.
- Do not let Payload auto-convert serial/int IDs to UUID. Use a fresh database or a deliberate manual migration plan.
- Commit schema code, generated `src/payload-types.ts`, and migration files together.

## Environment Rules

- Local disposable database: schema push is acceptable for fast iteration.
- Shared dev, staging, production: use migrations only.
- Test database should be isolated from the developer database.

## Agent Stop Conditions

If a schema change was made but migration generation cannot run, the agent must report the blocker clearly and must not claim the task is complete.

If a migration contains destructive SQL, the agent must call it out in the final response.
