# RBAC Model

RBAC is implemented in the `users` collection with a `roles` select field saved to JWT.

## Roles

| Role | Purpose |
| --- | --- |
| `super-admin` | Full system control, including destructive administration. |
| `admin` | CMS administration and publishing authority. |
| `editor` | Create and edit content across primary content collections. |
| `author` | Create and edit authored content where allowed. |
| `reviewer` | Review, approve, or request editorial changes. |
| `viewer` | Read-only admin access. |

## Access Rules

- Public users may only read published and non-archived content.
- Create/update/delete operations default to authenticated editorial roles.
- Super admins are the only role intended for system-level destructive changes.
- Field-level access must return booleans only.
- Query constraints belong in collection-level read access.

## Local API Safety

Payload Local API bypasses access control by default. When an operation acts on behalf of a user, always pass:

```ts
overrideAccess: false
```

Trusted system jobs may intentionally use the default privileged behavior, but this should be explicit in code review.
