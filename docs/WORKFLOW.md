# Editorial Workflow

The CMS combines Payload drafts with a domain workflow field.

## Payload Status

Payload draft/publish is enabled with:

```ts
versions: {
  drafts: {
    autosave: true,
    schedulePublish: true,
  },
}
```

Payload injects `_status`, which controls draft/published document versions.

## Domain Workflow

The `workflowStatus` field represents editorial state:

```txt
draft -> review -> approved -> published -> archived
draft -> review -> changes_requested -> draft
published -> archived
published -> changes_requested
archived -> draft
```

Source of truth:

- States: `src/shared/workflow/transitionMap.ts`
- Permissions: `src/shared/workflow/permissions.ts`
- Validation hook: `src/shared/workflow/validators.ts`

## Public Visibility

Public content must satisfy all conditions:

- `_status = published`
- `workflowStatus = published`
- `archivedAt` does not exist

## Hook Safety

- Nested writes inside hooks must pass `req`.
- Hooks that write to another collection should use context flags to avoid loops.
- Audit logging must not recursively audit audit-log writes.
