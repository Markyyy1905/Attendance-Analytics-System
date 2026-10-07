# System flow

```text
Sign in -> Select assigned class -> Upload CSV -> Validate -> Preview -> Process sections -> Commit to PostgreSQL
  -> Calculate shared metrics -> Dashboard and attendance matrix -> Review students and trends -> Detect review flags
  -> Generate analytics CSV -> Export
```

1. Staff sign in; the API resolves an active PostgreSQL session and school scope.
2. Staff select an assigned class or upload a CSV. CSV files are limited to 5 MB and 20,000 student rows / 200 session dates.
3. The browser validates the CSV structure, ISO dates, student names, duplicate rows, and P/A/L/E/blank marks. The preview shows row errors, warnings, class sections, and sample calculations.
4. Missing required headers, malformed dates/quotes, unsupported marks, duplicate students within a class block, empty content, or size-limit violations prevent commit. Staff correct the source file and upload it again; existing data remains intact.
5. A valid preview is split by section and sent to the authenticated API. PostgreSQL writes class, enrollment, session, marks, import metadata, row outcomes, and audit events in a transaction. Failure rolls back the import and reports an error.
6. The selected class dataset is loaded from PostgreSQL. Dashboard, attendance matrix, student profile, analytics, and export use the same committed records and shared calculations.
7. Attendance rate is `(P + L) / (P + L + A)`. Excused and blank marks do not enter the rate denominator; blank marks remain unrecorded and lower roster coverage.
8. Review flags use OR: rate below 75%, five or more consecutive absences, or more than eight absences. Each flag is a prompt for human review.
9. Trend and weekday charts show denominators and coverage and have data-table detail. A class-level projection appears only when at least six sessions meet 60% roster coverage. It is exploratory planning context, not a validated prediction.
10. Class analytics can be exported as CSV. Generation metadata is logged. A report/export failure is shown to staff; source attendance remains unchanged.

The deployment must use the configured server-only `DATABASE_URL`. The application has account login and class access checks, but it is not yet a school-approved operational service. Approved policy, identifier matching, retention/deletion, backups/recovery, monitoring, privacy review, password recovery, email verification, and accessibility validation remain launch gates.
