# Agent Playbook

This guide keeps agent work focused and token-efficient.

## Start Here

1. Read `.agents/skills/payload/SKILL.md`.
2. Read `.agents/skills/cms-template/SKILL.md`.
3. Read only the feature/shared files relevant to the task.

## File Selection

- Users/RBAC: `src/features/users`, `src/shared/access`, `docs/RBAC.md`.
- Pages/news/reports: the matching `src/features/<feature>` directory plus shared fields/hooks/workflow as needed.
- Workflow: `src/shared/workflow`, `docs/WORKFLOW.md`.
- SEO/crawl: `src/shared/seo`, `docs/SEO_AND_CRAWLABILITY.md`.
- Jobs/endpoints: `src/jobs` or `src/endpoints`.

## Coding Rules

- Keep `payload.config.ts` thin.
- Do not copy shared logic into feature modules.
- Add schema fields through feature field files or shared field factories.
- Follow `docs/MIGRATION_RULES.md` for every schema or field change.
- Run `pnpm run generate:types` after schema changes.
- Create and run a Payload migration for persisted schema changes before claiming the task is complete.
- Add or update tests for access, workflow, and public API behavior.

## Review Checklist

- Does the change preserve public draft isolation?
- Does Local API code use `overrideAccess: false` when acting as a user?
- Do hook writes pass `req`?
- Are UUID-only assumptions preserved?
- Did field/collection/global/job schema changes include typegen and migration?
- Are docs updated for changed conventions?
