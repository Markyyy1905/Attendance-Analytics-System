# Architecture

TalaTrack has a React + TypeScript + Vite client, a small Node.js API for local development, and PostgreSQL persistence through `pg`.

## Data flow

```text
CSV ? browser parser and preview ? local API ? PostgreSQL transaction
                                      ?
Teacher assignment ? class selector ? isolated class dataset
                                      ?
shared attendance metrics, coverage-aware trends, review evidence, cautious class projection
```

The API binds to `127.0.0.1:4174`; Vite proxies `/api`. `DATABASE_URL` is loaded by server scripts and never bundled into the client. Imports match students by normalized name within a class and save import jobs, row outcomes, sessions, marks, teacher/class assignments, and audit entries transactionally. CSV sections are split into separate class records. Student UUIDs are internal database keys, not displayed or required in CSV. The client stores the selected teacher and class locally and loads only the selected class dataset.

## Current boundary

This backend is for local development. Teacher workspaces and assignments are modeled and used for local navigation, but teacher selection is not authentication; requests are not protected by a verified login identity. Do not expose it to a network or use for live school data. Staged import conflict review, rollback, follow-up workflows, reports/exports, and production backup/retention operations remain before a school pilot.

## Source structure

- `server/`: local API and migration runner.
- `database/migrations/`: PostgreSQL schema.
- `src/app/`: routes and app-level data provider.
- `src/features/`: dashboard, class and teacher workspace, attendance, import, roster/profile, and analytics UI.
- `src/shared/lib/`: shared metric and projection calculations.
