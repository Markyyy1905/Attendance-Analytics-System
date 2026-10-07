# TalaTrack

TalaTrack is a multi-school attendance workspace built with React, TypeScript, Node.js, and PostgreSQL. School accounts, classes, enrollments, attendance, imports, sessions, and audit history persist in PostgreSQL. Browser storage is used only for non-sensitive UI preferences.

## Run locally

1. Copy `.env.example` to `.env` and set `DATABASE_URL` for a PostgreSQL database you control.
2. Install dependencies with `npm ci`.
3. Apply versioned schema migrations with `npm run db:migrate`. The runner applies pending SQL migrations without printing connection details.
4. Run `npm run dev`. Vite serves the browser app and routes local `/api` requests to the current PostgreSQL API handler in this checkout; there is no second API terminal to start.
5. Open the app and create the initial school workspace. Registration creates its administrator account. Use a unique email and a password with at least 12 characters.

The application never seeds illustrative student records. The first school administrator can add staff accounts, assign classes, and import the provided attendance CSV template. Account sessions are opaque, server-side PostgreSQL records with HTTP-only cookies. Set `APP_ORIGINS` to the exact allowed site origins. Production requires HTTPS so session cookies use the `Secure` attribute.

## Deploy in a container

The included Dockerfile builds the frontend and serves it and the API from one Node process. Provide `DATABASE_URL`, `APP_ORIGINS` (your HTTPS origin), `NODE_ENV=production`, and `PGSSL=require` when required by your PostgreSQL provider. Run `npm run db:migrate` as a deployment release step before switching traffic, then start the container with `npm start`. Persist database backups outside the application container and test restore procedures. Use a managed PostgreSQL service with TLS, automated encrypted backups, monitoring, and a least-privilege database role.

The container exposes port 4174. The database migration command must be run with the same database configuration as the application. Keep `.env` and all provider secrets out of source control and client-side `VITE_*` variables.

## Deploy to Vercel

The repository includes `vercel.json` for the Vite build, API-first routing, and SPA deep links. The `/api/*` rewrite targets `api/index.js`, which restores the requested API path before passing it to the shared PostgreSQL handler. In Vercel, use the repository root, Vite framework preset, `npm ci`, `npm run build`, and `dist`. Add `DATABASE_URL` and `NODE_ENV=production` under Project Settings > Environment Variables for Production. Same-origin requests are checked against the deployment host, so `APP_ORIGINS` is only needed for additional cross-origin clients; if used, list exact HTTPS origins separated by commas. Add `PGSSL=require` if required by the database provider. The function pool defaults to two connections per warm instance; use a provider pooler when needed.

Preview deployments should use a separate test database. Same-origin preview requests use their own deployment host; add a preview host to `APP_ORIGINS` only when calling the API cross-origin. Never put database credentials in a `VITE_*` variable. The current schema migration has already been applied to the database configured in the local `.env`; apply migrations to any different Vercel database before creating accounts. Vercel builds the frontend and Functions; it does not run the container Dockerfile.
## Product functions

- School signup and secure login/logout, administrator-managed staff accounts, session expiry, login throttling, and server-side school/class authorization.
- Separate class/section workspaces, class assignment management, CSV import reconciliation, student attendance history, and audit events.
- PostgreSQL-backed descriptive rates, coverage, trends, at-risk review signals, and the existing cautious class-level projection. Projections are decision support and are not validated individual predictions.
- Attendance formula: `(present + late) / (present + late + absent)`. Excused and unrecorded marks are excluded from the rate denominator; coverage is displayed separately.

See [the PRD](docs/prd.md), [CSV specification](docs/csv-template.md), [system workflow](docs/system-flow.md), and [architecture](docs/architecture.md) for product definitions and constraints.
