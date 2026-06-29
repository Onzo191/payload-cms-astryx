# Payload Astryx

Payload CMS + Next.js application standardized on Postgres, Node.js 24, and pnpm 10.

## Toolchain

- Node.js: `24.16.0`
- pnpm: `10.0.0`
- Database: PostgreSQL only

Use Corepack so the package manager version is resolved from `package.json`:

```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
```

## Local Development

1. Copy the environment template.

   ```bash
   cp .env.example .env
   ```

2. Start Postgres.

   ```bash
   docker compose up -d postgres
   ```

3. Install dependencies and start Next.js.

   ```bash
   pnpm install --frozen-lockfile
   pnpm dev
   ```

4. Open `http://localhost:3000`.

## Docker Development

To run the app and Postgres with the same Node/pnpm versions used by CI:

```bash
docker compose up payload
```

The app container uses `node:24.16.0-alpine`, pnpm `10.0.0`, and connects to the `postgres` service through `DATABASE_URL`.

## Production

The `Dockerfile` builds a Next.js standalone image with Node.js `24.16.0-alpine` and pnpm `10.0.0`.

Set these runtime variables in production:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
PAYLOAD_SECRET=replace-with-a-strong-secret
```

## CI

GitHub Actions runs on Node.js `24.16.0` and pnpm `10.0.0` with a Postgres `17-alpine` service.

Local Docker stores Postgres data in the `pgdata17` volume. If you have an older Postgres 16 volume, migrate it deliberately before pointing Postgres 17 at that data.

The CI pipeline checks:

- frozen dependency install from `pnpm-lock.yaml`
- generated Payload types are committed
- lint
- TypeScript
- integration tests
- production build
