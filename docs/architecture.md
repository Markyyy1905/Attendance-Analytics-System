# Architecture

TalaTrack uses a React, TypeScript, and Vite client; a Node.js HTTP API; and PostgreSQL through `pg`. Vercel routes `/api/*` requests to `api/index.js`, which passes them to the shared API handler in `server/api.mjs`. In local development, Vite mounts that same handler as middleware. `DATABASE_URL` is read server-side and is never bundled into the client.

## Data flow

```text
CSV upload -> browser validation and preview -> authenticated API -> PostgreSQL transaction
                                                           -> import, attendance, and audit records
Authenticated user -> assigned class -> persisted class dataset -> shared calculations
                                                           -> dashboard, profiles, analytics, and CSV report
```

The parser accepts the documented CSV metadata and dated attendance columns, validates dates and P/A/L/E/blank marks, and splits section blocks into separate classes. The API stores import metadata, row outcomes, class/student enrollment, sessions, attendance marks, and audit events transactionally. Student matching currently uses normalized names within a class; a school-approved identifier is needed before operational use.

Accounts use email/password credentials, server-side PostgreSQL sessions, HTTP-only cookies, login throttling, and school/class scope checks. Administrators manage staff accounts and class assignments. Faculty and coordinators require active class grants for class data; the user's school is enforced on queries. Browser storage holds only non-sensitive selection preferences.

## Analytics

Shared TypeScript functions calculate the rate `(present + late) / (present + late + absent)`, coverage, status totals, date and weekday trends, review triggers, and an exploratory class-level projection. The analytics view offers filters, charts with data-table details, and a CSV export. The projection is an indicative baseline and has not been validated against representative school outcomes; it is not an individual prediction.

## Current boundaries

The application is a pilot foundation, not a finished school-approved commercial service. Attendance policy, formal student matching, email verification and password recovery, SSO/MFA, attendance-taking and correction UI, follow-up notes, XLSX/PDF reports, retention/deletion, managed backup/recovery, monitoring, incident response, and accessibility validation remain incomplete. Do not describe those items as shipped or use the projection to automate a decision.

## Source structure

- `api/`: Vercel function entry point.
- `server/`: shared API handler and ordered migration runner.
- `database/migrations/`: PostgreSQL schema changes.
- `src/app/`: routes, authentication state, and class data provider.
- `src/features/`: dashboard, class workspace, administrator staff/access page, attendance, import, roster/profile, and analytics UI.
- `src/shared/lib/`: shared attendance calculations and projection.
