# Rule: Auth DRBAC Hybrid ABAC

Use this rule whenever changing account, role, permission, or collection access behavior.

1. Read `docs/auth-drbac-abac.md` first.
2. Keep authorization logic in `src/auth/policy.ts` and Payload adapters in `src/auth/access.ts`.
3. Do not hard-code role checks inside collections; use `canCollection`, `canCollectionBoolean`, or `canField`.
4. Do not rely on `req.user.roles` directly; load/evaluate the request access profile.
5. When adding a protected collection, update:
   - `AUTH_RESOURCE_OPTIONS` in `src/auth/constants.ts`
   - collection access config
   - default seed permissions/roles in `src/auth/defaults.ts`
   - policy tests
   - generated Payload types
6. Keep `roles`, `roleAssignments`, `directPermissions`, and `isSuperAdmin` super-admin locked unless privilege-escalation tests are added first.
7. Local API calls that must respect the current user's access must pass `overrideAccess: false`.
8. Run `corepack pnpm run generate:types`, `corepack pnpm run typecheck`, `corepack pnpm run lint`, and targeted tests after schema or policy changes.
