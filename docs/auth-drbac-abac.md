# Auth Architecture: DRBAC Hybrid ABAC

This project uses a dynamic role-based access control layer with ABAC conditions on top of Payload access functions.

## Goals

- Keep account, role, and permission management explicit in Payload Admin.
- Keep policy evaluation in one TypeScript module instead of scattering role checks through collections.
- Support both stable roles and dynamic role grants with tenant/date constraints.
- Let Payload enforce row-level access by returning `Where` constraints from collection access functions.
- Keep sensitive grant fields locked so self-service profile updates cannot escalate privileges.

## Core Files

- `src/auth/constants.ts`: registered resources, actions, scopes, account statuses, and system role keys.
- `src/auth/types.ts`: generated-type-independent policy shapes.
- `src/auth/policy.ts`: pure DRBAC/ABAC evaluator. This is unit-testable without Payload.
- `src/auth/access.ts`: Payload adapters: `canCollection`, `canCollectionBoolean`, `canField`, request memoization.
- `src/auth/defaults.ts`: idempotent seed for default permissions/roles plus first-account/default-account role hook.
- `src/collections/Users.ts`: account collection and dynamic grants.
- `src/collections/Roles.ts`: role definitions, inheritance, and permission relationships.
- `src/collections/Permissions.ts`: permission policies and ABAC conditions.
- `tests/int/auth/policy.int.spec.ts`: evaluator coverage.

## Data Model

### Accounts (`users`)

Payload still owns authentication. The `users` collection adds account-management fields:

- Profile: `firstName`, `lastName`, `displayName`.
- Status: `accountStatus`, with active statuses currently `active` and `invited`.
- ABAC attributes: `tenant`, `department`, and free-form `attributes`.
- Static grants: `roles`.
- Dynamic grants: `roleAssignments[]` with `role`, optional `tenant`, `startsAt`, `endsAt`, `enabled`.
- Emergency overrides: `directPermissions`.

Sensitive grant fields are update/read locked by `canField('*', 'manage')`, which defaults to super-admin-only behavior.

### Roles (`roles`)

Roles are stable permission bundles:

- `key`: stable machine name.
- `enabled`: disables the role without deleting assignments.
- `level`: optional hierarchy marker for future workflows.
- `isSuperAdmin`: bypasses policy checks.
- `inherits`: recursive parent roles.
- `permissions`: permission policies granted by this role.
- `system`: marks seed-managed roles.

### Permissions (`permissions`)

Permissions describe one resource/action/effect plus optional ABAC conditions:

- `resource`: registered resource, or `*`.
- `action`: `manage`, `create`, `read`, `update`, `delete`, `admin`, `unlock`, `readVersions`.
- `effect`: `allow` or `deny`.
- `conditions.scope`:
  - `global`: no row constraint.
  - `own`: compares a document field to a user field.
  - `tenant`: compares a document tenant field to the user's tenant or role-assignment tenant.
  - `public`: applies `publicWhere`.
  - `custom`: applies `customWhere`.
- `validFrom` / `validUntil`: optional time window.
- `enabled`: soft-disable switch.

`customWhere` supports interpolation tokens:

```json
{
  "and": [
    { "region": { "equals": "$user.attributes.region" } },
    { "createdBy": { "equals": "$user.id" } },
    { "tenant": { "equals": "$grant.tenant" } }
  ]
}
```

## Evaluation Flow

1. Payload access function calls `evaluateRequestAccess`.
2. `access.ts` loads the full current user with roles and permissions at depth `6`.
3. The profile is memoized on `req.context.authzProfile` for the request.
4. `policy.ts` builds an access profile from:
   - direct permissions,
   - baseline roles,
   - active dynamic role assignments,
   - inherited roles.
5. Suspended, locked, and offboarded accounts are denied.
6. `isSuperAdmin` roles return `true`.
7. Matching deny grants deny the request.
8. Matching allow grants return:
   - `true` for global access,
   - a Payload `Where` object for row-level access,
   - `false` if no grant matches.

## Default Seeds

`ensureAuthDefaults` upserts these permissions. It runs on Payload init except during the `build`
lifecycle, and the account creation hook also calls it before assigning default roles.

- `system.manage-all`
- `users.manage`
- `users.read.own`
- `users.update.own`
- `roles.manage`
- `permissions.manage`
- `media.manage`
- `media.read`

And these roles:

- `super-admin`: `isSuperAdmin`, seeded with `system.manage-all`.
- `account-manager`: account, role, permission management plus media read.
- `media-manager`: media management.
- `viewer`: self-service account access plus media read.

The first created account is assigned `super-admin`. Later accounts are assigned `viewer`.

## Seeding Super Admin

Run this command to create or update the local super admin account:

```bash
corepack pnpm run seed:super-admin
```

Defaults:

- Email: `super-admin@email.com.vn`
- Password: `SuperAdmin@123`

Override with environment variables when needed:

```bash
SUPER_ADMIN_EMAIL=admin@example.com SUPER_ADMIN_PASSWORD='change-me' corepack pnpm run seed:super-admin
```

## Adding A New Protected Collection

1. Register the resource in `AUTH_RESOURCE_OPTIONS` in `src/auth/constants.ts`.
2. Add access helpers to the collection:

```ts
access: {
  admin: canCollectionBoolean('articles', 'admin'),
  create: canCollectionBoolean('articles', 'create'),
  read: canCollection('articles', 'read'),
  update: canCollection('articles', 'update'),
  delete: canCollection('articles', 'delete'),
}
```

3. Add ownership/tenant fields if ABAC scopes need them:

```ts
{
  name: 'createdBy',
  type: 'relationship',
  relationTo: 'users',
  index: true,
}
```

4. Add seed permissions/roles in `src/auth/defaults.ts`.
5. Add evaluator tests for the new permission shape.
6. Run `pnpm run generate:types`, `pnpm run typecheck`, and targeted tests.

## Invariants For Future Agents

- Do not put hard-coded role checks in collections. Use `canCollection`, `canCollectionBoolean`, or `canField`.
- Do not read `req.user.roles` directly for authorization decisions. The JWT may only contain relationship IDs.
- Do not loosen `roles`, `roleAssignments`, or `directPermissions` field access without adding privilege-escalation tests.
- Prefer `scope: own`, `scope: tenant`, or `scope: custom` over bespoke access functions.
- Local API calls that should respect a user's permissions must pass `overrideAccess: false`.
- Keep `AUTH_RESOURCE_OPTIONS` and default seed permissions in sync when new protected collections are added.
