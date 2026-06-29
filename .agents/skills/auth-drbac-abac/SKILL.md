---
name: auth-drbac-abac
description: Use when changing account management, roles, permissions, Payload access functions, or DRBAC/ABAC authorization policy in this project.
---

# Auth DRBAC Hybrid ABAC Skill

This project implements authorization through a DRBAC hybrid ABAC layer.

## Start Here

1. Read `docs/auth-drbac-abac.md`.
2. Inspect `src/auth/constants.ts`, `src/auth/policy.ts`, `src/auth/access.ts`, and `src/auth/defaults.ts`.
3. Inspect the target collection config before changing access behavior.

## Mental Model

- Accounts live in `users`.
- Roles live in `roles`.
- Permissions live in `permissions`.
- `roleAssignments` are dynamic grants with optional tenant and time bounds.
- Permissions can return Payload `Where` filters through ABAC scopes.
- Field-level access can only return boolean, so sensitive fields use `canField('*', 'manage')`.

## Change Workflow

When adding or changing protected behavior:

1. Register or verify the resource/action constants.
2. Add or update permission seed definitions.
3. Wire collection access through `canCollection` or `canCollectionBoolean`.
4. Add ownership or tenant fields needed by ABAC conditions.
5. Add tests in `tests/int/auth/` for evaluator behavior.
6. Regenerate Payload types.
7. Run typecheck, lint, and targeted tests.

## Guardrails

- Do not scatter role checks in collection files.
- Do not loosen role-grant fields without privilege-escalation coverage.
- Do not use direct DB queries for user-facing operations that should enforce access.
- Do not assume JWT role fields are populated; fetch and evaluate the full profile.
