# Pilot implementation status

TalaTrack now runs a React/TypeScript client, a shared Node.js API, and PostgreSQL persistence locally and through a Vercel function. Faculty can register an account, sign in, import attendance CSVs, review class/student attendance, inspect descriptive analytics and an exploratory class-level projection, and export class analytics as CSV. Administrators manage staff accounts and class assignments. Attendance and account data are stored in PostgreSQL; browser storage holds only interface preferences.

## Remaining gates before a school pilot

1. Agree and version attendance policy, calendar, thresholds, timezone, reporting period, and effective enrollment rules with the school.
2. Replace name-based student matching with an approved stable identifier and validate representative import files.
3. Add email verification, account recovery, MFA or school SSO, and complete role review.
4. Add attendance-taking/correction workflow, staged conflict resolution, rollback/reprocessing, and restricted follow-up records.
5. Configure retention/deletion, encrypted backups, restore drills, monitoring, support, privacy/incident response, and accessibility validation.
6. Validate the exploratory projection on representative historical cohorts before presenting it as a forecast; it currently serves only as planning context.

The project deploys through Vercel. `DATABASE_URL` is server-only and must never be prefixed with `VITE_` or sent to browsers. Apply database migrations separately to each deployment database before using it.
