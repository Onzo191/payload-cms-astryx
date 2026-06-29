---
name: cms-template
description: Use when working in this repository's module-first Payload CMS template, including feature modules, shared RBAC, editorial workflow, SEO/crawlability, reports, UUID-only Postgres, tests, and token-efficient agent workflows.
---

# CMS Template Skill

Use this skill after the Payload skill for repository-specific conventions.

## Core Rules

- Keep `src/payload.config.ts` thin. Register modules there; implement behavior inside `src/features`, `src/shared`, `src/globals`, `src/jobs`, and `src/endpoints`.
- Put domain-specific code in `src/features/<feature>/` and reusable primitives in `src/shared/`.
- Use UUID IDs only. The Postgres adapter is configured with `idType: 'uuidv7'`.
- Use Payload access control for RBAC. When Local API work is performed on behalf of a user, pass `overrideAccess: false`.
- Any nested write inside a hook must pass `req` and use context flags to avoid loops.
- After schema changes, run `pnpm run generate:types` and follow `docs/MIGRATION_RULES.md`.
- Field, collection, global, upload, relationship, draft/version, job schema, and DB adapter changes require a migration before the task can be called complete.
- Prefer focused tests near the behavior being changed. Access and workflow changes require tests.

## File Selection

Read only the files needed for the task:

- Feature work: `reference/file-map.md`, then the relevant `src/features/<feature>/` files.
- Access/workflow/security work: `reference/checklists.md`, `src/shared/access/`, and `src/shared/workflow/`.
- Migration/schema work: `docs/MIGRATION_RULES.md`, then the touched feature/shared field files.
- SEO/crawl work: `docs/SEO_AND_CRAWLABILITY.md` and `src/shared/seo/`.
- Agent/process work: `docs/AGENT_PLAYBOOK.md`.

## Done Criteria

- The change follows the feature/shared boundary.
- Generated Payload types and migrations are current when schema changed.
- Lint/type/test commands relevant to the change have been run or the blocker is reported.
- Docs are updated when conventions, permissions, workflow states, or public API shape changes.
