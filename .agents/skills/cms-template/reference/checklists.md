# Checklists

## Access Control

- Default deny for create/update/delete.
- Public reads must constrain to `_status = published`, `workflowStatus = published`, and non-archived content.
- Field-level access returns booleans only; use collection-level read access for query constraints.
- Roles belong in `src/shared/constants/roles.ts`.
- Capability or role logic belongs in `src/shared/access` or `src/shared/workflow`, not inside collection files.

## Workflow

- Workflow states are defined in `src/shared/workflow/transitionMap.ts`.
- Transition permissions live in `src/shared/workflow/permissions.ts`.
- Collection hooks should reuse `validateWorkflowTransition`.
- Publish requires both Payload `_status` and domain `workflowStatus` to be publish-safe.
- Archive content instead of hard deleting unless the task explicitly requires deletion.

## Hooks

- Pass `req` to nested Local API writes.
- Use `context` flags for hooks that write to collections with hooks.
- Keep hook side effects idempotent where possible.
- Do not enqueue indexing or extraction jobs from draft-only changes unless the feature explicitly needs it.

## Testing

- RBAC changes need tests for allowed and denied roles.
- Workflow changes need tests for valid transitions, invalid transitions, and permission failures.
- Public API changes need tests that unauthenticated users cannot see drafts or archived content.
- Run type generation after schema changes before lint/type checks.

## Migrations

- Read `docs/MIGRATION_RULES.md` before changing persisted Payload schema.
- Field, collection, global, upload, relationship, draft/version, job schema, and DB adapter changes require `generate:types`, `migrate:create`, migration review, and `migrate`.
- Access-only, hook-only, admin UI-only, and docs-only changes do not require migrations unless persisted schema also changes.
- If migration generation or execution is blocked, report the blocker and do not mark the task complete.
