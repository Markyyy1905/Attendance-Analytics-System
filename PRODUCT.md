# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web application. React, TypeScript, and Vite serve the client; a Node.js API and PostgreSQL provide persisted school workspaces. The repository supports local Vite development and Vercel deployment.

## Users

Faculty review attendance for their assigned classes. School administrators create staff accounts, assign classes, and review their school's data. Coordinator and department-head roles are available, with class access granted explicitly. Students are the people represented by records; student login is not part of this staff application.

## Product Purpose

TalaTrack supports the attendance-monitoring and analytics study for 4th-year Computer Science students at Lyceum of Alabang. Staff import attendance, store it in PostgreSQL, inspect class and student histories, understand attendance patterns, and generate a CSV analytics report. The application must make data scope and calculation rules visible and treat review flags and projections as decision support.

The project presentation should demonstrate the real workflow using the group's approved attendance records: upload and validate a CSV, commit it to the database, review the dashboard and student records, explore trends and the class-level projection, then export the analytics report. No student records are seeded as mock data.

## Product Principles

- Use persistent records as the single source for dashboards, profiles, trends, and exports.
- Make scope, date range, denominator, coverage, and source clear wherever an attendance rate appears.
- Show absences and missing marks separately; never infer an absence from a blank record.
- Explain every review flag, keep staff responsible for follow-up, and never present a projection as validated prediction.
- Keep student data within the authenticated school and class scope.

## Current Capabilities

- School workspace registration, email/password sign-in and sign-out, PostgreSQL-backed expiring sessions, and administrator-created staff accounts.
- School-scoped class assignments and server-side access checks for class data.
- CSV template download, parsing, validation, preview, multi-section splitting, and transactional PostgreSQL import with import and audit history.
- Shared calculations for attendance rate, roster coverage, status totals, attendance trends, weekday summaries, and threshold review flags.
- Dashboard, attendance matrix, class workspace, student roster/profile, analytics charts and tables, cautious class-level projection, and downloadable analytics CSV.

## Metric and Analytics Contract

Attendance rate is `(present + late) / (present + late + absent)`. Excused and blank marks are excluded from this denominator; blanks remain unrecorded and lower coverage. Rates are rounded to the nearest whole percentage point for display while exact values are retained for thresholds. Review flags use OR: rate below 75%, at least five consecutive recorded absences, or more than eight absences in the selected period. The class projection is a recency-weighted historical baseline requiring at least six sessions with 60% roster coverage; its interval is a planning aid, not a validated forecast or individual prediction.

## Scope and Constraints

- The system accepts attendance through CSV. XLSX import, PDF/XLSX reports, interactive mark-taking and correction UI, follow-up notes, and student accounts are not implemented.
- CSV imports identify students by normalized name within a class because a school-approved stable identifier has not been adopted. Ambiguous duplicates must be resolved; this is a data-quality limit for school use.
- Current credentials are locally managed email/password accounts. Password recovery, email verification, MFA, and school SSO are not implemented.
- The current application is a pilot foundation, not a school-approved production service. Policy approval, retention and deletion, managed backups and recovery, monitoring, incident response, and accessibility validation remain launch work.
- No predictive model has been validated. Do not claim individual prediction or use the class projection to automate a decision.

## Evidence and Scope

The attached study describes the attendance problem, objectives, target population, potential users, and intended analytics for 4th-year Computer Science students at Lyceum of Alabang. Its proposed behaviors are product goals, not proof that a feature is implemented. The current app's implemented capabilities and remaining constraints are listed above and in `docs/prd.md`.

## Accessibility

Core tasks should work with keyboard and screen reader, preserve readable contrast and reflow at small widths, and provide an equivalent data table for each chart.
