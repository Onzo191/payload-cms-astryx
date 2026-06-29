# Payload Astryx CMS Template

Module-first Payload CMS template for landing pages, news, annual revenue reports, RBAC, editorial workflow, SEO, and AI crawlability.

## Stack

- Payload CMS 3
- Next.js
- Postgres
- UUID/UUIDv7 document IDs
- TypeScript
- Payload jobs, globals, endpoints, drafts, and versions

## Local Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Open `http://localhost:3000/admin`.

## Architecture

Source code is organized by feature and shared primitives:

```txt
src/
  payload.config.ts
  features/
  shared/
  globals/
  jobs/
  endpoints/
docs/
.agents/skills/
```

Read:

- `docs/ARCHITECTURE.md`
- `docs/MIGRATION_RULES.md`
- `docs/RBAC.md`
- `docs/WORKFLOW.md`
- `docs/SEO_AND_CRAWLABILITY.md`
- `docs/AGENT_PLAYBOOK.md`

## Schema Changes

After changing Payload schemas:

```bash
pnpm run generate:types
pnpm run payload -- migrate:create descriptive-migration-name
pnpm run payload -- migrate
pnpm run lint
```

Use migrations for production database changes.

## Agent Skills

Agents should start with:

- `.agents/skills/payload/SKILL.md`
- `.agents/skills/cms-template/SKILL.md`
