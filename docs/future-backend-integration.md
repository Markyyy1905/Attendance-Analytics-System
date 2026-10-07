# Backend status

TalaTrack now has a local Node API, a PostgreSQL schema migration, and a persistence path for CSV imports matched by student name within class. The API listens only on loopback and should be used only for local development. Do not expose it to school networks or load live student records yet.

## Required before a school pilot

1. Add school OIDC login/logout and server-side authorization for faculty, coordinators, department heads, and administrators.
2. Restrict every read, correction, import, and export to validated staff class assignments and school tenancy.
3. Add staged import conflict resolution, rollback/reprocessing, and duplicate reconciliation.
4. Approve the calendar, attendance formula, thresholds, retention period, and timezone with the school.
5. Add restricted follow-up notes, flag acknowledgement history, class/student reports, and logged exports.
6. Implement encrypted backups, restore drills, monitoring, incident handling, and deletion/retention automation.

The current local import service is not a production authorization boundary. The `DATABASE_URL` value is server-only and must never be prefixed with `VITE_` or shipped to browsers.
