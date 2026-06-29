# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

This project also uses the repository-specific CMS template skill at `.agents/skills/cms-template/`.
Use it for module boundaries, RBAC/workflow rules, SEO/crawlability conventions, and token-efficient file selection.

For any collection, global, field, upload, relationship, draft/version, job schema, or database adapter change, follow `docs/MIGRATION_RULES.md`: generate Payload types, create a migration, run/review it, and report any blocker.
